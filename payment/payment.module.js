(function ()
{
    'use strict';

    angular
        .module('app.payment', [])
        .config(config)
        .filter('parseDate',parseDateFilter)
        .filter('numberFixedLen',numberFixedLength);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
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
                    //Invoice: function (msApi)
                    //{
                    //    return msApi.resolve('cc_invoice.invoices@get');
                    //}
                },
                bodyClass: 'payment'
            });

        //Api
        msApiProvider.register('cc_invoice.invoices', ['app/data/cc_invoice/invoices.json']);

        // Navigation

        msNavigationServiceProvider.saveItem('payment', {
            title    : 'payment',
            icon     : 'icon-leaf',
            state    : 'app.payment',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 9
        });
    }

    function parseDateFilter(){
        return function(input){
            return new Date(input);
        };
    }

    function numberFixedLength()
    {
      return function (n, len) {
        var num = parseInt(n, 10);
        len = parseInt(len, 10);
        if (isNaN(num) || isNaN(len)) {
          return n;
        }
        num = ''+num;
        while (num.length < len) {
          num = '0'+num;
        }
        return num;
      };
    }
})();
