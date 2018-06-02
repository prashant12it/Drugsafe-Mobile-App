function userLoginFromIndex() {
    $('.loader-modal').css('display', 'block');
    var getemailid = $('#szEmail').val();
    var getpass = $('#szPassword').val();
    if(getemailid == 'Email ID'){
        getemailid = '';
    }
    if(getpass == 'Password'){
        getpass = '';
    }
    
    var jdata = {
        szEmail: getemailid,
        szPassword: getpass,
        szrole: $('#szrole').val()
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "userlogin/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            //var obj = JSON.parse(html);
            if (html.code == '200') {
                if (html.userid > '0') {
                    localStorage.setItem("userid", html.userid);
                    localStorage.setItem("role", html.role);
                    if (localStorage.getItem("userid") > '0' && (localStorage.getItem("role") == '2' || localStorage.getItem("role") == '6')) {
                        if(localStorage.getItem("role") == '6'){
                            getagentfranchisee();
                        }else{
                            window.location.href = 'franchisee-menu.html';
                        }
                    } else if (localStorage.getItem("userid") > '0' && (localStorage.getItem("role") == '3') || (localStorage.getItem("role") == '4')) {
                        window.location.href = 'clientreport.html';
                    }
                }
            } else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, showpage, 'Error', 'OK');
            }
        }
    });
}

function getagentfranchisee() {
    var jdata = {
        agentid: localStorage.getItem("userid")
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getagentfranchisee/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            if (html.code == '200') {
                    localStorage.setItem("agentfranchiseeid", html.franchiseeid);
                window.location.href = 'franchisee-menu.html';
            } else {
                navigator.notification.alert(html.message, showpage, 'Error', 'OK');
            }
        }
    });
}

function changetype(eve) {
    var getval = $(eve).val();
    var gettype = $(eve).attr('type');
}

$(document).ready(function () {
    $('#szEmail').click(function () {
        var getemail = $('#szEmail').val();
        var getpass = $('#szPassword').val();
        var getpasstype = $('#szPassword').attr('type');
        if(getemail == 'Email ID'){
            $('#szEmail').val('');
        }
        if((getpass == '') && (getpasstype == 'password')){
            $('#szPassword').val('Password');
            $('#szPassword').prop('type','text');
        }


    });
    $('#szPassword').click(function () {
        var getemail = $('#szEmail').val();
        var getpass = $('#szPassword').val();
        var getpasstype = $('#szPassword').attr('type');
        if((getpass == 'Password') && (getpasstype == 'text')){
            $('#szPassword').val('');
            $('#szPassword').prop('type','password');
            $( "#szPassword" ).trigger( "click" );
            $('#szPassword').focus();
        }
        if(getemail == ''){
            $('#szEmail').val('Email ID');
        }
    });
});