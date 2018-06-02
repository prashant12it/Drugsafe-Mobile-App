function getOrders() {
    var jdata = {
        franchiseeid: localStorage.getItem("userid")
    }
    $('.loader-modal').css('display', 'block');
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getfranchiseeorders/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
var htmldata = '';
            if(html.code == '200'){
                var counter = 1;
                var htmldata = '<div class="table-responsive orderhistorytab">' +
                    '<table class="table modaltable">' +
                    '<thead><tr><th>#</th><th>Order#</th><th>Total Price EXL GST($)</th><th>Order Date</th><th>Status</th></tr>' +
                    '</thead><tbody>';
                $.each( html.orderarr, function( key, value ) {
                    var statusval = '';
                    if(value.status == '1'){
                        statusval = 'Ordered'
                    }else if(value.status == '2'){
                        statusval = 'Dispatched';
                    }else if(value.status == '3'){
                        statusval = 'Cancelled';
                    }
                    htmldata += '<tr><td>'+counter+'</td><td><button class="green-btn2" onclick="getorderdetailsbyorderid(\''+value.id+'\',\''+formatdate(value.createdon)+'\',\''+parseFloat(value.price).toFixed(2)+'\',\''+statusval+'\',\''+formatdate(value.dispatchedon)+'\',\''+formatdate(value.canceledon)+'\')">#'+value.id+'</button></td><td>$'+parseFloat(value.price).toFixed(2)+'</td><td>'+formatdate(value.createdon)+'</td><td>'+statusval+'</td></tr>';
                    counter++;
                });
                htmldata += '</tbody></table></div>';
                $('.order-list').html(htmldata);
                $('.loader-modal').css('display', 'none');
                if(counter == 1){
                    navigator.notification.alert("You have not placed any order yet. Add products to your cart and continue ordering.",function () {
                        openurl('categorylisting.html');
                    }, 'Alert', 'OK');
                }
            }else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert("You have not placed any order yet. Add products to your cart and continue ordering.",function () {
                    openurl('categorylisting.html');
                }, 'Alert', 'OK');
            }
        }
    });
}

var formatdate = function(input){
    var d = new Date(Date.parse(input.replace(/-/g, "/")));
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var date = d.getDate() + " " + month[d.getMonth()] + ", " + d.getFullYear();
    var time = d.toLocaleTimeString().toUpperCase().replace(/([\d]+:[\d]+):[\d]+(\s\w+)/g, "$1$2");
    return (date + " " + time);
};

function getorderdetailsbyorderid(orderid,orderdate,price,ordstatus,dispatchdate,canceldate) {
    var jdata = {
        orderid: orderid
    }
    $('.loader-modal').css('display', 'block');
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getorderdetails/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            var htmldata = '';
            if(html.code == '200'){
                var counter = 1;
                var htmldata = '<div class="modal fade custommodal" id="orderdetailmodal" role="dialog">' +
                    '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                    '<h4 class="modal-title">Order Details</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<p><b>Order#:</b> #'+orderid+'</p>' +
                    '<p><b>Order Date:</b> '+orderdate+'</p>' +
                    '<p><b>Total Price EXL GST($):</b> $'+price+'</p>' +
                    '<p><b>Status:</b> '+ordstatus+'</p>' +
                    (ordstatus == 'Dispatched'?'<p><b>Dispatched Date:</b> '+dispatchdate+'</p>':(ordstatus == 'Cancelled'?'<p><b>cancellation  Date:</b> '+canceldate+'</p>':''))+
                    '<div class="table-responsive">' +
                    '<table class="table">' +
                    '<thead><tr><th>#</th><th>Product Code</th><th>Price($)</th><th>Ordered Quantity</th><th>Total Price($)</th><th>Dispatched Quantity</th></tr></thead>' +
                    '<tbody>';
                $.each( html.orderdetailsArr, function( key, value ) {
                    htmldata += '<tr><td>'+counter+'</td>' +
                        '<td>'+value.szProductCode+'</td>' +
                        '<td>$'+parseFloat(value.szProductCost).toFixed(2)+'</td>' +
                        '<td>'+value.quantity+'</td>' +
                        '<td>$'+parseFloat(value.szProductCost*value.quantity).toFixed(2)+'</td>' +
                        '<td>'+value.dispatched+'</td>' +
                        '</tr>';
                    counter++;
                });
                htmldata += '</tbody></table></div>' +
                '</div>'+
                '<div class="modal-footer">'+
                '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                '</div>'+
                '</div>'+
                '</div>'+
                '</div>';
                $('#show-info-modal').html(htmldata);
                $('.loader-modal').css('display', 'none');
                $('#orderdetailmodal').modal('show');
            }else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert("Something goes wrong. Please try again.",showpage, 'Error', 'OK');
            }
        }
    });
}