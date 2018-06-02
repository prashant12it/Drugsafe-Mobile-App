var __SITE_JS_PATH__ = 'http://connect.drugsafe.com.au/webservices/';
var __SITE_URL__ = 'http://connect.drugsafe.com.au/';
/*var __SITE_JS_PATH__ = 'http://drugsafe.dev.mobileconnekt.com.au/webservices/';
var __SITE_URL__ = 'http://drugsafe.dev.mobileconnekt.com.au/';*/
/*var __SITE_JS_PATH__ = 'http://local.drugsafe.com/webservices/';
 var __SITE_URL__ = 'http://local.drugsafe.com/';*/
var __SITE_SIGN_URL__ = __SITE_URL__+'uploadsign/';
function logout() {
    localStorage.clear();
    if (!(localStorage.getItem("userid") > '0') && !(localStorage.getItem("role") > '0')) {
        window.location.href = 'index.html';
    }
}

$(document).ready(function () {
    $('#logout').click(function () {

    });
});
function validateEmail(email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test(email);
}

function validatePhone(phone) {
    var phoneReg = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
    return phoneReg.test(phone);
}

function showpage(){

}
function opennewsos(backcheck) {
    localStorage.removeItem('siteid');
    localStorage.removeItem('sosid');
    localStorage.setItem("backcheck", backcheck);
    window.location.href = 'SOS.html';
}

function getblur(id) {
    $('#'+id).blur();
}

function checkhour(id,hourmin,hourmax) {
    var hoursval = $('#'+id).val();
    if((parseInt(hoursval) < hourmin)|| (parseInt(hoursval) > hourmax)){
        navigator.notification.alert("Enter valid hours.",showpage, 'Alert', 'OK');
    }else{
        return true;
    }
}

function checkminute(id) {
    var minval = $('#'+id).val();
    if((parseInt(minval) < 0)|| (parseInt(minval) > 59)){
        navigator.notification.alert("Enter valid minutes.",showpage, 'Alert', 'OK');
    }else{
        return true;
    }
}

function calbackfocusfield(fieldid){
    $('#'+fieldid).focus();
}

function openurl(url) {
    window.location.href = url;
}

function openorderdetails(franchiseeid) {
    var jdata = {
        franchiseeid: localStorage.getItem("userid")
    }
    $('.loader-modal').css('display', 'block');
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getfranchiseecartitems/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            var htmldata = '';
            if(html.code == '200'){
                $('.loader-modal').css('display', 'none');
                if(html.cartarr.length > 0){
                    openurl('order-details.html');
                }else {
                    navigator.notification.alert("Your cart is empty. Add some products in your cart to continue ordering.",function () {
                        openurl('categorylisting.html');
                    }, 'Alert', 'OK');
                }
            }else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert("Your cart is empty. Add some products in your cart to continue ordering.",function () {
                    openurl('categorylisting.html');
                }, 'Alert', 'OK');
            }
        }
    });
}
function combinetime24(hourid,minid) {
    var hour = $('#'+hourid).val();
    var min = $('#'+minid).val();
    if(min=='' || min== ' '){
        //$('#'+minid).val('00');
        min = '00';
    }
    var combinetime = hour+' : '+min;
    return combinetime;

}
function showsignpad(id,originalid) {
    $('#'+id).show();
    $('.repsignature').hide();
    $('.'+id+'-change-sign').hide();
    $('.'+id+'-nochange-sign').show();
    $('#'+originalid).val(0);
}
function hidesignpad(id,originalid) {
    $('#'+id).hide();
    $('.repsignature').show();
    $('.'+id+'-nochange-sign').hide();
    $('.'+id+'-change-sign').show();
    $('#'+originalid).val(1);
}

function resetsign(signid) {
    $('#'+signid).val(0);
}

function changesignoptions(buttonIndex,signid,canvasid) {
    if(buttonIndex == '1'){
        hidesignpad(canvasid,signid);
    }else{
        showpage();
        return false;
    }
}
function validateminutes(id){
    if(parseInt($('#'+id).val()) > 59 || parseInt($('#'+id).val()) < 0) {
        navigator.notification.alert('Enter valid minutes.', function () {
            calbackfocusfield(id);
        }, 'Error', 'OK');
        return false;
    }else{
        return true;
    }
}

function validateHours(id){
    if(parseInt($('#'+id).val()) > 23 || parseInt($('#'+id).val()) < 0) {
        navigator.notification.alert('Enter valid hours.', function () {
            calbackfocusfield(id);
        }, 'Error', 'OK');
        return false;
    }else{
        return true;
    }
}
function showsospdf(sosid,gohome) {
    $('.loader-modal').css('display', 'block');
    if(!gohome){
        gohome = 0;
    }
    var jdata = {
        sosid: sosid
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "sosformpdf/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            if(html.code == '200'){
                $('.loader-modal').css('display', 'none');
                window.open(html.file,'_system');
                if(gohome == '1'){
                    gotomainmenu();
                }
            }
        }
    });
}
function marksoscomplete(sosid,lab,print) {
    if(!lab){
        lab = 0;
    }
    if(!print){
        print = 0;
    }
    if(localStorage.getItem("role") == '6'){
        var jdata = {
            franchiseeid: localStorage.getItem("agentfranchiseeid"),
            sosid: sosid
        }
    }else {
        var jdata = {
            franchiseeid:localStorage.getItem("userid"),
            sosid: sosid
        }
    }
    $('.loader-modal').css('display', 'block');
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "testcompletebyinventorycheck/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            if(html.code == '200'){
                $('#complete-sos-options .modal-title').html('Drug Test Status');
                $('#complete-sos-options .modal-body').html('Drug Test completed successfully.');
                $('#print-sos').attr('onclick','showsospdf('+sosid+')');
                if(lab == 1){
                    addLabAdviceForm(sosid);
                }else if(print == '1'){
                    $('#print-lab-advice').hide();
                }else{
                    $('#print-lab-advice').hide();
                }
                if(lab != 1){
                    $('.loader-modal').css('display', 'none');
                    $('#complete-sos-options').modal({backdrop: 'static', keyboard: false});
                    $('#complete-sos-options').modal('show');
                }

            }else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, showpage, 'Error', 'OK');
            }
        }
    });
}

function addLabAdviceForm(sosid) {
    var jdata = {
        sosid: sosid
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "generateLabAdviceForm/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            if(html.code == '200'){
                if(html.result != '0'){
                    $('#print-lab-advice').attr('onclick','printLabAdvice("1","'+html.result+'","'+sosid+'")');
                    $('#print-lab-advice').show();
                }else{
                    $('#print-lab-advice').hide();
                }

            }else {
                $('#print-lab-advice').hide();
            }
            $('.loader-modal').css('display', 'none');
            $('#complete-sos-options').modal({backdrop: 'static', keyboard: false});
            $('#complete-sos-options').modal('show');
        }
    });
}

function printLabAdvice(buttonIndex,fileurl,sosid) {
    if(buttonIndex == '1'){
        window.open(fileurl,'_system');
        // gotomainmenu();
    }else {
        showsospdf(sosid);
    }
}

function printSOSForm(buttonIndex,fileurl,sosid) {
    if(buttonIndex == '1'){
        showsospdf(sosid,1);
        // gotomainmenu();
    }
}

function gotomainmenu(){
    window.location.href = 'franchisee-menu.html';
}

function showTnc(){
    $('#tnc').modal('show');
}