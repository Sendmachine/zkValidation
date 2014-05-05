var app = angular.module('Example', ['Validation']);

/**
 * Example controller
 */
app.controller('example', function($scope, $http, $rootScope) {
    
    $scope.countries = [
        {
            id: 642,
            name: 'Romania'
        },
        {
            id: 826,
            name: 'United Kingdom'
        },
        {
            id: 752, 
            name: 'Sweden'
        }
    ];
    
    $scope.editProfile = function(data) {
        $scope.saveRequest = $http.post('.', data);
    };
    
    $rootScope.lang = {
        "validation": {
            "required": "Field is required",
            "valid_email": "Email must be valid",
            "min_length": "Minimum length %s characters",
            "matches": "The field must be identical to %s",
            "numeric": "The field must contain only numbers",
            "callback_domain_is_valid": "Domanin must be valid",
            "callback_url_is_valid": "The site must be valid",
            "exact_length": "Length %s characters",
            "alpha_dash": "Only letters, numbers and dashes",
            
            "is_natural": "Trebuie sa fie un numar pozitiv",
            "greater_than": "Valoarea trebuie sa fie mai mare decat %s",
            "less_than": "Valoarea trebuie sa fie mai mica decat %s",
            "callback_email_is_unique": "Emailul este deja inregistrat",
            "alpha": "Doar litere",
            "alpha_numeric": "Doar litere si cifre",
            "callback_valid_path": "Calea trebuie sa fie valida",
            "callback_check_password_dictionary": "Parola este prea comuna",
            "callback_has_symbols" : "Trebuie sa contina minim un simbol",
            "callback_has_capitals" : "Trebuie sa contina minim o litera mare",
            "callback_has_numbers" : "Trebuie sa contina minim un numar",
            "callback_alpha_dash_dot" : "Poate sa contina numai litere, `-` si `.`",
            "callback_alpha_space" : "Poate contine doar listere si spatiu",
            "callback_alpha_numeric_space" : "Poate contine doar listere cifre si spatiu"
        }
    };
    
});
