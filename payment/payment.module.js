////////////////////////////////
// App : Payment
// Owner  : Gihan Herath
// Last changed date : 2017/01/04
// Version : 6.0.0.18
// Modified By : GihanHerath
/////////////////////////////////

(function ()
{
    'use strict';

    angular
        .module('app.payment', [])
        .config(config)
        .filter('parseDate',parseDateFilter);

    /** @ngInject */
    function config($stateProvider, msNavigationServiceProvider, mesentitlementProvider)
    {

        mesentitlementProvider.setStateCheck("payment");

        $stateProvider
            .state('app.payment', {
                url    : '/payment',
                views  : {
                    'payment@app': {
                        templateUrl: 'app/main/payment/payment.html',
                        controller : 'PaymentController as vm'
                    }
                },
                resolve: {
                    security: ['$q','mesentitlement','$timeout','$rootScope','$state', function($q,mesentitlement,$timeout,$rootScope,$state){
                        var entitledStatesReturn = mesentitlement.stateDepResolver('payment');

                        if(entitledStatesReturn !== true){
                              return $q.reject("unauthorized");
                        }
                        else
                        {
                          //debugger;
                          $timeout(function() {
                            var firstLogin=localStorage.getItem("firstLogin");
                            if(firstLogin==null ||firstLogin=="" || firstLogin==undefined) {
                              console.log('Payment First Login null');
                              $rootScope.firstLoginDitected = true;
                              //localStorage.removeItem('firstLogin');
                              $state.go('app.settings', {}, {location: 'settings'});
                              //return $q.reject("settings");
                            }
                            else
                            {
                              //localStorage.removeItem('firstLogin');
                            }
                          }, 50);
                        };
                    }]
                },
                bodyClass: 'payment'
            });

        msNavigationServiceProvider.saveItem('payment', {
            title    : 'payment',
            state    : 'app.payment',
            weight   : 4
        });
    }

    function parseDateFilter(){
        return function(input){
            return new Date(input);
        };
    }
})();
