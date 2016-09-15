/**
 * Created by Heshan.i on 9/14/2016.
 */


/**
 * Created by Heshan.i on 8/15/2016.
 */
(function(){
    var app =angular.module('veeryConsoleApp');

    var slaController = function($scope, $state, slaApiAccess) {
        $scope.slas = [];
        $scope.sla = {};

        $scope.showAlert = function (title,content,type) {
            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.removeDeleted = function (item) {

            var index = $scope.slas.indexOf(item);
            if (index != -1) {
                $scope.slas.splice(index, 1);
            }

        };

        $scope.reloadPage = function () {
            $state.reload();
        };

        $scope.loadSLAs = function(){
            slaApiAccess.getAllSla().then(function(response){
                if(response.IsSuccess)
                {
                    $scope.slas = response.Result;
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }
            }, function(err){
                var errMsg = "Error occurred while loading triggers";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        $scope.saveSla = function(){
            slaApiAccess.createSla($scope.sla).then(function(response){
                if(response.IsSuccess)
                {
                    $scope.slas = response.Result;
                    $scope.showAlert('Success', 'info', response.CustomMessage);
                    $state.reload();
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }
            }, function(err){
                var errMsg = "Error occurred while saving trigger";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        $scope.loadSLAs();
    };

    app.controller('slaController', slaController);
}());