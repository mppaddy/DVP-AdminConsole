/**
 * Created by Pawan on 6/15/2016.
 */

mainApp.factory('agentSummaryBackendService', function ($http, authService) {

    return {

        getAgentSummary: function (fromDate,toDate) {
            var authToken = authService.GetToken();
            return $http({
                method: 'GET',
                url: "http://resourceservice.104.131.67.21.xip.io/DVP/API/1.0.0.0/ResourceManager/Resources/Productivity/Summary/from/"+fromDate+"/to/"+toDate,
                headers: {
                    'authorization':authToken
                }
            }).then(function(response)
            {
                return response;
            });
        }


    }
});