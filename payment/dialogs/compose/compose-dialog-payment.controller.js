
(function ()
{
  'use strict';

  angular
    .module('app.payment')
    .controller('AddPaymentEmailController', AddPaymentEmailController);

  /** @ngInject */
  function AddPaymentEmailController($mdDialog, selectedPayment, base64Content,adminData, $scope, $charge,notifications)
  {
    var vm = this;


    vm.hiddenCC = true;
    vm.hiddenBCC = true;
    vm.readonly = false;
    vm.removable = false;
    $scope.addAttachment = true;
    $scope.recipients=[];
    $scope.selectedUser = [];
    //$scope.focusedItemName='';

    // If replying
    if ( angular.isDefined(selectedPayment) )
    {
      $scope.selectedPayment = selectedPayment;
      //$scope.selectedUser = [selectedInvoice.person_name];
      $scope.selectedPayment.email=$scope.selectedPayment.UserEmail;
      $scope.recipients.push({"display":selectedPayment.UserName,"value":selectedPayment});
      $scope.bodycontent='<p>Dear '+ selectedPayment.customer +','+"</p><p></p>" +'<p>Thank You for your business.' +"</p>" +'<p>Your payment '
      +$scope.selectedPayment.paymentNo+' can be viewed, printed or downloaded as a PDF file from the link below.' + '</p>'
        + '<p>We look forward to doing more business with you.</p>';
      $scope.subject=$scope.selectedPayment.paymentNo + ' ' + $scope.selectedPayment.UserName;
      if(adminData!=null) {
        adminData.email = adminData.Email;
        $scope.selectedUser.push({"display": adminData.Username, "value": adminData})
      }
    }

    vm.autocompleteDemoRequireMatch = true;
    $scope.selectedPayment=selectedPayment;

    $scope.profilelist = [];

    var skipprofiles=0;
    var takeprofiles=10;

    function loadAll() {

      $charge.profile().all(skipprofiles,takeprofiles,'asc').success(function(data){
        console.log(data);
        skipprofiles+=takeprofiles;
        for (var i = 0; i < data.length; i++) {
          var obj=data[i];

          if(obj.status==0)
          {

          }
          else if(obj.profile_type=='Business')
          {
            $scope.profilelist.push({
              display : obj.business_name,
              value : {profilename : obj.business_name, profileId : obj.profileId, othername : obj.business_contact_name, profile_type : obj.profile_type}
            });
          }
          else if(obj.profile_type=='Individual')
          {
            $scope.profilelist.push({
              display : obj.first_name,
              value : {profilename : obj.first_name, profileId : obj.profileId, othername : obj.last_name, profile_type : obj.profile_type}
            });
          }

        }
        //loadAll();
        $scope.filteredUsers = $scope.profilelist;

        //for (i = 0, len = data.length; i<len; ++i){
        //    $scope.allBanks.push ({display: data[i].BankName, value:{TenantID:data[i].TenantID, value:data[i].BankName.toLowerCase()}});
        //}

      }).error(function(data){
        //alert ("Error getting all banks");
      });

    }
    loadAll();
    var self = this;
    // list of `state` value/display objects
    //self.tenants        = loadAll();
    self.readonly = false;
    self.selectedItem = null;
    self.searchText = null;
    self.numberChips = [];
    self.numberChips2 = [];
    self.numberBuffer = '';
    self.autocompleteDemoRequireMatch = true;
    $scope.transformChip = transformChip;

    //self.querySearch   = querySearch;
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for tenants... use $timeout to simulate
     * remote dataservice call.
     */

    $scope.querySearch = function querySearch (query) {

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

    var skip,take;
    var tempProfileList;
    $scope.filteredUsers = [];
    $scope.isAutoTODisabled = false;
    //var autoElem = angular.element('#invoice-auto');
    $scope.searchMre=false;
    $scope.loadProfileByKeyword= function (keyword, elem) {
      if(!$scope.searchMre) {
        //debugger;
        if ($scope.profilelist.length == 9) {
          if (keyword != undefined) {
            if (keyword.length == 3) {
              if(elem=='to'){
                $scope.isAutoTODisabled = true;
              }else{
                $scope.isAutoCCDisabled = true;
              }
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
                //autoElem.focus();
                if(elem=='to'){
                  $scope.isAutoTODisabled = false;
                }else{
                  $scope.isAutoCCDisabled = false;
                }
                setTimeout(function(){
                  if(elem=='to'){
                    document.querySelector('#acProfileIdPayment1').focus();
                  }else{
                    document.querySelector('#acProfileIdPayment2').focus();
                  }
                },0);
                if (data.length < take)
                  $scope.searchMre = true;
                //skip += take;
                //$scope.loadPaging(keyword, rows, index, status, skip, take);
              }).error(function (data) {
                if(elem=='to'){
                  $scope.isAutoTODisabled = false;
                }else{
                  $scope.isAutoCCDisabled = false;
                }
                setTimeout(function(){
                  if(elem=='to'){
                    document.querySelector('#acProfileIdPayment1').focus();
                  }else{
                    document.querySelector('#acProfileIdPayment2').focus();
                  }
                },0);
                //autoElem.empty();
                //debugger;
                //vm.products = [];
                //vm.selectedProduct = null;
              });
            }
            else if(keyword.length>3)
            {
              //debugger;
              skip = 0;
              take = 10;
              tempProfileList = [];
              if(elem=='to'){
                $scope.isAutoTODisabled = true;
              }else{
                $scope.isAutDisabled = true;
              }
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
                //debugger;
                if(elem=='to'){
                  $scope.isAutoTODisabled = false;
                }else{
                  $scope.isAutoCCDisabled = false;
                }

                setTimeout(function(){
                  if(elem=='to'){
                    document.querySelector('#acProfileIdPayment1').focus();
                  }else{
                    document.querySelector('#acProfileIdPayment2').focus();
                  }
                },0);

                if (data.length < take)
                  $scope.searchMre = true;
              }).error(function (data) {
                if(elem=='to'){
                  $scope.isAutoTODisabled = false;
                }else{
                  $scope.isAutoCCDisabled = false;
                }
                setTimeout(function(){
                  if(elem=='to'){
                    document.querySelector('#acProfileIdPayment1').focus();
                  }else{
                    document.querySelector('#acProfileIdPayment2').focus();
                  }
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
      //debugger;
      if (ev.keyCode === 8) {
        $scope.searchMre = false;
      }
    }

    function transformChip(chip) {
      debugger;
      // If it is an object, it's already a known chip
      if (angular.isObject(chip)) {
        return chip;
      }

      // Otherwise, create a new one
      return { name: chip, type: 'new' }
    }

    // Methods
    $scope.closeDialog = closeDialog;

    vm.newVeg = function(chip) {
      return {
        name: chip,
        type: 'unknown'
      };
    };

    //////////

    function closeDialog()
    {
      $mdDialog.hide();
    }






    $scope.sendMail= function () {
      $scope.cc=[];
      $scope.to=[];
      for(var i=0;i<$scope.recipients.length;i++)
      {
        $scope.to.push($scope.recipients[i].value.email);
      }

      for(var i=0;i<$scope.selectedUser.length;i++)
      {
        $scope.cc.push($scope.selectedUser[i].value.email);
      }
      var req={
        "app" :"Payment",
        "html":base64Content,
        "id":$scope.selectedPayment.paymentNoWithoutPrefix,
        "body":$scope.bodycontent,
        "subject" :$scope.subject,
        "to":$scope.to,
        "cc":$scope.cc
      }
      $charge.document().sendMail(req).success(function(data) {
        var parsedData=JSON.parse(data);
        notifications.toast(parsedData.data.message, "success");
      }).error(function (data) {
        var parsedData=JSON.parse(data);
        notifications.toast(parsedData.data.message, "error");
      });
    }
  }
})();
