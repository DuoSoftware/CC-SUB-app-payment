/**
 * Created by Damith on 5/16/2016.
 */

mainApp.controller('adjustmentViewCtrl', function ($scope, adjustmentFact, NgTableParams) {

    $scope.isLoading = true;
    $scope.viewCount = 0;

    $scope.options = {
        scrollbar: false
    };


    adjustmentFact.getAllAdjustment().success(function (res) {
        $scope.data = res;
        $scope.isLoading = false;
    }).error(function (e) {
    });


    //row click event
    function TableRow(clickRow, data) {
        this.clickRow = clickRow;
        this.dataTbl = data;
    }

    TableRow.prototype = {
        constructor: TableRow,
        refreshAll: function () {
            var data = this.dataTbl;
            for (var i = 0; i < data.length; i++) {
                $scope.data[i].select = false;
            }
        },
        click: function () {
            var row = this.clickRow;
            var data = this.dataTbl;
            $scope.viewCount = 1;
            for (var i = 0; i < data.length; i++) {
                if (data[i].customer == row.customer) {
                    $scope.data[i].select = true;
                    data.length = $scope.data.length;
                }
                //todo
            }
        },
        refreshTbl: function () {
            if ($scope.viewCount == 0) {
                $("#ajdDetails").removeClass('selected-row');

            } else {
                document.getElementById("ajdDetails").classList.add("selected-row");
            }
        }
    }

    $scope.tableEvent = {
        rowClick: function (row, data) {
            var tableRow = new TableRow(row, data);
            tableRow.refreshAll();
            tableRow.click();
            tableRow.refreshTbl();
        }
    };

    $scope.number = 5;
    $scope.getNumber = function (num) {
        return new Array(num);
    }

});