/**
 * Created by Damith on 5/12/2016.
 */

'use strict'
var mainApp = angular.module('cloudPayApp', ['ngAnimate', 'ngMaterial', 'ui.router',
    'ngTable', 'data-table', 'ngSlimScroll']);

mainApp.config(["$httpProvider", "$stateProvider", "$urlRouterProvider",
    function ($httpProvider, $stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/adjustments-view');
        $stateProvider
            .state("customerPayment", {
                url: "/customer-payment",
                templateUrl: "views/customer-payment-view.html"
            }).state("adjustmentsAdd", {
            url: "/adjustments-add",
            templateUrl: "views/adjustments/adjustment-add.html"
        }).state("adjustmentsView", {
            url: "/adjustments-view",
            templateUrl: "views/adjustments/adjustment-view.html"
        });
    }]);
