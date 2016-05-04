(function (angular) {
	var app =angular.module('mainApp', ['ngMaterial', 'ngAnimate', 'ui.router', 'directivelibrary', 'ngMessages', 'ui.ace', 'cloudcharge', 'ngMdIcons']);

		app.config(function ($stateProvider, $urlRouterProvider) {

			$urlRouterProvider.otherwise('/inventorylist');

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
					templateUrl: 'partials/add.html',
					controller: 'AddCtrl'
				})

				.state('inventorylist', {
					url: '/inventorylist',
					templateUrl: 'partials/inventorylist.html',
					controller: 'InventoryListCtrl'
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
            //$scope.productlist1=[];
            //$scope.productlist2=[];

            //$charge.inventory().allheaders(0,5,'asc').success(function(data)
            //{
				//console.log(data);
				//for (var i = 0; i < data.length; i++) {
				//	var obj=data[i];
            //
            //        $scope.items.push({
            //            gUGRNID : obj.gUGRNID,
            //            grnNo : obj.grnNo,
            //            gUAODID : "1234",
            //            aodNo : "1234",
            //            supplier : obj.supplier,
            //            customer : "abcd",
            //            receivedDate : obj.receivedDate,
            //            receivedStore : obj.receivedStore,
            //            issuedDate : "12/12/16",
            //            issuedStore : "abcd",
            //            createdDate : obj.createdDate,
            //            guTranID : obj.guTranID,
            //            status : obj.status,
            //            inventory_type : "Receipt"
            //        });
				//}
            //
            //}).error(function(data)
            //{
				//console.log(data);
            //})
            //
            //$charge.aod().allheaders(0,5,'asc').success(function(data)
            //{
            //    console.log(data);
            //    for (var i = 0; i < data.length; i++) {
            //        var obj=data[i];
            //
            //        $scope.items.push({
            //            gUAODID : obj.gUAODID,
            //            aodNo : obj.aodNo,
            //            gUGRNID : "1234",
            //            grnNo : "1234",
            //            supplier : "abcd",
            //            customer : obj.customer,
            //            receivedDate : "12/12/16",
            //            receivedStore : "abcd",
            //            issuedDate : obj.issuedDate,
            //            issuedStore : obj.issuedStore,
            //            createdDate : obj.createdDate,
            //            guTranID : obj.guTranID,
            //            status : obj.status,
            //            inventory_type : "Issue"
            //        });
            //    }
            //
            //}).error(function(data)
            //{
            //    console.log(data);
            //})

            $charge.profile().all(0,20,'asc').success(function(data)
            {
                console.log(data);

                for (var i = 0; i < data.length; i++) {
                    var obj=data[i];

                    if(obj.profile_type=='Business')
                    {
                        $scope.profilelist.push({
                            profilename : obj.business_name,
                            profileId : obj.profileId,
                            othername : obj.business_contact_name,
                            profile_type : obj.profile_type
                        });
                    }
                    else if(obj.profile_type=='Individual')
                    {
                        $scope.profilelist.push({
                            profilename : obj.first_name,
                            profileId : obj.profileId,
                            othername : obj.last_name,
                            profile_type : obj.profile_type
                        });
                    }

                }

            }).error(function(data)
            {
                console.log(data);
            })

            $charge.product().all(0,20,'asc').success(function(data)
            {
                console.log(data);

                for (var i = 0; i < data.length; i++) {
                    var obj = data[i];

                    $scope.productlist.push({
                        product_name: obj.product_name,
                        productId: obj.productId,
                        price_of_unit: obj.price_of_unit,
                        quantity_of_unit: obj.quantity_of_unit
                    });
                }

            }).error(function(data)
            {
                console.log(data);
            })

            $charge.commondata().getDuobaseFieldDetailsByTableNameAndFieldName("CTS_InventoryAttributes","Store").success(function(data)
            {
                console.log(data);

                for(i=0;i<data.length;i++) {
                    var obj = data[i];

                    $scope.storeslist.push({
                        storename: obj.RecordFieldData,
                        storeId: obj.GuRecID
                    });
                }
            }).error(function(data) {
                console.log(data);
            })

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

            //GRN:Receipt(supplier)
			$scope.submit = function () {
				if ($scope.editForm.$valid == true) {
					//debugger;
					console.log("form validated");
                    var productitems=[];

                    var currentdate=new Date;
                    currentdate=currentdate.toDateString();
                    //currentdate=currentdate.toLocaleDateString();

                    var selecteduser=$scope.customer_supplier.supplier;
                    //console.log("supplier: "+selecteduser.profilename);

                    var selectedstore=$scope.store_details.receivedStore;

                    $scope.content.supplier=selecteduser.profilename;
                    $scope.content.supplierID=selecteduser.profileId;
                    $scope.content.receivedStore=selectedstore.storename;
                    $scope.content.receivedStoreID=selectedstore.storeId;
                    $scope.content.guTranID="11";
                    //$scope.content.issuedStore="";
                    //$scope.content.issuedStoreID="12345";
                    $scope.content.createdUser="admin";
                    $scope.content.createdDate = currentdate;

                    angular.forEach($scope.receiplist, function(value, key){

                        productitems.push({
                            productCode : $scope.a[value.modelname].product_name,
                            guProductID : $scope.a[value.modelname].productId,
                            quantity : $scope.a[value.quantityname],
                            productPrice : $scope.a[value.modelname].price_of_unit
                        });
                    });
                    //console.log(productitems);

                    $scope.content.invGoodsReceivedDetail=productitems;

                    var inventoryobject = $scope.content;
                    //console.log(inventoryobject);
                    $charge.inventory().store(inventoryobject).success(function(data){
                        console.log(data);
                        notifications.toast("Successfully added to Inventory!","success");
                        //$mdToast.show({
                        //	template: '<md-toast class="md-toast-success" >Successfully added to Inventory!</md-toast>',
                        //	hideDelay: 2000,
                        //	position: 'bottom right'
                        //});

                        $window.location.href='#/inventorylist';

                    }).error(function(data){
                        console.log(data);
                    })

				} else//This is done because the HTML simple validation might work and enter the submit, however the form can still be invalid
				{
					//$mdToast.show({
					//	template: '<md-toast class="md-toast-error" >Please fill all the details</md-toast>',
					//	hideDelay: 2000,
					//	position: 'bottom right'
					//});
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

            //AOD:Issue(customer)
            $scope.submit2 = function () {
                if ($scope.editForm2.$valid == true) {
                    //debugger;
                    console.log("form validated");
                    var aoditems=[];

                    var currentdate=new Date;
                    currentdate=currentdate.toDateString();

                    var selecteduser=$scope.customer_supplier.customer;

                    var selectedstore=$scope.store_details.issuedStore;

                    $scope.aodcontent.customer=selecteduser.profilename;
                    $scope.aodcontent.guCustomerID=selecteduser.profileId;
                    $scope.aodcontent.issuedStore=selectedstore.storename;
                    $scope.aodcontent.issuedStoreID=selectedstore.storeId;
                    $scope.aodcontent.createdUser="admin";
                    $scope.aodcontent.createdDate=currentdate;
                    $scope.aodcontent.guTranID="11";

                    angular.forEach($scope.issuelist, function(value, key){

                        aoditems.push({
                            productCode : $scope.a[value.modelname].product_name,
                            guProductID : $scope.a[value.modelname].productId,
                            quantity : $scope.a[value.quantityname],
                            productPrice : $scope.a[value.modelname].price_of_unit
                        });
                    });
                    $scope.aodcontent.invGoodsIssuedDetail=aoditems;

                    var aodobject = $scope.aodcontent;
					//console.log(aodobject);
                    $charge.aod().store(aodobject).success(function(data){
                        console.log(data);
                        notifications.toast("Successfully added to Inventory!","success");
                        //$mdToast.show({
                        //    template: '<md-toast class="md-toast-success" >Successfully added to Inventory!</md-toast>',
                        //    hideDelay: 2000,
                        //    position: 'bottom right'
                        //});

                        $window.location.href='#/inventorylist';

                    }).error(function(data){
                        console.log(data);
                    })

                } else//This is done because the HTML simple validation might work and enter the submit, however the form can still be invalid
                {
                    //$mdToast.show({
                    //	template: '<md-toast class="md-toast-error" >Please fill all the details</md-toast>',
                    //	hideDelay: 2000,
                    //	position: 'bottom right'
                    //});
                }

            }

            $scope.returntolist = function ()
            {
                $window.location.href='#/inventorylist';
            }


            $scope.adddiv = function (element) {
                //angular.element('#productdiv').html("<div class=\"md-block\" flex=\"5\"><p>htujtjutjtyyj</p><!--space keeper--></div>");
                //angular.element('#'+element).append("<div layout-gt-sm=\"row\" class=\"layout-gt-sm-row\"><md-input-container class=\"md-block flex-gt-sm\" flex-gt-sm=\"\"><label for=\"input_7\">Product</label><input class=\"ng-pristine md-input ng-empty ng-valid-pattern ng-valid-minlength ng-valid ng-valid-required ng-touched \" id=\"input_7\" aria-invalid=\"false\" ng-trim=\"false\" style='width=272px;' ng-required=\"false\" minlength=\"null\" md-maxlength=\"null\" type=\"\" name=\"productCode\" ng-pattern=\"\" ng-model=\"content.productCode\"><div class=\"md-errors-spacer\"></div></md-input-container>" +
                //    "<div class=\"md-block flex-5\" flex=\"5\"><!--space keeper--></div> " +
                //    "<md-input-container class=\"md-block\" flex-gt-sm><label for=\"input_8\">Quantity</label><input ng-required=\"false\" minlength=\"null\" md-maxlength=\"null\" type=\"number\" name=\"quantity\" ng-pattern=\"\" ng-model=\"content.quantity\" style='width: 272px;' class=\"ng-pristine ng-untouched md-input ng-empty ng-valid-pattern ng-valid-minlength ng-valid ng-valid-required\" id=\"input_8\" aria-invalid=\"false\" ng-trim=\"false\"><div class=\"md-errors-spacer\"></div></md-input-container>" +
                //    "<div class=\"md-block flex-5\" flex=\"5\"><!--space keeper--></div>" +
                //    "<button class=\"md-fab md-button md-ink-ripple\" type=\"button\" ng-transclude=\"\" aria-label=\"menu\" style=\"background-color:#c9c9c9;\" ng-click=\"adddiv();\"><md-icon md-svg-src=\"../img/ic_remove_24px.svg\" style=\"color:#e64a19;\" class=\"ng-scope ng-isolate-scope\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100%\" height=\"100%\" viewBox=\"0 0 24 24\" fit=\"\" preserveAspectRatio=\"xMidYMid meet\"><path d=\"M19 13H5v-2h14v2z\"></path></svg></md-icon><div class=\"md-ripple-container\"></div></md-button> </div>");
            }

            $scope.removediv = function () {

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

            $scope.addrow = function (rowname,productname) {
                var modelname="";
                var quantityname="";
                if(productname=='receiptproduct')
                {
                    $scope.receiptcount++;
                    modelname = productname + $scope.receiptcount;
                    quantityname='receiptquantity' + $scope.receiptcount;
                    $scope.receiplist.push({
                        modelname : modelname,
                        quantityname : quantityname
                    });
                }
                else if(productname=='issueproduct')
                {
                    $scope.issuecount++;
                    modelname = productname + $scope.issuecount;
                    quantityname='issuequantity' + $scope.issuecount;
                    $scope.issuelist.push({
                        modelname : modelname,
                        quantityname : quantityname
                    });
                }
                console.log(modelname);

                rowname.push({

                    input1: {
                        type: "textBox",
                        textType: "",
                        label: "Product",
                        model: modelname,
                        required: true,
                        maxlength: "",
                        minlength: ""
                    },
                    input2: {
                        type: "textBox",
                        textType: "number",
                        label: "Quantity",
                        model: quantityname,
                        required: true,
                        maxlength: "",
                        minlength: ""
                    }
                });
            }

            $scope.removerow = function (rowname,index) {
                rowname.splice(index, 1);

                if(rowname == $scope.rows)
                {
                    $scope.receiplist.splice(index, 1);
                    //console.log($scope.receiplist);
                }
                else if(rowname == $scope.rowsissue)
                {
                    $scope.issuelist.splice(index, 1);
                    //console.log($scope.issuelist);
                }
            }

            $scope.rows = [
                {

                    input1: {
                        type: "textBox",
                        textType: "",
                        label: "Product",
                        model: "receiptproduct1",
                        required: true,
                        maxlength: "",
                        minlength: ""
                    },
                    input2: {
                        type: "textBox",
                        textType: "number",
                        label: "Quantity",
                        model: "receiptquantity1",
                        required: true,
                        maxlength: "",
                        minlength: ""
                    }
                }
            ];

            $scope.rowsissue = [
                {

                    input1: {
                        type: "textBox",
                        textType: "",
                        label: "Product",
                        model: "issueproduct1",
                        required: true,
                        maxlength: "",
                        minlength: ""
                    },
                    input2: {
                        type: "textBox",
                        textType: "number",
                        label: "Quantity",
                        model: "issuequantity1",
                        required: true,
                        maxlength: "",
                        minlength: ""
                    }
                }
            ];




		})//END OF AddCtrl

		app.controller('InventoryListCtrl', function ($scope, $mdDialog, $window, $mdToast, $charge) {

            var editfalse = true;
            $scope.editOff = editfalse;

            var skip1=0;
            var skip2=0;
            var take=10;
            $scope.loading = true;
            // this function fetches a random text and adds it to array
            $scope.more = function(){

                $charge.inventory().allheaders(skip1,take,'asc').success(function(data)
                {
                    console.log(data);
                    skip1 += take;
                    for (var i = 0; i < data.length; i++) {
                        var obj=data[i];

                        $scope.items.push({
                            gUGRNID : obj.gUGRNID,
                            grnNo : obj.grnNo,
                            gUAODID : "1234",
                            aodNo : "1234",
                            supplier : obj.supplier,
                            customer : "abcd",
                            receivedDate : obj.receivedDate,
                            receivedStore : obj.receivedStore,
                            issuedDate : "12/12/16",
                            issuedStore : "abcd",
                            createdDate : obj.createdDate,
                            guTranID : obj.guTranID,
                            status : obj.status,
                            inventory_type : "Receipt"
                        });
                    }

                }).error(function(data)
                {
                    console.log(data);
                    $scope.isSpinnerShown=false;
                })

                $charge.aod().allheaders(skip2,take,'asc').success(function(data)
                {
                    console.log(data);
                    skip2 += take;
                    for (var i = 0; i < data.length; i++) {
                        var obj=data[i];

                        $scope.items.push({
                            gUAODID : obj.gUAODID,
                            aodNo : obj.aodNo,
                            gUGRNID : "1234",
                            grnNo : "1234",
                            supplier : "abcd",
                            customer : obj.customer,
                            receivedDate : "12/12/16",
                            receivedStore : "abcd",
                            issuedDate : obj.issuedDate,
                            issuedStore : obj.issuedStore,
                            createdDate : obj.createdDate,
                            guTranID : obj.guTranID,
                            status : obj.status,
                            inventory_type : "Issue"
                        });
                    }

                    $scope.loading = false;

                }).error(function(data)
                {
                    console.log(data);
                    $scope.isSpinnerShown=false;
                })

            };
            // we call the function twice to populate the list
            $scope.more();

			$scope.editlistitem = function (item) {

                $scope.editOff = true;
                //debugger;
                //console.log(item.gUGRNID+","+item.gUAODID);
                var rowproducts=[];

                if(item.inventory_type=='Receipt')
                {
                    var grnid=item.gUGRNID;
                    $charge.inventory().getHeaderByID(grnid).success(function(data)
                    {
                        console.log(data);
                        for(var i=0;i<data.length;i++)
                        {
                            rowproducts.push({
                                guProductID: data[i].guProductID,
                                productCode: data[i].productCode,
                                productPrice: data[i].productPrice,
                                quantity: data[i].quantity
                            });
                        }
                        item.rowproducts=rowproducts;

                    }).error(function(data)
                    {
                        console.log(data);
                    })
                }
                else if(item.inventory_type=='Issue')
                {
                    var aodid=item.gUAODID;
                    $charge.aod().getHeaderByID(aodid).success(function(data)
                    {
                        console.log(data);
                        for(var i=0;i<data.length;i++)
                        {
                            rowproducts.push({
                                guProductID: data[i].guProductID,
                                productCode: data[i].productCode,
                                productPrice: data[i].productPrice,
                                quantity: data[i].quantity
                            });
                        }
                        item.rowproducts=rowproducts;
                    }).error(function(data)
                    {
                        console.log(data);
                    })
                }
                $scope.selectedprofile = item;

                angular.element('#viewAllWhiteframe').css('margin', '0');
                angular.element('#viewAllWhiteframe').css('max-width', '750px');

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
                $scope.editOff = true;

                if(editedprofile.inventory_type == "Receipt")
                {
                    //var updatedinventoryobject = editedprofile;
                    $charge.inventory().cancel(editedprofile.gUGRNID).success(function(data){
                        console.log(data);

                        $mdToast.show({
                            template: '<md-toast class="md-toast-success" >Order has been cancelled!</md-toast>',
                            hideDelay: 2000,
                            position: 'bottom right'
                        });

                    }).error(function(data){
                        console.log(data);
                        $mdToast.show({
                            template: '<md-toast class="md-toast-success" >Order cancel failed!</md-toast>',
                            hideDelay: 2000,
                            position: 'bottom right'
                        });
                    })
                }
                else if(editedprofile.inventory_type == "Issue")
                {
                    //var updatedaodobject = editedprofile;
                    $charge.aod().cancel(editedprofile.gUAODID).success(function(data){
                        console.log(data);

                        $mdToast.show({
                            template: '<md-toast class="md-toast-success" >Order has been cancelled!</md-toast>',
                            hideDelay: 2000,
                            position: 'bottom right'
                        });

                    }).error(function(data){
                        console.log(data);
                        $mdToast.show({
                            template: '<md-toast class="md-toast-success" >Order cancel failed!</md-toast>',
                            hideDelay: 2000,
                            position: 'bottom right'
                        });
                    })
                }

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



