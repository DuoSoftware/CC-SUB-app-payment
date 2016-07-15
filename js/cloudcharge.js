(function(cc){
	var $h;
    //var service;
    function gst(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    function getSecurityToken() {
        var _st = gst("securityToken");
        return (_st != null) ? _st : "8bb4e93e877564262d46723d099108d9";
    }
	function BP(){
		var sfn,ffn, u,endpoint,domain, b, p,host,otherOptions="";
        var reqObj;
        function call(){
            //debugger;
            var domainReq = {
                method: "GET" ,
                url: "../js/config.json",
                headers: {'Content-Type': 'application/json', 'securityToken': getSecurityToken()}
            };
            //console.log(domainReq);
            $h(domainReq).success(function(data)
            {
                if (sfn && ffn){
                    for (key in data) {
                        if (data.hasOwnProperty(endpoint)) {
                            //console.log(data[r]["domain"]);
                            domain=data[endpoint]["domain"];
                            otherOptions=data[endpoint]["security"];
                            host='user77duocom.space.';
                            break;
                        }
                    }
                    if(otherOptions==undefined) {
                        reqObj = {
                            method: b ? "POST" : "GET",
                            url: "http://" + domain + u,
                            headers: {'Content-Type': 'application/json', 'securityToken': getSecurityToken()}
                        };
                    }
                    else {
                        reqObj = {
                            method: "JSONP",
                            url: "http://" + domain + u,
                            headers: {'Content-Type': 'application/json'}
                        };
                    }
                    //console.log(domainReq);
                    if (b) reqObj.data = b;
                    if (p) reqObj.params = p;
                    //console.log(reqObj);
                    $h(reqObj).
                      success(function(data, status, headers, config) {
                    	if (status == 200) sfn(data);
                    	else ffn(data);
                      }).
                      error(function(data, status, headers, config) {
                    	ffn(data);
                      });

                }
            }).error(function(data)
            {
                console.log(data);
            });
			//if (sfn && ffn){
			//var reqObj = {
             //   method: b ? "POST" : "GET" ,
             //   url: "http://" + ipAddress + u,
             //   headers: {'Content-Type': 'application/json', 'securityToken': getSecurityToken()}
            //};
			//if (b) reqObj.data = b;
            //if (p) reqObj.params = p;
             //   console.log(reqObj);
			////$h(reqObj).
			////  success(function(data, status, headers, config) {
			////	if (status == 200) sfn(data);
			////	else ffn(data);
			////  }).
			////  error(function(data, status, headers, config) {
		  	////	ffn(data);
			////  });
            //
			//}
		}
		return {
			success: function(f){sfn=f;call();return this;},
			error: function(f){ffn=f;return this;},
			p: function(ur,rr){u=ur;endpoint=rr;return this;},
			b: function(j){b =j;return this;},
            qp: function(po){p=po;return this;}
		}
	}

	cc.factory('$charge', function($http){
		$h = $http;
		return {
            profile: function(){ return new ProfileProxy();},
            payment: function(){ return new PaymentProxy();},
            invoice: function(){ return new InvoiceProxy();},
            adjustment: function(){ return new AdjustmentProxy();},
            commondata: function(){ return new CommonDataProxy();},
            converter: function(){ return new ConverterProxy();}
		}	
	});

    function PaymentProxy(){
        var p = BP();
        var service="payment";
        var handler = "/duosoftware.payment.service";
        p.all = function(s,t,o){p.p(handler + "/payment/getAllPayments/",service).qp({"skip":s,"take":t,"order":o}); return p;}
        p.getHeaderByID=function(s){p.p(handler + "/payment/GetPaymentDetails/",service).qp({"guPaymentID":s}); return p;}
        p.store = function(i){p.p(handler + "/payment/makePayment",service).b(i); return p;}
        p.getByID=function(s){p.p(handler + "/payment/searchPaymentbyID/",service).qp({"guPaymentID":s}); return p;}
        p.cancel=function(s){p.p(handler + "/payment/cancelPayment/",service).qp({"paymentNo":s}); return p;}
        return p;
    }

    function ProfileProxy(){
        var p = BP();
        var service="profile";
        var handler = "/duosoftware.profile.service";
        p.all = function(s,t,o){p.p(handler + "/profile/getAll/",service).qp({"skip":s,"take":t,"order":o}); return p;}
        p.store = function(i){p.p(handler + "/profile/insert",service).b(i); return p;}
        p.getByID=function(s){p.p(handler + "/profile/getById/",service).qp({"skip":s}); return p;}
        p.update = function(i){p.p(handler + "/profile/update",service).b(i); return p;}
        return p;
    }

    function InvoiceProxy(){
        var p = BP();
        var service="invoice";
        var handler = "/duosoftware.invoice.service";
        p.all = function(s,t,o){p.p(handler + "/invoice/getAll/",service).qp({"skip":s,"take":t,"order":o}); return p;}
        p.store = function(i){p.p(handler + "/invoice/insert",service).b(i); return p;}
        p.getByAccountID=function(s){p.p(handler + "/invoice/getbyAccountId/",service).qp({"accountid":s}); return p;}
        return p;
    }

    function AdjustmentProxy(){
        var p = BP();
        var service="adjustment";
        var handler = "/duosoftware.adjustment.service";
        p.allAdjustments = function(s,t,o){p.p(handler + "/adjustment/getAll/",service).qp({"skip":s,"take":t,"order":o}); return p;}
        p.store = function(i){p.p(handler + "/adjustment/insert",service).b(i); return p;}
        p.update = function(i){p.p(handler + "/adjustment/update",service).b(i); return p;}
        p.getByInvoiceId=function(s){p.p(handler + "/adjustment/getByInvoiceId/",service).qp({"invoiceId":s}); return p;}
        p.getByAdjustmentId=function(s){p.p(handler + "/adjustment/getById/",service).qp({"id":s}); return p;}
        return p;
    }

    function CommonDataProxy(){
        var p = BP();
        //debugger;
        var service="commondata";
        var handler = "/duosoftware.commondata.service";
        p.all = function(s,t,o){p.p(handler + "/commondata/getAll/",service).qp({"skip":s,"take":t,"order":o}); return p;}
        p.store = function(i){p.p(handler + "/commondata/insert",service).b(i); return p;}
        p.getDuobaseFieldDetailsByTableNameAndFieldName=function(s,t){p.p(handler + "/commondata/getDuobaseFieldDetailsByTableNameAndFieldName/",service).qp({"tableName":s,"fieldName":t}); return p;}
        p.getUOMConversionByUOMId=function(s){p.p(handler + "/commondata/getUOMConversionByUOMId/",service).qp({"skip":s}); return p;}
        p.getUOMAppMapperByUOMId=function(s){p.p(handler + "/commondata/getUOMAppMapperByUOMId/",service).qp({"skip":s}); return p;}
        return p;
    }

    function ConverterProxy(){
        var p = BP();
        var service="currencyRate";
        var handler = "/api/v3";
        p.calcCurrency = function(o){p.p(handler + "/convert?callback=JSON_CALLBACK",service).qp({"q":o}); return p;}
        return p;
    }


})(angular.module("cloudcharge", []));