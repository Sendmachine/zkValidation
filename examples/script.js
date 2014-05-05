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
    
    //~$scope.saveRequest = $http.save('.');
    
    $rootScope.lang = {
        "validation": {
            "required": "Campul este obligatoriu",
            "valid_email": "Emailul trebuie sa fie valid",
            "min_length": "Lungimea minima %s caractere",
            "max_length": "Lungimea maxima %s caractere",
            "matches": "Campul trebuie sa fie identic cu %s",
            "numeric": "Campul trebuie sa contina doar cifre",
            "is_natural": "Trebuie sa fie un numar pozitiv",
            "greater_than": "Valoarea trebuie sa fie mai mare decat %s",
            "less_than": "Valoarea trebuie sa fie mai mica decat %s",
            "callback_email_is_unique": "Emailul este deja inregistrat",
            "callback_domain_is_valid": "Domeniul trebuie sa fie valid",
            "callback_url_is_valid": "Linkul trebuie sa fie valid",
            "exact_length": "Lungimea exact %s caractere",
            "alpha_dash": "Doar litere, cifre si liniute",
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
