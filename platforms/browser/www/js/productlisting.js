function getproducts(catid) {
    var jdata = {
        catid: catid
    }
    $('.loader-modal').css('display', 'block');
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getallprodbycatid/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            var htmldata = '';
            if(html.code == '200'){
                $.each( html.prodarr, function( key, value ) {
                    htmldata += '<div class="product-list-row">'+
                        '<h3>'+value.szProductCode+'</h3>'+
                    '<p>Price: $'+parseFloat(value.szProductCost).toFixed(2)+'</p>'+
                    '<p><input type="number" min="1" max="100" value="" id="prodqty'+value.id+'" name="prodqty'+value.id+'" placeholder="Quantity">' +
                        '<input type="hidden" value="'+value.min_ord_qty+'" id="minprodqty'+value.id+'" name="minprodqty'+value.id+'"></p>'+
                        '<button type="button" class="green-btn" onclick="addtocart(\''+value.id+'\');"><i class="fa fa-opencart" aria-hidden="true"></i></button>'+
                        '</div>';
                });
                $('#prod-list-sec').html(htmldata);
                $('.loader-modal').css('display', 'none');
            }else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert("No products found in this category.",function () {
                    openurl('categorylisting.html');
                }, 'Alert', 'OK');
            }
        }
    });
}

function addtocart(prodid) {
    var quantity = $('#prodqty'+prodid).val();
    var minOrdQty = $('#minprodqty'+prodid).val();
    if(parseInt(quantity)>= parseInt(minOrdQty)){
        var jdata = {
            franchiseeid: localStorage.getItem("userid"),
            productid:prodid,
            quantity:quantity
        }
        $('.loader-modal').css('display', 'block');
        $.ajax({
            datatype: "json",
            url: __SITE_JS_PATH__ + "addtocart/",
            type: "POST",
            crossDomain: true,
            cache: false,
            data: JSON.stringify(jdata),
            success: function (html) {
                var htmldata = '';
                if(html.code == '200'){
                    $('.loader-modal').css('display', 'none');
                    navigator.notification.alert(html.message,function () {
                        showcartitems(localStorage.getItem("userid"));
                    }, 'Success', 'OK');
                }else {
                    $('.loader-modal').css('display', 'none');
                    navigator.notification.alert("Minimum quantity allowed for this product is "+minOrdQty+". Enter valid quantity to proceed further",function () {
                        calbackfocusfield('prodqty'+prodid);
                    }, 'Error', 'OK');
                }
            }
        });
    }else{
        navigator.notification.alert("Minimum quantity allowed for this product is "+minOrdQty+". Enter valid quantity to proceed further.",function () {
            calbackfocusfield('prodqty'+prodid);
        }, 'Error', 'OK');
    }
}

function showcartitems(franchiseeid) {
    var jdata = {
        franchiseeid: franchiseeid
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
                htmldata += '<button type="button" class="green-btn" onclick="openurl(\'order-details.html\')">'+html.cartarr.length+'<span><i class="fa fa-opencart" aria-hidden="true"></i></span></button>';
                $('.cart-button').html(htmldata);
                $('.loader-modal').css('display', 'none');
            }
        }
    });
}