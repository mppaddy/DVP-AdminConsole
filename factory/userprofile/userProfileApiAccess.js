/**
 * Created by dinusha on 6/11/2016.
 */

(function () {

    var userProfileApiAccess = function ($http, authService, baseUrls) {

        var getProfileByName = function (user) {

            return $http({
                method: 'GET',
                url: baseUrls.UserServiceBaseUrl + 'User/' + user + '/profile'

            }).then(function (resp) {
                return resp.data;
            })
        };

        var getUsers = function (activeState) {

            return $http({
                method: 'GET',
                url: baseUrls.UserServiceBaseUrl + 'Users?active='+activeState
            }).then(function (resp) {
                return resp.data;
            })
        };

        var getUsersByRole = function () {

            return $http({
                method: 'POST',
                url: baseUrls.UserServiceBaseUrl + 'UsersByRoles',
                data:{roles:["admin","supervisor"]}
            }).then(function (resp) {
                return resp.data;
            })
        };


        var addContactToProfile = function (user, contact, type) {
            return $http({
                method: 'PUT',
                url: baseUrls.UserServiceBaseUrl + 'User/' + user + '/profile/contact/' + contact,
                data: {
                    type: type
                }
            }).then(function (resp) {
                return resp.data;
            })
        };

        var addUser = function (userObj) {

            var jsonStr = JSON.stringify(userObj);
            return $http({
                method: 'POST',
                url: baseUrls.UserServiceBaseUrl + 'User',
                data: jsonStr
            }).then(function (resp) {
                return resp.data;
            })
        };

        var updateProfile = function (user, profileInfo) {

            delete profileInfo.email;

            profileInfo.birthday = profileInfo.dob.year + "-" + profileInfo.dob.month + "-" + profileInfo.dob.day;
            var jsonStr = JSON.stringify(profileInfo);

            return $http({
                method: 'PUT',
                url: baseUrls.UserServiceBaseUrl + 'User/' + user + '/profile',
                data: jsonStr
            }).then(function (resp) {
                return resp.data;
            })
        };


        var resetProfilePassword = function (user, profileInfo) {

            return $http({
                method: 'PUT',
                url: baseUrls.UserServiceBaseUrl + 'User/' + user + '/profile/password',
            }).then(function (resp) {
                return resp.data;
            })
        };


        var deleteContactFromProfile = function (user, contact) {

            return $http({
                method: 'DELETE',
                url: baseUrls.UserServiceBaseUrl + 'User/' + user + '/profile/contact/' + contact
            }).then(function (resp) {
                return resp.data;
            })
        };

        var deleteUser = function (username) {
            return $http({
                method: 'DELETE',
                url: baseUrls.UserServiceBaseUrl + 'User/' + username
            }).then(function (resp) {
                return resp.data;
            })
        };

        var reactivateUser = function (username) {
            return $http({
                method: 'PUT',
                url: baseUrls.UserServiceBaseUrl + 'User/ReActivate/' + username
            }).then(function (resp) {
                return resp.data;
            })
        };


        var getUserGroups = function () {

            return $http({
                method: 'GET',
                url: baseUrls.UserServiceBaseUrl + 'UserGroups'
            }).then(function (resp) {
                return resp.data;
            })
        };

        var getBusinessUnits = function () {

            return $http({
                method: 'GET',
                url: baseUrls.UserServiceBaseUrl + 'BusinessUnits'
            }).then(function (resp) {
                return resp.data;
            })
        };

        var getBusinessUnitsWithGroups = function () {

            return $http({
                method: 'GET',
                url: baseUrls.UserServiceBaseUrl + 'BusinessUnitsWithGroups'
            }).then(function (resp) {
                return resp.data;
            })
        };

        var getGroupMembers = function (groupID) {

            return $http({
                method: 'GET',
                url: baseUrls.UserServiceBaseUrl + 'UserGroup/' + groupID + "/members",
            }).then(function (resp) {
                return resp.data;
            })
        };

        var addUserGroup = function (userObj) {

            return $http({
                method: 'POST',
                url: baseUrls.UserServiceBaseUrl + 'UserGroup',
                data: userObj
            }).then(function (resp) {
                return resp.data;
            })
        };
        var removeUserFromGroup = function (gripID, userID) {

            return $http({
                method: 'DELETE',
                url: baseUrls.UserServiceBaseUrl + 'UserGroup/' + gripID + "/User/" + userID
            }).then(function (resp) {
                return resp.data;
            })
        };
        var addMemberToGroup = function (gripID, userID) {

            return $http({
                method: 'PUT',
                url: baseUrls.UserServiceBaseUrl + 'UserGroup/' + gripID + "/User/" + userID
            }).then(function (resp) {
                return resp.data;
            })
        };
        var getMyProfile = function () {

            return $http({
                method: 'GET',
                url: baseUrls.UserServiceBaseUrl + 'Myprofile'
            }).then(function (resp) {
                return resp.data;
            })
        };
        var updateUserSecurityLevel = function (username,body) {

            return $http({
                method: 'PUT',
                url: baseUrls.UserServiceBaseUrl + 'User/'+username,
                data:body
            }).then(function (resp) {
                return resp.data;
            })
        };

        var allowFileCategoryToUser = function (user,category) {

            return $http({
                method: 'PUT',
                url: baseUrls.UserServiceBaseUrl + 'User/'+user+'/FileCategory/'+category

            }).then(function (resp) {
                return resp.data;
            })
        };
        var restrictFileCategoryToUser = function (user,category) {

            return $http({
                method: 'DELETE',
                url: baseUrls.UserServiceBaseUrl + 'User/'+user+'/FileCategory/'+category

            }).then(function (resp) {
                return resp.data;
            })
        };

        var addUserFromAD = function (userObj) {

            return $http({
                method: 'POST',
                url: baseUrls.UserServiceBaseUrl + 'ActiveDirectory/FaceTone/User',
                data: userObj
            }).then(function (resp) {
                return resp.data;
            })
        };
        var GetFileCatagories = function () {

            return $http({
                method: 'GET',
                url: baseUrls.UserServiceBaseUrl + 'FileCategories'
            }).then(function (response) {
                return response.data.Result;
            })
        };

        var saveBusinessUnit = function (unitObj) {
            return $http({
                method: 'POST',
                url: baseUrls.UserServiceBaseUrl + 'BusinessUnit',
                data: unitObj
            }).then(function (resp) {
                return resp.data;
            })
        };

        var updateUserGroup = function (id,updtObj) {
            return $http({
                method: 'PUT',
                url: baseUrls.UserServiceBaseUrl + 'UserGroup/'+id,
                data: updtObj
            }).then(function (resp) {
                return resp.data;
            })
        };
        var updateBusinessUnit = function (name,updtObj) {
            return $http({
                method: 'PUT',
                url: baseUrls.UserServiceBaseUrl + 'BusinessUnit/'+name,
                data: updtObj
            }).then(function (resp) {
                return resp.data;
            })
        };

        var GetExternalUserConfig = function () {

            return $http({
                method: 'GET',
                url: baseUrls.UserServiceBaseUrl + 'ExternalUserConfig'
            }).then(function (response) {
                return response.data;
            })
        };
        var GetExternalUserDefaultAccessFields = function () {

            return $http({
                method: 'GET',
                url: baseUrls.UserServiceBaseUrl + 'ExternalUserConfig/DefaultKeys'
            }).then(function (response) {
                return response.data;
            })
        };
        var getExternalUserFields = function () {

            return $http({
                method: 'GET',
                url: baseUrls.UserServiceBaseUrl + 'ExternalUserConfig/UserFields'
            }).then(function (response) {
                return response.data;
            })
        };
        var updateAccessFields = function (updtObj) {
            return $http({
                method: 'PUT',
                url: baseUrls.UserServiceBaseUrl + 'ExternalUserConfig',
                data: updtObj
            }).then(function (resp) {
                return resp.data;
            })
        };
        var addAccessFields = function (updtObj) {
            return $http({
                method: 'POST',
                url: baseUrls.UserServiceBaseUrl + 'ExternalUserConfig',
                data: updtObj
            }).then(function (resp) {
                return resp.data;
            })
        };
        var addGroupsToBUnit = function (unitname,groupIds) {
            return $http({
                method: 'PUT',
                url: baseUrls.UserServiceBaseUrl + 'BusinessUnit/'+unitname+'/Groups',
                data: groupIds
            }).then(function (resp) {
                return resp.data;
            })
        };
        var addHeadUserToBUnit = function (unitname,hUser) {
            return $http({
                method: 'PUT',
                url: baseUrls.UserServiceBaseUrl + 'BusinessUnit/'+unitname+'/Head/'+hUser
            }).then(function (resp) {
                return resp.data;
            })
        };
        var removeHeadUserToBUnit = function (unitname,hUser) {
            return $http({
                method: 'DELETE',
                url: baseUrls.UserServiceBaseUrl + 'BusinessUnit/'+unitname+'/Head/'+hUser
            }).then(function (resp) {
                return resp.data;
            })
        };




        return {
            getProfileByName: getProfileByName,
            addContactToProfile: addContactToProfile,
            deleteContactFromProfile: deleteContactFromProfile,
            updateProfile: updateProfile,
            resetProfilePassword: resetProfilePassword,
            getUsers: getUsers,
            addUser: addUser,
            deleteUser: deleteUser,
            addUserGroup: addUserGroup,
            getUserGroups: getUserGroups,
            removeUserFromGroup: removeUserFromGroup,
            getGroupMembers: getGroupMembers,
            addMemberToGroup: addMemberToGroup,
            getMyProfile: getMyProfile,
            updateUserSecurityLevel: updateUserSecurityLevel,
            getUsersByRole:getUsersByRole,
            allowFileCategoryToUser:allowFileCategoryToUser,
            restrictFileCategoryToUser:restrictFileCategoryToUser,
            addUserFromAD:addUserFromAD,
            GetFileCatagories:GetFileCatagories,
            ReactivateUser:reactivateUser,
            getBusinessUnits: getBusinessUnits,
            saveBusinessUnit:saveBusinessUnit,
            updateUserGroup:updateUserGroup,
            updateBusinessUnit:updateBusinessUnit,
            GetExternalUserConfig:GetExternalUserConfig,
            GetExternalUserDefaultAccessFields:GetExternalUserDefaultAccessFields,
            updateAccessFields:updateAccessFields,
            addAccessFields:addAccessFields,
            getBusinessUnitsWithGroups:getBusinessUnitsWithGroups,
            getExternalUserFields:getExternalUserFields,
            addGroupsToBUnit:addGroupsToBUnit,
            addHeadUserToBUnit:addHeadUserToBUnit,
            removeHeadUserToBUnit:removeHeadUserToBUnit
        };
    };


    var module = angular.module("veeryConsoleApp");
    module.factory("userProfileApiAccess", userProfileApiAccess);

}());
