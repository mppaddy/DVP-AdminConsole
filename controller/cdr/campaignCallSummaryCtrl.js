mainApp.controller("campaignCallSummaryController", function ($http, $scope, $filter, $location, $log, $q, $anchorScroll, sipUserApiHandler, campaignService, cdrApiHandler) {

    $anchorScroll();


    $scope.showAlert = function (tittle, type, content) {
        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.initialLoad = true;

    $scope.SummaryDetails = [];

    $scope.campaignList = [];
    $scope.AnsweredCalls = 0;
    $scope.QueuedCalls = 0;
    $scope.isError = false;

    var getCampaigns = function()
    {
        campaignService.GetCampaigns().then(function (campaignList) {
            if (campaignList && campaignList.length > 0) {
                $scope.campaignList = campaignList;
            }


        }).catch(function (err) {
        });
    };

    var getUserList = function () {

        sipUserApiHandler.getSIPUsers().then(function (userList) {
            if (userList && userList.Result && userList.Result.length > 0) {
                $scope.userList = userList.Result;
            }


        }).catch(function (err) {
        });
    };

    getUserList();

    getCampaigns();

    $scope.isLoading = false;
    $scope.noDataToshow = false;
    $scope.BatchNames = [];
    $scope.AgentWiseSummary = [];


    $scope.StartDate = moment().format("YYYY-MM-DD");
    $scope.EndDate = moment().format("YYYY-MM-DD");

	/** Kasun_Wijeratne_5_MARCH_2018
	 * ----------------------------------------*/
	// var endDateValidatorListner = $scope.$watch(function () {
	// 	var sd = new Date($scope.StartDate);
	// 	var ed = new Date($scope.EndDate);
	// 	var msd = moment(sd);
	// 	var med = moment(ed);
	// 	if(sd && ed){
	// 		var dif = med.diff(msd, 'days');
	// 		if(dif > 30){
	// 			$scope.showAlert("Invalid End Date", 'error', "End Date should not exceed 30 days from Start Date");
	// 			$scope.EndDate = $scope.StartDate;
	// 			endDateValidatorListner();
	// 		}
	// 	}
	// });
	/** ----------------------------------------
	 * Kasun_Wijeratne_5_MARCH_2018*/

    $scope.DownloadCSV = function () {

        $scope.DownloadFileName = 'CAMPAIGN_SUMMARY_' + $scope.StartDate + '_' + $scope.EndDate;
        var deferred = $q.defer();
        var emptyList = [];

        var momentTz = moment.parseZone(new Date()).format('Z');
        momentTz = momentTz.replace("+", "%2B");
        var startD = $scope.StartDate + ' 00:00:00' + momentTz;
        var endD  = $scope.EndDate + ' 23:59:59' + momentTz;

        if(moment($scope.StartDate).isBefore($scope.EndDate) || moment($scope.StartDate).isSame($scope.EndDate))
        {
            cdrApiHandler.getCampaignAgentSummary(startD, endD).then(function (response){

                if(response.Result)
                {
                    deferred.resolve(response.Result);
                }
                else
                {
                    deferred.reject(emptyList);
                }

            }, function (error) {
                deferred.reject(emptyList);
            });
        }
        else
        {
            deferred.reject(emptyList);
        }


        return deferred.promise;
    };


    $scope.getPageData = function () {

        $scope.isLoading = true;
        var momentTz = moment.parseZone(new Date()).format('Z');
        momentTz = momentTz.replace("+", "%2B");
        var startD = $scope.StartDate + ' 00:00:00' + momentTz;
        var endD  = $scope.EndDate + ' 23:59:59' + momentTz;

        cdrApiHandler.getCampaignAgentSummary(startD, endD).then(function (response)
        {
            if(response.Result)
            {
                $scope.SummaryDetails = response.Result;

                $scope.isError = false;
            }
            else
            {
                $scope.isError = true;
            }
            $scope.isLoading = false;
            $scope.initialLoad = false;
        }, function (error) {
            $scope.showAlert("Campaign Report", 'error', "Fail To Load Summery Report.");
            $scope.isLoading = false
            $scope.isError = true;
            $scope.initialLoad = false;
        });
    };
});
