/**
 * Created by dinusha on 6/12/2016.
 */
(function () {
    var app = angular.module("veeryConsoleApp");

    var userListCtrl = function ($scope, $stateParams, $state, userProfileApiAccess, loginService,$anchorScroll, companyConfigBackendService) {

        $anchorScroll();
        $scope.showAlert = function (title, type, content) {

            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };


        $scope.newUser = {};
        $scope.newUserGroup = {};
        $scope.newUser.title = 'mr';
        $scope.NewUserLabel = "+";
        $scope.newGroupUsers = [];

        $scope.searchCriteria = "";

        $scope.NewUserOpened = false;

        $scope.addUserPress = function () {
            $scope.NewUserOpened = !$scope.NewUserOpened;

            if ($scope.NewUserLabel === '+') {
                $scope.NewUserLabel = '-';
            }
            else if ($scope.NewUserLabel === '-') {
                $scope.NewUserLabel = '+';
            }


        };

        var resetForm = function () {
            $scope.newUser = {};
            $scope.NewUserLabel = "+";
            $scope.searchCriteria = "";
            $scope.NewUserOpened = false;
            $scope.newUserGroup = {};
        };

        $scope.viewProfile = function (username) {
            $state.go('console.userprofile', {'username': username});
        };

        $scope.viewPermissions = function (item) {
            $state.go('console.applicationAccessManager', {username: item.username, role: item.user_meta.role});
        };


        var loadUsers = function () {
            userProfileApiAccess.getUsers().then(function (data) {
                if (data.IsSuccess) {
                    $scope.userList = data.Result;
                }
                else {
                    var errMsg = data.CustomMessage;

                    if (data.Exception) {
                        errMsg = data.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);

                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading users";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };
        var loadUserGroups = function () {
            userProfileApiAccess.getUserGroups().then(function (data) {
                if (data.IsSuccess) {
                    $scope.userGroupList = data.Result;

                    if ($scope.userGroupList.length > 0) {
                        $scope.loadGroupMembers($scope.userGroupList[0]);
                    }
                }
                else {
                    var errMsg = data.CustomMessage;

                    if (data.Exception) {
                        errMsg = data.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);

                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading users";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        $scope.addNewUser = function () {
            userProfileApiAccess.addUser($scope.newUser).then(function (data) {
                if (data.IsSuccess) {
                    $scope.showAlert('Success', 'info', 'User added');

                    resetForm();

                    loadUsers();


                }
                else {
                    var errMsg = "";
                    if (data.Exception && data.Exception.Message) {
                        errMsg = data.Exception.Message;
                    }

                    if (data.CustomMessage) {
                        errMsg = data.CustomMessage;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error adding user";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        loadUsers();
        loadUserGroups();


        $scope.removeUser = function (username) {

            new PNotify({
                title: 'Confirm Deletion',
                text: 'Are You Sure You Want To Delete User ?',
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
            }).get().on('pnotify.confirm', function () {
                userProfileApiAccess.deleteUser(username).then(function (data) {
                    if (data.IsSuccess) {
                        $scope.showAlert('Success', 'info', 'User Deleted');
                        loadUsers();
                    }
                    else {
                        var errMsg = "";

                        if (data.Exception) {
                            errMsg = data.Exception.Message;
                        }

                        if (data.CustomMessage) {
                            errMsg = data.CustomMessage;
                        }
                        $scope.showAlert('Error', 'error', errMsg);
                    }

                }, function (err) {
                    loginService.isCheckResponse(err);
                    var errMsg = "Error occurred while deleting contact";
                    if (err.statusText) {
                        errMsg = err.statusText;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                });
            }).on('pnotify.cancel', function () {

            });


        };


        $scope.addNewUserGroup = function () {
            userProfileApiAccess.addUserGroup($scope.newUserGroup).then(function (response) {

                if (response.IsSuccess) {
                    $scope.showAlert("New User group", "success", "New User Group Added Successfully");
                    resetForm();
                    loadUserGroups();
                }
                else {
                    $scope.showAlert("New User group", "error", "New User Group Adding Failed");
                }

            }, function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert("New User group", "error", "Error In New User Group Adding");
            })
        };

        $scope.showMembers = false;


        /*update code damith*/
        $scope.groupMemberlist = [];
        $scope.isLoadingUsers = false;
        $scope.selectedGroup = null;
        var removeAllocatedAgents = function () {
            $scope.groupMemberlist.filter(function (member) {
                $scope.agents.filter(function (agent) {
                    if (agent._id == member._id) {
                        $scope.agents.splice($scope.agents.indexOf(agent), 1);
                    }
                })
            })
        };

        $scope.loadGroupMembers = function (group) {
            $scope.groupMemberlist = [];
            $scope.isLoadingUsers = true;
            $scope.selectedGroup = group;
            
            userProfileApiAccess.getGroupMembers(group._id).then(function (response) {
                if (response.IsSuccess) {
                    $scope.groupMemberlist = response.Result;
                    removeAllocatedAgents()
                }
                else {
                    console.log("Error in loading Group member list");
                    //scope.showAlert("User removing from group", "error", "Error in removing user from group");
                }
                $scope.isLoadingUsers = false;
            }, function (err) {
                console.log("Error in loading Group member list ", err);
                //scope.showAlert("User removing from group", "error", "Error in removing user from group");
            });
        };


        //remove group member
        $scope.removeGroupMember = function (userID) {
            //confirm box
            new PNotify({
                title: 'Confirmation Needed',
                text: 'Are you sure?',
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
                },
                addclass: 'stack-modal',
            }).get().on('pnotify.confirm', function () {
                userProfileApiAccess.removeUserFromGroup($scope.selectedGroup._id, userID).then(function (response) {
                    if (response.IsSuccess) {
                        $scope.groupMemberlist.filter(function (userObj) {
                            if (userObj._id == userID) {
                                $scope.groupMemberlist.splice($scope.groupMemberlist.indexOf(userObj), 1);
                                $scope.agents.push(userObj);
                                $scope.showAlert("User Removing From Group", "success", "User Removed From Group Successfully");
                            }
                        });
                    }
                    else {
                        $scope.showAlert("User Removing From Group", "error", "Error In Removing User From Group");
                    }
                }, function (error) {
                    $scope.showAlert("User Removing From Group", "error", "User Removing From Group Failed");
                });
            }).on('pnotify.cancel', function () {
                console.log('fire event cancel');
            });

        };


        //create new group
        $scope.createNewGroup = function () {
            $('#crateNewGroupWrapper').animate({
                bottom: "-5"
            }, 500);
        };
        $scope.hiddenNewGroupDIV = function () {
            $('#crateNewGroupWrapper').animate({
                bottom: "-95"
            }, 300);
        };

        $scope.addNewGroupMember = function () {
            $('#crateNewGroupMemberWrapper').animate({
                bottom: "-5"
            }, 500);
        };
        $scope.hiddenNewGroupMember = function () {
            $('#crateNewGroupMemberWrapper').animate({
                bottom: "-95"
            }, 300);
        };


        //add user to group
        $scope.agents = [];
        //get all agents
        //onload
        $scope.loadAllAgents = function () {
            userProfileApiAccess.getUsers().then(function (data) {
                if (data.IsSuccess) {
                    $scope.agents = data.Result;
                    removeAllocatedAgents();
                }
            }, function (error) {
                $scope.showAlert("Loading Agent details", "error", "Error In Loading Agent Details");
            });
        };
        $scope.loadAllAgents();

        //add new member to current selected group
        $scope.addUserToGroup = function (userID) {
            userProfileApiAccess.addMemberToGroup($scope.selectedGroup._id, userID).then(function (response) {
                if (response.IsSuccess) {
                    $scope.agents.filter(function (userObj) {
                        if (userObj._id == userID) {
                            $scope.groupMemberlist.push(userObj);
                            $scope.showAlert("Member Added To Group", "success", "Member Added To Group Successfully");
                            removeAllocatedAgents();
                        }
                    })
                }
                else {
                    $scope.showAlert("Member Added To Group", "error", "Error In Member Adding To Group");
                }
            }, function (error) {
                $scope.showAlert("Member Added To Group", "error", "Member Added To Group Failed");
            })
        };

        $scope.showPasswordHints = function () {

            $scope.pwdBox = !$scope.pwdBox ;
        };




        //-------------------------Active Directory-------------------------------------

        $scope.activeDirectoryUsers = [];

        $scope.getUsersFromActiveDirectory = function () {
            companyConfigBackendService.getUsersFromActiveDirectory().then(function (response) {
                if(response.IsSuccess)
                {
                    $scope.activeDirectoryUsers = response.Result;
                    $scope.activeDirectoryUsers.push({
                        dn: "CN=Heshan1 Indika,OU=Domain Controllers,DC=duo,DC=lk",
                        userPrincipalName: "heshan@duo.lk",
                        sAMAccountName: "heshan1",
                        mail: "heshan1.i@duosoftware.com",
                        whenCreated: "20170628053252.0Z",
                        pwdLastSet: "131431015727394936",
                        userAccountControl: "66048",
                        sn: "Indika",
                        givenName: "Heshan1",
                        cn: "Heshan1 Indika",
                        displayName: "Heshan1 Indika"
                    });
                    $scope.activeDirectoryUsers.push({
                        dn: "CN=Heshan2 Indika,OU=Domain Controllers,DC=duo,DC=lk",
                        userPrincipalName: "heshan@duo.lk",
                        sAMAccountName: "heshan2",
                        mail: "heshan2.i@duosoftware.com",
                        whenCreated: "20170628053252.0Z",
                        pwdLastSet: "131431015727394936",
                        userAccountControl: "66048",
                        sn: "Indika",
                        givenName: "Heshan2",
                        cn: "Heshan2 Indika",
                        displayName: "Heshan2 Indika"
                    });
                    $scope.activeDirectoryUsers.push({
                        dn: "CN=Heshan3 Indika,OU=Domain Controllers,DC=duo,DC=lk",
                        userPrincipalName: "heshan@duo.lk",
                        sAMAccountName: "heshan3",
                        mail: "heshan3.i@duosoftware.com",
                        whenCreated: "20170628053252.0Z",
                        pwdLastSet: "131431015727394936",
                        userAccountControl: "66048",
                        sn: "Indika",
                        givenName: "Heshan3",
                        cn: "Heshan3 Indika",
                        displayName: "Heshan3 Indika"
                    });
                    $scope.activeDirectoryUsers.push({
                        dn: "CN=Heshan4 Indika,OU=Domain Controllers,DC=duo,DC=lk",
                        userPrincipalName: "heshan@duo.lk",
                        sAMAccountName: "heshan4",
                        mail: "heshan4.i@duosoftware.com",
                        whenCreated: "20170628053252.0Z",
                        pwdLastSet: "131431015727394936",
                        userAccountControl: "66048",
                        sn: "Indika",
                        givenName: "Heshan4",
                        cn: "Heshan4 Indika",
                        displayName: "Heshan4 Indika"
                    });
                    $scope.activeDirectoryUsers.push({
                        dn: "CN=Heshan5 Indika,OU=Domain Controllers,DC=duo,DC=lk",
                        userPrincipalName: "heshan@duo.lk",
                        sAMAccountName: "heshan5",
                        mail: "heshan5.i@duosoftware.com",
                        whenCreated: "20170628053252.0Z",
                        pwdLastSet: "131431015727394936",
                        userAccountControl: "66048",
                        sn: "Indika",
                        givenName: "Heshan5",
                        cn: "Heshan5 Indika",
                        displayName: "Heshan5 Indika"
                    });
                    $scope.activeDirectoryUsers.push({
                        dn: "CN=Heshan6 Indika,OU=Domain Controllers,DC=duo,DC=lk",
                        userPrincipalName: "heshan@duo.lk",
                        sAMAccountName: "heshan6",
                        mail: "heshan6.i@duosoftware.com",
                        whenCreated: "20170628053252.0Z",
                        pwdLastSet: "131431015727394936",
                        userAccountControl: "66048",
                        sn: "Indika",
                        givenName: "Heshan6",
                        cn: "Heshan6 Indika",
                        displayName: "Heshan6 Indika"
                    });
                    $scope.activeDirectoryUsers.push({
                        dn: "CN=Heshan7 Indika,OU=Domain Controllers,DC=duo,DC=lk",
                        userPrincipalName: "heshan@duo.lk",
                        sAMAccountName: "heshan7",
                        mail: "heshan7.i@duosoftware.com",
                        whenCreated: "20170628053252.0Z",
                        pwdLastSet: "131431015727394936",
                        userAccountControl: "66048",
                        sn: "Indika",
                        givenName: "Heshan7",
                        cn: "Heshan7 Indika",
                        displayName: "Heshan7 Indika"
                    });
                    $scope.activeDirectoryUsers.push({
                        dn: "CN=Heshan8 Indika,OU=Domain Controllers,DC=duo,DC=lk",
                        userPrincipalName: "heshan@duo.lk",
                        sAMAccountName: "heshan8",
                        mail: "heshan8.i@duosoftware.com",
                        whenCreated: "20170628053252.0Z",
                        pwdLastSet: "131431015727394936",
                        userAccountControl: "66048",
                        sn: "Indika",
                        givenName: "Heshan8",
                        cn: "Heshan8 Indika",
                        displayName: "Heshan8 Indika"
                    });
                    $scope.activeDirectoryUsers.push({
                        dn: "CN=Heshan9 Indika,OU=Domain Controllers,DC=duo,DC=lk",
                        userPrincipalName: "heshan@duo.lk",
                        sAMAccountName: "heshan9",
                        mail: "heshan9.i@duosoftware.com",
                        whenCreated: "20170628053252.0Z",
                        pwdLastSet: "131431015727394936",
                        userAccountControl: "66048",
                        sn: "Indika",
                        givenName: "Heshan9",
                        cn: "Heshan9 Indika",
                        displayName: "Heshan9 Indika"
                    });
                    $scope.activeDirectoryUsers.push({
                        dn: "CN=Heshan10 Indika,OU=Domain Controllers,DC=duo,DC=lk",
                        userPrincipalName: "heshan@duo.lk",
                        sAMAccountName: "heshan10",
                        mail: "heshan10.i@duosoftware.com",
                        whenCreated: "20170628053252.0Z",
                        pwdLastSet: "131431015727394936",
                        userAccountControl: "66048",
                        sn: "Indika",
                        givenName: "Heshan10",
                        cn: "Heshan10 Indika",
                        displayName: "Heshan10 Indika"
                    });
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Active Directory', errMsg, 'error');
                }
            }, function(err){
                var errMsg = "Error Occurred While Retrieving Active Directory Users";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Active Directory', errMsg, 'error');
            });

        };

        $scope.getUsersFromActiveDirectory();

    };

    app.controller("userListCtrl", userListCtrl);
}());
