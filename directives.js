/**
 * Run validation rules only after the data request.
 * 
 * Example Usage:
 *      
 *      <form name="accountForm" validation-rule="account" validation-run-after="getProfile">
 *      
 * Calls getProfile (which populates the form with data)
 * after the validation rule request was fulfilled.
 * 
 * So the call sequence is:
 *      
 *      get validation rules --> get data --> run validation rules
 * 
 * The last step is triggered by Angular.
 */
Validation.directive('validationRunAfter', function() {
    return {
        require: ['form', 'validationRule'],
        link: function(scope, elem, attrs, ctrl) {
            
            var validationRule = ctrl[1];
            var getFn = scope[attrs.validationRunAfter];
            
            validationRule.instance.runAfter(getFn);
            
        }
    };
});


/**
 * Validation submit button.
 * 
 * The submit button is disabled after clicking submit and waits until the
 * request promise is fulfilled.
 * 
 * The attribute value of this directive must be a $http or $resource object 
 * in the current scope.
 * The ng-disabled value must contain the formObject.$submitInProgress
 * variable for the disable functionality to work properly.
 * 
 * Example Usage:
 *      
 *      <input type="submit" validation-submit="saveRequest" 
 *      ng-disabled="accountForm.$invalid || accountForm.$submitInProgress">
 */
Validation.directive('validationSubmit', function() {
    return {
        require: ['^form'],
        link: function(scope, elem, attrs, ctrl) {
            
            var config = attrs.validationSubmit.split(',');
            var validationSubmit = config[0];
            var resetOnSuccess = config[1];
            
            resetSubmit();
            
            elem.bind('click', runForm);
            
            /**
             * Run form submit
             * Reset the submit button depending on the resetOnSuccess value.
             */
            function runForm() {
                
                ctrl[0].$submitInProgress = true;
                
                scope.$watch(validationSubmit, function(request) {
                    
                    if(!request) {
                        throw new Error('Validation: validation-submit should be given a $resource or a $http instance that contains a promise');
                    }
                    
                    var requestPromise = request.$promise || request;
                    
                    if(!(requestPromise && requestPromise.then)) {
                        throw new Error('Validation: validation-submit instance should contain a promise');
                    }
                    
                    if(resetOnSuccess) {
                        requestPromise.finally(resetSubmit);
                    } else {
                        requestPromise.catch(resetSubmit);
                    }
                    
                });
                
            }
            
            /**
             * Reset submit button to enabled state
             */
            function resetSubmit() {
                ctrl[0].$submitInProgress = false;
            }
            
        }
    };
    
});

/**
 * Master directive fetches validation rules and sets validate-input on child
 * inputs.
 * 
 * A new validation instance is created by this directive for each
 * form object.
 * 
 * The attribute value of this directive must be the rule name.
 * 
 * Example Usage:
 *      
 *      <form name="accountForm" validation-rule="account">
 *      
 * This will request the rules from the back-end resource: /validation/account
 */
Validation.directive('validationRule', function($compile, validation) {
return {
    require: ['form'],
    controller: function ($scope, $element, $attrs, validation) {
        
        var ruleName = $attrs.validationRule;
        $scope.errorMsg = {};
        
        if(!ruleName) {
            throw new Error('Validation: validation rule not set');
        }
        
        if(!$attrs.name) {
            throw new Error('Validation: name attribute not set on form');
        }
        
        var Instance = validation();
        
        // get rules
        return {
            'instance': Instance,
            'getRules': Instance.getRules(ruleName)
        };
    }
};
});


/**
 * Validate input field
 * 
 * The rule for the field is run depending on the `name` attribute of 
 * this field.
 * 
 * The ngModelController has two sets of functions:
 *      * parsers = Parse field (view -> model) called on each value alteration
 *      * formatters = Format field (model -> view) called on initial value display
 * 
 * Example Usage:
 *      
 *      <input type="text" ng-model="user.lname" name="last_name" validate="">
 * 
 * It will use the `last_name` rule for validating this field.
 */
Validation.directive('validate', function($compile, $log) {
  return {
    require: ['^validationRule', 'ngModel', '^form'],
    link: function(scope, elem, attrs, ctrls) {
        
        var name = attrs.name;
        var validationRule = ctrls[0];
        var ngModel = ctrls[1];
        var formInstance = ctrls[2];
        var isHidden;
        
        
        if(!name) {
            throw new Error('Validation: name attribute not set on input');
        }
        
        /**
         * Set validity to false by default
         */
        ngModel.$setValidity(name, false);
        
        /**
         * Compile error message element
         */
        var errorContent = $compile(
            angular.element('<div ng-bind="errorMsg.'+name+'"></div>')
        )(scope);
        
        elem.tooltip({
            'title': errorContent,
            'html': true,
            'placement': attrs.validate || 'right'
        });
        
        /**
         * Validate field value.
         * 
         * Does the validation (running the chain of rules on the field value)
         * and sets model validity.
         * 
         * The parseField and formatField functions are simply wrappers over 
         * this function.
         */
        function validateField(value) {
            
            var fieldValidation = validationRule.instance.runValidation(name, value, formInstance);
            
            ngModel.$setValidity(name, fieldValidation.isValid);
            
            $log.debug('Validation:', name, value, fieldValidation.isValid);
            
            return fieldValidation;
            
        }
        
        /**
         * Parse field (view -> model) called on each value alteration
         */
        function parseField(value) {
            
            var valid = validateField(value);
            
            scope.errorMsg[name] = valid.errorMsg;
            
            if(valid.isValid) {
                elem.tooltip('hide');
                isHidden = true;
            } else if(isHidden) {
                elem.tooltip('show');
                isHidden = false;
            }
            
            elem.toggleClass('validation-error', !valid.isValid);
            
            return valid.isValid ? value : undefined;
            
        }
        
        /**
         * Format field (model -> view) called on initial value display
         */
        function formatField(value) {
            
            var valid = validateField(value);
            
            return value;
            
        }
        
        /**
         * Set parsers and formatters after the rules are fetched
         * from the back-end.
         */
        validationRule.getRules.then(function() {
            
            ngModel.$isEmpty = function(){};
            
            ngModel.$parsers = [parseField];
            ngModel.$formatters = [formatField];
            
            elem.on('mouseenter focus', function() {
                scope.$apply(read);
            });
            
        });
        
        /**
         * Read element value from view.
         * Will trigger a validation run.
         */
        function read() {
            ngModel.$setViewValue(ngModel.$viewValue);
        }
        
    }
  };
});
