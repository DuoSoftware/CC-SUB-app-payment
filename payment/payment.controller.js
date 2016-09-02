(function ()
{
    'use strict';

    angular
        .module('app.payment')
        .controller('PaymentController', PaymentController);

    /** @ngInject */
    function PaymentController($scope, $document, $timeout, notifications, $mdDialog, $mdToast, $mdMedia, $mdSidenav,$charge,$filter)
    {
        var vm = this;

        vm.appInnerState = "default";
        vm.pageTitle="Create New";
        vm.checked = [];
        vm.colors = ['blue-bg', 'blue-grey-bg', 'orange-bg', 'pink-bg', 'purple-bg'];

        vm.selectedPayment = {};
        vm.toggleSidenav = toggleSidenav;

        vm.responsiveReadPane = undefined;
        vm.activeInvoicePaneIndex = 0;
        vm.dynamicHeight = false;

        vm.scrollPos = 0;
        vm.scrollEl = angular.element('#content');

        //vm.invoices = Invoice.data;
        //console.log(vm.invoices);
        //invoice data getter !
        //vm.selectedInvoice = vm.invoices[0];
        vm.selectedMailShowDetails = false;

        // Methods
        vm.checkAll = checkAll;
        vm.closeReadPane = closeReadPane;
        vm.addInvoice = toggleinnerView;
        vm.isChecked = isChecked;
        vm.selectPayment = selectPayment;
        vm.toggleStarred = toggleStarred;
        vm.toggleCheck = toggleCheck;

        //////////

        // Watch screen size to activate responsive read pane
        $scope.$watch(function ()
        {
            return $mdMedia('gt-md');
        }, function (current)
        {
            vm.responsiveReadPane = !current;
        });

        // Watch screen size to activate dynamic height on tabs
        $scope.$watch(function ()
        {
            return $mdMedia('xs');
        }, function (current)
        {
            vm.dynamicHeight = current;
        });

        /**
         * Select product
         *
         * @param product
         */
        function selectPayment(payment)
        {
            vm.selectedPayment = payment;
            $scope.loadInvoiceByCustomerId(payment.guCustomerID);

            $timeout(function ()
            {
                vm.activeInvoicePaneIndex = 1;

                // Store the current scrollPos
                vm.scrollPos = vm.scrollEl.scrollTop();

                // Scroll to the top
                vm.scrollEl.scrollTop(0);
            });
        }

        /**
         * Close read pane
         */
        function closeReadPane()
        {
            vm.activeInvoicePaneIndex = 0;

            $timeout(function ()
            {
                vm.scrollEl.scrollTop(vm.scrollPos);
            }, 650);
        }

        /**
         * Toggle starred
         *
         * @param mail
         * @param event
         */
        function toggleStarred(mail, event)
        {
            event.stopPropagation();
            mail.starred = !mail.starred;
        }

        /**
         * Toggle checked status of the mail
         *
         * @param invoice
         * @param event
         */
        function toggleCheck(invoice, event)
        {
            if ( event )
            {
                event.stopPropagation();
            }

            var idx = vm.checked.indexOf(invoice);

            if ( idx > -1 )
            {
                vm.checked.splice(idx, 1);
            }
            else
            {
                vm.checked.push(invoice);
            }
        }

        /**
         * Return checked status of the invoice
         *
         * @param invoice
         * @returns {boolean}
         */
        function isChecked(invoice)
        {
            return vm.checked.indexOf(invoice) > -1;
        }

        /**
         * Check all
         */
        function checkAll()
        {
            if ( vm.allChecked )
            {
                vm.checked = [];
                vm.allChecked = false;
            }
            else
            {
                angular.forEach(vm.payments, function (invoice)
                {
                    if ( !isChecked(invoice) )
                    {
                        toggleCheck(invoice);
                    }
                });

                vm.allChecked = true;
            }
        }

        /**
         * Open compose dialog
         *
         * @param ev
         */
        function addPaymentDialog(ev)
        {
            $mdDialog.show({
                controller         : 'AddPaymentController',
                controllerAs       : 'vm',
                locals             : {
                    selectedMail: undefined
                },
                templateUrl        : 'app/main/payment/dialogs/compose/compose-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : ev,
                clickOutsideToClose: true
            });
        }

        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }

        /**
         * Toggle innerview
         *
         */

        function toggleinnerView(){
            if(vm.appInnerState === "default"){
                vm.appInnerState = "add";
                vm.pageTitle="View Payments";
            }else{
                vm.appInnerState = "default";
                vm.pageTitle="Create New";
            }
        }


      $scope.items = [];
      $scope.profilelist = [];
      $scope.productlist = [];
      $scope.storeslist = [];
      $scope.invoicelist = [];
      $scope.currencyratelist = [];
      $scope.BaseCurrency = "LKR";
      $scope.currencyRate = 1;

      $charge.commondata().getDuobaseFieldDetailsByTableNameAndFieldName("CTS_GeneralAttributes","BaseCurrency").success(function(data) {
        $scope.BaseCurrency=data[0].RecordFieldData;
        console.log($scope.BaseCurrency);
      }).error(function(data) {
        console.log(data);
      })

      $scope.selectedCurrency = $scope.BaseCurrency;

      $scope.prefferedCurrencies=[];
      $charge.commondata().getDuobaseFieldDetailsByTableNameAndFieldName("CTS_GeneralAttributes","FrequentCurrencies").success(function(data) {
        $scope.prefferedCurrencies=data[0].RecordFieldData.trimLeft().split(" ");
      }).error(function(data) {
        console.log(data);
      })

      $scope.isLoading = true;
      $scope.isdataavailable=true;
      var editfalse = true;
      $scope.editOff = editfalse;

      var skip=0;
      var take=100;
      $scope.loading = true;

      $scope.more = function(){

        $scope.isLoading = true;
        $charge.payment().all(skip,take,'desc').success(function(data)
        {
          console.log(data);

          if($scope.loading)
          {
            skip += take;
            for (var i = 0; i < data.length; i++) {
              //console.log(moment(data[i].paymentDate).format('LL'));
              data[i].paymentDate=moment(data[i].paymentDate).format('L');
              //debugger;
              var insertedCurrency=data[i].currency;
              var insertedrate=1;
              if(data[i].rate!=null||data[i].rate!=""||data[i].rate!=undefined)
              {
                insertedrate=parseFloat(data[i].rate);
              }

              if(insertedCurrency!=$scope.BaseCurrency)
              {
                data[i].amount=Math.round((parseFloat(data[i].amount)*insertedrate)*100)/100;
                if(data[i].bankCharges!=null||data[i].bankCharges!=""||data[i].bankCharges!=undefined)
                {
                  data[i].bankCharges=Math.round((parseFloat(data[i].bankCharges)*insertedrate)*100)/100;
                }
                $scope.items.push(data[i]);
              }
              else
              {
                $scope.items.push(data[i]);
              }

              //$scope.items.push(data[i]);  payment service Version - 6.1.0.5

            }
            vm.payments=$scope.items;

            $scope.loading = false;
            $scope.isLoading = false;
            $scope.isdataavailable=true;
            if(data.length<take){
              $scope.isdataavailable=false;
            }
          }

        }).error(function(data)
        {
          console.log(data);
          $scope.isSpinnerShown=false;
          $scope.isdataavailable=false;
          $scope.isLoading = false;
        })

      };
      // we call the function twice to populate the list
      $scope.more();

      $charge.commondata().getDuobaseFieldDetailsByTableNameAndFieldName("CTS_CompanyAttributes","CompanyLogo").success(function(data)
      {
        //debugger;
        console.log(data);
        $scope.logourl=data[0].RecordFieldData;

      }).error(function(data) {
        console.log(data);
      })

      $scope.searchmorebuttonclick = function (){
        $scope.loading = true;
        $scope.more();
      }

      $scope.editlistitem = function (item) {

        $scope.editOff = true;
        //debugger;
        $scope.DivClassName = 'flex-40';

        for (var i = 0; i < $scope.items.length; i++) {
          $scope.items[i].select = false;
        }

        $scope.viewCount = 1;
        item.select = true;
        item.companylogo=$scope.logourl;
        //$scope.items[i].select = true;

        if ($scope.viewCount == 0) {
          $("#ajdDetails").removeClass('selected-row');

        } else {
          document.getElementById("ajdDetails").classList.add("selected-row");
        }

        $scope.selectedprofile = item;

        $scope.loadInvoiceByCustomerId(item.guCustomerID);
        //$scope.getcompanylogo();

        //angular.element('#viewAllWhiteframe').css('margin', '0');
        //angular.element('#viewAllWhiteframe').css('max-width', '750px');

      }

      $scope.editOff = true;

      $scope.loadInvoiceByCustomerId = function (customerId)
      {
        //debugger;
        $scope.invoicePrintlist=[];

        var cusId=customerId;
        //console.log(cusId);
        $charge.invoice().getByAccountID(cusId).success(function(data) //all(0,10,'asc').success(function(data)
        {
          console.log(data);

          var totbalance=0;
          for (var i = 0; i < data.length; i++) {
            var obj=data[i];
            var balance= parseInt(obj.invoiceAmount)-parseInt(obj.paidAmount);
            totbalance+=balance;
            data[i].balancepayment=balance;
          }
          data[0].totalbalance=totbalance;

          $scope.invoicePrintlist=data;

        }).error(function(data)
        {
          console.log(data);
          $scope.invoicePrintlist=[];
        })
      }

      $scope.getcompanylogo = function ()
      {
        $charge.commondata().getDuobaseFieldDetailsByTableNameAndFieldName("CTS_CompanyAttributes","CompanyLogo").success(function(data)
        {
          //debugger;
          console.log(data);
          $scope.logourl=data[0].RecordFieldData;

        }).error(function(data) {
          console.log(data);
        })
      }

      $scope.toggleEdit = function () {
        if($scope.editOff==true)
        {
          $scope.editOff = false;
        }
        else
        {
          $scope.editOff = true;
        }

      }

      $scope.closeApplication = function () {
        window.parent.dwShellController.closeCustomApp();
      };

      $scope.cancelorder = function (editedprofile) {

        $charge.payment().cancel(editedprofile.paymentNo).success(function(data){
          console.log(data);

          $mdToast.show({
            template: '<md-toast class="md-toast-success" >Payment has been cancelled!</md-toast>',
            hideDelay: 2000,
            position: 'bottom right'
          });

        }).error(function(data){
          console.log(data);
          $mdToast.show({
            template: '<md-toast class="md-toast-success" >Payment cancel failed!</md-toast>',
            hideDelay: 2000,
            position: 'bottom right'
          });
        })

      }

      $scope.printDiv = function(divName) {
        var printContents = document.getElementById(divName).innerHTML;
        var popupWin = window.open('', '_blank', 'width=1800,height=700');
        popupWin.document.open();
        popupWin.document.write('<html><head><link href="app/main/payment/views/read/read-view.scss" rel="stylesheet" type="text/css"></head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();
      }


      //------------------------Add page js--------------------------

      var self = this;
      // list of `state` value/display objects
      //self.tenants        = loadAll();
      self.selectedItem  = null;
      self.searchText    = null;
      self.querySearch   = querySearch;
      // ******************************
      // Internal methods
      // ******************************
      /**
       * Search for tenants... use $timeout to simulate
       * remote dataservice call.
       */

      function querySearch (query) {

        //Custom Filter
        var results=[];
        var len=0;
        for (var i = 0,len = $scope.profilelist.length; i<len; ++i){
          //console.log($scope.allBanks[i].value.value);

          if($scope.profilelist[i].value.profilename.toLowerCase().indexOf(query.toLowerCase()) !=-1)
          {
            results.push($scope.profilelist[i]);
          }
          else if($scope.profilelist[i].value.othername.toLowerCase().indexOf(query.toLowerCase()) !=-1)
          {
            results.push($scope.profilelist[i]);
          }
        }
        return results;
      }
      $scope.profilelist = [];

      var skipprofiles=0;
      var takeprofiles=100;

      function loadAll() {

        $charge.profile().all(skipprofiles,takeprofiles,'asc').success(function(data){
          console.log(data);
          skipprofiles+=takeprofiles;
          for (var i = 0; i < data.length; i++) {
            var obj=data[i];

            if(obj.profile_type=='Business')
            {
              $scope.profilelist.push({
                display : obj.business_name,
                value : {profilename : obj.business_name.toLowerCase(), profileId : obj.profileId, othername : obj.business_contact_name, profile_type : obj.profile_type}
              });
            }
            else if(obj.profile_type=='Individual')
            {
              $scope.profilelist.push({
                display : obj.first_name,
                value : {profilename : obj.first_name.toLowerCase(), profileId : obj.profileId, othername : obj.last_name, profile_type : obj.profile_type}
              });
            }

          }
          loadAll();

          //for (i = 0, len = data.length; i<len; ++i){
          //    $scope.allBanks.push ({display: data[i].BankName, value:{TenantID:data[i].TenantID, value:data[i].BankName.toLowerCase()}});
          //}

        }).error(function(data){
          //alert ("Error getting all banks");
        });

      }
      loadAll();

      //$scope.today=new Date().toDateString();
      $scope.today=new Date();
      $scope.content={};
      //$scope.content.paymentDate=moment(new Date().toISOString()).format('LL');
      $scope.content.paymentDate=new Date();
      $scope.customer_supplier={};

      $scope.clearform = function (){
        //$scope.editForm.$setPristine();
        //$scope.editForm.$setUntouched();
		 $scope.submitted=false;
        $scope.customer_supplier.customer="";
        //$scope.content.paymentDate=moment(new Date().toISOString()).format('LL');
        $scope.content.paymentDate=new Date();
        $scope.content.paymentMethod="";
        $scope.content.chequeNo="";
        $scope.content.amount="";
        $scope.content.bankCharges="";
        $scope.content.note="";
        $scope.content.prefferedcurrency="";
        self.searchText    = null;
        $scope.invoicelist=[];
        $scope.content.preferredcurrency="";
        $scope.selectedCurrency=$scope.BaseCurrency;
        $scope.currencyRate=1;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }

      $scope.refreshpage = function(){
        $scope.items = [];
        skip=0;
        $scope.loading = true;
        $scope.more();
      }


      $scope.submit = function () {
        //if ($scope.editForm.$valid == true) {
          //debugger;
          console.log("form validated");
		   $scope.submitted=true;
          var productitems=[];

          var currentdate=new Date;
          currentdate=currentdate.toDateString();

          var selecteduser=$scope.customer_supplier.customer;

          $scope.content.customer=selecteduser.value.profilename;
          $scope.content.guCustomerID=selecteduser.value.profileId;
          $scope.content.guTranID="11";
          $scope.content.createdUser="admin";
          $scope.content.createdDate = currentdate;
          $scope.content.guAccountID = selecteduser.value.profileId;
          $scope.content.currency=$scope.selectedCurrency;
          $scope.content.rate=$scope.currencyRate;
          if($scope.BaseCurrency!=$scope.selectedCurrency)
          {
            if($scope.content.amount!="")
            {
              $scope.content.amount=parseFloat($scope.content.amount)/$scope.currencyRate;
              $scope.content.amount=Math.round($scope.content.amount*100)/100;
            }
            if($scope.content.bankCharges!="")
            {
              $scope.content.bankCharges=parseFloat($scope.content.bankCharges)/$scope.currencyRate;
              $scope.content.bankCharges=Math.round($scope.content.bankCharges*100)/100;
            }
          }

          var paymentobject = $scope.content;
          console.log(paymentobject);
          $charge.payment().store(paymentobject).success(function(data){
            console.log(data);
            if(data.id!="")
            {
              notifications.toast("Successfully created the Payment Invoice with : "+data.id,"success");
              //$mdToast.show({
              //	template: '<md-toast class="md-toast-success" >Successfully created the Payment Invoice with : '+data.id+'</md-toast>',
              //	hideDelay: 2000,
              //	position: 'bottom right'
              //});
            }
            //$mdToast.show({
            //	template: '<md-toast class="md-toast-success" >Successfully added to Inventory!</md-toast>',
            //	hideDelay: 2000,
            //	position: 'bottom right'
            //});
            //var millisecondsToWait = 500;
            //setTimeout(function() {
            //    $window.location.reload();
            //}, millisecondsToWait);
            $scope.clearform();
            $scope.refreshpage();
            //$window.location.href='#/paymentlist';

          }).error(function(data){
            //debugger;
            console.log(data);
          })

        //} else//This is done because the HTML simple validation might work and enter the submit, however the form can still be invalid
        //{
        //  $mdToast.show({
        //    template: '<md-toast class="md-toast-error" >Please fill all the details- Payment method is empty!</md-toast>',
        //    hideDelay: 2000,
        //    position: 'bottom right'
        //  });
        //}

        //$scope.submitted = true; // Disable the submit button until the form is submitted successfully to the database (ng-disabled)

        //submit info to database

        /*
         ---if submit request is successful---
         self.searchText = "";
         $scope.submitted = false; // Make submit button enabled again (ng-disabled)
         $scope.template = ""; // Empty the form
         $scope.editForm.$setUntouched();
         $scope.editForm.$setPristine();
         */

      }

      $scope.returntolist = function ()
      {
        $window.location.href='#/paymentlist';
      }

      $scope.loadInvoice = function (customer)
      {
        //debugger;
        var invoicenolist="";
        var cusId=customer.value.profileId;//"2293";
        //console.log(cusId);
        $charge.invoice().getByAccountID(cusId).success(function(data) //all(0,10,'asc').success(function(data)
        {
          console.log(data);

          var totbalance=0;
          for (var i = 0; i < data.length; i++) {
            var obj=data[i];
            obj.invoiceAmount=parseFloat(obj.invoiceAmount)*$scope.currencyRate;
            obj.paidAmount=parseFloat(obj.paidAmount)*$scope.currencyRate;
            var balance= obj.invoiceAmount-obj.paidAmount;
            totbalance+=balance;
            data[i].balancepayment=balance;

            if(i==0)
            {
              invoicenolist=obj.invoiceNo;
            }
            else
            {
              invoicenolist=invoicenolist+","+obj.invoiceNo;
            }
          }
          data[0].totalbalance=totbalance;

          console.log(invoicenolist);
          $charge.adjustment().getByInvoiceId(invoicenolist).success(function(subdata)
          {
            console.log(subdata);
            for (var i = 0; i < data.length; i++) {
              var invoicedata=data[i];
              invoicedata.adjustmenttype='0';

              for (var j = 0; j < subdata.length; j++) {
                if(subdata[j].invoiceid==invoicedata.invoiceNo)
                {
                  //if(subdata[j].adjustmenttype==1)
                  //{
                  //    invoicedata.invoiceAdjustment="+"+subdata[j].amount;
                  //}
                  //else
                  //{
                  //    invoicedata.invoiceAdjustment="-"+subdata[j].amount;
                  //}
                  invoicedata.invoiceAdjustment=subdata[j].amount*$scope.currencyRate;
                  invoicedata.adjustmenttype=subdata[j].adjustmenttype;
                  if(subdata[j].adjustmenttype==1)
                  {
                    invoicedata.balancepayment=invoicedata.balancepayment-invoicedata.invoiceAdjustment;
                    data[0].totalbalance=data[0].totalbalance-invoicedata.invoiceAdjustment;
                  }
                  else if(subdata[j].adjustmenttype==2)
                  {
                    invoicedata.balancepayment=invoicedata.balancepayment+invoicedata.invoiceAdjustment;
                    data[0].totalbalance=data[0].totalbalance+invoicedata.invoiceAdjustment;
                  }
                }
              }

            }
            $scope.invoicelist=data;

          }).error(function(subdata)
          {
            console.log(subdata);
            $scope.invoicelist=data;
          })

          //$scope.invoicelist=data;

        }).error(function(data)
        {
          console.log(data);
          $scope.invoicelist=[];
        })
      }

      $scope.receiptcount = 1;
      $scope.issuecount = 1;
      $scope.receiplist=[
        {
          modelname : 'receiptproduct1',
          quantityname : 'receiptquantity1'
        }
      ];
      $scope.issuelist=[
        {
          modelname : 'issueproduct1',
          quantityname : 'issuequantity1'
        }
      ];

      //direct back to shell
      $scope.closeApplication = function () {
        window.parent.dwShellController.closeCustomApp();
      };

      $scope.convertCurrency = function(preferredCurrency)
      {
        debugger;
        if($scope.BaseCurrency==preferredCurrency)
        {
          $scope.selectedCurrency = $scope.BaseCurrency;
          $scope.currencyRate = 1;

          $scope.currencyratelist.push({
            currency : $scope.BaseCurrency,
            rate : $scope.currencyRate
          });

          if($scope.currencyratelist.length>1)
          {
            if($scope.content.amount!="")
            {
              $scope.content.amount=(parseFloat($scope.content.amount)/parseFloat($scope.currencyratelist[$scope.currencyratelist.length - 2].rate))*$scope.currencyRate;
              $scope.content.amount=Math.round($scope.content.amount*100)/100;
            }
            if($scope.content.bankCharges!="")
            {
              $scope.content.bankCharges=(parseFloat($scope.content.bankCharges)/parseFloat($scope.currencyratelist[$scope.currencyratelist.length - 2].rate))*$scope.currencyRate;
              $scope.content.bankCharges=Math.round($scope.content.bankCharges*100)/100;
            }
          }
          else if($scope.currencyratelist.length==1)
          {
            if($scope.content.amount!="")
            {
              $scope.content.amount=parseFloat($scope.content.amount)*$scope.currencyRate;
              $scope.content.amount=Math.round($scope.content.amount*100)/100;
            }
            if($scope.content.bankCharges!="")
            {
              $scope.content.bankCharges=parseFloat($scope.content.bankCharges)*$scope.currencyRate;
              $scope.content.bankCharges=Math.round($scope.content.bankCharges*100)/100;
            }
          }

          if($scope.customer_supplier.customer != null || $scope.customer_supplier.customer != "")
          {
            $scope.loadInvoice($scope.customer_supplier.customer);
          }
        }
        else
        {
          $charge.currency().calcCurrency($scope.BaseCurrency+"_"+preferredCurrency).success(function(data)
          {
            //debugger;
            //var el = document.createElement( 'html' );
            //el.innerHTML = data;
            //
            //var element=el.getElementsByTagName( 'span' );
            //var results=element[0].innerHTML.split(" ");
            var param=$scope.BaseCurrency+"_"+preferredCurrency;
            var results=data.results;
            var result = results[param];

            $scope.currencyratelist.push({
              currency : preferredCurrency,
              rate : result.val
            });
            console.log($scope.currencyratelist);

            $scope.selectedCurrency = preferredCurrency;
            $scope.currencyRate = parseFloat(result.val);

            if($scope.currencyratelist.length>1)
            {
              if($scope.content.amount!="")
              {
                $scope.content.amount=(parseFloat($scope.content.amount)/parseFloat($scope.currencyratelist[$scope.currencyratelist.length - 2].rate))*$scope.currencyRate;
                $scope.content.amount=Math.round($scope.content.amount*100)/100;
              }
              if($scope.content.bankCharges!="")
              {
                $scope.content.bankCharges=(parseFloat($scope.content.bankCharges)/parseFloat($scope.currencyratelist[$scope.currencyratelist.length - 2].rate))*$scope.currencyRate;
                $scope.content.bankCharges=Math.round($scope.content.bankCharges*100)/100;
              }
            }
            else if($scope.currencyratelist.length==1)
            {
              if($scope.content.amount!="")
              {
                $scope.content.amount=parseFloat($scope.content.amount)*$scope.currencyRate;
                $scope.content.amount=Math.round($scope.content.amount*100)/100;
              }
              if($scope.content.bankCharges!="")
              {
                $scope.content.bankCharges=parseFloat($scope.content.bankCharges)*$scope.currencyRate;
                $scope.content.bankCharges=Math.round($scope.content.bankCharges*100)/100;
              }
            }

            if($scope.customer_supplier.customer != null || $scope.customer_supplier.customer != "")
            {
              $scope.loadInvoice($scope.customer_supplier.customer);
            }

          }).error(function(data)
          {
            console.log(data);
          })

        }

      }



      //-------------------------old code----------------------------
      //invoice list ctrl functions

      //var skip=0;
      //var take=1000;
      //var invoicePrefix="";
      //var prefixLength=0;
      //$scope.invoices=[];
      //$scope.users=[];
      //
      ////this function fetches a random text and adds it to array
      //$scope.more = function(){
      //  //debugger;
      //  //$scope.spinnerInvoice=true;
      //  $charge.invoice().all(skip,take,"desc").success(function(data) {
      //    //debugger;
      //    if(data.length<=take)
      //      $scope.lastSet=true;
      //      data.forEach(function(inv){
      //        //debugger;
      //        var accountID=inv.guAccountID;
      //        var invoiceDate=moment(inv.invoiceDate).format('LL');
      //        //debugger;
      //
      //        var user = $scope.getUserByID(accountID);
      //        //debugger;
      //        //while(user != undefined)
      //        //{
      //        //debugger;
      //        var invoice={};
      //        //debugger;
      //        if(user!=null) {
      //          invoice.person_name = user.profilename;
      //          invoice.othername=user.othername;
      //          invoice.email=user.email;
      //        }
      //        //debugger;
      //        invoice.invoice_type = inv.invoiceType;
      //
      //        invoice.code=inv.invoiceNo;
      //        invoice.invoiceAmount=inv.invoiceAmount;
      //        invoice.currency=inv.currency;
      //        invoice.invoiceDate=invoiceDate;
      //        if(inv.paidAmount==0)
      //          invoice.status='Not paid';
      //        else if(inv.paidAmount>0 && inv.paidAmount<inv.invoiceAmount)
      //          invoice.status='Partial Paid';
      //        else if(inv.paidAmount==inv.invoiceAmount)
      //          invoice.status='Paid';
      //        //invoice.status='Paid';
      //        invoice.select=false;
      //        $scope.invoices.push(invoice);
      //        // break;
      //        // }
      //
      //      });
      //
      //      //debugger;
      //      for (var i = 0; i < $scope.invoices.length; i++) {
      //        //debugger;
      //        if ($scope.invoices[i].status == "Paid") {
      //          $scope.invoices[i].StatusColor = "green";
      //        } else if ($scope.invoices[i].status == "Partial Paid") {
      //          $scope.invoices[i].StatusColor = "skyblue";
      //        }
      //        else if ($scope.invoices[i].status == "Not paid") {
      //          $scope.invoices[i].StatusColor = "orange";
      //        }
      //        else if ($scope.invoices[i].status == "Void") {
      //          $scope.invoices[i].StatusColor = "red";
      //        }
      //
      //      }
      //    vm.invoices=$scope.invoices;
      //    vm.selectedInvoice = vm.invoices[0];
      //      //debugger;
      //      //skip += take;
      //  }).error(function(data) {
      //    //debugger;
      //    $scope.lastSet=true;
      //  })
      //};
      //
      //
      //$charge.commondata().getDuobaseFieldDetailsByTableNameAndFieldName("CTS_InvoiceAttributes","InvoicePrefix").success(function(data) {
      //  invoicePrefix=data[0];
      //  //debugger;
      //}).error(function(data) {
      //  console.log(data);
      //})
      //
      //$charge.commondata().getDuobaseFieldDetailsByTableNameAndFieldName("CTS_InvoiceAttributes","PrefixLength").success(function(data) {
      //  prefixLength=data[0];
      //}).error(function(data) {
      //  console.log(data);
      //})
      //
      //
      //
      //
      //$scope.loadmore = function(take){
      //  debugger;
      //  $scope.spinnerInvoice=true;
      //  $charge.invoice().all(skip,take,"desc").success(function(data) {
      //    //debugger;
      //    if(data.length<take)
      //      $scope.lastSet=true;
      //    data.forEach(function(inv){
      //      //debugger;
      //      var accountID=inv.guAccountID;
      //      var invoiceDate=moment(inv.invoiceDate).format('LL');
      //      //debugger;
      //
      //      var user = $scope.getUserByID(accountID);
      //      var invoice={};
      //      if(user!=null) {
      //        invoice.person_name = user.profilename;
      //        invoice.othername=user.othername;
      //      }
      //      invoice.invoice_type = inv.invoiceType;
      //
      //      invoice.code=inv.invoiceNo;
      //      invoice.invoiceDate=invoiceDate;
      //      if(inv.paidAmount==0)
      //        invoice.status='Not paid';
      //      else if(inv.paidAmount>0 && inv.paidAmount<inv.invoiceAmount)
      //        invoice.status='Partial Paid';
      //      else if(inv.paidAmount==inv.invoiceAmount)
      //        invoice.status='Paid';
      //      //invoice.status='Paid';
      //      $scope.invoices.push(invoice);
      //
      //    });
      //    for (var i = 0; i < $scope.invoices.length; ++i) {
      //      if ($scope.invoices[i].status == "Paid") {
      //        $scope.invoices[i].StatusColor = "green";
      //      } else if ($scope.invoices[i].status == "Partial Paid") {
      //        $scope.invoices[i].StatusColor = "skyblue";
      //      }
      //      else if ($scope.invoices[i].status == "Not paid") {
      //        $scope.invoices[i].StatusColor = "orange";
      //      }
      //      else if ($scope.invoices[i].status == "Void") {
      //        $scope.invoices[i].StatusColor = "red";
      //      }
      //
      //    }
      //    $scope.spinnerInvoice=false;
      //    skip += take;
      //
      //  }).error(function(data) {
      //    //response=data;
      //    //debugger;
      //    var da=$scope.invoices;
      //    $scope.lastSet=true;
      //    $scope.spinnerInvoice=false;
      //  })
      //};
      //var skipUsr= 0,takeUsr=1000;
      //$scope.loadingUsers = true;
      //$scope.loadUsers = function(){
      //
      //  $charge.profile().all(skipUsr,takeUsr,'asc').success(function(data)
      //  {
      //    console.log(data);
      //    if($scope.loadingUsers)
      //    {
      //      for (var i = 0; i < data.length; i++) {
      //        var obj = data[i];
      //        if(obj.profile_type=='Individual')
      //        {
      //          $scope.users.push({
      //            profilename : obj.first_name,
      //            profileId : obj.profileId,
      //            othername : obj.last_name,
      //            profile_type : obj.profile_type,
      //            bill_addr:obj.bill_addr,
      //            category:obj.category,
      //            email:obj.email_addr
      //          });
      //        }
      //        else if(obj.profile_type=='Business') {
      //          $scope.users.push({
      //            profilename : obj.business_name,
      //            profileId : obj.profileId,
      //            othername : obj.business_contact_name,
      //            profile_type : obj.profile_type,
      //            bill_addr:obj.bill_addr,
      //            category:obj.category,
      //            email:obj.email_addr
      //
      //          });
      //        }
      //
      //      }
      //
      //      skipUsr += takeUsr;
      //      $scope.loadUsers();
      //    }
      //
      //  }).error(function(data)
      //  {
      //    //console.log(data);
      //    $scope.isSpinnerShown=false;
      //    $scope.more();
      //  })
      //
      //};
      //$scope.loadUsers();
      ////$scope.more();
      //
      //$scope.editOff = true;
      //$scope.openInvoiceLst = function(invoice)
      //{
      //  //debugger;
      //  //all event false
      //  $scope.spinnerInvoice=true;
      //
      //  $charge.invoice().getByID(invoice.code).success(function(data) {
      //
      //    //debugger;
      //    console.log(data);
      //    $scope.invProducts=[];
      //    var invoiceDetails=data[0].invoiceDetails;
      //    var count=invoiceDetails.length;
      //    var productName;
      //    var status=false;
      //
      //    //var address = $scope.GetAddress(invoice.person_name);
      //    var address = $filter('filter')($scope.users, { profilename: invoice.person_name })[0];
      //    //$scope.prefix=prefixLength!=0? parseInt(prefixLength.RecordFieldData):0;
      //    var prefixInvoice=invoicePrefix!=""?invoicePrefix.RecordFieldData:"";
      //
      //    var exchangeRate=parseFloat(data[0].rate);
      //    $scope.selectedInvoice={};
      //    $scope.selectedInvoice = invoice;
      //    $scope.selectedInvoice.prefix=prefixLength!=0? parseInt(prefixLength.RecordFieldData):0;
      //    $scope.selectedInvoice.bill_addr = address.bill_addr;
      //    $scope.selectedInvoice.subTotal=angular.copy(data[0].subTotal*exchangeRate);
      //    $scope.selectedInvoice.discAmt=data[0].discAmt*exchangeRate;
      //    $scope.selectedInvoice.invoiceNo=prefixInvoice;
      //    //$scope.selectedInvoice.code=parseFloat($scope.selectedInvoice.code);
      //    //debugger;
      //    $scope.selectedInvoice.additionalcharge=data[0].additionalcharge*exchangeRate;
      //    $scope.selectedInvoice.invoiceAmount=data[0].invoiceAmount*exchangeRate;
      //    $scope.selectedInvoice.tax=data[0].tax*exchangeRate;
      //    $scope.selectedInvoice.dueDate=moment(data[0].dueDate.toString()).format('LL');
      //    $scope.selectedInvoice.logo=$rootScope.companyLogo;
      //    $scope.selectedInvoice.currency=data[0].currency;
      //    $scope.selectedInvoice.rate=exchangeRate;
      //
      //    //debugger;
      //    invoiceDetails.forEach(function(inv){
      //      //debugger;
      //      //productName=$scope.getProductByID(inv.guItemID);
      //      var currentProduct = $filter('filter')($scope.invProductList, { productId: inv.guItemID })[0];
      //      $scope.invProducts.push({
      //        product_name: currentProduct.product_name,
      //        unitprice: inv.unitPrice*exchangeRate,
      //        qty: inv.gty,
      //        amount: inv.totalPrice*exchangeRate
      //      });
      //    });
      //    //debugger;
      //
      //
      //    $scope.viewCount=1;
      //    //console.log($scope.selectedInvoice);
      //    $scope.spinnerInvoice=false;
      //
      //  }).error(function(data)
      //  {
      //    console.log(data);
      //    $scope.spinnerInvoice=false;
      //
      //  });
      //}
      //
      //$scope.toggleEdit = function () {
      //  if($scope.editOff==true)
      //  {
      //    $scope.editOff = false;
      //  }
      //  else
      //  {
      //    $scope.editOff = true;
      //  }
      //
      //}
      //
      //$scope.loadAllProducts=function()
      //{
      //  //debugger;
      //  $scope.spinnerInvoice=true;
      //  var product=$productHandler.getClient().LoadProduct().onComplete(function(data)
      //  {
      //    $scope.invProductList=data;
      //    //$scope.spinnerInvoice=false;
      //  });
      //
      //}
      //
      //$scope.loadAllProducts();
      //
      //$scope.getUserByID=function(id)
      //{
      //  //debugger;
      //  var users=$scope.users;
      //  var profileID=id;
      //  var currentUser={};
      //  var mapUservar = $filter('filter')(users, { profileId: profileID })[0];
      //  return mapUservar;
      //}
      //
      //
      //$scope.getProductByID=function(id)
      //{
      //  //debugger;
      //  var count=0;
      //  var isAvailable=false;
      //  var products=$scope.invProductList;
      //  var productID=id;
      //  var productName;
      //  var currentUser={};
      //  //for (var i = 0; i < products.length; i++) {
      //  //    var obj = products[i];
      //  //    if(obj.productId==productID) {
      //  //        productName=obj.product_name;
      //  //    }
      //  //}
      //  //products.forEach(function(product){
      //  //    if(product.productId==productID) {
      //  //        productName=product.product_name;
      //  //    }
      //  //});
      //  var productName = products.map(function(product){
      //    if(product.productId==productID) {
      //      isAvailable=true;
      //      //debugger;
      //      return product;
      //    }
      //    if(!isAvailable)
      //      count++;
      //
      //  });
      //  //debugger;
      //  return productName[count].product_name;
      //}
      //
      //$scope.GetAddress=function(name)
      //{
      //  //debugger;
      //  var users=$scope.users;
      //  var addr;
      //  var selectedName=name;
      //  for (var i = 0; i < users.length; i++) {
      //    var obj = users[i];
      //    if(obj.profilename==selectedName) {
      //      addr=obj.bill_addr;
      //    }
      //  }
      //  return addr;
      //}
      //
      //$scope.getPromotionByID=function(id)
      //{
      //  for (i = 0; i < $scope.promotions.length; i++) {
      //    if ($scope.promotions[i].promotioncode == promocode) {
      //      isValid = true;
      //      $scope.content.gupromotionid = $scope.promotions[i].gupromotionid;
      //      break;
      //    }
      //  }
      //}
    }
})();
