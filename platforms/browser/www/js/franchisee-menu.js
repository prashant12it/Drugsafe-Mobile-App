/**
 * Created by whiz16 on 23-Dec-16.
 */
if (!(localStorage.getItem("userid") > '0')) {
    window.location.href = 'index.html';
}else if(localStorage.getItem("role") == '2'){
    var jdata = {
        franchiseeid: localStorage.getItem("userid")
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
            var htmldata = '';
            if(html.code == '200'){
                var statcount = 0;
                $.each( html.dataarr, function( key, value ) {
                    $.each( value, function( keysub, valuesub ) {
                        if (valuesub[0].Status == '0') {
                            statcount = parseInt(statcount) + 1;
                        }
                    });
                });
                var onclickvar = '';
                if(statcount > '0'){
                    onclickvar = 'onclick="openpendinglist();"';
                }else{
                    onclickvar = 'onclick="opennewsos(\''+1+'\');"';
                }
                htmldata = '<p><button type="button" class="button green-btn" '+onclickvar+'>SOS Form<span><i class="fa fa-file-text" aria-hidden="true"></i></span></button></p>' +
                    '<p><button type="button" class="button green-btn" onclick="opencategorylist()">Order Stock<span><i class="fa fa-cubes" aria-hidden="true"></i></span></button></p>';
                $('.franchisee-menu').html(htmldata);
                $('.loader-modal').css('display', 'none');
            }else {
                htmldata = '<p><button type="button" class="button green-btn" onclick="opennewsos(\''+1+'\');">SOS Form<span><i class="fa fa-file-text" aria-hidden="true"></i></span></button></p>' +
                    '<p><button type="button" class="button green-btn" onclick="opencategorylist()">Order Stock<span><i class="fa fa-cubes" aria-hidden="true"></i></span></button></p>';
                $('.franchisee-menu').html(htmldata);
                $('.loader-modal').css('display', 'none');
            }
        }
    });
}else if(localStorage.getItem("role") == '6'){
    var jdata = {
        agentid: localStorage.getItem("userid")
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
            var htmldata = '';
            if(html.code == '200'){
                var statcount = 0;
                $.each( html.dataarr, function( key, value ) {
                    $.each( value, function( keysub, valuesub ) {
                        if (valuesub[0].Status == '0') {
                            statcount = parseInt(statcount) + 1;
                        }
                    });
                });
                var onclickvar = '';
                if(statcount > '0'){
                    onclickvar = 'onclick="openpendinglist();"';
                }else{
                    onclickvar = 'onclick="opennewsos(\''+1+'\');"';
                }
                htmldata = '<p><button type="button" class="button green-btn" '+onclickvar+'>SOS Form<span><i class="fa fa-file-text" aria-hidden="true"></i></span></button></p>';
                $('.franchisee-menu').html(htmldata);
                $('.loader-modal').css('display', 'none');
            }else {
                htmldata = '<p><button type="button" class="button green-btn" onclick="opennewsos(\''+1+'\');">SOS Form<span><i class="fa fa-file-text" aria-hidden="true"></i></span></button></p>';

                $('.franchisee-menu').html(htmldata);
                $('.loader-modal').css('display', 'none');
            }
        }
    });
}

function openpendinglist() {
    window.location.href = 'form-pending-list.html';
}
function opencategorylist() {
    window.location.href = 'categorylisting.html';
}