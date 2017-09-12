'use strict';

(function (angular) {
    angular.module('quickscan').factory('Stakeholders', ['$http', '$resource', 'Env', function ($http, $resource, Env) {

        var apiRoot = Env.apiRoot() + '/stakeholders';
        var resources = $resource(apiRoot, {}, {
            get: {method: 'GET', url: apiRoot + '/:key'},
            listInvitationFiles: {method: 'GET', url: apiRoot + '/:key/invitation-files', isArray: true},
            listResultFiles: {method: 'GET', url: apiRoot + '/:key/result-files', isArray: true}
        });

        return {
            findStakeholderWithAccessKey: findStakeholderWithAccessKey,
            listStakeholderInvitationFiles: listStakeholderInvitationFiles,
            listStakeholderResultFiles: listStakeholderResultFiles,
            uploadIdentifiersFile: uploadIdentifiersFile
        };

        function findStakeholderWithAccessKey(key) {
            return resources.get({key: key}).$promise;
        }

        function listStakeholderInvitationFiles(key) {
            return resources.listInvitationFiles({key: key}).$promise;
        }

        function listStakeholderResultFiles(key) {
            return resources.listResultFiles({key: key}).$promise;
        }

        function uploadIdentifiersFile(file, key) {
            var formData = new FormData();
            formData.append('file', file);

            return $http.post(apiRoot + '/' + key + '/identifiers', formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        }
    }]);
})(angular);
