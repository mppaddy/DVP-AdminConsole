/**
 * Created by Shehan on 26/1/2018.
 */
mainApp.directive("edittemplate", function ($filter, $uibModal, appBackendService) {

    return {
        restrict: "EAA",
        scope: {
            template: "=",
            templateList: "=",
            'updateApplication': '&',
            'reloadpage': '&'
        },

        templateUrl: 'chatbot/views/partials/editTemplate.html',

        link: function (scope) {

            scope.editTemplate = function () {
                scope.editMode = !scope.editMode;
            };

            scope.removeTemplate = function (item) {

                scope.showConfirm("Delete Template", "Delete", "ok", "cancel", "Are you sure you want to delete " + item.name, function (obj) {

                    // appBackendService.deleteApplication(scope.application).then(function (response) {
                    //     if (response) {
                    //         scope.updateApplication(item);
                    //         scope.showAlert("Deleted","File " + item.AppName + " Deleted successfully","success");
                    //     }
                    //     else
                    //         scope.showAlert("Error", "Error in file removing", "error");
                    // }, function (error) {
                    //     scope.showAlert("Error", "Error in file removing", "error");
                    // });

                }, function () {

                }, item);
            };

            /* Start of Default methods*/

            scope.showConfirm = function (tittle, label, okbutton, cancelbutton, content, OkCallback, CancelCallBack, okObj) {

                (new PNotify({
                    title: tittle,
                    text: content,
                    icon: 'glyphicon glyphicon-question-sign',
                    hide: false,
                    confirm: {
                        confirm: true
                    },
                    buttons: {
                        closer: false,
                        sticker: false
                    },
                    history: {
                        history: false
                    }
                })).get().on('pnotify.confirm', function () {
                    OkCallback("confirm");
                }).on('pnotify.cancel', function () {

                });

            };

            scope.showAlert = function (title, content, type) {

                new PNotify({
                    title: title,
                    text: content,
                    type: type,
                    styling: 'bootstrap3'
                });
            };

            /* End of Default Methods */

        }

    }
});