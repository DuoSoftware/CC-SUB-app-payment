////////////////////////////////
// App : Payment
// Owner  : Gihan Herath
// Last changed date : 2016/11/02
// Version : 6.0.0.10
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
                    security: ['$q','mesentitlement', function($q,mesentitlement){
                        var entitledStatesReturn = mesentitlement.stateDepResolver('payment');

                        if(entitledStatesReturn !== true){
                              return $q.reject("unauthorized");
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
