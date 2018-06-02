if (!(localStorage.getItem("userid") > '0')) {
    window.location.href = 'index.html';
}else if(localStorage.getItem("role") == '2'){

    var jdata = {
        franchiseeid: localStorage.getItem("userid"),
        status: 1
    }
    $('.loader-modal').css('display', 'block');
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getfranchiseesosdata/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            if(html.code == '200'){
                var newhtml = '';
                var allrecs = [];
                $.each( html.dataarr, function( key, value ) {
                    $.each( value, function( key1, value1 ) {
                        if($.inArray( value1[0].id, allrecs ) == -1){
                            allrecs.push(value1[0].id);
                            var clientn = value1[0].clientname;
                            var siten = value1[0].sitename;
                            newhtml += '<p><button type="button" class="button green-btn clientsitependings" onclick="getmysos(\''+value1[0].Clientid+'\')">'+clientn+'<br>'+siten+'<span><i class="fa fa-pencil-square-o" aria-hidden="true"></i></span></button></p>';
                        }
                    });
                });
                newhtml += '<br><p><button type="button" class="button green-btn" onclick="opennewsos(\''+2+'\')">New SOS Form<span><i class="fa fa-file-text" aria-hidden="true"></i></span></button></p>';
                $('.login-box').html(newhtml);
                $('.loader-modal').css('display', 'none');
            }else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, showpage, 'Error', 'OK');
            }
        }
    });
}else if(localStorage.getItem("role") == '6'){

    var jdata = {
        agentid: localStorage.getItem("userid"),
        status: 1
    }
    $('.loader-modal').css('display', 'block');
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getagentsosdata/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            if(html.code == '200'){
                var newhtml = '';
                $.each( html.dataarr, function( key, value ) {
                    $.each( value, function( key1, value1 ) {
                        var clientn = value1[0].clientname;
                        var siten = value1[0].sitename;
                        newhtml += '<p><button type="button" class="button green-btn clientsitependings" onclick="getmysos(\''+value1[0].Clientid+'\')">'+clientn+'<br>'+siten+'<span><i class="fa fa-pencil-square-o" aria-hidden="true"></i></span></button></p>';
                    });
                });
                newhtml += '<br><p><button type="button" class="button green-btn" onclick="opennewsos(\''+2+'\')">New SOS Form<span><i class="fa fa-file-text" aria-hidden="true"></i></span></button></p>';
                $('.login-box').html(newhtml);
                $('.loader-modal').css('display', 'none');
            }else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, showpage, 'Error', 'OK');
            }
        }
    });
}

function getmysos(id) {
    localStorage.setItem("siteid", id);
    localStorage.setItem("backcheck", 2);
    window.location.href = 'SOS.html';
}
