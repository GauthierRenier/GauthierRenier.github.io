'use strict';

(function (angular) {
    angular.module('quickscan').controller('AppCtrl', ['$location', '$scope', '$timeout', '$window', 'Env', 'Exceptions', 'Survey', function ($location, $scope, $timeout, $window, Env, Exceptions, Survey) {

        const API_ROOT = Env.apiRoot();
        const ROUTES_EXCLUDED_FROM_REDIRECTION = ['/management'];

        $scope.vm = {
            error: {
                message: undefined,
                show: false,
                translatable: false
            }
        };

        $scope.closeError = closeError;
        $scope.gotoLogin = gotoLogin;
        $scope.gotoLogout = gotoLogout;
        $scope.isRunningOnLocalhost = isRunningOnLocalhost;
        $scope.showError = showError;

        init();

        function catchRouteChangeStart() {
            $scope.$on('$routeChangeStart', function (angularEvent, next) {

                $scope.vm.error.show = false;

                // Rewrite URL to include angular hashbang
                if ($location.absUrl().indexOf('#') < 0) {
                    var indexOfSearchFragment = $location.absUrl().indexOf('?');
                    if (indexOfSearchFragment >= 0) {
                        $window.location = $location.absUrl().replace(/\?/, '#/?');
                    }
                }

                if (next.$$route && next.$$route.originalPath && next.$$route.originalPath.indexOf(ROUTES_EXCLUDED_FROM_REDIRECTION) === -1) {
                    if (Survey.isEmpty() && next.$$route.originalPath !== '/:key?') {
                        $location.url('/');
                    }
                }
            });
        }

        function closeError() {
            $scope.vm.error.show = false;
        }

        function gotoLogin() {
            $window.location = API_ROOT + '/login';
        }

        function gotoLogout() {
            $window.location = API_ROOT + '/logout';
        }

        function init() {
            Exceptions.error = $scope.vm.error;

            catchRouteChangeStart();

            $timeout(function () {
                angular.element('header').removeClass('hidden');
                angular.element('div#error-alerts').removeClass('hidden');
            });
        }

        function isRunningOnLocalhost() {
            return $location.host() === 'localhost';
        }

        function showError(message, translatable) {
            $scope.vm = {
                error: {
                    message: message,
                    show: true,
                    translatable: translatable !== undefined ? translatable : false
                }
            };
        }
    }]);
})(angular);
