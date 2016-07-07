(function (angular) {
	var app =angular.module('mainApp', ['ngMaterial', 'ngAnimate', 'ui.router', 'directivelibrary', 'ngMessages', 'ui.ace', 'cloudcharge', 'ngMdIcons', 'jkuri.slimscroll']);

		app.config(function ($stateProvider, $urlRouterProvider) {

			$urlRouterProvider.otherwise('/paymentlist');

			$stateProvider

				// HOME STATES AND NESTED VIEWS ========================================

				.state('main', {
					url: '/main',
					templateUrl: 'partials/main.html'
				})

				.state('main.one', {
					url: '/tabone',
					templateUrl: 'partials/tabone.html',
					controller: 'ViewCtrl'
				})

				.state('add', {
					url: '/add',
					templateUrl: 'partials/add1.html',
					controller: 'AddCtrl as ctrl'
				})

				.state('paymentlist', {
					url: '/paymentlist',
					templateUrl: 'partials/paymentlist1.html',
					controller: 'PaymentListCtrl'
				})

		})


		app.controller('AppCtrl', function ($scope, $mdDialog, $location, $state, $timeout, $q, $http, uiInitilize, $charge) {

            $scope.a={};
            $scope.customer_supplier={};
            $scope.store_details={};

			//this.items = [];
			//var p=1;
			//this.items.push({'productCode': 'iphone6', 'grn': '36544676', 'inventory_type': 'Receipt', 'receivedDate': 'June 15, 1984', 'quantity': '10'});
			//this.items.push({'productCode': 'iphone5s', 'grn': '86744676', 'inventory_type': 'Issue', 'receivedDate': 'June 22, 1989', 'quantity': '24'});
			//this.items.push({'productCode': 'apple watch', 'grn': '3652288', 'inventory_type': 'Issue', 'receivedDate': 'June 18, 1992', 'quantity': '16'});
			//this.items.push({'productCode': 'apple tab', 'grn': '11644672', 'inventory_type': 'Issue', 'receivedDate': 'June 28, 1989', 'quantity': '18'});
			//this.items.push({'productCode': 'hp pc', 'grn': '24444638', 'inventory_type': 'Issue', 'receivedDate': 'June 14, 1988', 'quantity': '45'});
			//this.items.push({'productCode': 'asus laptop', 'grn': '88644624', 'inventory_type': 'Receipt', 'receivedDate': 'June 26, 1984', 'quantity': '52'});
			//for (var i = 0; i < 4; i++) {
            //
			//	this.items.push({'productCode': p, 'grn': '65544625', 'inventory_type': 'Receipt', 'receivedDate': 'June 29, 1985', 'quantity': '46'});
			//	p++;
			//}

            $scope.items = [];
            $scope.profilelist = [];
            $scope.productlist = [];
            $scope.storeslist = [];
            $scope.invoicelist = [];
            //$scope.productlist1=[];
            //$scope.productlist2=[];

            //$charge.invoice().all(0,20,'asc').success(function(data)
            //{
            //    console.log(data);
            //    for (i = 0; i < data.length; i++) {
            //        $scope.invoicelist.push(data[i]);
            //
            //    }
            //
            //}).error(function(data)
            //{
            //    console.log(data);
            //})

            //$charge.profile().all(0,100,'asc').success(function(data){
            //
            //    for (var i = 0; i < data.length; i++) {
            //        var obj=data[i];
            //
            //        if(obj.profile_type=='Business')
            //        {
            //            $scope.profilelist.push({
            //                display : obj.business_name,
            //                value : {profilename : obj.business_name.toLowerCase(), profileId : obj.profileId, othername : obj.business_contact_name, profile_type : obj.profile_type}
            //            });
            //        }
            //        else if(obj.profile_type=='Individual')
            //        {
            //            $scope.profilelist.push({
            //                display : obj.first_name,
            //                value : {profilename : obj.first_name.toLowerCase(), profileId : obj.profileId, othername : obj.last_name, profile_type : obj.profile_type}
            //            });
            //        }
            //
            //    }
            //
            //    //for (i = 0, len = data.length; i<len; ++i){
            //    //    $scope.allBanks.push ({display: data[i].BankName, value:{TenantID:data[i].TenantID, value:data[i].BankName.toLowerCase()}});
            //    //}
            //
            //}).error(function(data){
            //    alert ("Error getting all banks");
            //});

            //$charge.profile().all(0,20,'asc').success(function(data)
            //{
            //    console.log(data);
            //
            //    for (var i = 0; i < data.length; i++) {
            //        var obj=data[i];
            //
            //        if(obj.profile_type=='Business')
            //        {
            //            $scope.profilelist.push({
            //                profilename : obj.business_name,
            //                profileId : obj.profileId,
            //                othername : obj.business_contact_name,
            //                profile_type : obj.profile_type
            //            });
            //        }
            //        else if(obj.profile_type=='Individual')
            //        {
            //            $scope.profilelist.push({
            //                profilename : obj.first_name,
            //                profileId : obj.profileId,
            //                othername : obj.last_name,
            //                profile_type : obj.profile_type
            //            });
            //        }
            //
            //    }
            //
            //}).error(function(data)
            //{
            //    console.log(data);
            //})

			//$scope.items = uiInitilize.insertIndex(this.items);

			//This holds the UI logic for the collapse cards
			$scope.toggles = {};
			$scope.toggleOne = function ($index) {
				$scope.toggles = uiInitilize.openOne(this.items, $index);
			}

			setInterval(function interval() {
				$scope.viewPortHeight = window.innerHeight;
				$scope.viewPortHeight = $scope.viewPortHeight + "px";
			}, 100);


		})//END OF AppCtrl

		.controller('ViewCtrl', function ($scope, $mdDialog, $window, $mdToast) {

			$scope.saveChanges = function (content) {

				delete content.$index;
				console.log(content);

				$mdToast.show({
					template: '<md-toast class="md-toast-success" >Changes saved</md-toast>',
					hideDelay: 2000,
					position: 'bottom right'
				});
			}

		})//END OF AddCtrl

		app.controller('AddCtrl', function ($scope, $mdDialog, $window, $mdToast, $charge, notifications) {

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
                for (i = 0, len = $scope.profilelist.length; i<len; ++i){
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

            $scope.today=new Date().toDateString();
            $scope.content={};
            $scope.content.paymentDate=moment(new Date().toISOString()).format('LL');

            $scope.clearform = function (){
                $scope.editForm.$setPristine();
                $scope.editForm.$setUntouched();
                $scope.customer_supplier.customer="";
                $scope.content.paymentDate=moment(new Date().toISOString()).format('LL');
                $scope.content.paymentMethod="";
                $scope.content.chequeNo="";
                $scope.content.amount="";
                $scope.content.bankCharges="";
                $scope.content.note="";
                self.searchText    = null;
                $scope.invoicelist=[];
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            }


			$scope.submit = function () {
				if ($scope.editForm.$valid == true) {
					//debugger;
					console.log("form validated");
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
                        //$window.location.href='#/paymentlist';

                    }).error(function(data){
                        //debugger;
                        console.log(data);
                    })

				} else//This is done because the HTML simple validation might work and enter the submit, however the form can still be invalid
				{
					$mdToast.show({
						template: '<md-toast class="md-toast-error" >Please fill all the details- Payment method is empty!</md-toast>',
						hideDelay: 2000,
						position: 'bottom right'
					});
				}

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
                    for (i = 0; i < data.length; i++) {
                        var obj=data[i];
                        var balance= parseInt(obj.invoiceAmount)-parseInt(obj.paidAmount);
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
                        for (i = 0; i < data.length; i++) {
                            var invoicedata=data[i];

                            for (j = 0; j < subdata.length; j++) {
                                if(subdata[j].invoiceid==invoicedata.invoiceNo)
                                {
                                    invoicedata.invoiceAdjustment=subdata[j].amount;
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

            $scope.addCardPayment = function(ev, amount)
            {
                //console.log("yes");
                //$scope.content.user = "";
                $scope.cardPayAmount=parseFloat(amount);
                $mdDialog.show({
                    controller: 'CardPaymentCtrl',
                    templateUrl: 'partials/paybycard.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true
                })
                    .then(function(user) {

                    })

            }


		})//END OF AddCtrl

        app.controller('CardPaymentCtrl', function ($scope, $mdDialog, $window, $mdToast, $charge, notifications) {

            //debugger;
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            //$scope.submit = function()
            //{
            //    $scope.contentuser.status="true";
            //    $scope.contentuser.ship_addr=$scope.contentuser.bill_addr;
            //    var userObj = $scope.contentuser;
            //
            //    //debugger;
            //    $charge.profile().store(userObj).success(function(data) {
            //        //debugger;
            //        if(data.id) {
            //            console.log(data);
            //            notifications.toast("Successfully Created User!","success");
            //            $scope.contentuser.profileId=data.id;
            //
            //            $mdDialog.hide($scope.contentuser);
            //        }
            //    }).error(function(data) {
            //        //debugger;
            //        console.log(data);
            //    })
            //
            //    //debugger;
            //}

        })//END OF AddCtrl

		app.controller('PaymentListCtrl', function ($scope, $mdDialog, $window, $mdToast, $charge) {

            $scope.isLoading = true;
            $scope.viewCount = 0;

            $scope.options = {
                scrollbar: false
            };

            $scope.isdataavailable=true;
            var editfalse = true;
            $scope.editOff = editfalse;

            $scope.items=[];
            var skip=0;
            var take=100;
            $scope.loading = true;
            // this function fetches a random text and adds it to array
            $scope.more = function(){

                $scope.isLoading = true;
                $charge.payment().all(skip,take,'desc').success(function(data)
                {
                    console.log(data);

                    if($scope.loading)
                    {
                        skip += take;
                        for (i = 0; i < data.length; i++) {
                            //console.log(moment(data[i].paymentDate).format('LL'));
                            data[i].paymentDate=moment(data[i].paymentDate).format('L');
                            $scope.items.push(data[i]);

                        }
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
                    for (i = 0; i < data.length; i++) {
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
                popupWin.document.write('<html><head><link href="../asset/css/customer.css" rel="stylesheet" type="text/css"></head><body onload="window.print()">' + printContents + '</body></html>');
                popupWin.document.close();
            }


		})//END OF ProfListCtrl

        app.directive("whenScrolled", function(){
            return{

                restrict: 'A',
                link: function(scope, elem, attrs){

                    // we get a list of elements of size 1 and need the first element
                    raw = elem[0];

                    // we load more elements when scrolled past a limit
                    elem.bind("scroll", function(){
                        if(raw.scrollTop+raw.offsetHeight+5 >= raw.scrollHeight){
                            scope.loading = true;

                            // we can give any function which loads more elements into the list
                            scope.$apply(attrs.whenScrolled);
                        }
                    });
                }
            }
        });

	//function AddProductCtrl($scope, $mdDialog, $window, $mdToast,bootstrap3ElementModifier) {
	//	debugger;
	//	$scope.submit = function () {
	//		bootstrap3ElementModifier.enableValidationStateIcons(true);
	//		debugger;
	//		if ($scope.editForm.$valid == true) {
	//			debugger;
	//			console.log($scope.content);
	//		} else//This is done because the HTML simple validation might work and enter the submit, however the form can still be invalid
	//		{
	//			//$mdToast.show({
	//			//	template: '<md-toast class="md-toast-error" >Please fill all the details</md-toast>',
	//			//	hideDelay: 2000,
	//			//	position: 'bottom right'
	//			//});
	//		}
	//	}
	//}
    //
	//AddProductCtrl.$inject = [
	//	'bootstrap3ElementModifier'
	//];
    //
	//app.controller('AddCtrl', AddProductCtrl);
    //chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security

}(angular));



