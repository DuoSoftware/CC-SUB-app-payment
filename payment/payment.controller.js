////////////////////////////////
// App : Payment
// File : Payment Controller
// Owner  : GihanHerath
// Last changed date : 2017/01/04
// Version : 6.0.0.13
/////////////////////////////////

(function ()
{
	'use strict';

	angular
		.module('app.payment')
		.controller('PaymentController', PaymentController);

	/** @ngInject */
	function PaymentController($scope, $document, $timeout, notifications, $mdDialog, $mdToast, $mdMedia, $mdSidenav,$charge,$filter,$azureSearchHandle, $http, transactionTemplateGenerator)
	{
		var vm = this;


		vm.appInnerState = "default";
		vm.pageTitle="Create New";
		vm.checked = [];
		vm.colors = ['blue-bg', 'blue-grey-bg', 'orange-bg', 'pink-bg', 'purple-bg'];

		vm.selectedPayment = {};
		vm.toggleSidenav = toggleSidenav;

		vm.responsiveReadPane = undefined;
		vm.activePaymentPaneIndex = 0;
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
		vm.extractEmailTemplate = extractEmailTemplate;
		vm.searchMoreInit = true;
		vm.isLoaded = true;

		vm.loadByKeyword = $scope.loadByKeywordPayment;

		$scope.showFilers=true;
		$scope.currencySample='';
		$scope.showInpageReadpane = false;
		$scope.currEmailTemplate = "";
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
		$scope.switchInfoPane = function (state, payment) {
			if(state=='show'){
				$scope.showInpageReadpane = true;
				vm.selectPayment(payment);
			}else if(state=='close'){
				$scope.showInpageReadpane = false;
			}
		};

		function extractEmailTemplate(paymentData, callback) {
			$scope.currEmailTemplate = $scope.tempSelectedTemplate;
			//Removing meta data
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('<!doctype html>', '');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('INVOICE', 'RECEIPT');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('<html lang="en">', '');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('<head>', '');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('<meta name="viewport"', '');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">', '');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('<meta http-equiv="X-UA-Compatible" content="ie=edge">', '');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('<meta charset="UTF-8">', '');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('<title>Document</title>', '');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('</head>', '');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('<body>', '');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('</body>', '');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('</html>', '');
			$scope.currEmailTemplate = $scope.currEmailTemplate.trim();

			//Adding payment information
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('%companyName%', $scope.companyName);
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('%companyPhone%', $scope.companyPhone);
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('%companyEmail%', $scope.companyEmail);
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('%companyAddress%', $scope.companyAddress);
			if($scope.emailTemplateName == 'emailTemplate3.html' || $scope.emailTemplateName == 'emailTemplate4.html')
				$scope.currEmailTemplate = $scope.currEmailTemplate.replace('%companyLogo%', $scope.companyLogo);
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('%personName%', vm.selectedPayment.UserName);
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('%otherName%', '');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('%listItems%', '');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('%bill_addr%', vm.selectedPayment.UserAddress);
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('%phone%', vm.selectedPayment.UserContact);
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('%email_addr%', vm.selectedPayment.UserEmail);
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('Invoice no', 'Payment no');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('%invoiceNo%', vm.selectedPayment.paymentNo);
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('%invoiceDate%', vm.selectedPayment.paymentDate);
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('Due date', '');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('%dueDate%', '');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('Billing period', '');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('%invoiceDate% - %dueDate%', '');

			//Sub details
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('SUBTOTAL', 'CURRENCY');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('%subTotal%', vm.selectedPayment.currency.toUpperCase());
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('MISCELLANEOUS CHARGES', 'CURRENCY RATE');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('%additionalcharge%', vm.selectedPayment.rate);
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('DISCOUNT', '');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('(%discAmt%)', '');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('TAX', 'PAYMENT METHOD');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('%tax%', vm.selectedPayment.paymentMethod);
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('%invoiceDate% - %dueDate%', '');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('PROMOTION', '');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('(%discount%)', '');
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('%invoiceAmount%', vm.selectedPayment.amount);

			//Footer
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('%greeting%', $scope.FooterGreeting);
			$scope.currEmailTemplate = $scope.currEmailTemplate.replace('%disclaimer%', $scope.FooterDisclaimer);
			callback();
		}

		$scope.isReadLoaded = true;
		function selectPayment(payment)
		{
			$scope.showInpageReadpane = true;
			$scope.isReadLoaded = false;
			vm.selectedPayment = payment;
			$scope.loadInvoiceByCustomerId(payment.guCustomerID);

			//var paymentNumber=payment.paymentNo.substr($scope.paymentPrefix.length);
			var paymentNumber=payment.paymentNoWithoutPrefix;
			paymentNumber=parseInt(paymentNumber);
			$charge.payment().searchPayment(paymentNumber).success(function(data){
				//console.log(data);

				if(data[0].profile_type=='Individual')
				{
					vm.selectedPayment.UserName=data[0].first_name+" "+data[0].last_name;
					vm.selectedPayment.UserAddress=data[0].bill_addr;
					vm.selectedPayment.UserContact=data[0].phone;
					vm.selectedPayment.UserEmail=data[0].email_addr;
				}
				else if(data[0].profile_type=='Business')
				{
					vm.selectedPayment.UserName=data[0].business_contact_name; //business_name,business_contact_name
					vm.selectedPayment.UserAddress=data[0].bill_addr;
					vm.selectedPayment.UserContact=data[0].business_contact_no;
					vm.selectedPayment.UserEmail=data[0].email_addr;
				}

                var docinfo = {
                    type : 'receipt',
                    company : {
                        companyName : $scope.companyName,
                        companyPhone : $scope.companyPhone,
                        companyEmail : $scope.companyEmail,
                        companyAddress : $scope.companyAddress,
                        companyLogo : $scope.companyLogo
                    },
                    client : {
                        clientName : vm.selectedPayment.UserName,
                        clientPhone : vm.selectedPayment.UserContact,
                        clientAddress : vm.selectedPayment.UserAddress,
                        clientEmail : vm.selectedPayment.UserEmail
                    },
                    transaction : {
                        paymentNo : vm.selectedPayment.paymentNo,
                        paymentDate : vm.selectedPayment.paymentDate,
                        rate : vm.selectedPayment.rate,
                        currency : vm.selectedPayment.currency,
                        paymentMethod : vm.selectedPayment.paymentMethod,
                        amount : vm.selectedPayment.amount,
                        invoiceDetails : []
                    }
                };

                // extractEmailTemplate(vm.selectedPayment, function () {
                var t = transactionTemplateGenerator(docinfo);
                var preview = $('#paymentPreview');
                preview.children().remove();
                preview.append(t);
                if(vm.selectedPayment.status.toLowerCase() == 'cancelled'){
                    preview.append('<div style="width: 100%;height: 100%;position: absolute;top: 0;text-align: center;z-index: 10"><div style="position: absolute;font-size: 60px;height: 120px;padding: 15px 0;width: 400px;border: dashed 5px;top: 0;bottom: 0;left: 0;right: 0;margin: auto;color: rgba(255, 137, 32, 0.7);-webkit-transform: rotate(-45deg);transform: rotate(-45deg)">CANCELLED</div></div>');
                }
                $('.list').css('padding','10px');
                $('.left-content > div:first-child').css('width','50%');
                $scope.isReadLoaded = true;

			}).error(function(data){
				//console.log(data);
				$scope.isReadLoaded = true;
			});

			$scope.showFilers=false;

			// $timeout(function ()
			// {
			//     vm.activePaymentPaneIndex = 1;
			//
			//     // Store the current scrollPos
			//     vm.scrollPos = vm.scrollEl.scrollTop();
			//
			//     // Scroll to the top
			//     vm.scrollEl.scrollTop(0);
			// });
		}

		/**
		 * Close read pane
		 */
		function closeReadPane()
		{
			vm.activePaymentPaneIndex = 0;

			$timeout(function ()
			{
				vm.scrollEl.scrollTop(vm.scrollPos);
			}, 650);
			$scope.showFilers=true;
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
			if(vm.activePaymentPaneIndex === 0){
				$timeout(function () {
					$scope.showInpageReadpane = false;
					vm.activePaymentPaneIndex = 1;
				});
			}else{
				if(vm.editForm.$dirty ){
					var confirm = $mdDialog.confirm()
						.title('Are you sure?')
						.textContent('Fields have changed and you might have unsaved data. Are you sure you want to leave this page?')
						.ariaLabel('Are you sure?')
						.targetEvent()
						.ok('Yes')
						.cancel('Stay');

					$mdDialog.show(confirm).then(function() {
						$scope.clearform();
						vm.activePaymentPaneIndex = 0;
					}, function() {
					});
				}else{
					vm.activePaymentPaneIndex = 0;
				}
			}
		}


		$scope.items = [];
		$scope.profilelist = [];
		$scope.productlist = [];
		$scope.storeslist = [];
		$scope.invoicelist = [];
		$scope.currencyratelist = [];
		$scope.BaseCurrency = "";
		$scope.currencyRate = 1;
		$scope.content={};
		$scope.hideSearchMore=false;

		$scope.getFirstName = function (val) {
			return val.split(" ")[0];
		};

		$charge.settingsapp().getDuobaseFieldDetailsByTableNameAndFieldName("CTS_GeneralAttributes","BaseCurrency").success(function(data) {
			$scope.BaseCurrency=data[0].RecordFieldData;
			//console.log($scope.BaseCurrency);
			$scope.content.preferredcurrency=$scope.BaseCurrency;
			$scope.selectedCurrency = $scope.BaseCurrency;

		}).error(function(data) {
			//console.log(data);
			$scope.BaseCurrency="USD";
			$scope.selectedCurrency = $scope.BaseCurrency;
		})

		$scope.prefferedCurrencies=[];
		$charge.settingsapp().getDuobaseFieldDetailsByTableNameAndFieldName("CTS_GeneralAttributes","FrequentCurrencies").success(function(data) {
			$scope.prefferedCurrencies=data[0].RecordFieldData.trimLeft().split(" ");
		}).error(function(data) {
			//console.log(data);
		});

		$charge.settingsapp().getDuobaseValuesByTableName("CTS_CompanyAttributes").success(function(data) {
			$scope.CompanyProfile=data;
			$scope.companyName=data[0].RecordFieldData;
			$scope.companyAddress=data[1].RecordFieldData;
			$scope.companyPhone=data[2].RecordFieldData;
			$scope.companyEmail=data[3].RecordFieldData;
			$scope.companyLogo=data[4].RecordFieldData;
		}).error(function(data) {
			//console.log(data);
		});

		$charge.settingsapp().getDuobaseValuesByTableName("CTS_FooterAttributes").success(function(data) {
			$scope.FooterData=data;
			$scope.FooterGreeting=data[0].RecordFieldData;
			$scope.FooterDisclaimer=data[1].RecordFieldData!=""?atob(data[1].RecordFieldData):"";
		}).error(function(data) {
		});

		$scope.paymentPrefix="";
		$scope.lenPrefixPayment=0;

		$scope.isLoading = false;
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
				//console.log(data);

				if($scope.loading)
				{
					skip += take;

					//$charge.commondata().getDuobaseFieldDetailsByTableNameAndFieldName("CTS_PaymentAttributes","PaymentPrefix").success(function(data2) {
					//$scope.paymentPrefix=data2[0].RecordFieldData;
					$scope.paymentPrefix=localStorage.getItem("paymentPrefix");
					//console.log($scope.paymentPrefix);

					var prefixLengthPayment=localStorage.getItem("paymentPrefixLength");
					$scope.lenPrefixPayment=prefixLengthPayment!=0? parseInt(prefixLengthPayment):0;

					for (var i = 0; i < data.length; i++) {
						//console.log(moment(data[i].paymentDate).format('LL'));
						data[i].paymentDate=moment(data[i].paymentDate).format('L');
						data[i].paymentNoWithoutPrefix=data[i].paymentNo;

						var paymentNum=$filter('numberFixedLen')(data[i].paymentNo,$scope.lenPrefixPayment);
						data[i].paymentNo=$scope.paymentPrefix+paymentNum;
						//
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
					$scope.listLoaded = true;
					vm.searchMoreInit = false;


					$scope.loading = false;
					$scope.isLoading = false;
					$scope.isdataavailable=true;
					if(data.length<take){
						$scope.isdataavailable=false;
						$scope.hideSearchMore=true;
					}

					//}).error(function(data) {
					//  $scope.listLoaded = true;
					//  $scope.hideSearchMore=true;
					//
					//  console.log(data);
					//})

				}

			}).error(function(data)
			{
				//console.log(data);
				$scope.isSpinnerShown=false;
				$scope.isdataavailable=false;
				$scope.isLoading = false;
				$scope.listLoaded = true;
				$scope.hideSearchMore=true;
			})

		};

		//Get email template for the tenant
		$charge.settingsapp().getDuobaseFieldsByTableNameAndFieldName("CTS_EmailTemplates", "TemplateUrl").success(function (data) {
			$scope.emailTemplateName = data[0][0].RecordFieldData.split('/').pop();
			$http({
				method:'GET',
				url:data[0][0].RecordFieldData
			}).then(function (res) {
				$scope.tempSelectedTemplate = angular.copy(res.data);
				$scope.currEmailTemplate = res.data;

				// we call the function twice to populate the list
				$scope.more();
			});
		}).error(function (errorResponse) {
			$http({
				method:'GET',
				url:'https://ccresourcegrpdisks974.blob.core.windows.net/email-templates/Templates/emailTemplate1.html'
			}).then(function (res) {
				$scope.tempSelectedTemplate = angular.copy(res.data);
				$scope.currEmailTemplate = res.data;

				// we call the function twice to populate the list
				$scope.more();
			});
			// notifications.toast("Error loading selected email template","Error");

			// we call the function twice to populate the list
			$scope.more();
		});

		var skipPaymentSearch, takePaymentSearch;
		var tempList;
		$scope.loadByKeywordPayment= function (keyword,length) {
			if($scope.items.length>=100) {
				//
				if(length==undefined)
				{
					keyword="undefined";
					length=0;
				}
				var searchLength=length;
				//var searchLength=3;
				var idLength=0;
				var keywordIdLength=0;
				if(keyword.toLowerCase().startsWith($scope.paymentPrefix.toLowerCase()))
				{
					keyword=keyword.substr($scope.paymentPrefix.length);
					//console.log(keyword);
					if(keyword!="")
					{
						keywordIdLength=$scope.lenPrefixPayment-keyword.length;
						keyword=parseInt(keyword);
						keyword=keyword.toString();
						if(keyword!="0")
						{
							searchLength=keyword.length;
							idLength=searchLength+keywordIdLength;
						}
					}
					//searchLength=1;
					//idLength=2;
				}
				if (keyword.length == searchLength) {
					//console.log(keyword);
					//
					skipPaymentSearch = 0;
					takePaymentSearch = 100;
					tempList = [];
					$charge.payment().filterByKey(keyword, idLength, skipPaymentSearch, takePaymentSearch,'desc').success(function (data) {
						for (var i = 0; i < data.length; i++) {
							data[i].paymentDate=moment(data[i].paymentDate).format('L');
							data[i].paymentNoWithoutPrefix=data[i].paymentNo;

							var paymentNum=$filter('numberFixedLen')(data[i].paymentNo,$scope.lenPrefixPayment);
							data[i].paymentNo=$scope.paymentPrefix+paymentNum;
							//
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
								tempList.push(data[i]);
							}
							else
							{
								tempList.push(data[i]);
							}

							//tempList.push(data[i]);
						}
						vm.payments = tempList;
						//skipPaymentSearch += takePaymentSearch;
						//$scope.loadPaging(keyword, idLength, skipPaymentSearch, takePaymentSearch);
					}).error(function (data) {
						if(tempList.length>0) {
							vm.payments = tempList;
							//$scope.openProduct(vm.products[0]);
						}
						else
						{
							vm.payments=[];
							vm.selectedPayment=null;
						}
						$scope.listLoaded = true;
					});
				}
				else if (keyword.length == 0 || keyword == null) {
					vm.payments = $scope.items;
					$scope.listLoaded = true;
				}

				if(searchLength==0||searchLength==undefined)
				{
					$scope.loading = true;
					$scope.more();
				}
			}
		}


		var skip,take;
		var tempProfileList;
		$scope.filteredUsers = [];
		vm.isAutoDisabled = false;
		//var autoElem = angular.element('#invoice-auto');
		$scope.searchMre=false;
		$scope.loadProfileByKeyword= function (keyword) {
			//
			$scope.waitForSearchMoreKeyword=keyword;
			if(!$scope.searchMre) {

				if ($scope.profilelist.length == $scope.searchFilterLength) {
					if (keyword != undefined) {
						if (keyword.length == 3) {
							vm.isAutoDisabled = true;
							skip = 0;
							take = 10;
							var tempProfileList = [];
							$scope.filteredUsers = [];
							$charge.profile().filterByKey(keyword,skip,take).success(function (data) {
								for (var i = 0; i < data.length; i++) {
									var obj = data[i];
									if(obj.profile_type=='Individual')
									{
										tempProfileList.push({
											display : obj.first_name,
											value : {profilename : obj.first_name, profileId : obj.profileId, othername : obj.last_name, profile_type : obj.profile_type, bill_addr : obj.bill_addr, category : obj.category, email : obj.email_addr}
										});
									}
									else if(obj.profile_type=='Business') {
										tempProfileList.push({
											display : obj.business_name,
											value : {profilename : obj.business_name, profileId : obj.profileId, othername : obj.business_contact_name, profile_type : obj.profile_type, bill_addr : obj.bill_addr, category : obj.category, email : obj.email_addr}
										});
									}

								}
								$scope.filteredUsers = tempProfileList;
								vm.isAutoDisabled = false;
								//autoElem.focus();
								setTimeout(function(){
									document.querySelector('#acProfileIdPayment').focus();
								},0);
								if (data.length < take)
									$scope.searchMre = true;
								$timeout.cancel($scope.waitForSearchMore);
								//skip += take;
								//$scope.loadPaging(keyword, rows, index, status, skip, take);
							}).error(function (data) {
								vm.isAutoDisabled = false;
								setTimeout(function(){
									document.querySelector('#acProfileIdPayment').focus();
								},0);
								//autoElem.empty();
								//
								//vm.products = [];
								//vm.selectedProduct = null;
							});
						}
						else if(keyword.length>3)
						{
							//
							skip = 0;
							take = 10;
							tempProfileList = [];
							vm.isAutoDisabled = true;
							$scope.filteredUsers = [];
							$charge.profile().filterByKey(keyword,skip,take).success(function (data) {
								for (var i = 0; i < data.length; i++) {
									var obj = data[i];
									if(obj.profile_type=='Individual')
									{
										tempProfileList.push({
											display : obj.first_name,
											value : {profilename : obj.first_name, profileId : obj.profileId, othername : obj.last_name, profile_type : obj.profile_type, bill_addr : obj.bill_addr, category : obj.category, email : obj.email_addr}
										});
									}
									else if(obj.profile_type=='Business') {
										tempProfileList.push({
											display : obj.business_name,
											value : {profilename : obj.business_name, profileId : obj.profileId, othername : obj.business_contact_name, profile_type : obj.profile_type, bill_addr : obj.bill_addr, category : obj.category, email : obj.email_addr}
										});
									}

								}
								$scope.filteredUsers = tempProfileList;
								vm.isAutoDisabled = false;
								//
								setTimeout(function(){
									document.querySelector('#acProfileIdPayment').focus();
								},0);

								if (data.length < take)
									$scope.searchMre = true;
								$timeout.cancel($scope.waitForSearchMore);
							}).error(function (data) {
								vm.isAutoDisabled = false;
								setTimeout(function(){
									document.querySelector('#acProfileIdPayment').focus();
								},0);
								//autoElem.empty();
							});
						}
						else if (keyword.length == 0 || keyword == null) {
							$scope.filteredUsers = $scope.profilelist;
							$scope.searchMre = false;
						}
					}
					else if (keyword == undefined) {
						$scope.filteredUsers = $scope.profilelist;
						$scope.searchMre = false;
					}
				}
			}
			else if (keyword == undefined || keyword.length == 0) {
				$scope.filteredUsers = $scope.profilelist;
				$scope.searchMre = false;
			}
		}


		$scope.toggleProfileSearchMre= function (ev) {
			//
			if (ev.keyCode === 8) {
				$timeout.cancel($scope.waitForSearchMore);
				$scope.waitForSearchMore = $timeout(function myFunction() {
					// do something
					if($scope.searchMre)
					{
						$scope.searchMre = false;
						$scope.loadProfileByKeyword($scope.waitForSearchMoreKeyword);
					}
				},1000);
				//$scope.searchMre = false;
			}
		}


		$scope.loadPaging= function (keyword, idLength,skip, take) {
			$charge.payment().filterByKey(keyword, idLength, skip, take, 'desc').success(function (data) {
				for(var i=0;i<data.length;i++)
				{
					data[i].paymentDate=moment(data[i].paymentDate).format('L');
					data[i].paymentNoWithoutPrefix=data[i].paymentNo;

					var paymentNum=$filter('numberFixedLen')(data[i].paymentNo,$scope.lenPrefixPayment);
					data[i].paymentNo=$scope.paymentPrefix+paymentNum;
					//
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
						tempList.push(data[i]);
					}
					else
					{
						tempList.push(data[i]);
					}

					//tempList.push(data[i]);
				}
				skip += take;
				$scope.loadPaging(keyword, idLength,skip, take);
			}).error(function (data) {
				if(tempList.length>0) {
					vm.payments = tempList;
					//$scope.openProduct(vm.products[0]);
				}
				else
				{
					vm.payments=[];
					vm.selectedPayment=null;
				}
			});
		}

		$charge.commondata().getDuobaseFieldDetailsByTableNameAndFieldName("CTS_CompanyAttributes","CompanyLogo").success(function(data)
		{
			//
			//console.log(data);
			$scope.logourl=data[0].RecordFieldData;

		}).error(function(data) {
			//console.log(data);
		})

		$scope.searchmorebuttonclick = function (){
			$scope.loading = true;
			$scope.more();
		}

		var filterList;
		$scope.filterMainList = function (filterBy,value){
			filterList = [];
			vm.payments = [];
			vm.searchMoreInit = true;
			var skipFilterList=0;
			var takeFilterList=50;
			$scope.listLoaded = false;
			//
			$charge.payment().filter(filterBy, value, skipFilterList, takeFilterList, 'desc').success(function (data) {
				for(var i=0;i<data.length;i++)
				{
					data[i].paymentDate=moment(data[i].paymentDate).format('L');
					data[i].paymentNoWithoutPrefix=data[i].paymentNo;

					var paymentNum=$filter('numberFixedLen')(data[i].paymentNo,$scope.lenPrefixPayment);
					data[i].paymentNo=$scope.paymentPrefix+paymentNum;
					//
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
						filterList.push(data[i]);
					}
					else
					{
						filterList.push(data[i]);
					}

					//tempList.push(data[i]);
				}
				skipFilterList += takeFilterList;
				$scope.loadFilterPaging(filterBy, value, skipFilterList, takeFilterList);
			}).error(function (data) {
				vm.payments = [];
				vm.selectedPayment = null;
				$scope.listLoaded = true;
				vm.searchMoreInit = false;
			});
		}

		$scope.loadFilterPaging = function (filterBy, value, skip, take){
			$charge.payment().filter(filterBy, value, skip, take, 'desc').success(function (data) {
				for(var i=0;i<data.length;i++)
				{
					data[i].paymentDate=moment(data[i].paymentDate).format('L');
					data[i].paymentNoWithoutPrefix=data[i].paymentNo;

					var paymentNum=$filter('numberFixedLen')(data[i].paymentNo,$scope.lenPrefixPayment);
					data[i].paymentNo=$scope.paymentPrefix+paymentNum;
					//
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
						filterList.push(data[i]);
					}
					else
					{
						filterList.push(data[i]);
					}

					//tempList.push(data[i]);
				}
				skip += take;
				$scope.loadFilterPaging(filterBy, value, skip, take,function () {
					$scope.listLoaded = true;
					vm.searchMoreInit = false;
				});
			}).error(function (data) {
				if(filterList.length>0) {
					vm.payments = filterList;
					//$scope.openProduct(vm.products[0]);
					$scope.listLoaded = true;
					vm.searchMoreInit = false;
				}
				else
				{
					vm.payments=[];
					vm.selectedPayment=null;
					$scope.listLoaded = true;
					vm.searchMoreInit = false;
				}
			});
		}

		$scope.editlistitem = function (item) {

			$scope.editOff = true;
			//
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

		$scope.prefixInvoice="";
		$scope.lenPrefixInvoice=0;

		//$charge.commondata().getDuobaseFieldDetailsByTableNameAndFieldName("CTS_InvoiceAttributes","InvoicePrefix").success(function(data) {
		//  var invoicePrefix=data[0];
		//  $scope.prefixInvoice=invoicePrefix!=""?invoicePrefix.RecordFieldData:"";
		$scope.prefixInvoice=localStorage.getItem("invoicePrefix");
		//
		//}).error(function(data) {
		//  console.log(data);
		//  $scope.prefixInvoice="";
		//})
		//$charge.commondata().getDuobaseFieldDetailsByTableNameAndFieldName("CTS_InvoiceAttributes","PrefixLength").success(function(data) {
		//  var prefixLength=data[0];
		//  $scope.lenPrefixInvoice=prefixLength!=0? parseInt(prefixLength.RecordFieldData):0;
		var prefixLength=localStorage.getItem("prefixLength");
		$scope.lenPrefixInvoice=prefixLength!=0? parseInt(prefixLength):0;
		//}).error(function(data) {
		//  console.log(data);
		//})

		$scope.loadInvoiceByCustomerId = function (customerId)
		{
			//
			$scope.invoicePrintlist=[];

			var cusId=customerId;
			//console.log(cusId);
			$charge.invoice().getByAccountID(cusId).success(function(data) //all(0,10,'asc').success(function(data)
			{
				//console.log(data);

				var totbalance=0;
				for (var i = 0; i < data.length; i++) {
					var obj=data[i];

					var invoiceNum=$filter('numberFixedLen')(obj.invoiceNo,$scope.lenPrefixInvoice);
					obj.invoiceNo=$scope.prefixInvoice+invoiceNum;

					var balance= parseInt(obj.invoiceAmount)-parseInt(obj.paidAmount);
					totbalance+=balance;
					data[i].balancepayment=balance;
				}
				data[0].totalbalance=totbalance;

				$scope.invoicePrintlist=data;

			}).error(function(data)
			{
				//console.log(data);
				$scope.invoicePrintlist=[];
			})
		}

		$scope.getcompanylogo = function ()
		{
			$charge.commondata().getDuobaseFieldDetailsByTableNameAndFieldName("CTS_CompanyAttributes","CompanyLogo").success(function(data)
			{
				//
				//console.log(data);
				$scope.logourl=data[0].RecordFieldData;

			}).error(function(data) {
				//console.log(data);
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

		//$scope.closeApplication = function () {
		//	window.parent.dwShellController.closeCustomApp();
		//};

		$scope.showCancelPaymentConfirm = function(ev,editedprofile) {
			// Appending dialog to document.body to cover sidenav in docs app
			var confirm = $mdDialog.confirm()
				.title('Would you like to Cancel this Payment?')
				.textContent('You cannot revert this action again for a active Payment!')
				.ariaLabel('Lucky day')
				.targetEvent(ev)
				.ok('Please do it!')
				.cancel('No!');

			$mdDialog.show(confirm).then(function() {
				$scope.cancelorder(editedprofile);
			}, function() {

			});
		};

		$scope.cancelorder = function (editedprofile) {

			//var paymentNumber=editedprofile.paymentNo.substr($scope.paymentPrefix.length);
			var paymentNumber=editedprofile.paymentNoWithoutPrefix;
			paymentNumber=parseInt(paymentNumber);
			//console.log(paymentNumber);
      var cancelPaymentObj = {
        "email":editedprofile.UserEmail,
        "receiptNo":paymentNumber
      }
			$charge.invoicing().cancelPayment(cancelPaymentObj).success(function(data){
				//console.log(data);
        if(data.response=="succeeded")
        {
          notifications.toast("Payment has been cancelled!", "success");
          $scope.refreshpage();
          closeReadPane();
        }
        else
        {
          notifications.toast("Payment cancel failed!", "error");
        }

			}).error(function(data){
				//console.log(data);
        notifications.toast("Payment cancel failed!", "error");
			})

		}

		$scope.printDiv = function(divName) {
			// var printContainer = document.createElement('div');
			// printContainer.append(document.getElementById(divName));
			var printContents = document.getElementById(divName).innerHTML;
			var popupWin = window.open('', '_blank', 'width=1800,height=700');
			popupWin.document.open();
			popupWin.document.write('<html><head><link href="app/main/360/dialogs/compose/print-view.css" rel="stylesheet" type="text/css"><script src="https://code.jquery.com/jquery-3.2.1.min.js"integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="crossorigin="anonymous"></script><link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css"><style>body{font-family: "Roboto"!important;}</style></head><body onload="window.print()" style="position:relative;width: 700px">' + printContents + '<script src="views/read/jquery.min.js"></script><script>$(document).ready(function (){window.print()});</script></body></html>');
			popupWin.document.close();
		}

		$scope.emailTemplateInit = function(ev,base64Conversion){
			$mdDialog.show({
				controller: 'AddPaymentEmailController',
				templateUrl: 'app/main/payment/views/read/mailTemplate.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				locals : {
					selectedPayment: vm.selectedPayment,
					base64Content:base64Conversion,
					adminData:$scope.adminData
				},
				fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
			})


		}

		$scope.adminData=null;
		$scope.getAdminUser= function () {
			$charge.commondetails().getAdminInfo().success(function(data){
				$scope.adminData=data;
			}).error(function (data) {

			})
		}

		$scope.getAdminUser();

		$scope.emailPayment= function (ev,divName) {
			var printContents = document.getElementById(divName).innerHTML;
			var base64Conversion=window.btoa(unescape(encodeURIComponent(printContents)));
			$scope.emailTemplateInit(ev,base64Conversion);

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
			for (var i = 0,len = $scope.filteredUsers.length; i<len; ++i){
				//console.log($scope.allBanks[i].value.value);

				if($scope.filteredUsers[i].value.profilename!=""&&$scope.filteredUsers[i].value.profilename!=undefined)
				{
					if($scope.filteredUsers[i].value.profilename.toLowerCase().indexOf(query.toLowerCase()) !=-1)
					{
						results.push($scope.filteredUsers[i]);
						continue;
					}
				}
				if($scope.filteredUsers[i].value.othername!=""&&$scope.filteredUsers[i].value.othername!=undefined)
				{
					if($scope.filteredUsers[i].value.othername.toLowerCase().indexOf(query.toLowerCase()) !=-1)
					{
						results.push($scope.filteredUsers[i]);
						continue;
					}
				}
			}
			return results;
		}
		$scope.profilelist = [];
		$scope.searchFilterLength=0;

		var skipprofiles=0;
		var takeprofiles=100;

		function loadAll() {

			vm.loadingProfiles=true;
			$scope.searchFilterLength=takeprofiles;

			$azureSearchHandle.getClient().SearchRequest("profile",skipprofiles,takeprofiles,'desc',"").onComplete(function(Response)
			{
				if(vm.loadingProfiles)
				{
					skipprofiles += takeprofiles;
					//

					for (var i = 0; i < Response.length; i++) {
						//
						var obj=Response[i];
						$scope.profilelist.push({
							display : obj.first_name,
							value : {profilename : obj.first_name, profileId : obj.profileId, othername : obj.last_name, profile_type : obj.profile_type, email : obj.email_addr}
						});

					}

					$scope.filteredUsers=$scope.profilelist;

					vm.loadingProfiles = false;
					if(Response.length==takeprofiles){
						loadAll();
					}
				}

			}).onError(function(data)
			{
				//console.log(data);
				vm.loadingProfiles = false;
			});

		}
		loadAll();

		//$scope.today=new Date().toDateString();
		$scope.today=new Date();
		$scope.content={};
		//$scope.content.paymentDate=moment(new Date().toISOString()).format('LL');
		$scope.content.paymentDate=new Date();
		$scope.customer_supplier={};
		//$scope.content.preferredcurrency=$scope.BaseCurrency;

		$scope.clearform = function (){
			vm.editForm.$setPristine();
			vm.editForm.$setUntouched();

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
			$scope.content.preferredcurrency=$scope.BaseCurrency;
			$scope.selectedCurrency=$scope.BaseCurrency;
			$scope.currencyRate=1;
			document.body.scrollTop = document.documentElement.scrollTop = 0;
			$scope.submitted=false;
			vm.isAutoDisabled = false;
			$timeout(function () {
				vm.isLoaded = true;
			},0);
			$scope.searchMre = false;
		}

		$scope.refreshpage = function(){
			vm.payments = [];
			$scope.items = [];
			skip=0;
			$scope.loading = true;
			$scope.listLoaded = false;
			$scope.hideSearchMore=false;
			vm.searchMoreInit = true;
			$scope.more();
		}


		$scope.submit = function () {
			if (vm.editForm.$valid == true) {
				//
				$scope.submitted=true;
				//console.log("form validated");
				var productitems=[];

				var currentdate=new Date;
				currentdate=currentdate.toDateString();

				var selecteduser=$scope.customer_supplier.customer;

				if(selecteduser==null||selecteduser==""||$scope.content.paymentMethod==undefined)
				{
					//$mdToast.show({
					//  template: '<md-toast class="md-toast-error" >Fill the necessary details!</md-toast>',
					//  hideDelay: 2000,
					//  position: 'bottom right'
					//});
					$scope.submitted=false;

					vm.searchText="";
				}
				else
				{
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
							//$scope.content.amount=Math.round($scope.content.amount*100)/100;
						}
						if($scope.content.bankCharges!="")
						{
							$scope.content.bankCharges=parseFloat($scope.content.bankCharges)/$scope.currencyRate;
							//$scope.content.bankCharges=Math.round($scope.content.bankCharges*100)/100;
						}
					}

          var paymentobject = {
            "email": selecteduser.value.email,
            "amount": $scope.content.amount,
            "paymentMethod": $scope.content.paymentMethod,
            "guInvoiceId": ""
          }

          $charge.invoicing().insertReceipt(paymentobject).success(function(data){
            //console.log(data);
            if(data.response=="succeeded")
            {
              notifications.toast("Successfully created the Payment Invoice","success");
              $scope.clearform();
              $scope.refreshpage();
              toggleinnerView();
              //$window.location.href='#/paymentlist';
            }
            else if(data.response=="failed")
            {
              notifications.toast(data.message,"error");
              //var errorMsg="Receipt invoice creating failed";
              //for (key in data.error) {
              //  errorMsg=data.error[key][0];
              //  break;
              //}
              //notifications.toast(errorMsg,"error");
              //console.log(data);
              $scope.submitted=false;
            }

          }).error(function(data){
            //
            //console.log(data);
			notifications.toast(data.message,"error");
            //var errorMsg="Receipt invoice creating failed";
            //for (key in data.error) {
            //  errorMsg=data.error[key][0];
            //  break;
            //}
            //notifications.toast(errorMsg,"error");

            $scope.submitted=false;
          })
				}

			} else//This is done because the HTML simple validation might work and enter the submit, however the form can still be invalid
			{
				angular.element(document.querySelector('#paymentForm')).find('.ng-invalid:visible:first').focus();

				//$mdToast.show({
				//  template: '<md-toast class="md-toast-error" >Please fill all the details properly!</md-toast>',
				//  hideDelay: 2000,
				//  position: 'bottom right'
				//});
				$scope.submitted=false;
			}

		}

		//$scope.returntolist = function ()
		//{
		//	$window.location.href='#/paymentlist';
		//}

		$scope.loadInvoice = function (customer)
		{
			vm.isLoaded = false;
			if(customer!=null&&customer!=undefined)
			{
				var invoicenolist="";
				var cusId=customer.value.profileId;//"2293";
				//console.log(cusId);
				$charge.invoice().getByAccountID(cusId).success(function(data) //all(0,10,'asc').success(function(data)
				{
					//console.log(data);

					var totbalance=0;
					for (var i = 0; i < data.length; i++) {
						var obj=data[i];

						if(i==0)
						{
							invoicenolist=obj.invoiceNo;
						}
						else
						{
							invoicenolist=invoicenolist+","+obj.invoiceNo;
						}
						obj.invoiceNo_withoutPrefix=obj.invoiceNo;

						var invoiceNum=$filter('numberFixedLen')(obj.invoiceNo,$scope.lenPrefixInvoice);
						obj.invoiceNo=$scope.prefixInvoice+invoiceNum;

						obj.invoiceAmount=parseFloat(obj.invoiceAmount)*$scope.currencyRate;
						obj.paidAmount=parseFloat(obj.paidAmount)*$scope.currencyRate;
						var balance= obj.invoiceAmount-obj.paidAmount;
						totbalance+=balance;
						data[i].balancepayment=balance;

					}
					data[0].totalbalance=totbalance;

					//console.log(invoicenolist);
					$charge.adjustment().getByInvoiceId(invoicenolist).success(function(subdata)
					{
						//console.log(subdata);
						for (var i = 0; i < data.length; i++) {
							var invoicedata=data[i];
							invoicedata.adjustmenttype='0';

							for (var j = 0; j < subdata.length; j++) {
								if(subdata[j].invoiceid==invoicedata.invoiceNo_withoutPrefix)
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
						vm.isLoaded = true;

					}).error(function(subdata)
					{
						//console.log(subdata);
						$scope.invoicelist=data;
						vm.isLoaded = true;
					})

					//$scope.invoicelist=data;

				}).error(function(data)
				{
					//console.log(data);
					$scope.invoicelist=[];
					vm.isLoaded = true;
				})
			}
		}

		//$scope.receiptcount = 1;
		//$scope.issuecount = 1;
		//$scope.receiplist=[
		//	{
		//		modelname : 'receiptproduct1',
		//		quantityname : 'receiptquantity1'
		//	}
		//];
		//$scope.issuelist=[
		//	{
		//		modelname : 'issueproduct1',
		//		quantityname : 'issuequantity1'
		//	}
		//];

		//direct back to shell
		//$scope.closeApplication = function () {
		//	window.parent.dwShellController.closeCustomApp();
		//};

		$scope.convertCurrency = function(preferredCurrency)
		{

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
				//$charge.currency().calcCurrency($scope.BaseCurrency+"_"+preferredCurrency).success(function(data)
				$charge.currency().calcCurrency(1,$scope.BaseCurrency,preferredCurrency).success(function(data)
				{
					//
					//var el = document.createElement( 'html' );
					//el.innerHTML = data;
					//
					//var element=el.getElementsByTagName( 'span' );
					//var results=element[0].innerHTML.split(" ");
					//var param=$scope.BaseCurrency+"_"+preferredCurrency;
					//var results=data.results;
					//var result = results[param];
					var result = data;

					$scope.currencyratelist.push({
						currency : preferredCurrency,
						rate : result
					});
					//console.log($scope.currencyratelist);

					$scope.selectedCurrency = preferredCurrency;
					$scope.currencyRate = parseFloat(result);

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
					//console.log(data);
				})

			}

		}

		$scope.sortBy = function(propertyName,status,property) {

			vm.payments=$filter('orderBy')(vm.payments, propertyName, $scope.reverse)
			$scope.reverse =!$scope.reverse;
			if(status!=null) {
				if(property=='ID')
				{
					$scope.showId = status;
					$scope.showCust = false;
					$scope.showDate = false;
					$scope.showAmount = false;
					$scope.showMethod = false;
					$scope.showStat = false;
				}
				if(property=='Customer')
				{
					$scope.showId = false;
					$scope.showCust = status;
					$scope.showDate = false;
					$scope.showAmount = false;
					$scope.showMethod = false;
					$scope.showStat = false;
				}
				if(property=='Date')
				{
					$scope.showId = false;
					$scope.showCust = false;
					$scope.showDate = status;
					$scope.showAmount = false;
					$scope.showMethod = false;
					$scope.showStat = false;
				}
				if(property=='Amount')
				{
					$scope.showId = false;
					$scope.showCust = false;
					$scope.showDate = false;
					$scope.showAmount = status;
					$scope.showMethod = false;
					$scope.showStat = false;
				}
				if(property=='Method')
				{
					$scope.showId = false;
					$scope.showCust = false;
					$scope.showDate = false;
					$scope.showAmount = false;
					$scope.showMethod = status;
					$scope.showStat = false;
				}
				if(property=='Status')
				{
					$scope.showId = false;
					$scope.showCust = false;
					$scope.showDate = false;
					$scope.showAmount = false;
					$scope.showStat = status;
				}
			}
		};



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
		//  //
		//  //$scope.spinnerInvoice=true;
		//  $charge.invoice().all(skip,take,"desc").success(function(data) {
		//    //
		//    if(data.length<=take)
		//      $scope.lastSet=true;
		//      data.forEach(function(inv){
		//        //
		//        var accountID=inv.guAccountID;
		//        var invoiceDate=moment(inv.invoiceDate).format('LL');
		//        //
		//
		//        var user = $scope.getUserByID(accountID);
		//        //
		//        //while(user != undefined)
		//        //{
		//        //
		//        var invoice={};
		//        //
		//        if(user!=null) {
		//          invoice.person_name = user.profilename;
		//          invoice.othername=user.othername;
		//          invoice.email=user.email;
		//        }
		//        //
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
		//      //
		//      for (var i = 0; i < $scope.invoices.length; i++) {
		//        //
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
		//      //
		//      //skip += take;
		//  }).error(function(data) {
		//    //
		//    $scope.lastSet=true;
		//  })
		//};
		//
		//
		//$charge.commondata().getDuobaseFieldDetailsByTableNameAndFieldName("CTS_InvoiceAttributes","InvoicePrefix").success(function(data) {
		//  invoicePrefix=data[0];
		//  //
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
		//
		//  $scope.spinnerInvoice=true;
		//  $charge.invoice().all(skip,take,"desc").success(function(data) {
		//    //
		//    if(data.length<take)
		//      $scope.lastSet=true;
		//    data.forEach(function(inv){
		//      //
		//      var accountID=inv.guAccountID;
		//      var invoiceDate=moment(inv.invoiceDate).format('LL');
		//      //
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
		//    //
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
		//  //
		//  //all event false
		//  $scope.spinnerInvoice=true;
		//
		//  $charge.invoice().getByID(invoice.code).success(function(data) {
		//
		//    //
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
		//    //
		//    $scope.selectedInvoice.additionalcharge=data[0].additionalcharge*exchangeRate;
		//    $scope.selectedInvoice.invoiceAmount=data[0].invoiceAmount*exchangeRate;
		//    $scope.selectedInvoice.tax=data[0].tax*exchangeRate;
		//    $scope.selectedInvoice.dueDate=moment(data[0].dueDate.toString()).format('LL');
		//    $scope.selectedInvoice.logo=$rootScope.companyLogo;
		//    $scope.selectedInvoice.currency=data[0].currency;
		//    $scope.selectedInvoice.rate=exchangeRate;
		//
		//    //
		//    invoiceDetails.forEach(function(inv){
		//      //
		//      //productName=$scope.getProductByID(inv.guItemID);
		//      var currentProduct = $filter('filter')($scope.invProductList, { productId: inv.guItemID })[0];
		//      $scope.invProducts.push({
		//        product_name: currentProduct.product_name,
		//        unitprice: inv.unitPrice*exchangeRate,
		//        qty: inv.gty,
		//        amount: inv.totalPrice*exchangeRate
		//      });
		//    });
		//    //
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
		//  //
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
		//  //
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
		//  //
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
		//      //
		//      return product;
		//    }
		//    if(!isAvailable)
		//      count++;
		//
		//  });
		//  //
		//  return productName[count].product_name;
		//}
		//
		//$scope.GetAddress=function(name)
		//{
		//  //
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
