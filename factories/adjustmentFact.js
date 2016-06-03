/**
 * Created by Damith on 5/16/2016.
 */
'use strict';
mainApp.factory('adjustmentFact', function ($http) {

    return {
        getAllAdjustment: function () {
            return $http.get('json/adjustmentData.json')
        },
        getAdjustmentDetails: function () {
            return $http.get('json/adjustmentDetails.json')
        }
    }
});
