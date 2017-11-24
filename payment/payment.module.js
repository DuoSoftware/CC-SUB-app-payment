////////////////////////////////
// App : Payment
// Owner  : Gihan Herath
// Last changed date : 2017/11/22
// Version : 6.1.0.3
// Modified By : Gihan
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
					security: ['$q','mesentitlement','$timeout','$rootScope','$state','$location', function($q,mesentitlement,$timeout,$rootScope,$state, $location){
						return $q(function(resolve, reject) {
							$timeout(function() {
								if (true) {
								// if ($rootScope.isBaseSet2) {
									resolve(function () {
										var entitledStatesReturn = mesentitlement.stateDepResolver('payment');

										mesentitlementProvider.setStateCheck("payment");

										if(entitledStatesReturn !== true){
											return $q.reject("unauthorized");
										}
									});
								} else {
									return $location.path('/guide');
								}
							});
						});
					}]
                },
                bodyClass: 'payment'
            });

        msNavigationServiceProvider.saveItem('payment', {
            title    : 'Receipt',
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
