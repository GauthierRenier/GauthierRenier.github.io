'use strict';

(function (angular) {
    angular.module('quickscan').controller('SurveyConfirmationCtrl', ['$uibModalInstance', '$location', '$scope', function($uibModalInstance, $location, $scope) {

        $scope.confirm = function() {
            $location.url('/evaluation');
            $uibModalInstance.close();
        };
        $scope.cancel = function() {
            $uibModalInstance.close();
        };
    }]);
})(angular);