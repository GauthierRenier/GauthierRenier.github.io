'use strict';

(function (angular) {
    angular.module('quickscan').controller('SurveyQuestionnaireCtrl', ['$location', '$scope', '$uibModal', 'Exceptions', 'Survey', 'SurveyRuns', function ($location, $scope, $uibModal, Exceptions, Survey, SurveyRuns) {

        $scope.vm = {
            lang: Survey.language,
            pagination: {
                numberPerPage: Survey.data.numberOfQuestionsPerPage,
                page: 1,
                questions: undefined
            },
            progress: {
                max: undefined,
                value: undefined
            },
            questions: undefined
        };

        $scope.areAllQuestionsAnswered = areAllQuestionsAnswered;
        $scope.finish = finish;
        $scope.gotoFirstUnansweredQuestion = gotoFirstUnansweredQuestion;
        $scope.isSingleChoiceQuestion = isSingleChoiceQuestion;
        $scope.isMultipleChoiceQuestion = isMultipleChoiceQuestion;
        $scope.isDegreeQuestion = isDegreeQuestion;
        $scope.nextPage = nextPage;
        $scope.previousPage = previousPage;
        $scope.progressPercentage = progressPercentage;
        $scope.disableValidation = disableValidation;

        init();

        function calculateNumberOfPages(){
            $scope.numberOfPages = Math.ceil(getNonProceedQuestions(Survey.data.questionsOrder).length / $scope.vm.pagination.numberPerPage);
        }

        function disableValidation(){
            if ($scope.areAllQuestionsAnswered()){ return false;}
            return $scope.vm.pagination.page !== $scope.numberOfPages;
        }

        function areAllQuestionsAnswered() {
            return $scope.vm.progress.value === $scope.vm.progress.max;
        }

        function finish() {
            if (!areAllQuestionsAnswered()) {
                $uibModal.open({
                    templateUrl: 'app/modals/confirmation.html',
                    controller: 'SurveyConfirmationCtrl',
                    backdrop: 'static'
                });
            } else {
                $location.url('/evaluation');
            }
        }

        function gotoFirstUnansweredQuestion() {

            var firstUnansweredQuestionId = getNonProceedQuestionsOrder(Survey.data.questionsOrder).filter(function (questionId) {
                var unansweredQuestion = $scope.vm.questions.filter(function (question) {
                    return question.id === questionId;
                })[0];
                return unansweredQuestion.answer === undefined || unansweredQuestion.answer.length === 0;
            })[0];

            if (firstUnansweredQuestionId) {
                var indexOfUnansweredQuestion = getNonProceedQuestionsOrder(Survey.data.questionsOrder).indexOf(firstUnansweredQuestionId);
                $scope.vm.pagination.page = Math.floor(indexOfUnansweredQuestion / $scope.vm.pagination.numberPerPage) + 1;
            }

            updatePageOfDisplayedQuestions();
        }

        function init() {

            SurveyRuns.getSurvey(Survey.key).then(function(survey) {
                Survey.data = survey;

                return SurveyRuns.getSurveyQuestions(Survey.key);
            }).then(function (questions) {

                initQuestions(questions);
                initPagination();
                initProgressBar(questions);

                watchQuestionnaireForChanges();
                calculateNumberOfPages();

            }).catch(function (rejection) {
                Exceptions.handleMessage('survey.questionnaire.error.surveyNotFound', rejection);
            });
        }

        function initPagination() {
            $scope.vm.pagination.page = 1;

            if (Survey.isStarted()) {

                var firstUnansweredQuestion = getNonProceedQuestionsOrder(Survey.data.questionsOrder).filter(function (questionId) {
                    var answer = Survey.data.answers[questionId];
                    return answer === undefined || answer.values.length === 0;
                })[0];

                if (firstUnansweredQuestion) {
                    var indexOfUnansweredQuestion = getNonProceedQuestionsOrder(Survey.data.questionsOrder).indexOf(firstUnansweredQuestion);
                    $scope.vm.pagination.page = Math.floor(indexOfUnansweredQuestion / $scope.vm.pagination.numberPerPage) + 1;
                }
            }

            updatePageOfDisplayedQuestions();
        }

        function initProgressBar(questions) {
            setProgressValue();
            $scope.vm.progress.max = getNonProceedQuestions(questions).length;
        }

        function initQuestions(questions) {
            $scope.vm.questions = getNonProceedQuestions(questions);

            // Fill each question with its answer if it's already filled
            $scope.vm.questions.forEach(function (question) {
                var answer = Survey.data.answers[question.id];
                if (answer && answer.values) {
                    switch (question.type) {
                        case 'degree':
                        case 'single-choice' :
                            if (answer.values.length > 0) {
                                question.answer = answer.values[0];
                            }
                            break;
                        case'multiple-choice':
                            question.answer = answer.values;
                            break;
                    }
                }
            });
        }

        function isSingleChoiceQuestion(question) {
            return question.type === 'single-choice';
        }

        function isMultipleChoiceQuestion(question) {
            return question.type === 'multiple-choice';
        }

        function isDegreeQuestion(question) {
            return question.type === 'degree';
        }

        function nextPage() {
            if ($scope.vm.pagination.page < ($scope.numberOfPages)) {
                $scope.vm.pagination.page++;
                updatePageOfDisplayedQuestions();
            }
        }

        function previousPage() {
            if ($scope.vm.pagination.page > 1) {
                $scope.vm.pagination.page--;
                updatePageOfDisplayedQuestions();
            }
        }

        function progressPercentage() {
            return Math.floor($scope.vm.progress.value / $scope.vm.progress.max * 100);
        }

        function getNonProceedQuestions(questions) {
            return angular.copy(questions).filter(function (question) {
                return question.type !== 'proceed';
            });
        }

        function getNonProceedQuestionsOrder(questionOrder) {
            return angular.copy(questionOrder).filter(function (questionId) {

                var question = (function (questionId) {
                    return $scope.vm.questions.filter(function (question) {
                        return question.id === questionId;
                    })[0];
                })(questionId);

                return (question !== undefined);
            });
        }

        function updatePageOfDisplayedQuestions() {

            $scope.vm.pagination.questions = [];

            var index = ($scope.vm.pagination.page -1) * $scope.vm.pagination.numberPerPage;
            while ($scope.vm.pagination.questions.length < $scope.vm.pagination.numberPerPage && index < $scope.vm.questions.length) {
                var questionId = getNonProceedQuestionsOrder(Survey.data.questionsOrder)[index++];

                var question = (function (questionId) {
                    return $scope.vm.questions.filter(function (question) {
                        return question.id === questionId;
                    })[0];
                })(questionId);

                $scope.vm.pagination.questions.push(question);
            }
        }

        function watchQuestionnaireForChanges() {
            $scope.$watch('vm.questions', function (newQuestions, oldQuestions) {

                var answeredQuestions = newQuestions.filter(function (newQuestion, index) {
                    var oldQuestion = oldQuestions[index];
                    return !angular.equals(newQuestion, oldQuestion);
                });

                if (answeredQuestions && answeredQuestions.length > 0) { // Only save one answer at a time!
                    var question = answeredQuestions[0];

                    // Build question's answer
                    var answer = {
                        timestamp: Date.now(),
                        values: []
                    };
                    switch (question.type) {
                        case 'degree':
                        case 'single-choice':
                            if (question.answer !== undefined) {
                                answer.values.push(question.answer);
                            }
                            break;
                        case 'multiple-choice':
                            answer.values = question.answer;
                            break;
                    }

                    SurveyRuns.saveSurveyQuestionAnswer(Survey.key, question.id, answer).then(function () {
                        setProgressValue();
                    }).catch(function (rejection) {
                        Exceptions.handleMessage('survey.questionnaire.error.answerNotSaved', rejection);
                    });
                }
            }, true);
        }

        function setProgressValue() {
            $scope.vm.progress.value = $scope.vm.questions.filter(function (question) {
                return angular.isArray(question.answer) ? (question.answer.length) > 0 : question.answer !== undefined;
            }).length;
        }
    }]);
})(angular);
