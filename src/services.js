/**
 * Handle live form validation
 */
var Validation = angular.module('Validation', []);


/**
 * A new validation service instance is created for each form instance.
 * The instance is created by the `validationRule` directive.
 */
Validation.factory('validation', function($http, $rootScope, validationFn, appConfig) {
    
    /**
     * Validation class
     */
    function Validation() {
        
        this.baseUrl = appConfig.validationUrl + '/';
        
    }
    
    Validation.prototype = {
        
        /**
         * Run after function for this instance
         */
        runAfterFn: undefined,
        
        /**
         * Validation rules for this instance
         */
        rules: undefined,
        
        /**
         * Set rules base url
         */
        setBaseUrl: function(url) {
            this.baseUrl = url;
        },
        
        /**
         * Get validation rules from the back-end
         * and run runAfterFn()
         */
        getRules: function(ruleName) {
            
            var self = this;
            
            return $http.get(self.baseUrl+ruleName, {cache: true}).then(
                function success(resp) {
                    self.rules = resp.data.validation;
                },
                function error() {
                    throw new Error('Validation: could not load rule <'+ruleName+'>');
                }
            ).then(function(){
                return self.runAfterFn ? self.runAfterFn() : null;
            });
            
        },
        
        /**
         * Run validation after fn
         */
        runAfter: function(fn) {
            this.runAfterFn = fn;
        },
        
        /**
         * Run validation on a field
         * and set error messages.
         * 
         * For 'matches' rule check against $modelValue of target field,
         * so if target is not valid, the current field won't be valid either.
         */
        runValidation: function(fieldName, fieldValue, formInstance) {
            
            var valid = {
                isValid: undefined,
                errorMsg: ''
            };
            
            var rules = this.rules;
            var lang = $rootScope.lang;
            
            if(!(rules && rules[fieldName])) {
                throw new Error('Validation: no rule found for field name <'+fieldName+'>');
            }
            
            $.each(rules[fieldName], function(k, rule) {
                
                // run validation
                if(rule.msg == 'matches') {
                    valid.isValid = validationFn[rule.msg](fieldValue, formInstance[rule.param].$modelValue || formInstance[rule.param]);
                } else if (rule.param) {
                    valid.isValid = validationFn[rule.msg](fieldValue, rule.param);
                } else {
                    valid.isValid = validationFn[rule.msg](fieldValue);
                }
                
                // set error messages
                if(!valid.isValid && lang.validation[rule.msg]) {
                    if(rule.msg == 'matches') {
                        valid.errorMsg = lang.validation[rule.msg].replace('%s', lang[rule.param]);
                    } else if(rule.param) {
                        valid.errorMsg = lang.validation[rule.msg].replace('%s', rule.param);
                    } else {
                        valid.errorMsg = lang.validation[rule.msg];
                    }
                }
                
                // break on false
                return valid.isValid;
                
            });
            
            return valid;
            
        }
        
    };
    
    return function ValidationFactory() {
        return new Validation();
    };
    
});


/**
 * Validation functions used by the validation rules.
 * 
 * All validation functions except required and min_length assume that a field
 * is valid if it's empty.
 */
Validation.service('validationFn', function(appConfig) {
    
    return {
    
    'required': function (inp) {
        return inp ? true : false;
    },
    'min_length': function (inp, len) {
        return inp ? (inp.length >= len) : false;
    },
    'max_length': function (inp, len) {
        return inp ? (inp.length <= len) : true;
    },
    'exact_length': function (inp, len) {
        return inp && inp.length == len;
    },
    'matches': function (inp, field) {
        return inp == field;
    },
    'numeric': function (inp) {
        if(inp) {
            return +inp ? true : false;
        } else {
            return true;
        }
    },
    'is_natural': function (inp) {
        return +inp >= 0;
    },
    'greater_than': function (inp, value) {
        return +inp > +value;
    },
    'less_than': function (inp, value) {
        return +inp < +value;
    },
    'alpha_dash': function (inp) {
        return inp ? (/^[\w\-]+$/i).test(inp) : true;
    },
    'alpha': function (inp) {
        return inp ? (/^([a-z])+$/i).test(inp) : true;
    },
    'alpha_numeric': function (inp) {
        return inp ? (/^[a-z0-9]+$/i).test(inp) : true;
    },
    'valid_email': function (inp) {
        // use the same regex as the backend
        return inp ? (/^([\w\+\-]+)(\.[\w\+\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/i).test(inp) : true;
    },
    'callback_domain_is_valid': function (inp) {
        return inp ? (/^([a-z0-9]+)([\-\.]{1}[a-z0-9]+)*\.[a-z]+$/i).test(inp) : true;
    },
    'callback_url_is_valid': function (inp) {
        return inp ? (/^(http(s)?\:\/\/)([\w]+)([\-\.]{1}[\w]+)*\.[a-z]+([\w][\w\-\.]*[\/]?)+$/i).test(inp) : true;
    },
    'callback_cron_jobs_selected_entire_time_is_valid': function (inp) {
        return inp ? (/^(([\d\*\.\/]+),){4}([\d\*\.\/]+)$/).test(inp) : true;
    },
    'callback_has_symbols': function (inp) {
        return inp ? (/[\!\@\#\$\%\^\&\*\(\)\:\"\;\'\{\}\[\]\,\.\/<\>\?\`\~\\]/).test(inp) : true;
    },
    'callback_has_capitals': function (inp) {
        return inp ? (/[A-Z]/).test(inp) : true;
    },
    'callback_has_numbers': function (inp) {
        return inp ? (/[0-9]/).test(inp) : true;
    },
    'callback_alpha_dash_dot': function (inp) {
        return inp ? (/^[\w\-\.]+$/i).test(inp) : true;
    },
    'callback_alpha_space': function (inp) {
        return inp ? (/^([a-z\s])+$/i).test(inp) : true;
    },
    'callback_valid_url_cron_jobs': function (inp) {
        return inp ? (/^([a-z])([a-z0-9\/\_\-\?\=\&\.])*$/i).test(inp) : true;
    },
    'callback_valid_path': function (inp) {
        return inp ? (/^([\w][\w\-\.]*[\/]?)*$/).test(inp) : true;
    },
    'callback_alpha_numeric_space': function (inp) {
        return inp ? (/^[a-z0-9\s]+$/i).test(inp) : true;
    }
    
    
    };
    
});
