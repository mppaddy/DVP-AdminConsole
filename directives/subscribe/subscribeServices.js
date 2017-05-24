/**
 * Created by damith on 5/3/17.
 */


mainApp.factory('subscribeServices', function (baseUrls, loginService) {


    //local  variable
    var connectionSubscribers;
    var dashboardSubscriber;

    //********  subscribe event ********//
    var OnConnected = function () {
        console.log("OnConnected..............");
        var token = loginService.getToken();
        SE.authenticate({
            success: function (data) {
                console.log("authenticate..............");

                if (connectionSubscribers) {
                    connectionSubscribers(true);
                }

                //subscribe room
                SE.subscribe({room: 'QUEUE:QueueDetail'});
                SE.subscribe({room: 'QUEUE:CurrentCount'});
                SE.subscribe({room: 'QUEUE:TotalCount'});
                SE.subscribe({room: 'QUEUE:TotalCount'});
                SE.subscribe({room: 'CONNECTED:TotalTime'});
                SE.subscribe({room: 'QUEUEANSWERED:TotalCount'});
                SE.subscribe({room: 'BRIDGE:TotalCount'});

                SE.subscribe({room: 'CALLS:TotalCount'});
                SE.subscribe({room: 'CALLS:CurrentCount'});
                SE.subscribe({room: 'QUEUEDROPPED:TotalCount'});
                SE.subscribe({room: 'BRIDGE:CurrentCount'});

            },
            error: function (data) {
                console.log("authenticate error..............");
            },
            token: token
        });
    };

    var OnDisconnect = function (o) {
        console.log("OnDisconnect..............");
        if (connectionSubscribers)
            connectionSubscribers(false);
    };

    var OnDashBoardEvent = function (event) {
        console.log("OnDshboardEvent..............");
        if (dashboardSubscriber) {
            dashboardSubscriber(event);

        }
    };

    var callBackEvents = {
        OnConnected: OnConnected,
        OnDisconnect: OnDisconnect,
        OnDashBoardEvent: OnDashBoardEvent
    };


    //********  subscribe function ********//
    var connect = function () {
        SE.init({
            serverUrl: baseUrls.ipMessageURL,
            callBackEvents: callBackEvents
        });
    };
    var subscribeDashboard = function (func) {
        dashboardSubscriber = func;
    };

    var unsubscribe = function (view) {
        //if (view == "dashoboard") {
        //    SE.unsubscribe({room: 'QUEUE:QueueDetail'});
        //    SE.unsubscribe({room: 'QUEUE:CurrentCount'});
        //    SE.unsubscribe({room: 'QUEUE:TotalCount'});
        //    SE.unsubscribe({room: 'QUEUE:TotalCount'});
        //    SE.unsubscribe({room: 'CONNECTED:TotalTime'});
        //    SE.unsubscribe({room: 'QUEUEANSWERED:TotalCount'});
        //    SE.unsubscribe({room: 'BRIDGE:TotalCount'});
        //
        //    SE.unsubscribe({room: 'CALLS:TotalCount'});
        //    SE.unsubscribe({room: 'CALLS:CurrentCount'});
        //    SE.unsubscribe({room: 'QUEUEDROPPED:TotalCount'});
        //    SE.unsubscribe({room: 'BRIDGE:CurrentCount'});
        //    return;
        //}
        //
        //if (view == "queuedetail") {
        //    SE.unsubscribe({room: 'QUEUE:QueueDetail'});
        //    return;
        //}
    };

    var subscribe = function (view) {
        //if (view == "dashoboard") {
        //    SE.unsubscribe({room: 'QUEUE:QueueDetail'});
        //    SE.unsubscribe({room: 'QUEUE:CurrentCount'});
        //    SE.unsubscribe({room: 'QUEUE:TotalCount'});
        //    SE.unsubscribe({room: 'QUEUE:TotalCount'});
        //    SE.unsubscribe({room: 'CONNECTED:TotalTime'});
        //    SE.unsubscribe({room: 'QUEUEANSWERED:TotalCount'});
        //    SE.unsubscribe({room: 'BRIDGE:TotalCount'});
        //
        //    SE.unsubscribe({room: 'CALLS:TotalCount'});
        //    SE.unsubscribe({room: 'CALLS:CurrentCount'});
        //    SE.unsubscribe({room: 'QUEUEDROPPED:TotalCount'});
        //    SE.unsubscribe({room: 'BRIDGE:CurrentCount'});
        //    return;
        //}
        //
        //if (view == "queuedetail") {
        //    SE.unsubscribe({room: 'QUEUE:QueueDetail'});
        //    return;
        //}
    };

    return {
        connectSubscribeServer: connect,
        subscribeDashboard: subscribeDashboard,
        unsubscribe: unsubscribe,
        subscribe: subscribe
    }


});