'use strict';

(function (angular) {
    angular.module('quickscan').controller('SurveyManagementCtrl', ['$http', '$location', '$scope', '$translate', 'toastr', 'Env', 'Exceptions', 'Sessions', 'Stakeholders', function ($http, $location, $scope, $translate, toastr, Env, Exceptions, Sessions, Stakeholders) {

        $scope.vm = {
            accessKey: undefined,
            activeTab: 'identifiers',
            files: {
                identifiers: undefined,
                invitations: [],
                results: []
            },
            language: 'fr',
            mailto: 'mailto:servicedesk@mycarenet.be',
            stakeholder: undefined
        };

        $scope.fetchStakeholder = fetchStakeholder;
        $scope.hasInvitations = hasInvitations;
        $scope.hasResults = hasResults;
        $scope.isPartnerInstitution = isPartnerInstitution;
        $scope.linkToInvitationFile = linkToInvitationFile;
        $scope.linkToPartnerInstitutionResultFile = linkToPartnerInstitutionResultFile;
        $scope.updateLanguage = updateLanguage;
        $scope.uploadIdentifiers = uploadIdentifiers;

        init();

        function fetchStakeholder() {
            if ($scope.vm.accessKey && $scope.vm.accessKey.trim().length > 0) {
                Stakeholders.findStakeholderWithAccessKey($scope.vm.accessKey).then(function (stakeholder) {
                    $scope.vm.stakeholder = stakeholder;

                    return Stakeholders.listStakeholderInvitationFiles($scope.vm.accessKey);
                }).then(function (invitationFiles) {
                    $scope.vm.files.invitations = invitationFiles;

                    return Stakeholders.listStakeholderResultFiles($scope.vm.accessKey);
                }).then(function (resultFiles) {
                    $scope.vm.files.results = resultFiles;

                    if (!isPartnerInstitution()) {
                        $scope.vm.activeTab = 'survey-results';
                    }

                    var focusedElement = angular.element(':focus');
                    if (focusedElement && focusedElement.length > 0 && focusedElement[0] !== undefined) {
                        focusedElement[0].blur();
                    }

                }).catch(function (rejection) {
                    if (rejection.status === 404) {
                        Exceptions.handleRejection(rejection, {404: 'manage.accessKeyInvalid'});
                    } else {
                        Exceptions.handleRejection(rejection);
                    }
                });
            }
        }

        function hasInvitations() {
            return $scope.vm.files.invitations.length > 0;
        }

        function hasResults() {
            return $scope.vm.files.results.length > 0;
        }

        function init() {
            Sessions.isLogged().then(function (isLogged) {
                if (!isLogged) {
                    $location.path('/');
                }
            }).catch(function (rejection) {
                Exceptions.handleRejection(rejection);
            });
        }

        function isPartnerInstitution() {
            return $scope.vm.stakeholder && $scope.vm.stakeholder.type === 'PARTNER_INSTITUTION';
        }

        function linkToInvitationFile(file) {
            // The trailing slash at the end of the file name is to prevent removal of dots in the url.
            // If omitted it would remove the extension and request "test" instead of "test.csv" to the server
            return Env.apiRoot() + '/stakeholders/' + $scope.vm.accessKey + '/invitation-files/' + encodeURIComponent(file.name) + '/';
        }

        function linkToPartnerInstitutionResultFile(file) {
            return Env.apiRoot() + '/stakeholders/' + $scope.vm.accessKey + '/result-files/' + encodeURIComponent(file.name) + '/';
        }

        function updateLanguage() {
            $translate.use($scope.vm.language);
        }

        function uploadIdentifiers() {
            var fileInputElement = angular.element('#uploadIdentifiersFile')[0];
            if (fileInputElement.files && fileInputElement.files.length && fileInputElement.files.length > 0) {

                Stakeholders.uploadIdentifiersFile(fileInputElement.files[0], $scope.vm.accessKey).then(function () {

                    return $translate('manage.identifiers.uploaded');
                }).then(function (message) {
                    toastr.success(message);

                    // Reset form's file field
                    var fileInputElements = angular.element('#uploadIdentifiersFile');
                    fileInputElements.wrap('<form>').closest('form').get(0).reset();
                    fileInputElements.unwrap();
                    // Prevent form submission
                    if (fileInputElements.stopPropagation) {
                        fileInputElements.stopPropagation();
                    }
                    if (fileInputElements.preventDefault) {
                        fileInputElements.preventDefault();
                    }

                }).catch(function (rejection) {
                    Exceptions.handleRejection(rejection);
                });
            }
        }
    }]);
})(angular);
