/**
 * Created by damith on 10/11/17.
 */

mainApp.controller("campaignWizardController", function ($scope,
                                                         $anchorScroll,
                                                         campaignService, campaignNumberApiAccess,
                                                         scheduleBackendService, $filter, $q, loginService) {
        $anchorScroll();


        $scope.step = 1;


        $scope.submit = function () {
            alert("Submitted Wizard!");
        };
        $scope.addNewStep = function (newStep) {
            $scope.dynamicSteps.push(newStep);
        };

        $scope.dynamicSteps = ["step 3"];
        $scope.dynamicRequiredText = {};


        $scope.safeApply = function (fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

        //step 01 create new campaign
        //

        $scope.active = 1;

        var step01UIFun = function () {
            return {
                onLoadWizard: function () {
                    $scope.campaignModeObj.push(campaignModeObj[2]);
                    $scope.dialoutMechanismObj.push(dialoutMechanismObj[0]);

                    ///$('#callBackOption').addClass('display-none');
                    $scope.showCallback = "no";
                },
                clearChannel: function () {
                    $scope.campaignModeObj = [];
                    $scope.dialoutMechanismObj = [];
                },
                refreshTabConfig: function () {
                    $scope.stepOneConfigTabs = [
                        {index: 1, title: 'Template Config ', viewType: 'template', disabled: true, active: true},
                        {index: 2, title: 'Preview Config', viewType: 'preview', disabled: true, active: true},
                        {index: 3, title: 'Callback Config', viewType: 'callback', disabled: true, active: true}
                    ];
                },
                moveWizard: function (step) {

                    var firstStepWizard = $('#1stStepWizard'),
                        secondStepWizard = $('#2ndStepWizard'),
                        configWizard = $('#3ndStepWizard'),
                        fourthStepWizard = $('#4ndStepWizard');

                    if (step == 1) {
                        $scope.safeApply(function () {
                            $scope.step = 2;
                        });

                        firstStepWizard.removeClass('processing').addClass('done');
                        secondStepWizard.removeClass('processing');
                        configWizard.removeClass('processing');
                        fourthStepWizard.removeClass('processing');
                    }

                    if (step == 2) {
                        $scope.safeApply(function () {
                            $scope.step = 2;
                        });
                        firstStepWizard.removeClass('processing').addClass('done');
                        secondStepWizard.addClass('processing');
                        return;
                    }


                    if (step == 3) {
                        $scope.safeApply(function () {
                            $scope.step = 3;
                        });
                        secondStepWizard.removeClass('processing').addClass('done');
                        configWizard.addClass('processing');

                        $scope.GetCampaignAdditionalData();
                        return;
                    }

                    if (step == 4) {
                        $scope.safeApply(function () {
                            $scope.step = 4;
                        });
                        configWizard.removeClass('processing').addClass('done');
                        fourthStepWizard.addClass('processing');
                    }
                },
                moveBackWizard: function (step) {
                    var firstStepWizard = $('#1stStepWizard'),
                        secondStepWizard = $('#2ndStepWizard'),
                        configWizard = $('#3ndStepWizard'),
                        fourthStepWizard = $('#4ndStepWizard');

                    if (step == 2) {
                        $scope.safeApply(function () {
                            $scope.step = 1;
                        });

                        firstStepWizard.removeClass('done').addClass('processing');
                        secondStepWizard.removeClass('processing');
                        secondStepWizard.removeClass('done');
                    }

                    if (step == 3) {
                        $scope.safeApply(function () {
                            $scope.step = 2;
                        });

                        secondStepWizard.removeClass('done').addClass('processing');
                        configWizard.removeClass('processing');
                        configWizard.removeClass('done');
                    }


                    if (step == 4) {
                        $scope.safeApply(function () {
                            $scope.step = 3;
                        });

                        configWizard.removeClass('done').addClass('processing');
                        fourthStepWizard.removeClass('processing');
                        fourthStepWizard.removeClass('done');
                    }
                },
                refreshWizard: function () {
                    var firstStepWizard = $('#1stStepWizard'),
                        secondStepWizard = $('#2ndStepWizard'),
                        configWizard = $('#3ndStepWizard'),
                        fourthStepWizard = $('#4ndStepWizard');

                    firstStepWizard.removeClass('processing done');
                    secondStepWizard.removeClass('processing done');
                    configWizard.removeClass('processing done');
                    fourthStepWizard.removeClass('processing done');

                    firstStepWizard.addClass('processing');
                }
            }
        }();
        step01UIFun.clearChannel();
        //step01UIFun.refreshTabConfig();

        var campaignModeObj = [
            {name: 'IVR'},
            {name: 'AGENT'},
            {name: 'MESSAGE'}
        ];

        var dialoutMechanismObj = [
            {name: 'BLAST'},
            {name: 'FIFO'},
            {name: 'PREVIEW'},
            {name: 'AGENT'}
        ];

        step01UIFun.onLoadWizard();


        $scope.changeChannels = function (_selectMe) {
            $('.camp-channel').removeClass('active-channel');
            $('#' + _selectMe).addClass('active-channel');
            $('#callBackOption').addClass('display-none');

            step01UIFun.clearChannel();
            step01UIFun.refreshTabConfig();
            $scope.campaign.CampaignChannel = _selectMe;
            switch (_selectMe) {
                case 'SMS':
                    $scope.campaignModeObj.push(campaignModeObj[2]);
                    $scope.dialoutMechanismObj.push(dialoutMechanismObj[0]);
                    $scope.stepOneConfigTabs[0].disabled = false;
                    $scope.stepOneConfigTabs[0].active = 1;
                    break;
                case 'EMAIL':
                    $scope.campaignModeObj.push(campaignModeObj[2]);
                    $scope.dialoutMechanismObj.push(dialoutMechanismObj[0]);
                    $scope.safeApply(function () {
                        $scope.stepOneConfigTabs[0].disabled = false;
                        $scope.stepOneConfigTabs[0].active = 1;
                    });
                    break;
                case 'CALL':
                    $scope.campaignModeObj.push(campaignModeObj[0],
                        campaignModeObj[1]);
                    $scope.dialoutMechanismObj.push(
                        dialoutMechanismObj[0],
                        dialoutMechanismObj[1],
                        dialoutMechanismObj[2],
                        dialoutMechanismObj[3]);
                    $('#callBackOption').removeClass('display-none');

                    $scope.safeApply(function () {
                        $scope.stepOneConfigTabs[2].disabled = false;
                        $scope.stepOneConfigTabs[2].active = 3;
                    });
                    break;
            }
        };


        /*template config */
        $scope.Templates = [];
        $scope.campaignAdditionalData = [];
        $scope.currentConfigTemplate = {};

        $scope.GetCampaignAdditionalData = function () {
            $scope.isLoadingData = true;
            campaignService.GetTemplateList().then(function (response) {
                if (response) {
                    $scope.Templates = response;
                }
            }, function (error) {
                $scope.showAlert("Campaign", 'error', "Fail To Load Template Data");
            });


            campaignService.GetCampaignAdditionalData($scope.campaign.CampaignId).then(function (response) {
                if (response) {

                    $scope.campaignAdditionalData = response;
                    response.map(function (item) {
                        $scope.currentConfigTemplate = item.Category != "ATTACHMENT" ? item : '';
                    });
                    if ($scope.campaign.DialoutMechanism === "PREVIEW") {
                        if (response.length > 0) {
                            $scope.campAttribute = [];
                            $scope.AdditionalDataRecordId = response[0].AdditionalDataId;
                            $scope.campaignAttributes = JSON.parse(response[0].AdditionalData);
                            $scope.campaignAttributes.forEach(function (item) {
                                for (var i = 0; i < $scope.ardsAttributes.length; i++) {
                                    var ardsAttribute = $scope.ardsAttributes[i];
                                    if (ardsAttribute && ardsAttribute.Id === item) {
                                        $scope.campAttribute.push(ardsAttribute);
                                    }
                                }
                            });
                        } else {
                            $scope.campaignAttributes = [];
                            $scope.campAttribute = [];
                            $scope.AdditionalDataRecordId = undefined;
                        }
                    }
                }
                $scope.isLoadingData = false;
            }, function (error) {
                $scope.showAlert("Campaign", 'error', "Fail To Create Additional Data");
                $scope.isLoadingData = false;
            });
        };


        $scope.DeleteAdditionalDataByID = function (id) {
            campaignService.DeleteAdditionalDataByID(id).then(function (response) {
                if (response) {
                    $scope.GetCampaignAdditionalData();
                    $scope.showAlert("Campaign", 'success', "Successfully Deleted.");
                }
                else {
                    $scope.showAlert("Campaign", 'error', "Fail To Delete Additional Data");
                }
            }, function (error) {
                $scope.showAlert("Campaign", 'error', "Fail To Delete Additional Data");
            });
        };


        //callback option
        $scope.safeApply(function () {

        });

        $scope.setCallback = function (value) {
            console.log(value);
            $scope.showCallback = value;
            $scope.callback.AllowCallBack = value == "yes" ? 'YES' : 'NO';
        };


        //change event
        $scope.changeDialoutMechanism = function (_mechanism) {
            console.log(_mechanism);
            //step01UIFun.refreshTabConfig();
            if (_mechanism == "PREVIEW") {
                $scope.safeApply(function () {
                    $scope.stepOneConfigTabs[1].disabled = false;
                });
            }
        };

        //#end


        /* number upload wizard */
        // $scope.loadNewlyCreatedCampaigns = function () {
        //     $scope.newlyCreatedCampaigns = [];
        //     campaignNumberApiAccess.GetNewlyCreatedCampaigns().then(function (response) {
        //         if (response.IsSuccess) {
        //             var newCampaigns = response.Result;
        //
        //
        //             campaignNumberApiAccess.GetOngoingCampaigns().then(function (response) {
        //                 if (response.IsSuccess) {
        //                     $scope.newlyCreatedCampaigns = newCampaigns.concat(response.Result);
        //
        //                 }
        //                 else {
        //                     $scope.newlyCreatedCampaigns = newCampaigns;
        //                 }
        //             }, function (err) {
        //                 $scope.newlyCreatedCampaigns = newCampaigns;
        //             });
        //
        //
        //         }
        //         else {
        //             var errMsg = response.CustomMessage;
        //
        //             if (response.Exception) {
        //                 errMsg = response.Exception.Message;
        //             }
        //             $scope.showAlert('Campaign Number Upload', errMsg, 'error');
        //         }
        //     }, function (err) {
        //         loginService.isCheckResponse(err);
        //         var errMsg = "Error occurred while loading campaigns";
        //         if (err.statusText) {
        //             errMsg = err.statusText;
        //         }
        //         $scope.showAlert('Campaign Number Upload', errMsg, 'error');
        //     });
        // };
        //
        //
        // $scope.loadNewlyCreatedCampaigns();


        //create new campaign
        $scope.campaign = {
            CampaignChannel: 'SMS',
            AdditionalData: {
                FileName: '',
                Template: ''
            }
        };
        $scope.callback = {
            AllowCallBack: 'no'
        };


        $scope.SaveCallBack = function (id, callback) {
            $scope.updateConfig = true;

            if (angular.isArray(callback)) {

                var i = 0;
                var failToSave = [];

                function showmsg() {
                    $scope.updateConfig = false;
                    if (i === callback.length) {

                        if (failToSave.length === 0) {
                            $scope.showAlert("Campaign", "Configurations  Updated successfully ", 'success');
                        }
                        else {
                            $scope.showAlert("Campaign", "Configurations  saved successfully but fail to save same callback configurations.", 'warning');
                        }

                    }
                }

                angular.forEach(callback, function (item) {
                    callback.ReasonId = item.CampCallBackReasons.ReasonId;
                    campaignService.SetCallBack(id, item).then(function (response) {
                        if (!response) {
                            item.Status = false;
                            failToSave.push(item);
                        }
                        else {
                            var items = $filter('filter')($scope.callbacks, {ReasonId: parseInt(item.ReasonId)}, true);
                            if (items) {
                                var index = $scope.callbacks.indexOf(items[0]);
                                if (index > -1) {
                                    $scope.callbacks.splice(index, 1);
                                }
                            }
                            item.Status = true;
                            item.CallBackConfId = response.CallBackConfId;
                            $scope.callbacks.push(item);
                        }
                        i++;
                        showmsg();
                    }, function (error) {
                        item.Status = false;
                        failToSave.push(item);
                        i++;
                        showmsg();
                    });


                });


            }
            else {
                callback.ReasonId = callback.CampCallBackReasons.ReasonId;
                campaignService.SetCallBack(id, callback).then(function (response) {
                    if (!response) {
                        $scope.showAlert("Campaign", 'error', "Fail To Set Callback");
                    }
                    else {
                        callback.Status = true;
                        callback.CallBackConfId = response.CallBackConfId;

                        var items = $filter('filter')($scope.callbacks, {CallBackConfId: parseInt(response.CallBackConfId)}, true);
                        if (items) {
                            var index = $scope.callbacks.indexOf(items[0]);
                            if (index === -1) {
                                var tempCallback = {};
                                angular.copy(callback, tempCallback);
                                $scope.callbacks.push(tempCallback);
                            }
                        }

                    }
                    $scope.updateConfig = false;
                }, function (error) {
                    $scope.showAlert("Campaign", 'error', "Fail To Set Callback");
                    $scope.updateConfig = false;
                });
            }
        };

        var createNewCampaign = function () {
            var idCampaign,
                idExtension,
                idCampaignMode,
                idDialoutMechanism,
                idChannelConcurrency;

            var clearAllValidation = function () {
                idCampaign = $('#frmCampaign');
                idExtension = $('#frmExtensions');
                idCampaignMode = $('#frmCampaignMode');
                idDialoutMechanism = $('#frmDialoutMechanism');
                idChannelConcurrency = $('#frmChannelConcurrency');


                //remove all validations
                idCampaign.removeClass('has-error');
                idExtension.removeClass('has-error');
                idCampaignMode.removeClass('has-error');
                idDialoutMechanism.removeClass('has-error');
                idChannelConcurrency.removeClass('has-error');
            };


            return {
                clearNewCampaignValidation: function () {
                    clearAllValidation();
                },
                validation: function () {
                    var campaign = $scope.campaign,
                        campaignCallBack = $scope.callback;

                    clearAllValidation();

                    if (!campaign.CampaignName) {
                        //validation campaign name
                        $scope.showAlert("Campaign", "Please Enter Campaign Name.", 'error');
                        idCampaign.addClass('has-error');
                        return false;
                    } else if (!campaign.Extensions) {
                        //campaign extensions
                        $scope.showAlert("Campaign", "Please Select Extension", 'error');
                        idExtension.addClass('has-error');
                        return false;
                    } else if (campaign.CampaignChannel) {
                        //user selected channel sms
                        //validation sms configuration
                        if (!campaign.CampaignMode) {
                            $scope.showAlert("Campaign", "Please Select Campaign Mode.", 'error');
                            idCampaignMode.addClass('has-error');
                            return false;
                        }
                        else if (!campaign.DialoutMechanism) {
                            $scope.showAlert("Campaign", "Please Select Campaign Dialout Mechanism.", 'error');
                            idDialoutMechanism.addClass('has-error');
                            return false;
                        }

                        if (!campaignCallBack.ChannelConcurrency) {
                            $scope.showAlert("Campaign", "Please Enter Campaign Channel Concurrency", 'error');
                            idChannelConcurrency.addClass('has-error');
                            return false;
                        }

                        return true;

                    }
                },
                createCampaign: function (campaignx, callBack) {
                    $scope.isCreateNewCampaign = true;
                    campaignService.CreateCampaign(campaignx).then(function (response) {
                        $scope.isCreateNewCampaign = false;
                        if (response) {
                            $scope.showAlert("Campaign", "Campaign Created Successfully.", 'success');
                            if (response.CampaignId) {
                                $scope.campaign = response;
                                callBack(true);
                            }
                            //$scope.addNewCampaign = false;
                            //$scope.campaigns.push(response);
                        } else {
                            $scope.showAlert("Campaign", "Fail To Create Campaign.", 'error');
                            callBack(false);
                        }
                    }, function (error) {
                        $scope.showAlert("Campaign", "Fail To Create Campaign.", 'error');
                        $scope.isCreateNewCampaign = false;
                        callBack(true);
                    });
                },
                updateCampaignConfig: function (callback) {
                    if (callback.ConfigureId > 0) {
                        /*update config id, configId, config*/
                        campaignService.UpdateCampaignConfig($scope.campaign.CampaignId, callback.ConfigureId, callback).then(function (response) {
                            if (response) {
                                $scope.showAlert("Campaign", "Configurations  Updated successfully ", 'success');
                            } else {
                                $scope.showAlert("Campaign", "Fail To Update Configurations", 'error');
                            }
                            $scope.updateConfig = false;
                        }, function (error) {
                            $scope.showAlert("Campaign", "Fail To Update Configurations", 'error');
                            $scope.updateConfig = false;
                        });
                    }
                    else {
                        /*save config*/
                        campaignService.CreateCampaignConfig($scope.campaign.CampaignId, callback).then(function (response) {
                            if (response) {
                                $scope.callback.ConfigureId = response.ConfigureId;
                            } else {
                                $scope.showAlert("Campaign", "Fail To Update Configurations");
                            }
                            $scope.updateConfig = false;
                        }, function (error) {
                            $scope.showAlert("Campaign", "Fail To Update Configurations");
                            $scope.updateConfig = false;
                        });
                    }
                },
                updateCampaign: function () {
                    $scope.updateEdit = true;
                    var updateCam = {};
                    angular.copy(campaignx, updateCam);
                    updateCam.CampConfigurations = undefined;
                    updateCam.CampContactSchedule = undefined;

                    campaignService.UpdateCampaign($scope.campaign.CampaignId, updateCam).then(function (response) {
                        if (response) {
                            $scope.showAlert("Campaign", "Campaign Updated successfully ");
                        } else {
                            $scope.showAlert("Campaign", "Fail To Update Campaign");
                        }
                        $scope.updateEdit = false;
                    }, function (error) {
                        $scope.showAlert("Campaign", "Fail To Update Campaign");
                        $scope.updateEdit = false;
                    });
                }

            }
        }();

        //add schedule to campaign
        $scope.camSchedule = [];
        $scope.addedSchedule = [];
        $scope.availableSchedule = [];
        $scope.ScheduleList = [];
        $scope.campaignSchedule = {};

        var createCampaignSchedule = function () {

            var idCampaignSchedule;


            var clearAllValidation = function () {
                idCampaignSchedule = $('#frmcampaignSchedule');
                idCampaignSchedule.removeClass('has-error');
            };

            return {
                validation: function (callback) {
                    clearAllValidation();
                    if ($scope.campaignSchedule) {
                        if (!$scope.campaignSchedule.ScheduleId) {
                            idCampaignSchedule.addClass('has-error');
                            $scope.showAlert("Campaign", "Please Select Campaign Schedule", 'error');
                            callback(false);
                            return;
                        }
                    } else {
                        idCampaignSchedule.addClass('has-error');
                        $scope.showAlert("Campaign", "Please Select Campaign Schedule", 'error');
                        callback(false);
                        return;
                    }
                    callback(true);
                },
                getScheduleCampaign: function () {
                    $scope.scheduleList = true;
                    //$scope.campaign.CampaignId
                    campaignService.GetScheduleCampaign($scope.campaign.CampaignId).then(function (response) {
                        $scope.camSchedule = [];
                        $scope.addedSchedule = [];
                        if (response && response.length > 0) {
                            $scope.ScheduleList.map(function (t) {
                                var items = $filter('filter')(response, {ScheduleId: parseInt(t.id)}, true);
                                if (items && items.length === 0) {
                                    $scope.camSchedule.push(t);
                                }
                                else {
                                    t.camSchedule = items[0];
                                    $scope.addedSchedule.push(t);
                                }
                            });
                            $scope.availableSchedule = $scope.camSchedule;
                        }
                        else {
                            $scope.availableSchedule = $scope.ScheduleList;
                        }
                        $scope.scheduleList = false;
                    }, function (error) {
                        console.log("Error in GetScheduleCampaign " + error);
                        $scope.scheduleList = false;
                    });
                },
                GetSchedules: function () {
                    $scope.editMapSchedule = true;
                    $scope.scheduleList = true;
                    scheduleBackendService.getSchedules().then(function (response) {
                        if (response.data.IsSuccess) {
                            $scope.ScheduleList = response.data.Result;
                            createCampaignSchedule.getScheduleCampaign();
                        }
                        else {
                            console.info("Error in GetSchedules " + response.data.Exception);
                            $scope.showAlert("Campaign", "Fail To Get Schedules", 'error');
                        }
                        $scope.editMapSchedule = false;
                        $scope.scheduleList = false;
                    }, function (error) {
                        $scope.showAlert("Campaign", "Fail To Get Schedules", 'error');
                        $scope.editMapSchedule = false;
                        $scope.scheduleList = false;
                    });
                },
                addScheduleToCampaign: function (data) {
                    $scope.addScheduleToCampaign = true;
                    campaignService.AddScheduleToCampaign($scope.campaign.CampaignId, data).then(function (response) {
                        $scope.addScheduleToCampaign = false;
                        if (response) {
                            createCampaignSchedule.GetSchedules();
                            //$scope.GetAssignableScheduleCampaign();
                            $scope.showAlert("Campaign", "Successfully Add To Campaign.", 'success');
                        } else {
                            $scope.showAlert("Campaign", "Fail To Add", 'error');
                        }
                    }, function (error) {
                        $scope.showAlert("Campaign", "Fail To Add", 'error');
                        $scope.addScheduleToCampaign = false;
                    });
                },
                deleteSchedule: function (schedule) {
                    $scope.showConfirm("Delete Schedule", "Delete", "ok", "cancel", "Do you want to delete " + schedule.ScheduleName, function (obj) {
                        campaignService.DeleteSchedule($scope.campaign.CampaignId, schedule.camSchedule.CamScheduleId).then(function (response) {
                            if (response) {
                                createCampaignSchedule.GetSchedules();
                                $scope.showAlert("Delete Schedule", "Successfully Delete.", 'success');
                            }
                            else
                                $scope.showAlert("Delete Schedule", "Fail To Delete Schedule", 'error');
                        }, function (error) {
                            $scope.showAlert("Delete Schedule", "Fail To Delete Schedule", 'error');
                        });

                    }, function () {

                    }, schedule);
                }
            }
        }();

        createCampaignSchedule.GetSchedules();

        //add schedule to campaign
        $scope.crateScheduleToCampaign = function (_campaignSchedule) {
            createCampaignSchedule.validation(function (status) {
                if (status) {
                    createCampaignSchedule.addScheduleToCampaign(_campaignSchedule);
                }
            });
        };

        //delete campaign
        $scope.deleteSchedule = function (schedule) {
            createCampaignSchedule.deleteSchedule(schedule);
        };

        //end  schedule to campaign


        //Map Number Group and Schedule to Campaign
        $scope.Categorys = [];
        $scope.mapnumberschedue = {};
        $scope.AssignedCategory = [];
        $scope.AvailableCategory = [];

        var mapNumberGroupSchedule = function () {

            var idCurrentCampaignSchedule,
                idCategory;
            var clearAllValidation = function () {
                idCurrentCampaignSchedule = $('#frmCurrentCampaignSchedule'),
                    idCategory = $('#frmCategory');

                idCurrentCampaignSchedule.removeClass('has-error');
                idCategory.removeClass('has-error');
            };

            return {
                GetCategorys: function () {
                    campaignService.GetCategorys().then(function (response) {
                        $scope.Categorys = response;
                    }, function (error) {
                        $scope.showAlert("Campaign", 'error', "Fail To Load Categories");
                    });
                },
                validation: function (callback) {
                    clearAllValidation();
                    if (!$scope.mapnumberschedue.Schedule) {
                        idCurrentCampaignSchedule.addClass('has-error');
                        $scope.showAlert("Campaign", 'error', "Please Select Current Campaign Schedule");
                        callback(false);
                        return;
                    }
                    if (!$scope.mapnumberschedue.CategoryID) {
                        idCategory.addClass('has-error');
                        $scope.showAlert("Campaign", 'error', "Please Select  Campaign Category Schedule");
                        callback(false);
                        return;
                    }

                    callback(true);
                },
                getAssignedCategory: function () {
                    $scope.AssignedCategory = [];
                    $scope.AvailableCategory = [];
                    campaignService.GetAssignedCategory($scope.campaign.CampaignId).then(function (response) {
                        if (response) {
                            $scope.AssignedCategory = response;
                        }
                    }, function (error) {
                        $scope.AvailableCategory = $scope.Categorys;
                    });
                },
                MapNumberAndScheduleToCampaign: function (mapnumberschedue) {
                    $scope.mapnumberScheduleToCam = true;

                    $scope.showConfirm("Map Numbers and Schedule To Campaign", "Map Numbers", "ok", "cancel", "You Are Not Allowed To Revert This Process. Do You Really Want To Continue?", function (obj) {
                        campaignService.MapNumberAndScheduleToCampaign($scope.campaign.CampaignId, mapnumberschedue.CategoryID, mapnumberschedue.Schedule.id, mapnumberschedue.Schedule.ScheduleName).then(function (response) {
                            $scope.mapnumberScheduleToCam = false;
                            if (response) {
                                mapNumberGroupSchedule.getAssignedCategory();
                                $scope.showAlert("Campaign", 'success', "Successfully Map To Campaign.");
                            } else {
                                $scope.showAlert("Campaign", 'error', "Fail To Map");
                            }
                            $scope.mapnumberScheduleToCam = false;
                        }, function (error) {
                            $scope.mapnumberScheduleToCam = false;
                            $scope.showAlert("Campaign", 'error', "Fail To Map");
                            validationFailed().mapnumberScheduleToCam = false;
                        });

                    }, function () {
                        $scope.safeApply(function () {
                            $scope.mapnumberScheduleToCam = false;
                        });
                    }, mapnumberschedue)

                }
            }

        }();
        mapNumberGroupSchedule.GetCategorys();
        mapNumberGroupSchedule.getAssignedCategory();

        /// map number and schedule to campaign
        $scope.MapNumberAndScheduleToCampaign = function (mapnumberschedue) {
            mapNumberGroupSchedule.validation(function (res) {
                if (res) {
                    mapNumberGroupSchedule.MapNumberAndScheduleToCampaign(mapnumberschedue);
                }
            });

        };

        //campaign configuration

        var campignConfigration = function () {

            return {}
        }();


        //goto wizard
        $scope.changeFormWizard = function (_wizard) {
            // $scope.step = _wizard;
            switch (_wizard) {
                case '1':
                    step01UIFun.moveWizard(_wizard);
                    break;
                case '2':
                    //create new campaign
                    if (createNewCampaign.validation()) {
                        //save campaign
                        //if(campaign.CampaignId) {
                        createNewCampaign.createCampaign($scope.campaign, function (status) {
                            if (status) {
                                //update campaign configuration
                                createNewCampaign.updateCampaignConfig($scope.callback);
                                step01UIFun.moveWizard(_wizard);
                            }
                        });
                    }
                    break;
                case '3':
                    $scope.GetCampaignConfig();
                    step01UIFun.moveWizard(_wizard);
                    break;
                case '4':
                    step01UIFun.moveWizard(_wizard);
                    break;

            }
        };

        $scope.wizardBackMove = function (step) {
            step01UIFun.moveBackWizard(step);
        };


        //campaign config

        $scope.GetCallBacks = function () {
            $scope.isLoadingCallBack = true;
            campaignService.GetCallBacks($scope.callback.ConfigureId).then(function (response) {
                $scope.isLoadingCallBack = false;
                $scope.callbacks = response.map(function (item) {
                    item.isLoading = false;
                    return item;
                });
            }, function (error) {
                $scope.isLoadingCallBack = false;
                console.log(error);
            });
        };

        $scope.GetCampaignConfig = function () {
            campaignService.GetCampaignConfig($scope.campaign.CampaignId).then(function (response) {
                if (response) {

                    $scope.callback = response;
                    // $scope.callback.AllowCallBack = response.AllowCallBack === false ? 'no' : 'yes';
                    $scope.showCallback = response.AllowCallBack;
                    $scope.GetCallBacks();
                }
                else {
                    $scope.callback = {AllowCallBack: 'no'};
                }
            }, function (error) {

            });
        };


        var campaignConfig = function () {

            var idSmsExtension,
                idSmsTemplate;

            var campaign = $scope.campaign;
            console.log(campaign);

            var clearValidation = function () {
                idSmsExtension = $('#formExtension');
                idSmsTemplate = $('#formTemplate');

                idSmsExtension.removeClass('has-error');
                idSmsTemplate.removeClass('has-error');

            };
            var smsConfigValidation = function () {
                clearValidation();
                var campaign = $scope.campaign;

                if (!campaign.AdditionalData || !campaign.AdditionalData.FileName) {
                    idSmsExtension.addClass('has-error');
                    return false;
                }

                if ($scope.campaignAdditionalData.length == 0) {
                    if (!campaign.AdditionalData || !campaign.AdditionalData.Template) {
                        idSmsTemplate.addClass('has-error');
                        return false;
                    }
                }

                return true;


            };

            return {
                smsConfig: function (data) {
                    if (smsConfigValidation()) {
                        var additionalDataSet = [];
                        if (data && data.Template) {
                            var additionalDataTemplate = {
                                Class: "BLAST",
                                Type: $scope.campaign.CampaignChannel,
                                Category: "TEMPLATE",
                                TenantId: $scope.campaign.TenantId,
                                CompanyId: $scope.campaign.CompanyId,
                                CampaignId: $scope.campaign.CampaignId,
                                AdditionalData: data.Template
                            };

                            additionalDataSet.push(additionalDataTemplate);
                        }
                        if (data && data.FileName) {
                            var additionalDataAttachment = {
                                Class: "BLAST",
                                Type: $scope.campaign.CampaignChannel,
                                Category: "ATTACHMENT",
                                TenantId: $scope.campaign.TenantId,
                                CompanyId: $scope.campaign.CompanyId,
                                CampaignId: $scope.campaign.CampaignId,
                                AdditionalData: data.FileName
                            };
                            additionalDataSet.push(additionalDataAttachment);
                        }

                        $scope.isTemplateConfigLoading = true;

                        additionalDataSet.forEach(function (additional_data) {
                            campaignService.CreateCampaignAdditionalData($scope.campaign.CampaignId, additional_data).then(function (response) {
                                if (response && response.AdditionalData) {
                                    //var t = angular.fromJson(response.AdditionalData);
                                    //t.name = $scope.getTemplateNameById(t.Template);
                                    //t.AdditionalDataId = response.AdditionalDataId;
                                    $scope.campaignAdditionalData.push(response);
                                }
                                $scope.isTemplateConfigLoading = false;
                            }, function (error) {
                                $scope.showAlert("Campaign", 'error', "Fail To Create Additional Data");
                                $scope.isTemplateConfigLoading = false;
                            });
                        });
                    }
                }
            }
        }();

        $scope.addNewSmsConfig = function (data) {
            campaignConfig.smsConfig(data);
        };


        //campaign callback config
        var campaignCallBackConfig = function () {

            var idReason,
                idMaxCallBack,
                idCallBackInterval,
                callback;

            var clearValidation = function () {
                callback = $scope.callback;
                idReason = $('#frmReason');
                idMaxCallBack = $('#frmMacCallBackCount');
                idCallBackInterval = $('#frmCallBackInterval');

                idReason.removeClass('has-error');
                idMaxCallBack.removeClass('has-error');
                idCallBackInterval.removeClass('has-error');
            };


            var validation = function () {
                clearValidation();
                if (!callback || !callback.CampCallBackReasons) {
                    idReason.addClass('has-error');
                    return false;
                }

                if (!callback || !callback.MaxCallBackCount) {
                    idMaxCallBack.addClass('has-error');
                    return false;
                }

                if (!callback || !callback.CallbackInterval) {
                    idCallBackInterval.addClass('has-error');
                    return false;
                }
                return true;
            };


            var saveCallBack = function (id, callback) {
                $scope.updateConfig = true;
                if (angular.isArray(callback)) {

                    var i = 0;
                    var failToSave = [];

                    function showmsg() {
                        if (i === callback.length) {

                            if (failToSave.length === 0) {
                                $scope.showAlert("Campaign", 'success', "Configurations  Updated successfully ");
                            }
                            else {
                                $scope.showAlert("Campaign", 'warning', "Configurations  saved successfully but fail to save same callback configurations.");
                            }
                            $scope.updateConfig = false;
                        }
                    }

                    angular.forEach(callback, function (item) {
                        callback.ReasonId = item.CampCallBackReasons.ReasonId;
                        campaignService.SetCallBack(id, item).then(function (response) {
                            if (!response) {
                                item.Status = false;
                                failToSave.push(item);
                            }
                            else {
                                var items = $filter('filter')($scope.callbacks, {ReasonId: parseInt(item.ReasonId)}, true);
                                if (items) {
                                    var index = $scope.callbacks.indexOf(items[0]);
                                    if (index > -1) {
                                        $scope.callbacks.splice(index, 1);
                                    }
                                }
                                item.Status = true;
                                item.CallBackConfId = response.CallBackConfId;
                                $scope.callbacks.push(item);
                            }
                            i++;
                            showmsg();
                        }, function (error) {
                            item.Status = false;
                            failToSave.push(item);
                            i++;
                            showmsg();
                        });


                    });


                }
                else {
                    callback.ReasonId = callback.CampCallBackReasons.ReasonId;
                    campaignService.SetCallBack(id, callback).then(function (response) {
                        if (!response) {
                            $scope.showAlert("Campaign", 'error', "Fail To Set Callback");

                        }
                        else {
                            callback.Status = true;
                            callback.CallBackConfId = response.CallBackConfId;

                            var items = $filter('filter')($scope.callbacks, {CallBackConfId: parseInt(response.CallBackConfId)}, true);
                            if (items) {
                                var index = $scope.callbacks.indexOf(items[0]);
                                if (index === -1) {
                                    var tempCallback = {};
                                    angular.copy(callback, tempCallback);
                                    $scope.callbacks.push(tempCallback);
                                }
                            }

                        }
                        $scope.updateConfig = false;
                    }, function (error) {
                        $scope.showAlert("Campaign", 'error', "Fail To Set Callback");
                        $scope.updateConfig = false;
                    });
                }
            };

            return {

                createCampaignCallBack: function (callback) {
                    if (validation()) {
                        if (callback.CampCallBackReasons.ReasonId) {
                            if (callback.ConfigureId && callback.ConfigureId > 0) {
                                $scope.SaveCallBack(callback.ConfigureId, callback);
                                $scope.GetCallBacks();
                            }
                            else {
                                var item = $filter('filter')($scope.callbacks, {ReasonId: parseInt(callback.CampCallBackReasons.ReasonId)}, true)[0];
                                if (!item) {
                                    var data = {};
                                    angular.copy(callback, data);
                                    data.ReasonId = callback.CampCallBackReasons.ReasonId;
                                    data.Status = true;
                                    $scope.callbacks.push(data);
                                }

                            }
                        }
                    }
                },
                deleteReasonConfig: function (callback) {
                    $scope.updateConfig = true;
                    callback.isLoading = true;
                    $scope.showConfirm("Delete Callback Reason", "Delete", "ok", "cancel", "Do you want to delete " + callback.CampCallBackReasons.Reason, function (obj) {

                        function showMsg() {
                            var items = $filter('filter')($scope.callbacks, {ReasonId: parseInt(callback.ReasonId)}, true);
                            if (items) {
                                var index = $scope.callbacks.indexOf(items[0]);
                                if (index > -1) {
                                    $scope.callbacks.splice(index, 1);
                                }
                            }
                            $scope.updateConfig = false;
                        }

                        if (callback.CallBackConfId && callback.CallBackConfId > 0) {
                            campaignService.DeleteCallBack(callback.CallBackConfId).then(function (response) {
                                callback.isLoading = false;
                                if (response) {
                                    showMsg();
                                    $scope.showAlert("Campaign", "Configurations  Deleted successfully ", 'success');
                                } else {
                                    $scope.showAlert("Campaign", "Fail To Deleted Configurations", 'error');
                                    $scope.updateConfig = false;
                                }
                            }, function (error) {
                                $scope.showAlert("Campaign", "Fail To Deleted Configurations", 'error');
                                $scope.updateConfig = false;
                                callback.isLoading = false;
                            });
                        }
                        else {
                            showMsg();
                        }

                    }, function () {
                        $scope.safeApply(function () {
                            callback.isLoading = false;
                            $scope.updateConfig = false;
                        });

                    }, callback)
                }
            }
        }();


        $scope.createCallBack = function (data) {
            campaignCallBackConfig.createCampaignCallBack(data);
        };

        //delete call back config
        $scope.deleteReason = function (data) {
            campaignCallBackConfig.deleteReasonConfig(data);
        };

        /* ------------------------Number Upload -------------------------------------------- */


        $scope.campaignNumberObj = {
            campaignName: 'camp-17 :)',
            CampaignId: '185'
        };
        $scope.numberCategory = {};

        $scope.data = [];
        $scope.headerData = [];
        $scope.selectObj = {};
        $scope.campaignNumberObj.Contacts = [];
        $scope.campaignNumberObj.CampaignId = undefined;
        $scope.enablePreviewData = false;
        $scope.showUpload = false;
        $scope.uploadState = "Show Upload";
        $scope.numberProgress = 0;
        $scope.uploadButtonValue = "Upload";
        $scope.previewDataColumns;


        $scope.searchObj = {};
        $scope.isTableLoading = 2;
        $scope.selectedCustomerTags = [];

        $scope.leftAddValue = {};

        $scope.showAlert = function (title, content, type) {
            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.switchUpload = function () {
            $scope.showUpload = !$scope.showUpload;
            if ($scope.showUpload) {
                $scope.uploadState = "Show Number Base";
            } else {
                $scope.uploadState = "Show Upload";
            }
        };

        $scope.reset = function () {
            $scope.safeApply(function () {
                $scope.target.form.reset();
                $scope.headerData = [];
                $scope.selectObj = {};
                $scope.campaignNumberObj.Contacts = [];
                $scope.campaignNumberObj.CampaignId = undefined;
                $scope.selectObj.previewData = [];
                $scope.gridOptions.data = [];
                $scope.gridOptions.columnDefs = [];
                $scope.numberProgress = 0;
                $scope.uploadButtonValue = "Upload";
                $scope.leftAddValue = undefined;
                $scope.selectedCampaign = undefined;
                $scope.previewData;
            });

        };

        $('.collapse-link').on('click', function () {
            var $BOX_PANEL = $(this).closest('.x_panel'),
                $ICON = $(this).find('i'),
                $BOX_CONTENT = $BOX_PANEL.find('.x_content');

            // fix for some div with hardcoded fix class
            if ($BOX_PANEL.attr('style')) {
                $BOX_CONTENT.slideToggle(200, function () {
                    $BOX_PANEL.removeAttr('style');
                });
            } else {
                $BOX_CONTENT.slideToggle(200);
                $BOX_PANEL.css('height', 'auto');
            }

            $ICON.toggleClass('fa-chevron-up fa-chevron-down');
        });


        //--------------------------------------------------Number Upload Grid-------------------------------------

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(cTag) {
                return (cTag.name.toLowerCase().indexOf(lowercaseQuery) != -1);

            };
        }

        $scope.querySearch = function (query) {
            if (query === "*" || query === "") {
                if ($scope.customerTags) {
                    return $scope.customerTags;
                }
                else {
                    return [];
                }

            }
            else {
                var results = query ? $scope.customerTags.filter(createFilterFor(query)) : [];
                return results;
            }

        };

        $scope.onChipAdd = function (chip) {

            $scope.selectedCustomerTags.push(chip.name);

        };
        $scope.onChipDelete = function (chip) {

            var index = $scope.selectedCustomerTags.indexOf(chip.name);
            if (index > -1) {
                $scope.selectedCustomerTags.splice(index, 1);
                chip.active = false;
            }


        };

        function validateNumbers(data, filter, previewFilter) {
            var deferred = $q.defer();
            setTimeout(function () {
                var numbers = [];
                var numberRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/im;
                data.forEach(function (data) {
                    var tempNumber = data[filter];

                    if ($scope.campaignNumberObj.CategoryID && !$scope.selectedCampaign) {
                        numbers.push(data[filter]);
                    } else {
                        if ($scope.selectedCampaign && $scope.selectedCampaign.CampaignChannel.toLowerCase() === 'call') {
                            if (tempNumber && tempNumber.toString().match(numberRegex)) {
                                if (previewFilter && previewFilter.length > 0) {
                                    var previewObj = {};
                                    previewFilter.forEach(function (pFilter) {
                                        previewObj[pFilter] = data[pFilter];
                                    });
                                    var numberWithPreviewData = data[filter] + ":" + JSON.stringify(previewObj);
                                    numbers.push(numberWithPreviewData);
                                } else {

                                    numbers.push(data[filter]);
                                }
                                console.log('Valid Number - ' + tempNumber);
                            }
                            else {
                                console.log('Invalid Number - ' + tempNumber);
                            }
                        } else {


                            if ($scope.campaign.CampaignChannel.toLowerCase() === 'sms' || $scope.campaign.CampaignChannel.toLowerCase() === 'email') {
                                if (tempNumber) {
                                    if (previewFilter && previewFilter.length > 0) {
                                        var previewObj2 = {};
                                        previewFilter.forEach(function (pFilter) {
                                            previewObj2[pFilter] = data[pFilter];
                                        });
                                        var numberWithPreviewData2 = data[filter] + ":" + JSON.stringify(previewObj2);
                                        numbers.push(numberWithPreviewData2);
                                    } else {

                                        numbers.push(data[filter]);
                                    }
                                }
                                else {
                                    console.log('Invalid Number - ' + tempNumber);
                                }
                            } else {
                                numbers.push(data[filter]);
                            }
                        }
                    }
                });
                deferred.resolve(numbers);
            }, 1000);
            return deferred.promise;
        }


        $scope.loadNumbers = function () {
            $scope.campaignNumberObj.Contacts = [];


            var promise = validateNumbers($scope.data, $scope.selectObj.name, $scope.selectObj.previewData);
            promise.then(function (numbers) {
                $scope.campaignNumberObj.Contacts = numbers;
                console.log(JSON.stringify(numbers));
            });
        };

        $scope.numberLeftAdd = function () {
            if ($scope.selectObj && $scope.selectObj.name && $scope.leftAddValue && $scope.leftAddValue.value) {
                $scope.campaignNumberObj.Contacts = [];

                var newNumberSet = $scope.data.map(function (obj) {
                    obj[$scope.selectObj.name] = $scope.leftAddValue.value + obj[$scope.selectObj.name];
                    return obj;
                });

                $scope.data = newNumberSet;

                var promise = validateNumbers($scope.data, $scope.selectObj.name);
                promise.then(function (numbers) {
                    $scope.campaignNumberObj.Contacts = numbers;
                });
            }
        };

        $scope.gridOptions = {
            enableGridMenu: false,
            data: 'data',
            importerDataAddCallback: function (grid, newObjects) {
                $scope.data = newObjects;
            },
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            },
            importerProcessHeaders: function (hData, headerArray) {
                var myHeaderColumns = [];
                var thisCol;

                headerArray.forEach(function (value, index) {
                    thisCol = mySpecialLookupFunction(value, index);
                    myHeaderColumns.push(thisCol.name);
                    $scope.headerData.push({name: thisCol.name, index: index});
                });

                return myHeaderColumns;
            }
        };

        var mySpecialLookupFunction = function (value, index) {
            var headerType = typeof value;
            if (headerType.toLowerCase() !== 'string') {
                return {name: 'Undefined Column ' + index};
            } else {
                return {name: value};
            }
        };

        var handleFileSelect = function (event) {
            var target = event.srcElement || event.target;
            $scope.target = target;

            if (target && target.files && target.files.length === 1) {
                var fileObject = target.files[0];
                $scope.gridApi.importer.importFile(fileObject);
                //target.form.reset();
            }
        };
        $scope.getInputFileValue = function () {
            var fileChooser = document.querySelectorAll('.file-chooser');
            if (fileChooser.length !== 1) {
                console.log('Found > 1 or < 1 file choosers within the menu item, error, cannot continue');
            } else {
                fileChooser[0].addEventListener('change', handleFileSelect, false);
            }
        };


        var loadCustomersByTags = function () {
            $scope.headerData = [];
            campaignNumberApiAccess.GetCustomersByTags($scope.selectedCustomerTags).then(function (response) {
                if (response.IsSuccess) {
                    var externalUserResult = response.Result;
                    $scope.data = externalUserResult.map(function (eur) {
                        return {
                            ExternalUser: eur.firstname + " " + eur.lastname,
                            Number: eur.phone
                        };
                    });

                    $scope.headerData.push({name: 'ExternalUser', index: 0});
                    $scope.headerData.push({name: 'Number', index: 1});
                    console.log($scope.data);
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
                var errMsg = "Error occurred while loading numbers from profile";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Campaign Number Upload', errMsg, 'error');
            });
        };

        var loadCustomers = function () {
            $scope.headerData = [];
            campaignNumberApiAccess.GetCustomers().then(function (response) {
                if (response.IsSuccess) {
                    var externalUserResult = response.Result;
                    $scope.data = externalUserResult.map(function (eur) {
                        return {
                            ExternalUser: eur.firstname + " " + eur.lastname,
                            Number: eur.phone
                        };
                    });

                    $scope.headerData.push({name: 'ExternalUser', index: 0});
                    $scope.headerData.push({name: 'Number', index: 1});
                    console.log($scope.data);
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
                var errMsg = "Error occurred while loading numbers from profile";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Campaign Number Upload', errMsg, 'error');
            });
        };

        $scope.previewData;
        $scope.isExtranalDataSheet = true;
        $scope.searchFromProfile = function (tag) {

            //create tag
            var index = $scope.selectedCustomerTags.indexOf(tag.name);
            if (index > -1) {
                $scope.selectedCustomerTags.splice(index, 1);
                tag.active = false;
            } else {
                $scope.selectedCustomerTags.push(tag.name);
                tag.active = true;
            }

            $scope.isExtranalDataSheet = $scope.selectedCustomerTags.length == 0 ? true : false;

            if ($scope.selectedCustomerTags && $scope.selectedCustomerTags.length > 0) {
                loadCustomersByTags();
            } else {
                loadCustomers();
            }
        };


        function createFilterForColumn(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(header) {
                return (header.toLowerCase().indexOf(lowercaseQuery) != -1);
            };
        }

        $scope.querySearchForColumn = function (query) {
            if (query === "*" || query === "") {
                if ($scope.headerData) {
                    return $scope.headerData;
                }
                else {
                    return [];
                }

            }
            else {
                var results = query ? $scope.headerData.filter(createFilterForColumn(query)) : [];
                return results;
            }

        };

        $scope.onChipAddForColumn = function (chip) {

            if (!$scope.selectObj.previewData)
                $scope.selectObj.previewData = [];

            $scope.selectObj.previewData.push(chip.name);
            $scope.loadNumbers();

        };
        $scope.onChipDeleteForColumn = function (chip) {

            var index = $scope.selectObj.previewData.indexOf(chip.name);
            if (index > -1) {
                $scope.selectObj.previewData.splice(index, 1);
                $scope.loadNumbers();
            }


        };

        //--------------------------------Number Base Grid---------------------------------------------------


        $scope.gridOptions3 = {
            enableSorting: true,
            enableFiltering: true,
            treeRowHeaderAlwaysVisible: true,
            onRegisterApi: function (gridApi) {
                $scope.gridApi3 = gridApi;
            }
        };


        //-----------------------CampaignCategory---------------------------------------

        $scope.loadCampaignCategories = function () {
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


        $scope.createCampaignCategories = function () {
            if (typeof $scope.campaignNumberObj.CategoryID === "string") {
                var reqData = {CategoryName: $scope.campaignNumberObj.CategoryID};
                campaignNumberApiAccess.CreateNumberCategory(reqData).then(function (response) {
                    if (response.IsSuccess) {
                        $scope.campaignCategories.push(response.Result);
                        $scope.showAlert('Campaign Number Upload', 'Create Number Category Success', 'success');
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
                    var errMsg = "Error occurred while creating number category";
                    if (err.statusText) {
                        errMsg = err.statusText;
                    }
                    $scope.showAlert('Campaign Number Upload', errMsg, 'error');
                });
            }
        };
        $scope.loadCampaignCategories();

        var loadCustomerTags = function () {
            campaignNumberApiAccess.GetCustomersTags().then(function (response) {
                if (response.IsSuccess) {
                    $scope.customerTags = response.Result.map(function (item) {
                        item.active = false;
                        return item;
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
                var errMsg = "Error occurred while loading customer tags";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Campaign Number Upload', errMsg, 'error');
            });
        };

        loadCustomerTags();


        //-----------------------Campaign---------------------------------------

        $scope.loadNewlyCreatedCampaigns = function () {
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

        var loadCampaignSchedules = function (campaignId) {
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

        $scope.loadNewlyCreatedCampaigns();

        //loadCampaignSchedules($scope.campaign.CampaignId);


        //-----------------------Campaign Numbers---------------------------------------

        var batchedHTTP = function (items, current) {

            if (items.length < current) {
                return;
            }

            var end = current + 1;
            var execPromises = items.slice(current, end);

            //$q.all(execPromises).then(function (response) {
            //    $scope.numberProgress = Math.ceil((end / items.length)*100);
            //    batchedHTTP(items, end);
            //});

            execPromises[0].then(function (response) {
                $scope.numberProgress = Math.ceil((end / items.length) * 100);
                batchedHTTP(items, end);
            });
        };

        // $scope.onChangeSchedule = function () {
        //     $scope.campaignSchedules.forEach(function (cs) {
        //         if (cs.CamScheduleId.toString() === $scope.campaignNumberObj.CamScheduleId) {
        //
        //             $scope.scheduleName = cs.ScheduleName;
        //         }
        //     });
        // };

        var idNumberCategory,
            idNumberSchedule,
            idNumberSheet,
            idNumberColumn;
        var clearNumUploadValidation = function () {

            idNumberCategory = $('#frmNumberCatergory');
            idNumberSchedule = $('#frmScheduleId');
            idNumberColumn = $('#frmNumberColumn');
            idNumberSheet = $('.number-upload-sheet');

            idNumberCategory.removeClass('has-error');
            idNumberSchedule.removeClass('has-error');
            idNumberColumn.removeClass('has-error');
            idNumberSheet.removeClass('error-upload');
        };


        $scope.uploadButtonValue = false;
        $scope.uploadNumbers = function () {
            // if (typeof $scope.campaignNumberObj.CategoryID === "number") {
            clearNumUploadValidation();
            if (!$scope.campaignNumberObj.CategoryID) {
                idNumberCategory.addClass('has-error');
                return;
            }

            if (!$scope.campaignNumberObj.CamScheduleId) {
                idNumberSchedule.addClass('has-error');
                return;
            }

            if ($scope.gridOptions.columnDefs.length == 0) {
                idNumberSheet.addClass('error-upload');
                $scope.showAlert('Campaign Number Upload', 'Please add number list to campaign.', 'error');
                return;
            }


            if (!$scope.selectObj.name) {
                idNumberColumn.addClass('has-error');
                $scope.showAlert('Campaign Number Upload', 'Please select number column before upload', 'error');
                return;
            }


            if ($scope.campaign.CampaignId && !$scope.campaignNumberObj.CamScheduleId) {
                $scope.showAlert('Campaign Number Upload', 'Select schedule before use', 'error');
            } else {
                if ($scope.campaignNumberObj && $scope.campaignNumberObj.Contacts.length > 0) {

                    $('#uploadLoaindWizard').removeClass('display-none');
                    $scope.uploadButtonValue = true;

                    $scope.numberProgress = 0;
                    var numberCount = $scope.campaignNumberObj.Contacts.length;
                    var numOfIterations = Math.ceil(numberCount / 1000);
                    var funcArray = [];

                    var numberArray = [];

                    for (var i = 0; i < numOfIterations; i++) {
                        var start = i * 1000;
                        var end = (i * 1000) + 1000;
                        var numberChunk = $scope.campaignNumberObj.Contacts.slice(start, end);

                        var sendObj = {
                            CampaignId: $scope.campaign.CampaignId,
                            CamScheduleId: $scope.campaignNumberObj.CamScheduleId,
                            CategoryID: $scope.campaignNumberObj.CategoryID,
                            Contacts: numberChunk,
                            ScheduleName: $scope.scheduleName
                        };
                        numberArray.push(sendObj);
                    }


                    $scope.BatchUploader(numberArray).then(function () {
                        $scope.uploadButtonValue = false;
                        $('#uploadLoaindWizard').addClass('display-none');
                        $scope.showAlert('Campaign Number Upload', 'Numbers uploaded successfully', 'success');
                        //$scope.reset();
                        $scope.refreshAllWizard();
                    }, function (reason) {
                        $scope.uploadButtonValue = false;
                        $('#uploadLoaindWizard').addClass('display-none');
                    });
                } else {
                    $scope.showAlert('Campaign Number Upload', 'Please select number column before upload', 'error');
                }
            }

            // } else {
            //     $scope.showAlert('Campaign Number Upload', 'Add number category before use', 'error');
            // }

        };


        $scope.BatchUploader = function (array) {
            var index = 0;


            return new Promise(function (resolve, reject) {

                function next() {
                    $scope.numberProgress = Math.ceil((index / array.length) * 100);
                    if (index < array.length) {
                        campaignNumberApiAccess.UploadNumbers(array[index++]).then(next, reject);
                    } else {
                        resolve();
                    }
                }

                next();
            });
        };


        var searchNumbersByCategories = function () {
            $scope.gridOptions3.data = [];
            $scope.gridOptions3.columnDefs = [];
            $scope.isTableLoading = 0;

            campaignNumberApiAccess.GetNumbersByCategory($scope.searchObj.CategoryID).then(function (response) {
                if (response.IsSuccess) {
                    if (response.Result && response.Result.CampContactInfo && response.Result.CampContactInfo.length > 0) {
                        $scope.gridOptions3.data = response.Result.CampContactInfo.map(function (contact) {

                            return contact;

                        });
                        $scope.isTableLoading = 1;
                    } else {
                        $scope.isTableLoading = 2;
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
                $scope.isTableLoading = 2;
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading numbers";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Number Base', errMsg, 'error');
            });
        };

        var searchNumbersByCampaignAndSchedule = function () {
            $scope.gridOptions3.data = [];
            $scope.gridOptions3.columnDefs = [];
            $scope.isTableLoading = 0;

            campaignNumberApiAccess.GetNumbersByCampaignAndSchedule($scope.searchObj.CampaignId, $scope.searchObj.CamScheduleId).then(function (response) {
                if (response.IsSuccess) {
                    if (response.Result && response.Result.length > 0) {
                        $scope.gridOptions3.data = response.Result.map(function (contact) {

                            return {ContactId: contact.CampContactInfo.ContactId, ExtraData: contact.ExtraData};

                        });
                        $scope.isTableLoading = 1;
                    } else {
                        $scope.isTableLoading = 2;
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
                $scope.isTableLoading = 2;
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading numbers";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Number Base', errMsg, 'error');
            });
        };

        var searchNumbersByCampaign = function () {
            $scope.gridOptions3.data = [];
            $scope.gridOptions3.columnDefs = [];
            $scope.isTableLoading = 0;

            campaignNumberApiAccess.GetNumbersByCampaign($scope.searchObj.CampaignId).then(function (response) {
                if (response.IsSuccess) {
                    if (response.Result && response.Result.length > 0) {
                        $scope.gridOptions3.data = response.Result.map(function (contact) {

                            return {ContactId: contact.CampContactInfo.ContactId, ExtraData: contact.ExtraData};

                        });
                        $scope.isTableLoading = 1;
                    } else {
                        $scope.isTableLoading = 2;
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
                $scope.isTableLoading = 2;
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading numbers";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Number Base', errMsg, 'error');
            });
        };


        $scope.searchNumbers = function () {
            if ($scope.searchObj.CampaignId) {
                if ($scope.searchObj.CamScheduleId) {
                    searchNumbersByCampaignAndSchedule();
                }
                else {
                    searchNumbersByCampaign();
                }
            }
            else {
                searchNumbersByCategories();
            }
        };


        //refresh form
        $scope.refreshAllWizard = function () {

            $scope.safeApply(function () {
                $scope.step = 1;
            });
            step01UIFun.refreshWizard();
            step01UIFun.clearChannel();

            $scope.safeApply(function () {
                $scope.campaign = {};
                $scope.campaign = {
                    CampaignChannel: 'SMS',
                    AdditionalData: {
                        FileName: '',
                        Template: ''
                    }
                };
                $scope.callback = {};
                $scope.callback = {
                    AllowCallBack: 'no'
                };
            });

            createNewCampaign.clearNewCampaignValidation();
        };


    }
);