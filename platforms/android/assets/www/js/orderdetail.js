function getorder(franchiseeid) {
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
            var proddata = '';
            if (html.code == '200') {
                htmldata += '<button type="button" class="green-btn" onclick="openurl(\'order-details.html\')">' + html.cartarr.length + '<span><i class="fa fa-opencart" aria-hidden="true"></i></span></button>';
                $('.cart-button').html(htmldata);
                var totalprice = 0.00;
                var counter = 1;
                $.each(html.cartarr, function (key, value) {
                    var price = parseFloat(value.szProductCost).toFixed(2);
                    var totalprodprice = price * value.quantity;
                    proddata += '<div class="product-list-row"><div class="row">' +
                        '<div class="col-xs-5"><p>Product</p></div>' +
                        '<div class="col-xs-7"><p id="prodcode' + counter + '">' + value.szProductCode + '</p><a class="del-cart-product" href="javascript:void(0)" onclick="delcartprodconfirmation(\'' + value.productid + '\')"><i class="fa fa-trash" aria-hidden="true"></i></a></div>' +
                        '</div></div>' +
                        '<div class="product-list-row"><div class="row">' +
                        '<div class="col-xs-5"><p>Quantity</p></div>' +
                        '<div class="col-xs-7"><p>' +
                        '<input type="number" min="1" max="100" value="' + value.quantity + '" name="qty' + counter + '" id="qty' + counter + '">' +
                        '<input type="hidden" value="' + value.min_ord_qty + '" name="minqty' + counter + '" id="minqty' + counter + '">' +
                        '</p></div>' +
                        '</div></div>' +
                        '<div class="product-list-row"><div class="row">' +
                        '<div class="col-xs-5"><p>Price($)</p></div>' +
                        '<div class="col-xs-7"><p>' + price + '</p></div>' +
                        '</div></div>' +
                        '<div class="product-list-row"><div class="row">' +
                        '<div class="col-xs-5"><p>Total($)</p></div>' +
                        '<div class="col-xs-7"><p>' + parseFloat(totalprodprice).toFixed(2) + '</p></div>' +
                        '</div></div>' +
                        '<input type="hidden" name="cartid' + counter + '" id="cartid' + counter + '" value="' + value.id + '"><br/>' +
                        '';
                    totalprice = totalprice + totalprodprice;
                    counter++;
                });
                proddata += '<input type="hidden" name="totcartitems" id="totcartitems" value="' + (parseInt(counter) - 1) + '">' +
                    '<input type="hidden" name="totcartprice" id="totcartprice" value="' + parseFloat(totalprice).toFixed(2) + '">';
                $('#cart-prod-listing').html(proddata);
                $('.cart-total span').html(parseFloat(totalprice).toFixed(2));
                $('.loader-modal').css('display', 'none');
                if (counter == 1) {
                    navigator.notification.alert("Your cart is empty. Add some products in your cart to continue ordering..", function () {
                        openurl('categorylisting.html');
                    }, 'Alert', 'OK');
                }

            } else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert("Your cart is empty. Add some products in your cart to continue ordering.", function () {
                    openurl('categorylisting.html');
                }, 'Alert', 'OK');
            }
        }
    });
}

function delcartprod(buttonIndex, productid) {
    if (buttonIndex == '1') {
        var jdata = {
            franchiseeid: localStorage.getItem("userid"),
            productid: productid
        }
        $('.loader-modal').css('display', 'block');
        $.ajax({
            datatype: "json",
            url: __SITE_JS_PATH__ + "deleteitemfromcart/",
            type: "POST",
            crossDomain: true,
            cache: false,
            data: JSON.stringify(jdata),
            success: function (html) {
                var htmldata = '';
                if (html.code == '200') {
                    $('.loader-modal').css('display', 'none');
                    navigator.notification.alert(html.message, function () {
                        openurl('order-details.html');
                    }, 'Success', 'OK');
                } else {
                    $('.loader-modal').css('display', 'none');
                    navigator.notification.alert("Something goes wrong. Please try again.", showpage, 'Error', 'OK');
                }
            }
        });
    } else {
        return false;
    }

}

function delcartprodconfirmation(productid) {
    navigator.notification.confirm(
        'Are you sure you want to remove this product from your cart?', // message
        function (buttonIndex) {
            delcartprod(buttonIndex, productid);
        },            // callback to invoke with index of button pressed
        'Confirmation',           // title
        ['Yes', 'No']     // buttonLabels
    );
}
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
}
function updatecart() {
    var totalProds = $('#totcartitems').val();
    var proceed = true;
    for (var i = 1; i <= totalProds; i++) {
        var prodQty = $('#qty' + i).val();
        var minprodQty = $('#minqty' + i).val();
        var prodname = $('#prodcode' + i).html();
        prodname = $.trim(prodname);
        if (parseInt(prodQty) < parseInt(minprodQty)) {
            proceed = false;
            navigator.notification.alert("Minimum quantity allowed for " + prodname + " is " + minprodQty + ". Enter valid quantity to proceed further.", function () {
                calbackfocusfield('qty' + i);
            }, 'Error', 'OK');
        }
    }
    if (proceed) {
        var jdata = $('form').serializeObject();
        $('.loader-modal').css('display', 'block');
        $.ajax({
            datatype: "json",
            url: __SITE_JS_PATH__ + "updatecart/",
            type: "POST",
            crossDomain: true,
            cache: false,
            data: JSON.stringify(jdata),
            success: function (html) {
                var htmldata = '';
                if (html.code == '200') {
                    $('.loader-modal').css('display', 'none');
                    navigator.notification.alert(html.message, function () {
                        openurl('order-details.html');
                    }, 'Success', 'OK');
                } else {
                    $('.loader-modal').css('display', 'none');
                    navigator.notification.alert("Something goes wrong. Please try again.", showpage, 'Error', 'OK');
                }
            }
        });
    }
}

function checkout() {
    var totalprice = $('#totcartprice').val();
    var jdata = {
        franchiseeid: localStorage.getItem("userid"),
        totalprice: totalprice
    }
    $('.loader-modal').css('display', 'block');
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "addorder/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            var htmldata = '';
            if (html.code == '200') {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, function () {
                    openurl('order-confirmed.html');
                }, 'Success', 'OK');
            } else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert("Something goes wrong. Please try again.", showpage, 'Error', 'OK');
            }
        }
    });
}