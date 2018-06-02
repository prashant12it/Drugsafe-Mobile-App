function getcategories() {
    var jdata = {
        nodata: ""
    }
    $('.loader-modal').css('display', 'block');
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getallcategories/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            var htmldata = '';
            if(html.code == '200'){
                $.each( html.catarr, function( key, value ) {
                    htmldata += '<p><button type="button" onclick="openprodlist(\''+value.id+'\',\''+value.szName+'\')" class="button green-btn">'+value.szName+'</button></p>';
                });

                $('.category-list').html(htmldata);
                $('.loader-modal').css('display', 'none');
            }else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert("No categories found.",showpage, 'Error', 'OK');
            }
        }
    });
}

function openprodlist(catid,catname) {
    localStorage.setItem('catid',catid);
    localStorage.setItem('catname',catname);
    window.location.href = 'product-list.html';
}
