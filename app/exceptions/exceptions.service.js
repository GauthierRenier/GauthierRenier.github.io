'use strict';

(function (angular) {
    angular.module('quickscan').factory('Exceptions', ['$log', '$translate', function ($log, $translate) {

        var Exceptions = {
            error: undefined,
            handleMessage: handleMessage,
            handleRejection: handleRejection
        };
        return Exceptions;

        function handleMessage(message, errorObject) {
            if (errorObject) {
                $log.error(errorObject)
            }
            translateAndDisplay(message);
        }

        /**
         * The messages parameter can be a translate path to codes and their translations, such as "survey.error",
         * where the translate i18n file is like:
         * ...
         * "survey": {
         *   "error: {
         *     "403": "My error message for 403",
         *     "500": "My error message for 500"
         *   },
         *   ...
         * }
         * It can also be an object carrying the various codes, such as:
         * {
         *   "403": "My error message for 403",
         *   "500": "My error message for 500"
         * }
         * The codes can link to sentences or to translatable paths such as "survey.initialization.error.rejected"
         *
         * @param rejection
         * @param messages
         */
        function handleRejection(rejection, messages) {
            $log.error(rejection);

            var message = undefined;
            if (messages && angular.isString(messages)) {
                message = messages + '.' + [rejection.status]; // i18n path to error
            } else if (messages && angular.isObject(messages) && messages[rejection.status]) {
                message = messages[rejection.status]; // Object (map) of error codes whose value is the message (i18n path or text message)
            } else {
                message = 'error.unexpected';
            }

            translateAndDisplay(message);
        }

        function translateAndDisplay(message) {
            if (Exceptions && Exceptions.error) {
                $translate(message).then(function (message) {
                    Exceptions.error.message = message;
                }).catch(function (message) {
                    Exceptions.error.message = message;
                }).finally(function() {
                    Exceptions.error.show = true;
                });
            } else {
                $log.warn(message);
            }
        }
    }]);
})(angular);
