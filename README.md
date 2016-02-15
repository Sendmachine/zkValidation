zkValidation
============

AngularJS validation bundle (services + directives) used by Zooku.


API
===

The available directives are:

    * validation-rule (on form element)
    * validation-run-after (on form element)
    * validate (on input)
    * validation-submit (on submit)


Example
=======

    <!-- Example form with validation directives -->
    <form ng-submit="editProfile(user)" name="accountForm" 
        validation-rule="rules.json"
        validation-run-after="getProfile">
        
        <label>
            First name
            <input type="text" ng-model='user.first_name' name="first_name" validate="">
        </label>
        <br>
        
        <label>
            Last name
            <input type="text" ng-model='user.last_name' name="last_name" validate="">
        </label>
        <br>
        
        <label>
            Country
            <select ng-options="c.id as c.name for c in countries" ng-model="user.country" name="country"  validate=""></select>
        </label>
        <br>
        
        <label>
            Phone number
            <input type="tel" ng-model='user.phone_number' name="phone_number" validate="">
        </label>
        <br>
        
        <label>
            Accept terms
            <input type="checkbox" ng-model="user.accept_terms" name="accept_terms" validate="">
        </label>
        <br>
        
        <button type="submit" validation-submit="saveRequest,true" 
            ng-disabled="accountForm.$invalid || accountForm.$submitInProgress"
            class="btn btn-primary">Save</button>
        
    </form>


License
=======

The project is licensed under the MIT license.
