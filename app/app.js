'use strict';

(function (angular) {
    angular.module('quickscan', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',

        'pascalprecht.translate',
        'toastr',
        'ui.bootstrap',
        'ui.uploader'
    ]);

    angular.module('quickscan').config(['$locationProvider', '$routeProvider', '$translateProvider', function ($locationProvider, $routeProvider, $translateProvider) {

        $locationProvider.hashPrefix('');

        $translateProvider.useLocalStorage();
        $translateProvider.useSanitizeValueStrategy('escape');
        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('fr');

        $routeProvider

            // Survey steps
            .when('/done', {
                controller: 'SurveyDoneCtrl',
                templateUrl: 'app/survey/survey-done.html'
            })
            .when('/evaluation', {
                controller: 'SurveyEvaluationCtrl',
                templateUrl: 'app/survey/survey-evaluation.html'
            })
            .when('/explanation', {
                controller: 'SurveyProceedCtrl',
                templateUrl: 'app/survey/survey-proceed.html'
            })
            .when('/questionnaire', {
                controller: 'SurveyQuestionnaireCtrl',
                templateUrl: 'app/survey/survey-questionnaire.html'
            })

            // Survey management
            .when('/management', {
                controller: 'SurveyManagementCtrl',
                templateUrl: 'app/survey/management/survey-management.html'
            })

            // Survey initialization
            .when('/:key?', {
                controller: 'SurveyInitializationCtrl',
                templateUrl: 'app/survey/survey-initialization.html'
            })

            .otherwise('/');
    }]);
})(angular);
