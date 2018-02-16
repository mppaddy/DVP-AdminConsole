/**
 * Created by Pawan on 2/14/2018.
 */

mainApp.controller("filecategoryController", function ($scope, $state, ardsBackendService,fileServiceApiAccess, loginService,$anchorScroll) {

    $anchorScroll();
    $scope.addNew = false;



    $scope.showAlert = function (title, content, type) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };


    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(group) {
            return (group.GroupName.toLowerCase().indexOf(lowercaseQuery) != -1);
            ;
        };
    }




    $scope.querySearch = function (query) {
        if (query === "*" || query === "") {
            if ($scope.groups) {
                return $scope.groups;
            }
            else {
                return [];
            }

        }
        else {
            var results = query ? $scope.groups.filter(createFilterFor(query)) : [];
            return results;
        }

    };

    $scope.newFileCat={};
    $scope.newFileCat.Visible=true;
    $scope.newFileCat.Encripted=false;
    $scope.addFileCategory = function (resource) {


        fileServiceApiAccess.addNewFileCategory(resource).then(function (resAdd) {
            $scope.showAlert("Success", "File Category Saved successfully", "success");
            $state.reload();
        },function (errAdd) {
            $scope.showAlert("Error", "Error in saving new file category", "error");
            console.log("Exception in request ", errAdd);
        });


    };

    $scope.reloadPage = function () {
        $state.reload();
    };

    $scope.GetFileCategories = function () {
        fileServiceApiAccess.getAllFileCategories().then(function (response) {

            if (!response.IsSuccess) {
                console.info("Error in picking File category list " + response.Exception);
                $scope.showAlert("Error", "Error in loading file categories", "error");
            }
            else {
                $scope.fCategoryList = response.Result;
                //$scope.MasterAppList = response.data.Result;
            }

        }, function (error) {

            console.info("Error in picking File category list " + error);
            $scope.showAlert("Error", "Error in loading file categories", "error");
        });

    };


    $scope.cancleEdit = function () {
        $scope.addNew = false;
    };


    $scope.GetFileCategories();

});