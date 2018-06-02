function getClientDetails() {
    $('.loader-modal').css('display', 'block');

    var jdata = {
        clientid: localStorage.getItem("userid")
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getclientdetailsbyclientid/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {

            //var obj = JSON.parse(html);

            if (html.dataarr[0].id > '0') {
                if (html.dataarr[0].clientType > '0') {
                    localStorage.setItem("role", '4');
                } else {
                    localStorage.setItem("role", '3');
                }
                if (localStorage.getItem('role') == '3') {
                    getclientssitesbyclientid(localStorage.getItem("userid"));
                }else if (localStorage.getItem('role') == '4') {
                    opensosforms(localStorage.getItem("userid"));
                }

            } else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, showpage, 'Error', 'OK');
            }
        }
    });
}

function getclientssitesbyclientid(clientid) {
    var jdata = {
        clientid: clientid
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getclientsites/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            if (html.code == '200') {
                var htmldata = '';
                $.each( html.dataarr, function( key, value ) {
                    var onclickvar = '';
                    onclickvar = 'onclick="opensosforms('+value.clientId+');"';
                    htmldata += '<p><button type="button" class="button green-btn" '+onclickvar+'>'+value.szName+'<span><i class="fa fa-building" aria-hidden="true"></i></span></button></p>';
                });
                $('.client-report').html(htmldata);
                $('.loader-modal').css('display', 'none');

            } else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, showpage, 'Error', 'OK');
            }
        }
    });
}

function opensosforms(clientid) {
    localStorage.setItem("clientsite",clientid);
    if(localStorage.getItem("clientsite") == clientid) {
        window.location.href = "clientsosformslist.html";
    }

}