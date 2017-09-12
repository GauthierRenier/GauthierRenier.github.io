'use strict';

(function (angular) {
    angular.module('quickscan').controller('SurveyInitializationCtrl', ['$location', '$routeParams', '$scope', '$translate', '$window', 'Exceptions', 'Survey', 'SurveyRuns', function ($location, $routeParams, $scope, $translate, $window, Exceptions, Survey, SurveyRuns) {

        const MINIMAL_LENGTH_OF_KEY_QUERY_PARAM_IN_URL = 5; // minimal length to have a key parameter: ?key=

        $scope.vm = {
            key: undefined,
            language: 'fr'
        };

        $scope.initiate = initiate;
        $scope.updateLanguage = updateLanguage;

        init();

        /**
         * Attempt various approaches to recover the survey key from the URL
         */
        function grabKeyFromUrl() {
            var key = undefined;

            if ($routeParams.key) {
                key = $routeParams.key;

            } else if ($location.search().key) {
                key = $location.search().key;

            } else if ($window.location.search
                && $window.location.search.length > MINIMAL_LENGTH_OF_KEY_QUERY_PARAM_IN_URL) {
                var keyValues = $window.location.search.slice(1).split('=');
                if (keyValues.length >= 2 && keyValues[0] === 'key') {
                    key = keyValues[1];
                }
            }

            return key;
        }

        function init() {
            $scope.vm.key = grabKeyFromUrl();
            updateLanguage();
        }

        function initiate() {
            SurveyRuns.getSurvey($scope.vm.key, $scope.vm.language).then(function (survey) {

                initSurveyObject(survey);

                if (Survey.isStarted()) {
                    $location.url('/questionnaire');
                } else {
                    $location.url('/explanation');
                }

            }).catch(function (rejection) {
                Exceptions.handleRejection(rejection, 'survey.initialization.error');
            });
        }

        function initSurveyObject(survey) {
            Survey.data = survey;
            Survey.key = $scope.vm.key;
            Survey.language = $scope.vm.language;
        }

        function updateLanguage() {
            $translate.use($scope.vm.language);
        }
    }]);
})(angular);
