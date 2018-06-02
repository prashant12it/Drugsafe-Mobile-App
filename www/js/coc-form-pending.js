if (!(localStorage.getItem("userid") > '0')) {
    window.location.href = 'index.html';
}else{
    localStorage.setItem("backtrack", '2');
    var jdata = {
        sosid: localStorage.getItem("sosid")
    }
    $('.loader-modal').css('display', 'block');
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getdonorsbysosid/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            if(html.code == '200'){
                var newhtml = '';
                var complete = 0;
                var onlysos = 0;
                var nococdonor = 0;
                var total = 0;
                var formleft = 0;
                $.each( html.dataarr, function( key, value ) {
                    total = parseInt(total)+1;
                    var doner = value.donerName;
                    var idcoc = value.cocid;
                    if(idcoc > '0' && value.cocstatus == '0'){
                        nococdonor = parseInt(nococdonor)+1;
                        formleft = parseInt(formleft)+1;
                        newhtml += '<p><button type="button" class="button green-btn" onclick="getmycoc(\''+idcoc+'\')">'+doner+'<span><i class="fa fa-pencil-square-o" aria-hidden="true"></i></span></button></p>';
                    }
                    if(idcoc > '0' && value.cocstatus == '1'){
                        complete = parseInt(complete)+1;
                        newhtml += '<p><button type="button" class="button green-btn">'+doner+'<span><i class="fa fa-check-square" aria-hidden="true"></i></span></button></p>';
                    }
                    if(idcoc == '0' && value.cocstatus == '0'){
                        onlysos = parseInt(onlysos)+1;
                    }
                });
                localStorage.setItem("formleft", formleft);
                newhtml += '<br><p><button type="button" class="button green-btn" '+(total == (parseInt(complete)+parseInt(onlysos))?"style=\'background:rgb(17,156,111)\'":"style=\'background:rgba(17,156,111,0.6)\'")+' onclick="marksoscomplete(\''+localStorage.getItem("sosid")+'\',\'1\');" '+(total == (parseInt(complete)+parseInt(onlysos))?"":"disabled=\'disabled\'")+'>Completed<span><i class="fa fa-file-text" aria-hidden="true"></i></span></button></p>';
                $('.login-box').html(newhtml);
                $('.loader-modal').css('display', 'none');
            }else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, showpage, 'Error', 'OK');
            }
        }
    });
}
function getmycoc(id) {
    localStorage.setItem("cocid", id);
    window.location.href = 'COC.html';
}
