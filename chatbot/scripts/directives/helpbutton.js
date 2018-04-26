/**
 * Created by Shehan on 26/4/2018.
 */
mainApp.directive("helpbutton", function ($filter, $uibModal, appBackendService) {

    return {
        restrict: "EAA",
        scope: {
            displayhelp: "="
        },
        templateUrl: 'chatbot/views/partials/helpbutton.html',
        link: function (scope) {
            scope.mode = "view"
            scope.changeMode = function (mode) {
                scope.mode = mode
            };
            scope.showModal = function (value) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'chatbot/views/partials/helpbutton-modal.html',
                    controller: 'helpbuttonController',
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        DisplayHelp: function () {
                            return value;
                        }
                    }
                });
            };
        }

    }
});


mainApp.controller("helpbuttonController", function ($scope, $uibModalInstance, DisplayHelp) {

    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
    }

});
