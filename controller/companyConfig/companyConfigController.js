/**
 * Created by Pawan on 7/29/2016.
 */

mainApp.controller("companyConfigController", function ($scope, $state, companyConfigBackendService, jwtHelper, authService, loginService) {


    $scope.isNewEndUser = false;
    $scope.isUserError = false;
    $scope.ClusterID;
    $scope.contextList = [];

    var authToken = authService.GetToken();
    var decodeData = jwtHelper.decodeToken(authToken);

    $scope.contextPrefix = decodeData.tenant + "_" + decodeData.company + "_";


    $scope.newApplication = {};
    $scope.addNew = false;
    $scope.MasterAppList = [];
    $scope.IsDeveloper = false;
    $scope.Developers = [];

    $scope.showAlert = function (tittle, content, type) {

        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };


    $scope.saveEndUser = function () {

        switch ($scope.CloudEndUser.ConnectivityProvision) {
            case "SINGLE":
                $scope.CloudEndUser.Provision = 1;
                break;
            case "PROFILE":
                $scope.CloudEndUser.Provision = 2;
                break;
            case "SHARED":
                $scope.CloudEndUser.Provision = 3;
                break;
            default :
                $scope.CloudEndUser.Provision = 1;
                break;
        }

        $scope.CloudEndUser.ClientCompany = decodeData.company;
        $scope.CloudEndUser.ClientTenant = decodeData.tenant;


        if ($scope.isNewEndUser) {
            $scope.CloudEndUser.ClusterID = $scope.ClusterID;

            companyConfigBackendService.saveNewEndUser($scope.CloudEndUser).then(function (response) {

                if (!response.data.IsSuccess) {

                    console.info("Error in adding new Enduser " + response.data.Exception);
                    $scope.showAlert("Error", "There is an error in adding new Enduser ", "error");
                    //$scope.showAlert("Error",)
                }
                else {
                    $scope.addNew = !response.data.IsSuccess;
                    $scope.showAlert("Success", "New Enduser added successfully.", "success");


                }
                $state.reload();
            }, function (error) {
                loginService.isCheckResponse(error);
                console.info("Error in adding new Enduser " + error);
                $scope.showAlert("Error", "There is an Exception in saving Enduser " + error, "error");
                $state.reload();
            });
        }
        else {
            $scope.CloudEndUser.SIPConnectivityProvision = $scope.CloudEndUser.Provision;
            companyConfigBackendService.updateEndUser($scope.CloudEndUser).then(function (response) {

                if (!response.data.IsSuccess) {

                    console.info("Error in adding new Enduser " + response.data.Exception);
                    $scope.showAlert("Error", "There is an error in updating Enduser ", "error");
                    //$scope.showAlert("Error",)
                }
                else {
                    $scope.addNew = !response.data.IsSuccess;
                    $scope.showAlert("Success", "New Enduser updated successfully.", "success");


                }
                $state.reload();
            }, function (error) {
                loginService.isCheckResponse(error);
                console.info("Error in adding new Enduser " + error);
                $scope.showAlert("Error", "There is an Exception in updating Enduser " + error, "error");
                $state.reload();
            });
        }


    };

    $scope.GetEndUser = function () {
        companyConfigBackendService.getCloudEndUser().then(function (response) {

            if (!response.data.IsSuccess) {
                console.info("Error in picking EndUsers " + response.data.Exception);

                $scope.isUserError = true;
            }
            else {
                $scope.isUserError = false;
                if (response.data.Result.length > 0) {
                    $scope.isNewEndUser = false;
                    $scope.CloudEndUser = response.data.Result[0];
                    switch ($scope.CloudEndUser.SIPConnectivityProvision) {
                        case 1:
                            $scope.CloudEndUser.ConnectivityProvision = "SINGLE";
                            break;
                        case 2:
                            $scope.CloudEndUser.ConnectivityProvision = "PROFILE";
                            break;
                        case 3:
                            $scope.CloudEndUser.ConnectivityProvision = "SHARED";
                            break;
                        default :
                            $scope.CloudEndUser.ConnectivityProvision = "SINGLE";
                            break;
                    }
                }
                else {
                    $scope.isNewEndUser = true;
                }

                //$scope.MasterAppList = response.data.Result;
            }

        }, function (error) {
            loginService.isCheckResponse(error);
            console.info("Error in picking EndUsers " + error);
            $scope.isUserError = true;
        });
    };

    $scope.GetClusters = function () {

        companyConfigBackendService.getClusters().then(function (response) {
            if (!response.data.IsSuccess) {
                console.info("Error in picking Clusters " + response.data.Exception);

            } else {

                if (response.data.Result.length > 0) {
                    $scope.ClusterID = response.data.Result[0].id;

                }


                //$scope.MasterAppList = response.data.Result;
            }

        }, function (error) {
            loginService.isCheckResponse(error);
            console.info("Error in picking clusters " + JSON.stringify(error));
        });

    };

    $scope.GetContexts = function () {
        companyConfigBackendService.getContexts().then(function (response) {

            if (!response.data.IsSuccess) {
                console.info("Error in picking Contexts " + response.data.Exception);

            }
            else {
                $scope.contextList = response.data.Result;

                //$scope.MasterAppList = response.data.Result;
            }

        }, function (error) {
            loginService.isCheckResponse(error);
            console.info("Error in picking Contexts " + error);

        })
    };
    $scope.removeDeleted = function (item) {

        var index = $scope.contextList.indexOf(item);
        if (index != -1) {
            $scope.contextList.splice(index, 1);
        }

    };

    $scope.saveNewContext = function () {

        $scope.newContext.ContextCat = "INTERNAL";
        $scope.newContext.ClientCompany = decodeData.company;
        $scope.newContext.ClientTenant = decodeData.tenant;
        $scope.newContext.Context = $scope.contextPrefix + $scope.newContext.Context;

        companyConfigBackendService.saveNewContext($scope.newContext).then(function (response) {

            if (!response.data.IsSuccess) {

                console.info("Error in adding new Context " + response.data.Exception);
                $scope.showAlert("Error", "There is an error in adding new Context ", "error");
                //$scope.showAlert("Error",)
            }
            else {
                $scope.addNew = !response.data.IsSuccess;
                $scope.showAlert("Success", "New Context added successfully.", "success");


            }
            $state.reload();
        }, function (error) {
            loginService.isCheckResponse(error);
            console.info("Error in adding new Enduser " + error);
            $scope.showAlert("Error", "There is an Exception in saving Context " + error, "error");
            $state.reload();
        });
    };

    $scope.reloadPage = function () {
        $state.reload();
    };


    $scope.GetEndUser();
    $scope.GetClusters();
    $scope.GetContexts();


    //----------------------------Dynamic Ticket Types----------------------------------------------
    $scope.ticketTypes = undefined;

    $scope.activateDynamicTicketTypes = function () {
        companyConfigBackendService.activateTicketTypes().then(function (response) {
            if (response) {

                var result = response.data;
                if (result && result.IsSuccess) {
                    $scope.ticketTypes = result.Result;
                } else {
                    $scope.ticketTypes = undefined;

                    $scope.showAlert("Dynamic Ticket Types", "Empty Response", "error");
                }
            }
            else {
                $scope.ticketTypes = undefined;
                $scope.showAlert("Dynamic Ticket Types", "Empty Response", "error");
            }
        }, function (error) {
            loginService.isCheckResponse(error);
            $scope.ticketTypes = undefined;

            var errMsg = "Error in activate ticket types";
            if (error.statusText) {
                errMsg = error.statusText;
            }

            $scope.showAlert("Dynamic Ticket Types", errMsg, "error");
        });
    };

    $scope.getDynamicTicketTypes = function () {
        companyConfigBackendService.getTicketTypes().then(function (response) {
            if (response.IsSuccess) {
                $scope.ticketTypes = response.Result;
            }
            else {
                var errMsg = response.CustomMessage;

                if (response.Exception) {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Dynamic Ticket Types', errMsg, 'error');
            }
        }, function (err) {
            loginService.isCheckResponse(error);
            var errMsg = "Error occurred while saving ticket type";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            $scope.showAlert('Dynamic Ticket Types', errMsg, 'error');
        });
    };

    $scope.updateDynamicTicketTypes = function () {
        companyConfigBackendService.updateTicketTypes($scope.ticketTypes).then(function (response) {
            if (response.IsSuccess) {
                $scope.showAlert('Dynamic Ticket Types', response.CustomMessage, 'success');
            }
            else {
                var errMsg = response.CustomMessage;

                if (response.Exception) {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Dynamic Ticket Types', errMsg, 'error');
            }
        }, function (err) {
            loginService.isCheckResponse(error);
            var errMsg = "Error occurred while saving ticket type";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            $scope.showAlert('Dynamic Ticket Types', errMsg, 'error');
        });
    };

    $scope.addCustomTicketTypes = function () {
        companyConfigBackendService.addCustomTicketTypes($scope.ticketTypes._id.toString(), $scope.ticketTypes.newCustomState).then(function (response) {
            if (response.IsSuccess) {
                $scope.ticketTypes.custom_types.push($scope.ticketTypes.newCustomState);
            }
            else {
                var errMsg = response.CustomMessage;

                if (response.Exception) {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Dynamic Ticket Types', errMsg, 'error');
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            var errMsg = "Error occurred while saving custom type";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            $scope.showAlert('Dynamic Ticket Types', errMsg, 'error');
        });
    };

    $scope.removeCustomTicketTypes = function (index, customType) {
        companyConfigBackendService.removeCustomTicketTypes($scope.ticketTypes._id.toString(), customType).then(function (response) {
            if (response.IsSuccess) {
                $scope.ticketTypes.custom_types.splice(index, 1);
            }
            else {
                var errMsg = response.CustomMessage;

                if (response.Exception) {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Dynamic Ticket Types', errMsg, 'error');
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            var errMsg = "Error occurred while removing custom type";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            $scope.showAlert('Dynamic Ticket Types', errMsg, 'error');
        });
    };

    $scope.getDynamicTicketTypes();


    //----------------------------Custom Ticket Status----------------------------------------------
    $scope.cusTicketStatus = {};
    $scope.customticketStatus = [];
    $scope.systemTicketStatus = [];

    $scope.getCustomTicketStatus = function(){
        $scope.customticketStatus = [];
        $scope.systemTicketStatus = [];
        companyConfigBackendService.getCustomTicketStatus().then(function(response){
            if(response.IsSuccess)
            {
                if(response.Result){
                    for(var i=0; i< response.Result.length; i++){
                        if(response.Result[i].node_type === "system"){
                            $scope.systemTicketStatus.push(response.Result[i]);
                        }else{
                            $scope.customticketStatus.push(response.Result[i]);
                        }
                    }
                }else{
                    $scope.customticketStatus = [];
                }
            }
            else
            {
                var errMsg = response.CustomMessage;

                if(response.Exception)
                {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Custom Ticket Status', errMsg, 'error');
            }
        }, function(err){
            var errMsg = "Error occurred while receiving ticket status";
            if(err.statusText)
            {
                errMsg = err.statusText;
            }
            $scope.showAlert('Custom Ticket Status', errMsg, 'error');
        });
    };

    $scope.addCustomTicketStatus = function(){
        companyConfigBackendService.addCustomTicketStatus($scope.cusTicketStatus).then(function (response) {
            if(response.IsSuccess)
            {
                $scope.showAlert('Custom Ticket Status', response.CustomMessage, 'success');
                $scope.cusTicketStatus = {};
                $scope.getCustomTicketStatus();
            }
            else
            {
                var errMsg = response.CustomMessage;

                if(response.Exception)
                {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Custom Ticket Status', errMsg, 'error');
            }
        }, function(err){
            var errMsg = "Error occurred while add new ticket status";
            if(err.statusText)
            {
                errMsg = err.statusText;
            }
            $scope.showAlert('Custom Ticket Status', errMsg, 'error');
        });
    };

    $scope.removeDeleted = function (item) {

        var index = $scope.customticketStatus.indexOf(item);
        if (index != -1) {
            $scope.customticketStatus.splice(index, 1);
        }

    };

    $scope.getCustomTicketStatus();

});