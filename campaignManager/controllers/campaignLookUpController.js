/**
 * Created by damith on 11/8/17.
 */


mainApp.controller("campaignLookUpController", function ($scope,
                                                         $anchorScroll, campaignNumberApiAccess, loginService) {
    $anchorScroll();

    $scope.searchObj = {};
    $scope.categoryLookupObj = [];
    $scope.showAlert = function (title, content, type) {
        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };


    var loadCampaignCategories = function () {
        campaignNumberApiAccess.GetNumberCategories().then(function (response) {
            if (response.IsSuccess) {
                $scope.campaignCategories = response.Result;
            }
            else {
                var errMsg = response.CustomMessage;

                if (response.Exception) {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Campaign Number Upload', errMsg, 'error');
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            var errMsg = "Error occurred while loading number categories";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            $scope.showAlert('Campaign Number Upload', errMsg, 'error');
        });
    };
    loadCampaignCategories();


    var loadNewlyCreatedCampaigns = function () {
        $scope.newlyCreatedCampaigns = [];
        campaignNumberApiAccess.GetNewlyCreatedCampaigns().then(function (response) {
            if (response.IsSuccess) {
                var newCampaigns = response.Result;


                campaignNumberApiAccess.GetOngoingCampaigns().then(function (response) {
                    if (response.IsSuccess) {
                        $scope.newlyCreatedCampaigns = newCampaigns.concat(response.Result);

                    }
                    else {
                        $scope.newlyCreatedCampaigns = newCampaigns;
                    }
                }, function (err) {
                    $scope.newlyCreatedCampaigns = newCampaigns;
                });


            }
            else {
                var errMsg = response.CustomMessage;

                if (response.Exception) {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Campaign Number Upload', errMsg, 'error');
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            var errMsg = "Error occurred while loading campaigns";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            $scope.showAlert('Campaign Number Upload', errMsg, 'error');
        });
    };
    loadNewlyCreatedCampaigns();

    $scope.loadCampaignSchedules = function (campaignId) {
        if ($scope.campaignNumberObj) {
            $scope.campaignSchedules = [];
            $scope.enablePreviewData = false;
            if (campaignId) {
                var promiseFnList = [];
                for (var i = 0; i < $scope.newlyCreatedCampaigns.length; i++) {
                    var newCamp = $scope.newlyCreatedCampaigns[i];
                    if (newCamp.CampaignId.toString() === campaignId) {

                        $scope.selectedCampaign = newCamp;
                        newCamp.CampScheduleInfo.forEach(function (camSchedule) {
                            promiseFnList.push(scheduleBackendService.getSchedule(camSchedule.ScheduleId));
                        });


                        $q.all(promiseFnList).then(function (response) {
                            response.forEach(function (fnRes, k) {
                                if (fnRes.IsSuccess) {
                                    newCamp.CampScheduleInfo[k].ScheduleName = fnRes.Result[0].ScheduleName;
                                    $scope.campaignSchedules.push(newCamp.CampScheduleInfo[k]);

                                }

                            });


                            if (newCamp.CampaignChannel.toLowerCase() === 'call' && newCamp.DialoutMechanism.toLowerCase() === 'preview') {
                                $scope.enablePreviewData = true;
                            }

                            if (newCamp.CampaignChannel.toLowerCase() === 'sms' || newCamp.CampaignChannel.toLowerCase() === 'email') {
                                $scope.enablePreviewData = true;
                            }
                        });


                        //.then(function (response) {
                        //        if (response.IsSuccess) {
                        //            newCamp.CampScheduleInfo[0].ScheduleName = response.Result[0].ScheduleName;
                        //            $scope.campaignSchedules.push(newCamp.CampScheduleInfo[0]);
                        //            if(newCamp.CampaignChannel.toLowerCase() === 'call' && newCamp.DialoutMechanism.toLowerCase() === 'preview'){
                        //                $scope.enablePreviewData = true;
                        //            }
                        //        }
                        //        else {
                        //            $scope.showAlert('Campaign Number Upload', 'Fail To oad Schedules', 'error');
                        //        }
                        //    }, function (error) {
                        //        $scope.showAlert('Campaign Number Upload', 'Fail To oad Schedules', 'error');
                        //    });


                        break;
                    }
                }

                //campaignNumberApiAccess.GetCampaignSchedule(campaignId).then(function (response) {
                //    if (response.IsSuccess) {
                //        $scope.campaignSchedules = response.Result;
                //    }
                //    else {
                //        var errMsg = response.CustomMessage;
                //
                //        if (response.Exception) {
                //            errMsg = response.Exception.Message;
                //        }
                //        $scope.showAlert('Campaign Number Upload', errMsg, 'error');
                //    }
                //}, function (err) {
                //    loginService.isCheckResponse(err);
                //    var errMsg = "Error occurred while loading campaign schedules";
                //    if (err.statusText) {
                //        errMsg = err.statusText;
                //    }
                //    $scope.showAlert('Campaign Number Upload', errMsg, 'error');
                //});
            }
        }
    };


    var searchOption = function () {

        return {
            searchNumbersByCampaign: function () {
                $scope.isLoadingLookUp = true;
                campaignNumberApiAccess.GetNumbersByCampaign($scope.searchObj.CampaignId).then(function (response) {
                    $scope.isLoadingLookUp = false;
                    if (response.IsSuccess) {
                        if (response.Result && response.Result.length > 0) {
                            $scope.categoryLookupObj = response.Result.map(function (result) {
                                return result;
                            });
                        }

                    }
                    else {
                        var errMsg = response.CustomMessage;
                        if (response.Exception) {
                            errMsg = response.Exception.Message;
                        }
                        $scope.showAlert('Number Base', errMsg, 'error');
                    }
                }, function (err) {
                    $scope.isLoadingLookUp = false;
                    loginService.isCheckResponse(err);
                    var errMsg = "Error occurred while loading numbers";
                    if (err.statusText) {
                        errMsg = err.statusText;
                    }
                    $scope.showAlert('Number Base', errMsg, 'error');
                });
            },
            searchNumbersByCampaignAndSchedule: function () {
                $scope.isLoadingLookUp = true;
                campaignNumberApiAccess.GetNumbersByCampaignAndSchedule($scope.searchObj.CampaignId, $scope.searchObj.CamScheduleId).then(function (response) {
                    $scope.isLoadingLookUp = false;
                    if (response.IsSuccess) {
                        if (response.Result && response.Result.length > 0) {
                            if (response.Result && response.Result && response.Result.length > 0) {
                                $scope.categoryLookupObj = response.Result.map(function (result) {
                                    return result;
                                });
                            }
                        }

                    }
                    else {
                        $scope.isTableLoading = 2;
                        var errMsg = response.CustomMessage;

                        if (response.Exception) {
                            errMsg = response.Exception.Message;
                        }
                        $scope.showAlert('Number Base', errMsg, 'error');
                    }
                }, function (err) {
                    $scope.isLoadingLookUp = false;
                    loginService.isCheckResponse(err);
                    var errMsg = "Error occurred while loading numbers";
                    if (err.statusText) {
                        errMsg = err.statusText;
                    }
                    $scope.showAlert('Number Base', errMsg, 'error');
                });
            },
            searchNumbersByCategories: function () {

                $scope.isLoadingLookUp = true;
                campaignNumberApiAccess.GetNumbersByCategory($scope.searchObj.CategoryID).then(function (response) {
                    $scope.isLoadingLookUp = false;
                    if (response.IsSuccess) {
                        if (response.Result && response.Result.CampContactInfo && response.Result.CampContactInfo.length > 0) {
                            $scope.categoryLookupObj = response.Result.CampContactInfo.map(function (result) {
                                return result;
                            })
                        }

                    }
                    else {
                        var errMsg = response.CustomMessage;

                        if (response.Exception) {
                            errMsg = response.Exception.Message;
                        }
                        $scope.showAlert('Number Base', errMsg, 'error');
                    }
                }, function (err) {
                    $scope.isLoadingLookUp = false;
                    loginService.isCheckResponse(err);
                    var errMsg = "Error occurred while loading numbers";
                    if (err.statusText) {
                        errMsg = err.statusText;
                    }
                    $scope.showAlert('Number Base', errMsg, 'error');
                });
            }
        }
    }();

    $scope.searchNumbers = function () {
        if ($scope.searchObj.CampaignId) {
            if ($scope.searchObj.CamScheduleId) {
                searchOption.searchNumbersByCampaignAndSchedule();
            }
            else {
                searchOption.searchNumbersByCampaign();
            }
        }
        else {
            searchOption.searchNumbersByCategories();
        }
    };

    $scope.clearSearch = function () {
        $scope.searchObj = {};
        $scope.categoryLookupObj = [];
    };
});