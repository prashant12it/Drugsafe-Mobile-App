if (!(localStorage.getItem("userid") > '0')) {
    window.location.href = 'index.html';
} else {
    var backcheckval = localStorage.getItem("backcheck");
    var backpage = '';
    if (backcheckval == '1') {
        backpage = 'franchisee-menu.html';
    } else if (backcheckval == '2') {
        backpage = 'form-pending-list.html';
    }
    $('.page-back').prop('href', backpage);
    if (localStorage.getItem("role") == '6') {

        var jdata = {
            franchiseeid: localStorage.getItem("agentfranchiseeid"),
            parentid: 0,
            agentid: localStorage.getItem("userid")
        }
        $('.onlyforagent').show();
    } else {
        var jdata = {
            franchiseeid: localStorage.getItem("userid"),
            parentid: 0,
            agentid: 0
        }
    }

    $('.loader-modal').css('display', 'block');
        $.ajax({
            datatype: "json",
            url: __SITE_JS_PATH__ + "getclientdetails/",
            type: "POST",
            crossDomain: true,
            cache: false,
            data: JSON.stringify(jdata),
            success: function (html) {
                if (html.code == '200') {
                    if (html.userid > '0') {
                        var allClients = [];
                        $.each(html.dataarr, function (key, value) {

                            if ($.inArray(value.id, allClients) == -1) {
                                allClients.push(value.id);
                                $('#reqclient').append($('<option>', {
                                    value: value.id,
                                    text: value.szBusinessName
                                }));
                            }

                        });
                        if (localStorage.getItem("siteid") > 0) {
                            $('#pending').attr("onclick", "savesos('0','1')");
                            $('#complete').attr("onclick", "savesos('1','1')");
                            $('#opencoc').attr("onclick", "finalSubmitDrugTest('1','1')");
                            fildata(localStorage.getItem("siteid"));
                        } else {
                            getDrugtestKitItems('kit1');
                            $('.loader-modal').css('display', 'none');
                        }
                    }
                } else {
                    $('.loader-modal').css('display', 'none');
                    navigator.notification.alert("You have no clients. Please add some clients and their respective sites to proceed further.", function () {
                        focusonfieldbyid('reqclient');
                    }, 'Error', 'OK');
                }
            }
        });
}

function savesign(canvasid, siteid, fieldname, status) {
    var canvas = document.getElementById(canvasid);
    var imgdata = canvas.toDataURL("image/png");
    $.ajax({
        type: "POST",
        async: false,
        url: __SITE_JS_PATH__ + "uploaddata/",
        data: {
            imgBase64: imgdata,
            siteid: siteid,
            fieldname: fieldname,
            status: status
        }
    }).done(function (o) {
        console.log(o);
    });
}

function checkSites() {
    var siteid = $('#site').val();
    if (siteid == '0') {
        navigator.notification.alert('Please select a site', focusonfieldbyid, 'Error', 'OK');
    } else {
        var jdata = {
            siteid: siteid
        }
        $('.loader-modal').css('display', 'block');
        $.ajax({
            datatype: "json",
            url: __SITE_JS_PATH__ + "getsossitesbyfranchiseeid/",
            type: "POST",
            crossDomain: true,
            cache: false,
            data: JSON.stringify(jdata),
            success: function (html) {
                //var obj = JSON.parse(html);
                if (html.code == '200') {
                    $('.loader-modal').css('display', 'none');
                    navigator.notification.alert("A test is already running at this site. Please choose another one.", function () {
                        focusonfieldbyid('site',1);
                    }, 'Alert!', 'OK');
                } else {
                    $('.loader-modal').css('display', 'none');
                }
            }
        });
    }
}

function focusonfieldbyid(fieldid, setZero) {
    if (!setZero) {
        setZero = 0;
    }
    if (setZero == 1) {
        $('#' + fieldid).val(0);
    }
    $('#' + fieldid).focus();
}

function getdonersbysosid(sosid,drugtestids) {

    var jdata = {
        sosid: sosid
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getdonorsbysosid/",
        type: "POST",
        crossDomain: true,
        cache: false,
        async: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            console.log(html);
            if (html.code == '200') {
                $('#doner-count').val(html.dataarr.length);
                $('#donercountpre').val(html.dataarr.length);
                $('#donercountpost').val(html.dataarr.length);
                $('#doner_1').remove();

                var htmlnew = '';
                var coccompletestatus = 0;
                var CompleteCocCount = 0;
                for (var i = 1; i <= html.dataarr.length; i++) {
                    var drugopt = false;
                    var alcopt = false;
                    var labresopt = false;
                    if (html.dataarr[i - 1].cocain == 'U' || html.dataarr[i - 1].amp == 'U' || html.dataarr[i - 1].mamp == 'U' || html.dataarr[i - 1].thc == 'U' || html.dataarr[i - 1].opiates == 'U' || html.dataarr[i - 1].benzo == 'U' || html.dataarr[i - 1].otherdc == 'U') {
                        drugopt = true;
                    }
                    /*if(html.dataarr[i - 1].dontest1 != '' || html.dataarr[i - 1].dontest2 != ''){
                     alcopt = true;
                     }*/
                    if ((parseFloat(html.dataarr[i - 1].dontest2) > 0 || parseFloat(html.dataarr[i - 1].cutoff) > 0) && parseFloat(html.dataarr[i - 1].dontest2) >= parseFloat(html.dataarr[i - 1].cutoff)) {
                        alcopt = true;
                    }
                    if (drugopt || alcopt) {
                        labresopt = true;
                    }
                    if (html.dataarr[i - 1].cocstatus == '1') {
                        coccompletestatus = parseInt(coccompletestatus) + 1;
                    }
                    htmlnew += '<div id="doner_' + i + '"><div class="row"><div class="col-sm-4 col-md-5">' +
                        '<div class="input-field">' +
                        '<label class="col-sm-10">Donor Name</label><label class="col-sm-2 deldonor"><a title="Delete Donor" href="javascript:void(0);" onclick="deldonor(\'' + html.dataarr[i - 1].donorid + '\',\'' + html.dataarr[i - 1].id + '\')"><i class="fa fa-trash-o"></i></a></label>' +
                        '<input type="text" name="name' + i + '" id="name' + i + '" value="' + html.dataarr[i - 1].donerName + '"/>' +
                        '</div></div>';
                    htmlnew += '<div class="col-sm-5 col-md-5"><div class="row"><div class="col-xs-3">' +
                        '<div class="input-field"><label>Result</label>' +
                        '<select name="result' + i + '" id="result' + i + '" class="hidedownarrow" onchange="checkcoc(\'result' + i + '\');">';
                    htmlnew += '<option value="0" ' + (!labresopt ? "selected=\'selected\'" : "disabled") + '>N</option>';
                    htmlnew += '<option value="1" ' + (labresopt ? "selected=\'selected\'" : "disabled") + '>U</option>';
                    htmlnew += '</select>';
                    if (labresopt) {
                        checkresult();
                    }
                    htmlnew += '</div>';
                    htmlnew += '</div>';
                    htmlnew += '<div class="col-xs-3">';
                    htmlnew += '<div class="input-field">';
                    htmlnew += '<label>Drug</label>';
                    htmlnew += '<select name="drug' + i + '" class="drugdrop hidedownarrow" id="drugnewcounter' + i + '" onchange="showdrugopt(\'' + i + '\',\'' + html.dataarr[i - 1].id + '\',\'' + html.dataarr[i - 1].cocid + '\');">';

                    htmlnew += '<option value="0" ' + (!drugopt ? "selected=\'selected\'" : "disabled") + '>N</option>';
                    htmlnew += '<option value="1" ' + (drugopt ? "selected=\'selected\'" : "disabled") + '>U</option>';
                    htmlnew += '</select>';
                    if (drugopt) {
                        showdrugopt(i);
                    }
                    htmlnew += '</div>';
                    htmlnew += '</div>';
                    htmlnew += '<div class="col-xs-3">';
                    htmlnew += '<div class="input-field">';
                    htmlnew += '<label>Alcohol</label>';
                    htmlnew += '<select name="alcohol' + i + '" class="alcoholdrop hidedownarrow" id="doneralcohol' + i + '" onchange="showalcoholopt(\'' + i + '\',\'' + html.dataarr[i - 1].id + '\',\'' + html.dataarr[i - 1].cocid + '\');">';
                    htmlnew += '<option value="0" ' + (!alcopt ? "selected=\'selected\'" : "disabled") + '>N</option>';
                    htmlnew += '<option value="1" ' + (alcopt ? "selected=\'selected\'" : "disabled") + '>U</option>';
                    htmlnew += '</select>';
                    if (alcopt) {
                        showalcoholopt(i);
                    }
                    htmlnew += '</div>';
                    htmlnew += '</div>';
                    htmlnew += '<div class="col-xs-3">';
                    htmlnew += '<div class="input-field">';
                    htmlnew += '<label>Lab</label>';
                    htmlnew += '<select name="lab' + i + '" id="lab' + i + '" class="hidedownarrow" disabled="disabled">';
                    htmlnew += '<option value="0" ' + (!drugopt ? "selected=\'selected\'" : "disabled") + '>N</option>';
                    htmlnew += '<option value="1" ' + (drugopt ? "selected=\'selected\'" : "disabled") + '>Y</option>';
                    htmlnew += '</select>';
                    htmlnew += '</div>';
                    htmlnew += '</div>';
                    htmlnew += '</div>';
                    htmlnew += '</div>';

                    htmlnew += '<div class="col-sm-3 col-md-2">';
                    htmlnew += '<div class="input-field">';
                    htmlnew += '<br style="margin-bottom: 5px" />';
                    htmlnew += '<button type="button" class="green-btn" ' + (html.dataarr[i - 1].cocstatus == '1' ? 'disabled="disabled"' : '') + ' onclick="savesosOpenCoc(0,1,\'name' + i + '\',\'result' + i + '\',\'drugtype' + i + '\',\'pos1read' + i + '\',\'pos2read' + i + '\',\'lab' + i + '\',\'oth' + i + '\',\'' + html.dataarr[i - 1].donorid + '\');">COC Form<span><i class="' + (html.dataarr[i - 1].cocstatus == '1' ? 'fa fa-check' : 'fa fa-pencil') + '"></i></span></button>';
                    htmlnew += '</div>';
                    htmlnew += '</div>';
                    htmlnew += '</div>';
                        htmlnew +='<div id="drug' + i + '" class="drugoptfield" '+(drugopt?'style="display:block; pointer-events: none"':'')+'>';

                    htmlnew += '<p>Drug - Positive</p>';
                    htmlnew += '<div class="row">';
                    htmlnew += '<div class="col-sm-4">';
                    htmlnew += '<div class="input-field">';
                    htmlnew += '<div class="checkbox-field">';
                    htmlnew += '<input type="checkbox" ' + (html.dataarr[i - 1].mamp == 'U' ? 'checked="checked"' : '') + ' onclick="return false" id="ice' + i + '" value="1" name="drugtype' + i + '">Ice-Methamphetamine(mAmp)<label for="ice' + i + '"></label>';
                    htmlnew += '</div>';
                    htmlnew += '</div>';
                    htmlnew += '</div>';
                    htmlnew += '<div class="col-sm-4">';
                    htmlnew += '<div class="input-field">';
                    htmlnew += '<div class="checkbox-field">';
                    htmlnew += '<input type="checkbox" ' + (html.dataarr[i - 1].thc == 'U' ? 'checked="checked"' : '') + ' onclick="return false" id="marijuana' + i + '" value="2" name="drugtype' + i + '">THC-Marijuana(THC)<label for="marijuana' + i + '"></label>';
                    htmlnew += '</div>';
                    htmlnew += '</div>';
                    htmlnew += '</div>';
                    htmlnew += '<div class="col-sm-4">';
                    htmlnew += '<div class="input-field">';
                    htmlnew += '<div class="checkbox-field">';
                    htmlnew += '<input type="checkbox" ' + (html.dataarr[i - 1].opiates == 'U' ? 'checked="checked"' : '') + ' onclick="return false" id="heroin' + i + '" value="3" name="drugtype' + i + '">Heroine-Opiates(OPI)<label for="heroin' + i + '"></label>';
                    htmlnew += '</div>';
                    htmlnew += '</div>';
                    htmlnew += '</div><div class="clearfix"></div>';
                    htmlnew += '<div class="col-sm-4">';
                    htmlnew += '<div class="input-field">';
                    htmlnew += '<div class="checkbox-field">';
                    htmlnew += '<input type="checkbox" ' + (html.dataarr[i - 1].cocain == 'U' ? 'checked="checked"' : '') + ' onclick="return false" id="cocain' + i + '" value="4" name="drugtype' + i + '">Cocaine-Cocaine(COC)<label for="cocain' + i + '"></label>';
                    htmlnew += '</div>';
                    htmlnew += '</div></div>';
                    htmlnew += '<div class="col-sm-4">';
                    htmlnew += '<div class="input-field">';
                    htmlnew += '<div class="checkbox-field">';
                    htmlnew += '<input type="checkbox" ' + (html.dataarr[i - 1].benzo == 'U' ? 'checked="checked"' : '') + ' onclick="return false" id="benzos' + i + '" value="5" name="drugtype' + i + '">Benzodiazepines-Benzodiazepines(BZO)<label for="benzos' + i + '"></label>';
                    htmlnew += '</div>';
                    htmlnew += '</div></div>';
                    htmlnew += '<div class="col-sm-4">';
                    htmlnew += '<div class="input-field">';
                    htmlnew += '<div class="checkbox-field">';
                    htmlnew += '<input type="checkbox" ' + (html.dataarr[i - 1].amp == 'U' ? 'checked="checked"' : '') + ' onclick="return false" id="amph' + i + '" value="6" name="drugtype' + i + '">Amphetamine-Amphetamine(AMP)<label for="amph' + i + '"></label>';
                    htmlnew += '</div>';
                    htmlnew += '</div></div><div class="clearfix"></div>';
                    htmlnew += '<div class="col-sm-4">';
                    htmlnew += '<div class="input-field">';
                    // htmlnew += '<input type="text" id="oth' + i + '" value="' + (html.dataarr[i - 1].otherdrug ? html.dataarr[i - 1].otherdrug : '') + '" placeholder="Other (Specify)" name="oth' + i + '"><label for="oth' + i + '"></label>';
                    // htmlnew += '<input type="text" id="oth' + i + '" value="" placeholder="Other (Specify)" name="oth' + i + '"><label for="oth' + i + '"></label>';
                    htmlnew += '<div class="checkbox-field">';
                    htmlnew += '<input type="checkbox" ' + (html.dataarr[i - 1].otherdc == 'U' ? 'checked="checked"' : '') + ' onclick="return false" id="oth' + i + '" value="7" name="drugtype' + i + '">Other<label for="oth' + i + '"></label>';
                    htmlnew += '</div>';
                    htmlnew += '</div>';
                    htmlnew += '</div>' +
                        '</div>';

                    // if (drugopt) {
                    // alert(html.dataarr[i - 1].cocain);
                    /*var drugoptsarr = '';
                     drugoptsarr = html.dataarr[i - 1].drug.split(',');*/
                    // drudoptscheckNew(html.dataarr[i - 1].cocain,html.dataarr[i - 1].amp,html.dataarr[i - 1].mamp,html.dataarr[i - 1].thc,html.dataarr[i - 1].opiates,html.dataarr[i - 1].benzo,html.dataarr[i - 1].otherdc, i);
                    // }
                    htmlnew += '</div>';

                        htmlnew += '<div id="alcohol' + i + '" class="drugoptfield" '+(alcopt?'style="display:block;pointer-events: none;"':'')+'>';

                        htmlnew += '<p>Alcohol - Positive</p>';
                        htmlnew += '<div class="row">';
                        htmlnew += '<div class="col-sm-6">';
                        htmlnew += '<div class="input-field">';
                        htmlnew += '<input type="number" readonly="readonly" placeholder="1st Reading" id="pos1read' + i + '" name="pos1read' + i + '" value="' + (html.dataarr[i - 1].dontest1 && html.dataarr[i - 1].dontest1 != '' ? html.dataarr[i - 1].dontest1 : '') + '">';
                        htmlnew += '</div>';
                        htmlnew += '</div>';
                        htmlnew += '<div class="col-sm-6">';
                        htmlnew += '<div class="input-field">';
                        htmlnew += '<input type="number" readonly="readonly" placeholder="2nd Reading" id="pos2read' + i + '" name="pos2read' + i + '" value="' + (html.dataarr[i - 1].dontest2 && html.dataarr[i - 1].dontest2 != '' ? html.dataarr[i - 1].dontest2 : '') + '">';
                        htmlnew += '</div>';
                        htmlnew += '</div>';
                        htmlnew += '</div>' +
                            '</div>';
                    if (alcopt) {
                        // alcoholoptscheck(html.dataarr[i - 1].dontest1, html.dataarr[i - 1].dontest2, i);
                    }
                    htmlnew += '<input type="hidden" name="iddonor' + i + '" id="iddonor' + i + '" value="' + html.dataarr[i - 1].donorid + '" />';
                    htmlnew += '<input type="hidden" name="idcoc' + i + '" id="idcoc' + i + '" value="' + html.dataarr[i - 1].id + '" />';
                    htmlnew += '<hr>';
                    htmlnew += '</div>';
                    if(html.dataarr[i - 1].cocstatus == '1'){
                        CompleteCocCount++;
                    }
                }
                $('#coc-complete-count').val(CompleteCocCount);
                if(html.dataarr.length == CompleteCocCount){
                    $('#opencoc').prop('disabled',false);
                }else{
                    $('#opencoc').prop('disabled',true);
                }
                if (html.dataarr.length == coccompletestatus) {
                    $('#showcocformpending').val('1');
                } else {
                    $('#showcocformpending').val('0');
                }
                $(htmlnew).insertAfter('.donorsection');
                /*if(drugtestids){
                    var Alcohol = false;
                    var Oral = false;
                    var Urine = false;
                    var Asnza = false;
                    var drugtestarr = drugtestids.split(',');
                    if ((drugtestarr[0] == '1') || (drugtestarr[1] == '1') || (drugtestarr[2] == '1') || (drugtestarr[3] == '1') || (drugtestarr[4] == '1')) {
                        Alcohol = true;
                    }
                    if ((drugtestarr[0] == '2') || (drugtestarr[1] == '2') || (drugtestarr[2] == '2') || (drugtestarr[3] == '2') || (drugtestarr[4] == '2')) {
                        Oral = true;
                    }
                    if ((drugtestarr[0] == '3') || (drugtestarr[1] == '3') || (drugtestarr[2] == '3') || (drugtestarr[3] == '3') || (drugtestarr[4] == '3')) {
                        Urine = true;
                    }
                    if ((drugtestarr[0] == '4') || (drugtestarr[1] == '4') || (drugtestarr[2] == '4') || (drugtestarr[3] == '4') || (drugtestarr[4] == '4')) {
                        Asnza = true;                    }
                    if ((drugtestarr[0] == '5') || (drugtestarr[1] == '5') || (drugtestarr[2] == '5') || (drugtestarr[3] == '5') || (drugtestarr[4] == '5')) {
                        $('#other').prop("checked", true);
                        $('#othertest').val(html.dataarr[0].other_drug_test);
                        $('.othertestsec').show();
                    }
                    if(Alcohol){
                        setTimeout(function () {
                            $('#alcohol').click();
                        },2500);
                    }
                    if(Oral){
                        setTimeout(function () {
                            $('#oral-fluid').click();
                        },2500);
                    }
                    if(Urine){
                        setTimeout(function () {
                            $('#urine').click();
                        },2500);
                    }
                    if(Asnza){
                        setTimeout(function () {
                            $('#asnza').click();
                        },2500);
                    }
                    setTimeout(function () {
                        $('.sos-drugopt').attr("onclick","return false");
                    },3000);
                }*/
            } else if (html.code == '201') {
                $('#doner-count').val('1');
                $('#donercountpre').val('0');
                $('#donercountpost').val('1');
                $('#newdonerids').val('1');
                $('.loader-modal').hide();
            } else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, showpage, 'Error', 'OK');
            }
        }
    });
}

function getsavedkits(sosid) {
    var jdata = {
        sosid: sosid
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getsavedkitsbysosid/",
        type: "POST",
        crossDomain: true,
        async: false,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            console.log(html);
            if (html.code == '200') {
                $('#kitcount').val(html.kitarr.length);
                $('#oldkitcount').val(html.kitarr.length);
                $('#totalkitcount').val(html.kitarr.length);
                $('#kitrow1').remove();
                var oldkithtml = '';
                for (var i = 1; i <= html.kitarr.length; i++) {
                    oldkithtml += '<div class="row productsec" id="kitrow' + i + '">' +
                        '<div class="col-xs-5">' +
                        '<div class="input-field">' +
                        '<select name="kit' + i + '" id="kit' + i + '" class="drugtestprods" onchange="checkprodexist(\'kit' + i + '\',\'' + i + '\');">' +
                        '<option value="0">Product</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="col-xs-5">' +
                        '<div class="input-field">' +
                        '<input type="number" placeholder="Qty" value="' + html.kitarr[i - 1].quantity + '" onblur="checkAvailProds(\'kitqty' + i + '\',\'kit' + i + '\');" step="1" min="1" max="100" name="kitqty' + i + '" id="kitqty' + i + '" >' +
                        '</div>' +
                        '</div>' +
                        '<div class="col-xs-2">' +
                        '<div class="input-field">' +
                        '<label class="deldonor">' +
                        '<a title="Delete product" href="javascript:void(0);" onclick="delusedkit(\'' + html.kitarr[i - 1].id + '\',\'kitrow' + i + '\')"><i class="fa fa-trash-o"></i></a>' +
                        '</label><input type="hidden" name="kitid' + i + '" value="' + html.kitarr[i - 1].id + '" />' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    getDrugtestKitItems('kit' + i, html.kitarr[i - 1].prodid);
                }
                $(oldkithtml).insertAfter('.AllproductList');
            } else {
                getDrugtestKitItems('kit1');
                $('.loader-modal').css('display', 'none');
                //navigator.notification.alert(html.message, showpage, 'Error', 'OK');
            }
        }
    });
}

function delsosdonor(buttonIndex, donorid) {
    if (buttonIndex == '1') {
        if (donorid > '0') {
            var jdata = {
                donorid: donorid
            }
            $('.loader-modal').css('display', 'block');
            $.ajax({
                datatype: "json",
                url: __SITE_JS_PATH__ + "deldonor/",
                type: "POST",
                crossDomain: true,
                cache: false,
                data: JSON.stringify(jdata),
                success: function (html) {
                    //var obj = JSON.parse(html);
                    if (html.code == '200') {
                        $('.loader-modal').css('display', 'none');
                        navigator.notification.alert(html.message, showpage, 'Sucess', 'OK');
                        window.location.href = 'SOS.html';
                    } else {
                        $('.loader-modal').css('display', 'none');
                        navigator.notification.alert(html.message, showpage, 'Error', 'OK');
                    }
                }
            });
        } else {
            navigator.notification.alert('Something went wrong. Please try again.', showpage, 'Error', 'OK');
        }
    } else {
        return false;
    }
}

function canceldonorcoc(donorid, fieldid) {
    var jdata = {
        donorid: donorid
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "canceldonorcoc/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            //var obj = JSON.parse(html);
            if (html.code == '200') {
                $('#result' + fieldid).val('0');
                $('#drugnewcounter' + fieldid).val('0');
                $('#doneralcohol' + fieldid).val('0');
                $('#lab' + fieldid).val('0');
                $('#ice' + fieldid).prop('checked', false);
                $('#marijuana' + fieldid).prop('checked', false);
                $('#heroin' + fieldid).prop('checked', false);
                $('#cocain' + fieldid).prop('checked', false);
                $('#pos1read' + fieldid).val('');
                $('#pos2read' + fieldid).val('');
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, showpage, 'Success', 'OK');
            } else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, showpage, 'Error', 'OK');
            }
        }
    });
}

function onConfirm(buttonIndex, donorid, cocid, changefield, changefieldid, fieldid) {
    if (buttonIndex == '1') {
        if (cocid > '0') {
            var jdata = {
                cocid: cocid
            }
            $('.loader-modal').css('display', 'block');
            $.ajax({
                datatype: "json",
                url: __SITE_JS_PATH__ + "delcoc/",
                type: "POST",
                crossDomain: true,
                cache: false,
                data: JSON.stringify(jdata),
                success: function (html) {
                    //var obj = JSON.parse(html);
                    if (html.code == '200') {
                        if (changefield == '1') {
                            $('#result' + fieldid).val('0');
                            $('#drugnewcounter' + fieldid).val('0');
                            $('#doneralcohol' + fieldid).val('0');
                            $('#lab' + fieldid).val('0');
                            $('#idcoc' + fieldid).val('0');
                            canceldonorcoc(donorid, fieldid);
                        } else {
                            delsosdonor(buttonIndex, donorid);
                            $('.loader-modal').css('display', 'none');
                        }
                    } else {
                        $('.loader-modal').css('display', 'none');
                        navigator.notification.alert(html.message, showpage, 'Error', 'OK');
                    }
                }
            });
        } else {
            $('.loader-modal').css('display', 'none');
            navigator.notification.alert('Something went wrong. Please try again.', showpage, 'Error', 'OK');
        }
    } else {
        if (changefield == '1' && buttonIndex == '2') {
            if (changefieldid == 'doneralcohol') {
                $('#' + changefieldid + fieldid).val('1');
                showalcoholopt(fieldid, donorid, cocid);
            }
            if (changefieldid == 'drugnewcounter') {
                $('#' + changefieldid + fieldid).val('1');
                showdrugopt(fieldid, donorid, cocid);
            }
            //$('#'+changefieldid+fieldid).val('1');
            //var result = '1';
            return false;
        } else {
            return false;
        }

    }
}

function delkit(buttonIndex, kitid, kitrowid) {
    if (buttonIndex == '1') {
        if (kitid > '0') {
            var jdata = {
                kitid: kitid
            }
            $('.loader-modal').css('display', 'block');
            $.ajax({
                datatype: "json",
                url: __SITE_JS_PATH__ + "delusedkit/",
                type: "POST",
                crossDomain: true,
                cache: false,
                data: JSON.stringify(jdata),
                success: function (html) {
                    //var obj = JSON.parse(html);
                    if (html.code == '200') {
                        /*var kitcount = $('#kitcount').val();
                         var oldkitcount = $('#oldkitcount').val();
                         var totalkitcount = $('#totalkitcount').val();
                         $('#kitcount').val(parseInt(kitcount)-1);
                         $('#oldkitcount').val(parseInt(oldkitcount)-1);
                         $('#totalkitcount').val(parseInt(totalkitcount)-1);*/
                        $('#' + kitrowid).remove();
                        $('.loader-modal').css('display', 'none');
                        navigator.notification.alert(html.message, showpage, 'Success', 'OK');
                    } else {
                        $('.loader-modal').css('display', 'none');
                        navigator.notification.alert(html.message, showpage, 'Error', 'OK');
                    }
                }
            });
        } else {
            $('.loader-modal').css('display', 'none');
            navigator.notification.alert('Something went wrong. Please try again.', showpage, 'Error', 'OK');
        }
    } else {
        return false;
    }
}

function delusedkit(kitid, kitrowid) {
    navigator.notification.confirm(
        'Are you sure you want to delete this product?', // message
        function (buttonIndex) {
            delkit(buttonIndex, kitid, kitrowid);
        },            // callback to invoke with index of button pressed
        'Confirmation',           // title
        ['Yes', 'No']     // buttonLabels
    );
}

function deldonor(donorid, cocid, changefield, changefieldid, fieldid) {
    var cocmessage = 'A COC form is associated with this donor. You need to cancel the COC form of this donor first. Are you willing to cancel the associated COC form and delete this donor?';
    if (changefield == '1') {
        cocmessage = 'Changing the test result from positive to negative will require to cancel the associated COC form with this user. Are you willing to cancel the associated COC form and change the test result from positive to negative?';
    }

    if (cocid > '0') {
        navigator.notification.confirm(
            cocmessage, // message
            function (buttonIndex) {
                onConfirm(buttonIndex, donorid, cocid, changefield, changefieldid, fieldid);
            },            // callback to invoke with index of button pressed
            'Confirmation',           // title
            ['Yes', 'No']     // buttonLabels
        );
    } else if (changefield == undefined || changefield != '1') {
        navigator.notification.confirm(
            'Are you sure you want to delete this donor?', // message
            function (buttonIndex) {
                delsosdonor(buttonIndex, donorid);
            },            // callback to invoke with index of button pressed
            'Confirmation',           // title
            ['Yes', 'No']     // buttonLabels
        );
    }
}
function drudoptscheck(optsarr, i) {
    // setTimeout(function () {
        if (optsarr[0] == '1' || optsarr[1] == '1' || optsarr[2] == '1' || optsarr[3] == '1' || optsarr[4] == '1' || optsarr[5] == '1') {
            $('#ice' + i).prop('checked', true);
        }
        if (optsarr[0] == '2' || optsarr[1] == '2' || optsarr[2] == '2' || optsarr[3] == '2' || optsarr[4] == '2' || optsarr[5] == '2') {
            $('#marijuana' + i).prop('checked', true);
        }
        if (optsarr[0] == '3' || optsarr[1] == '3' || optsarr[2] == '3' || optsarr[3] == '3' || optsarr[4] == '3' || optsarr[5] == '3') {
            $('#heroin' + i).prop('checked', true);
        }
        if (optsarr[0] == '4' || optsarr[1] == '4' || optsarr[2] == '4' || optsarr[3] == '4' || optsarr[4] == '4' || optsarr[5] == '4') {
            $('#cocain' + i).prop('checked', true);
        }
        if (optsarr[0] == '5' || optsarr[1] == '5' || optsarr[2] == '5' || optsarr[3] == '5' || optsarr[4] == '5' || optsarr[5] == '5') {
            $('#benzos' + i).prop('checked', true);
        }
        if (optsarr[0] == '6' || optsarr[1] == '6' || optsarr[2] == '6' || optsarr[3] == '6' || optsarr[4] == '6' || optsarr[5] == '6') {
            $('#amph' + i).prop('checked', true);
        }
        if (optsarr[0] == '7' || optsarr[1] == '7' || optsarr[2] == '7' || optsarr[3] == '7' || optsarr[4] == '7' || optsarr[5] == '7') {
            $('#oth' + i).prop('checked', true);
        }
    // }, 500);
}

function drudoptscheckNew(cocain,amp,mamp,thc,opiates,benzo,otherdc, i) {
    // setTimeout(function () {
        if (mamp == 'U') {
            $('#ice' + i).prop('checked', true);
        }
        if (thc == 'U') {
            $('#marijuana' + i).prop('checked', true);
        }
        if (opiates == 'U') {
            $('#heroin' + i).prop('checked', true);
        }
        if (cocain == 'U') {
            $('#cocain' + i).prop('checked', true);
        }
        if (benzo == 'U') {
            $('#benzos' + i).prop('checked', true);
        }
        if (amp == 'U') {
            $('#amph' + i).prop('checked', true);
        }
        if (otherdc == 'U') {
            $('#oth' + i).prop('checked', true);
        }
        /*if (cocain == 'U') {
            $('#oth' + i).prop('checked', true);
        }*/
    // }, 500);
}

function alcoholoptscheck(opt1, opt2, i) {
    // setTimeout(function () {
        if (opt1 != '') {
            $('#pos1read' + i).val(opt1);
        }
        if (opt2 != '') {
            $('#pos2read' + i).val(opt2);
        }
    // }, 500);
}
function formatdate(val) {
    var datearr = val.split('-');
    var dateval = datearr[2] + '/' + datearr[1] + '/' + datearr[0];
    if (dateval != '00/00/0000') {
        return dateval;
    } else {
        return '';
    }
}
function fildata(siteid) {
    var jdata = {
        siteid: siteid
    }
    var Alcohol = false;
    var Oral = false;
    var Urine = false;
    var Asnza = false;
    var InHouse = 0;
    var OnClinic = 0;
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getsosformdatabysiteid/",
        type: "POST",
        crossDomain: true,
        cache: false,
        async: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            if (html.code == '200') {
                var datearr = html.dataarr[0].testdate.split(' ');
                var validdate = formatdate(datearr[0]);
                var drugtestarr = html.dataarr[0].Drugtestid.split(',');
                var SFArr = html.dataarr[0].screening_facilities.split(',');
                if ((drugtestarr[0] == '1') || (drugtestarr[1] == '1') || (drugtestarr[2] == '1') || (drugtestarr[3] == '1') || (drugtestarr[4] == '1')) {
                    Alcohol = true;
                }
                if ((drugtestarr[0] == '2') || (drugtestarr[1] == '2') || (drugtestarr[2] == '2') || (drugtestarr[3] == '2') || (drugtestarr[4] == '2')) {
                    Oral = true;
                }
                if ((drugtestarr[0] == '3') || (drugtestarr[1] == '3') || (drugtestarr[2] == '3') || (drugtestarr[3] == '3') || (drugtestarr[4] == '3')) {
                    Urine = true;
                }
                if ((drugtestarr[0] == '4') || (drugtestarr[1] == '4') || (drugtestarr[2] == '4') || (drugtestarr[3] == '4') || (drugtestarr[4] == '4')) {
                    Asnza = true;
                }
                if ((drugtestarr[0] == '5') || (drugtestarr[1] == '5') || (drugtestarr[2] == '5') || (drugtestarr[3] == '5') || (drugtestarr[4] == '5')) {
                    $('#other').prop("checked", true);
                    $('#othertest').val(html.dataarr[0].other_drug_test);
                    $('.othertestsec').show();
                }

                if ((SFArr[0] == '1') || (SFArr[1] == '1')) {
                    InHouse = 1;
                }

                if ((SFArr[0] == '2') || (SFArr[1] == '2')) {
                    OnClinic = 2;
                }

                $('#sosdate').val((validdate != '01/01/1970' || validdate != '31/12/1969' ? validdate : ''));
                var servcommarr = html.dataarr[0].ServiceCommencedOn.split(" ");
                $('#sercomhr').val(servcommarr[0]);
                $('#sercommin').val((servcommarr[0] ? servcommarr[2] : ''));
                var servconarr = html.dataarr[0].ServiceConcludedOn.split(" ");
                $('#serconhr').val(servconarr[0]);
                $('#serconmin').val((servconarr[0] ? servconarr[2] : ''));
                $('#servicecomm').val(html.dataarr[0].ServiceCommencedOn);
                if(InHouse>0){
                    $('#inhouse').click();
                }
                if(OnClinic>0){
                    $('#mobileclinic').click();
                }
                $('#startkm').val(html.dataarr[0].start_km);
                $('#endkm').val(html.dataarr[0].end_km);
                $('#totalkm').val(html.dataarr[0].total_km);
                $('#servicecon').val(html.dataarr[0].ServiceConcludedOn);

                $('#refusals').val(html.dataarr[0].Refusals);
                $('#devicename').val(html.dataarr[0].DeviceName);
                $('#extraused').val(html.dataarr[0].ExtraUsed);
                $('#breathtest').val(html.dataarr[0].BreathTesting);
                $('#collname').val(html.dataarr[0].collname);
                $('#sign1').val(html.dataarr[0].sign1);
                $('#sign2').val(html.dataarr[0].sign2);
                $('#changesign1').val(html.dataarr[0].sign1);
                $('#changesign2').val(html.dataarr[0].sign2);
                $('#agentcomment').val(html.dataarr[0].agent_comment);
                if (html.dataarr[0].collsign) {
                    $('#smoothed').hide();
                    $('.smoothed-change-sign').show();
                    $('#colsign').attr('src', __SITE_SIGN_URL__ + html.dataarr[0].collsign);
                }
                $('#comments').val(html.dataarr[0].Comments);
                if (html.dataarr[0].RepresentativeSignature) {
                    $('#signpadarea').hide();
                    $('.repsignature').show();
                    $('.signpadarea-change-sign').show();
                    $('#repsign').attr('src', __SITE_SIGN_URL__ + html.dataarr[0].RepresentativeSignature);
                }
                $('.nominated').val(html.dataarr[0].ClientRepresentative);
                var nominearr = html.dataarr[0].RepresentativeSignatureTime.split(" ");
                $('#nominehr').val(nominearr[0]);
                $('#nominemin').val((nominearr[0] ? nominearr[2] : ''));
                $('#nominedec').val(html.dataarr[0].RepresentativeSignatureTime);
                $("#reqclient").val(html.dataarr[0].clientType);
                $("#sosstatus").val(html.dataarr[0].Status);
                getSites(true);
                        $("#site").val(html.dataarr[0].Clientid);
                    localStorage.setItem('sosid', html.dataarr[0].id)
                    getdonersbysosid(html.dataarr[0].id);
                    if(Alcohol){
                        $('#alcohol').click();
                    }
                    if(Oral){
                        $('#oral-fluid').click();
                    }
                    if(Urine){
                        $('#urine').click();
                    }
                    /*if(Asnza){
                        $('#asnza').click();
                    }*/
                    if($('#coc-complete-count').val()>0){
                        if($('#othertest').is(':visible')){
                            $('#othertest').prop("readonly",true);
                        }
                        $('.sos-drugopt').each(function () {
                            if($(this).is(":checked")){
                                var dtval = $(this).val();
                                $('<input type="checkbox" checked="checked" name="drugtest" value="'+dtval+'" style="display:none" />').appendTo('.drugtotest');
                                $(this).attr('disabled',true);
                            }
                        });
                        $('.sos-drugopt').attr('disabled',true);
                    }
                getsavedkits(html.dataarr[0].id);
                    $('.loader-modal').css('display', 'none');

                // setTimeout(function () {
                //     $("#site").val(html.dataarr[0].Clientid);
                // }, 1500);

            } else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, showpage, 'Error', 'OK');
            }
        }
    });
}

function getSites(check) {
    var parentid = $('#reqclient').val();
    if (parentid == '0') {
        $('#site').empty();
        $('#site').append($('<option>', {
            value: 0,
            text: 'Please Select'
        }));
        return false;
    } else {
        if (localStorage.getItem("role") == '6') {
            var jdata = {
                franchiseeid: localStorage.getItem("agentfranchiseeid"),
                parentid: $('#reqclient').val(),
                agentid: localStorage.getItem("userid")
            }
        } else {
            var jdata = {
                franchiseeid: localStorage.getItem("userid"),
                parentid: $('#reqclient').val(),
                agentid: 0
            }
        }
        /*var jdata = {
         franchiseeid: localStorage.getItem("userid"),
         parentid: $('#reqclient').val()
         }*/
        $('.loader-modal').css('display', 'block');
        $.ajax({
            datatype: "json",
            url: __SITE_JS_PATH__ + "getclientdetails/",
            type: "POST",
            crossDomain: true,
            async: false,
            cache: false,
            data: JSON.stringify(jdata),
            success: function (html) {
                //var obj = JSON.parse(html);
                if (html.code == '200') {
                    if (html.userid > '0') {
                        $('#site').empty();
                        $('#site').append($('<option>', {
                            value: 0,
                            text: 'Select'
                        }));
                        $.each(html.dataarr, function (key, value) {
                            $('#site').append($('<option>', {
                                value: value.id,
                                text: value.szName
                            }));
                        });
                        $('.nominated').val(html.NominatedClientName);
                        if (!check) {
                            $('.loader-modal').css('display', 'none');
                        }
                    }

                } else {
                    $('.loader-modal').css('display', 'none');
                    navigator.notification.alert("No sites are available for this client. Please add  sites for this client or choose another requesting client.", function () {
                        focusonfieldbyid('reqclient',1);
                    }, 'Error', 'OK');
                }
            }
        });
    }
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
function checkcoc(id) {
    var newval = $('#drugnewcounter1').val();
    var resval = $('#' + id).val();
    var showcocval = $('#showcocbutton').val();
    if (resval == '1') {
        showcocval = parseInt(showcocval) + 1;
    } else {
        if (showcocval > '0') {
            showcocval = parseInt(showcocval) - 1;
        }
    }
    $('#showcocbutton').val(showcocval);
    /*if (showcocval > '0') {
        $('#complete').hide();
        $('#opencoc').show();
    } else {
        $('#opencoc').hide();
        $('#complete').show();
    }*/
}
function changetimeto24hr(time) {
    var timearr = time.split(' ');
    var hour = $.trim(timearr[0]);
    var min = $.trim(timearr[2]);
    if (min == '' || min == ' ') {
        min = '00';
    }
    hour = ("0" + hour).slice(-2);
    min = ("0" + min).slice(-2);
    var joinhrmin = hour + min;
    var finaltime = parseInt(joinhrmin);
    /*if (timearr[3] == 'PM' && hour < '12') {
     finaltime = finaltime + 1200;
     } else if (timearr[3] == 'AM' && hour == '12') {
     finaltime = finaltime - 1200;
     }*/
    return finaltime;
}

function getvalofcheckedone(fieldid) {
    if ($('#' + fieldid).is(':checked')) {
        return 1;
    } else {
        return 0;
    }
}

function testname(fieldid, val, message) {
    var RegExpression = /^[a-zA-Z\s]*$/;
    if (!RegExpression.test(val)) {
        navigator.notification.alert('Enter valid ' + message + '. Only alphabets are allowed.', function () {
            calbackfocusfield(fieldid);
        }, 'Error', 'OK');
        return false;
    }
}
function combinetime(hourid, minid, durationid) {
    var hour = $('#' + hourid).val();
    var min = $('#' + minid).val();
    if (min == '' || min == ' ') {
        //$('#' + minid).val('00');
        min = '00';
    }
    var ampm = $('#' + durationid).val();
    var combinetime = hour + ' : ' + min + ' ' + ampm;
    return combinetime;
}

function savesos(type, update) {
    var siteval = $('#site').val();
    /*var servicecomm = combinetime('sercomhr', 'sercommin', 'sercomdur');
     var serviceconcl = combinetime('serconhr', 'serconmin', 'sercondur');
     var nominedectime = combinetime('nominehr', 'nominemin', 'nominedur');
     $('#servicecomm').val(servicecomm);
     $('#servicecon').val(serviceconcl);
     $('#nominedec').val(nominedectime);
     var servicecom24hr = changetimeto24hr(servicecomm);
     var servicecon24hr = changetimeto24hr(serviceconcl);
     var nominedectime24hr = changetimeto24hr(nominedectime);*/

    var servicecomm = combinetime24('sercomhr', 'sercommin');
    var serviceconcl = combinetime24('serconhr', 'serconmin');
    var nominedectime = combinetime24('nominehr', 'nominemin');
    $('#servicecomm').val(servicecomm);
    $('#servicecon').val(serviceconcl);
    $('#nominedec').val(nominedectime);
    var servicecom24hr = changetimeto24hr(servicecomm);
    var servicecon24hr = changetimeto24hr(serviceconcl);
    var nominedectime24hr = changetimeto24hr(nominedectime);

    var testdate = $('#sosdate').val();
    var reqclient = $('#reqclient').val();
    var reqsite = $('#site').val();
    var totcoccount = $('#showcocbutton').val();
    var totdonorcount = $('#doner-count').val();
    if (!testdate) {
        navigator.notification.alert('Enter a valid date.', function () {
            focusonfieldbyid('drugnewcounter' + i);
        }, 'Error', 'OK');
        return false;
    } else if (reqclient == 0) {
        navigator.notification.alert('Please select requesting client.', function () {
            focusonfieldbyid('drugnewcounter' + i);
        }, 'Error', 'OK');
        return false;
    } else if (reqsite == 0) {
        navigator.notification.alert('Please select a site.', function () {
            focusonfieldbyid('drugnewcounter' + i);
        }, 'Error', 'OK');
        return false;
    } else if (type == '0') {
        for (var j = 1; j <= totdonorcount; j++) {
            var donarname = $('#name' + j).val();
            if (!donarname) {
                navigator.notification.alert('Enter donor name.', function () {
                    calbackfocusfield('name' + j);
                }, 'Error', 'OK');
                return false;
            } else {
                var getres = testname('name' + j, donarname, 'Donor name');
                if (getres == false) {
                    return false;
                }
            }
        }
        for (var i = 1; i <= totcoccount; i++) {
            if ($('#drugnewcounter' + i).val() == '1') {
                var iceval = getvalofcheckedone('ice' + i);
                var marijuanaval = getvalofcheckedone('marijuana' + i);
                var heroinval = getvalofcheckedone('heroin' + i);
                var cocainval = getvalofcheckedone('cocain' + i);
                var benzosval = getvalofcheckedone('benzos' + i);
                var ampval = getvalofcheckedone('amph' + i);
                var othval = $('#oth' + i).val();
                if (iceval == '0' && marijuanaval == '0' && heroinval == '0' && cocainval == '0' && benzosval == '0' && ampval == '0' && !othval) {
                    navigator.notification.alert('Please select a drug.', function () {
                        calbackfocusfield('drugnewcounter' + i);
                    }, 'Error', 'OK');
                    return false;
                }
            }
            if ($('#doneralcohol' + i).val() == '1') {
                var read1 = $.trim($('#pos1read' + i).val());
                var read2 = $.trim($('#pos2read' + i).val());
                if (read1 == '' || read1 == undefined) {
                    navigator.notification.alert('Enter alcohol 1st reading.', function () {
                        focusonfieldbyid('pos1read' + i);
                    }, 'Error', 'OK');
                    return false;
                } else if (!$.isNumeric(read1)) {
                    navigator.notification.alert('Alcohol 1st reading must be numeric.', function () {
                        focusonfieldbyid('pos1read' + i);
                    }, 'Error', 'OK');
                    return false;
                }
                if (read2 == '' || read2 == undefined) {
                    navigator.notification.alert('Enter alcohol 2nd reading.', function () {
                        focusonfieldbyid('pos2read' + i);
                    }, 'Error', 'OK');
                    return false;
                } else if (!$.isNumeric(read2)) {
                    navigator.notification.alert('Alcohol 2nd reading must be numeric.', function () {
                        focusonfieldbyid('pos2read' + i);
                    }, 'Error', 'OK');
                    return false;
                }
            }
        }
    }
    if (type == '1') {
        for (var j = 1; j <= totdonorcount; j++) {
            var donarname = $('#name' + j).val();
            if (!donarname) {
                navigator.notification.alert('Enter donor name.', function () {
                    calbackfocusfield('name' + j);
                }, 'Error', 'OK');
                return false;
            } else {
                var getres = testname('name' + j, donarname, 'Donor name');
                if (getres == false) {
                    return false;
                }

            }
        }
        if(!validateHours('sercomhr')){
            return false;
        }
        if (!validateminutes('sercommin')) {
            return false;
        }
        /*if (($('#sercomdur').val() == 'AM') && (servicecom24hr > '1159' || servicecom24hr < '0')) {
         navigator.notification.alert('Enter valid hours in service commenced time.', showpage, 'Error', 'OK');
         return false;
         } else if (($('#sercomdur').val() == 'PM') && (servicecom24hr > '2359' || servicecom24hr < '1200')) {
         navigator.notification.alert('Enter valid hours in service commenced time.', showpage, 'Error', 'OK');
         return false;
         }*/
        if (servicecom24hr == '') {
            navigator.notification.alert('Service Commenced time must filled out.', showpage, 'Error', 'OK');
            return false;
        }
        if(!validateHours('serconhr')){
            return false;
        }
        if (!validateminutes('serconmin')) {
            return false;
        }
        /*if (($('#sercondur').val() == 'AM') && (servicecon24hr > '1159' || servicecon24hr < '0')) {
         navigator.notification.alert('Enter valid hours in service concluded time.', showpage, 'Error', 'OK');
         return false;
         } else if (($('#sercondur').val() == 'PM') && (servicecon24hr > '2359' || servicecon24hr < '1200')) {
         navigator.notification.alert('Enter valid hours in service concluded time.', showpage, 'Error', 'OK');
         return false;
         }*/
        if (servicecon24hr == '') {
            navigator.notification.alert('Service Concluded time must filled out.', showpage, 'Error', 'OK');
            return false;
        }
        if (servicecom24hr > servicecon24hr) {
            navigator.notification.alert('Service Commenced time must be less than Services Concluded time', showpage, 'Error', 'OK');
            return false;
        }
        var proceedcheck = false;
        var oldkitcount = $('#oldkitcount').val();
        var kitcount = $('#kitcount').val();
        if (oldkitcount > '0') {
            for (var i = 1; i <= kitcount; i++) {
                if ($('#kit' + i).val() > 0) {
                    if (!$('#kitqty' + i).val() || $('#kitqty' + i).val() == '' || $('#kitqty' + i).val() == ' ' || $('#kitqty' + i).val() < 1) {
                        navigator.notification.alert('Product quantity must be filled out.', function () {
                            calbackfocusfield('kitqty' + i);
                        }, 'Error', 'OK');
                        return false;
                    } else {
                        proceedcheck = true;
                    }
                }
            }
            if (!proceedcheck) {
                navigator.notification.alert('You must choose at least one product and its respective quantity, to proceed further.', showpage, 'Error', 'OK');
                return false;
            }
        } else {
            for (var j = 1; j <= kitcount; j++) {
                if ($('#kit' + j).val() > 0) {
                    if (!$('#kitqty' + j).val() || $('#kitqty' + j).val() == '' || $('#kitqty' + j).val() == ' ' || $('#kitqty' + j).val() < 1) {
                        navigator.notification.alert('Product quantity must be filled out.', function () {
                            calbackfocusfield('kitqty' + j);
                        }, 'Error', 'OK');
                        return false;
                    } else {
                        proceedcheck = true;
                    }
                }
            }
            if (!proceedcheck) {
                navigator.notification.alert('You must choose at least one product and its respective quantity, to proceed further.', showpage, 'Error', 'OK');
                return false;
            }
        }
        /*if (($('#nominedur').val() == 'AM') && (nominedectime24hr > '1159' || nominedectime24hr < '0')) {
         navigator.notification.alert('Enter valid hours in nominated client representative signature time.', showpage, 'Error', 'OK');
         return false;
         } else if (($('#nominedur').val() == 'PM') && (nominedectime24hr > '2359' || nominedectime24hr < '1200')) {
         navigator.notification.alert('Enter valid hours in nominated client representative signature time.', showpage, 'Error', 'OK');
         return false;
         }*/
        if (nominedectime24hr == '') {
            navigator.notification.alert('Nominated Client Representative signature time must filled out.', showpage, 'Error', 'OK');
            return false;
        }
        if(!validateHours('nominehr')){
            return false;
        }
        if (!validateminutes('nominemin')) {
            return false;
        }
        if(!$('#collname').val()){
            navigator.notification.alert('Collector name must be filled out.', showpage, 'Error', 'OK');
            return false;
        }
        if ($('#sign1').val() != '1') {
            navigator.notification.alert('Collector Signature is required.', showpage, 'Error', 'OK');
            return false;
        }
        if ($('#sign2').val() != '1') {
            navigator.notification.alert('Nominated Client Representative signature is required.', showpage, 'Error', 'OK');
            return false;
        }
    }
    if ($('#changesign1').val() == '1' && $('#sign1').val() == '0') {
        navigator.notification.confirm(
            'You have opted clicked on signature but you have left it blank. Do you want to change your signature?', // message
            function (buttonIndex) {
                changesignoptions(buttonIndex, 'sign1', 'smoothed');
            },
            'Alert!',
            ['Keep Original', 'Change Signature']     // buttonLabels
        );
    }
    if ($('#changesign2').val() == '1' && $('#sign2').val() == '0') {
        navigator.notification.confirm(
            'You have clicked on change signature but you have left it blank. Do you want to change your signature?', // message
            function (buttonIndex) {
                changesignoptions(buttonIndex, 'sign2', 'signpadarea');
            },
            'Alert!',
            ['Keep Original', 'Change Signature']     // buttonLabels
        );
    }
    if ((siteval > '0' && $('#sign1').val() == '1' && $('#sign2').val() == '1') || (siteval > '0' && ($('#changesign1').val() == '0' || $('#changesign2').val() == '0'))) {
        $('.loader-modal').css('display', 'block');
        var jdata = $('form').serializeObject();
        if (type == '1') {
            jdata.status = '1';
        } else {
            jdata.status = '0';
        }
        jdata.formtype = '0';
        if (update == '1') {
            jdata.update = '1';
            if (localStorage.getItem("sosid") > 0) {
                jdata.idsos = localStorage.getItem("sosid");
            } else {
                jdata.idsos = '0';
            }
        } else {
            jdata.update = '0';
        }
        jdata.userid = localStorage.getItem("userid");
        $.ajax({
            datatype: "json",
            url: __SITE_JS_PATH__ + "addsosdata/",
            type: "POST",
            crossDomain: true,
            cache: false,
            data: JSON.stringify(jdata),
            success: function (html) {
                if (html.code == '200') {
                    var siteid = $('#site').val();
                    var sosid = html.sosid;
                    if ($('#smoothed').is(':visible')) {
                        savesign('canvas', siteid, 'collsign', jdata.status);
                    }
                    if ($('#smoothed1').is(':visible')) {
                        savesign('repcanvas', siteid, 'RepresentativeSignature', jdata.status);
                    }
                    if (type == '1') {
                        setTimeout(function () {
                            marksoscomplete(sosid);
                        }, 2000);
                    } else {
                        $('.loader-modal').css('display', 'none');
                        navigator.notification.alert(html.message, callbackfrmenu, 'Success', 'OK');
                    }
                } else if (html.code == '203') {
                    $('.loader-modal').css('display', 'none');
                    navigator.notification.alert(html.message, showpage, 'Error', 'OK');
                } else {
                    $('.loader-modal').css('display', 'none');
                    navigator.notification.alert("Some error occured while adding data. Please try again.", showpage, 'Error', 'OK');
                }
            }
        });
    }
}

function callbackfrmenu() {
    window.location.href = 'franchisee-menu.html';
}

function cocformopen(type, update) {
    var siteval = $('#site').val();
    /*var servicecomm = combinetime('sercomhr', 'sercommin', 'sercomdur');
     var serviceconcl = combinetime('serconhr', 'serconmin', 'sercondur');
     var nominedectime = combinetime('nominehr', 'nominemin', 'nominedur');
     $('#servicecomm').val(servicecomm);
     $('#servicecon').val(serviceconcl);
     $('#nominedec').val(nominedectime);
     var servicecom24hr = changetimeto24hr(servicecomm);
     var servicecon24hr = changetimeto24hr(serviceconcl);
     var nominedectime24hr = changetimeto24hr(nominedectime);*/

    var servicecomm = combinetime24('sercomhr', 'sercommin');
    var serviceconcl = combinetime24('serconhr', 'serconmin');
    var nominedectime = combinetime24('nominehr', 'nominemin');
    $('#servicecomm').val(servicecomm);
    $('#servicecon').val(serviceconcl);
    $('#nominedec').val(nominedectime);
    var servicecom24hr = changetimeto24hr(servicecomm);
    var servicecon24hr = changetimeto24hr(serviceconcl);
    var nominedectime24hr = changetimeto24hr(nominedectime);

    var testdate = $('#sosdate').val();
    var reqclient = $('#reqclient').val();
    var reqsite = $('#site').val();
    var totcoccount = $('#showcocbutton').val();
    var totdonorcount = $('#doner-count').val();
    if (!testdate) {
        navigator.notification.alert('Enter a valid date.', function () {
            focusonfieldbyid('sosdate');
        }, 'Error', 'OK');
        return false;
    } else if (reqclient == 0) {
        navigator.notification.alert('Please select requesting client.', function () {
            focusonfieldbyid('reqclient');
        }, 'Error', 'OK');
        return false;
    } else if (reqsite == 0) {
        navigator.notification.alert('Please select a site.', function () {
            focusonfieldbyid('site');
        }, 'Error', 'OK');
        return false;
    } else if (!validateminutes('sercommin')) {
        return false;
    } else if (totcoccount > '0') {
        for (var i = 1; i <= totcoccount; i++) {

            if ($('#drugnewcounter' + i).val() == '1') {
                var iceval = getvalofcheckedone('ice' + i);
                var marijuanaval = getvalofcheckedone('marijuana' + i);
                var heroinval = getvalofcheckedone('heroin' + i);
                var cocainval = getvalofcheckedone('cocain' + i);
                var benzosval = getvalofcheckedone('benzos' + i);
                var ampval = getvalofcheckedone('amph' + i);
                var othval = $('#oth' + i).val();
                if (iceval == '0' && marijuanaval == '0' && heroinval == '0' && cocainval == '0' && benzosval == '0' && ampval == '0' && !othval) {
                    navigator.notification.alert('Please select a drug.', function () {
                        calbackfocusfield('drugnewcounter' + i);
                    }, 'Error', 'OK');
                    return false;
                }
            }
            if ($('#doneralcohol' + i).val() == '1') {
                var read1 = $.trim($('#pos1read' + i).val());
                var read2 = $.trim($('#pos2read' + i).val());
                if (read1 == '' || read1 == undefined) {
                    navigator.notification.alert('Enter alcohol 1st reading.', function () {
                        focusonfieldbyid('pos1read' + i);
                    }, 'Error', 'OK');
                    return false;
                } else if (!$.isNumeric(read1)) {
                    navigator.notification.alert('Alcohol 1st reading must be numeric.', function () {
                        focusonfieldbyid('pos1read' + i);
                    }, 'Error', 'OK');
                    return false;
                }
                if (read2 == '' || read2 == undefined) {
                    navigator.notification.alert('Enter alcohol 2nd reading.', function () {
                        focusonfieldbyid('pos2read' + i);
                    }, 'Error', 'OK');
                    return false;
                } else if (!$.isNumeric(read2)) {
                    navigator.notification.alert('Alcohol 2nd reading must be numeric.', function () {
                        focusonfieldbyid('pos2read' + i);
                    }, 'Error', 'OK');
                    return false;
                }
            }
        }
    }
    if (totdonorcount > '0') {
        for (var j = 1; j <= totdonorcount; j++) {
            var donarname = $('#name' + j).val();
            if (donarname) {
                var getres = testname('name' + j, donarname, 'Donor name');
                if (getres == false) {
                    return false;
                }
            } else {
                navigator.notification.alert('Enter donor name.', function () {
                    calbackfocusfield('#name' + j);
                }, 'Error', 'OK');
                return false;
            }
        }
    }
    if (!validateminutes('sercommin')) {
        return false;
    }
    /*if (($('#sercomdur').val() == 'AM') && (servicecom24hr > '1159' || servicecom24hr < '0')) {
     navigator.notification.alert('Enter valid hours in service commenced time.', showpage, 'Error', 'OK');
     return false;
     } else if (($('#sercomdur').val() == 'PM') && (servicecom24hr > '2359' || servicecom24hr < '1200')) {
     navigator.notification.alert('Enter valid hours in service commenced time.', showpage, 'Error', 'OK');
     return false;
     }*/
    if (servicecom24hr < 0) {
        navigator.notification.alert('Service Commenced time must filled out.', showpage, 'Error', 'OK');
        return false;
    }
    if (!validateminutes('serconmin')) {
        return false;
    }
    /*if (($('#sercondur').val() == 'AM') && (servicecon24hr > '1159' || servicecon24hr < '0')) {
     navigator.notification.alert('Enter valid hours in service concluded time.', showpage, 'Error', 'OK');
     return false;
     } else if (($('#sercondur').val() == 'PM') && (servicecon24hr > '2359' || servicecon24hr < '1200')) {
     navigator.notification.alert('Enter valid hours in service concluded time.', showpage, 'Error', 'OK');
     return false;
     }*/

    if (servicecon24hr < 0) {
        alert('sch----' + servicecom24hr);
        navigator.notification.alert('Service Concluded time must filled out.', showpage, 'Error', 'OK');
        return false;
    }
    if (servicecom24hr > servicecon24hr) {
        navigator.notification.alert('Service Commenced time must be less than Services Concluded time', showpage, 'Error', 'OK');
        return false;
    }

    var proceedcheck = false;
    var oldkitcount = $('#oldkitcount').val();
    var kitcount = $('#kitcount').val();
    if (oldkitcount > '0') {
        for (var i = 1; i <= kitcount; i++) {
            if ($('#kit' + i).val() > 0) {
                if (!$('#kitqty' + i).val() || $('#kitqty' + i).val() == '' || $('#kitqty' + i).val() == ' ' || $('#kitqty' + i).val() < 1) {
                    navigator.notification.alert('Product quantity must be filled out.', function () {
                        calbackfocusfield('kitqty' + i);
                    }, 'Error', 'OK');
                    return false;
                } else {
                    proceedcheck = true;
                }
            }
        }
        if (!proceedcheck) {
            navigator.notification.alert('You must choose at least one product and its respective quantity, to proceed further.', showpage, 'Error', 'OK');
            return false;
        }
    } else {
        for (var j = 1; j <= kitcount; j++) {
            if ($('#kit' + j).val() > 0) {
                if (!$('#kitqty' + j).val() || $('#kitqty' + j).val() == '' || $('#kitqty' + j).val() == ' ' || $('#kitqty' + j).val() < 1) {
                    navigator.notification.alert('Product quantity must be filled out.', function () {
                        calbackfocusfield('kitqty' + j);
                    }, 'Error', 'OK');
                    return false;
                } else {
                    proceedcheck = true;
                }
            }
        }
        if (!proceedcheck) {
            navigator.notification.alert('You must choose at least one product and its respective quantity, to proceed further.', showpage, 'Error', 'OK');
            return false;
        }
    }

    /*if (($('#nominedur').val() == 'AM') && (nominedectime24hr > '1159' || nominedectime24hr < '0')) {
     navigator.notification.alert('Enter valid hours in nominated client representative signature time.', showpage, 'Error', 'OK');
     return false;
     } else if (($('#nominedur').val() == 'PM') && (nominedectime24hr > '2359' || nominedectime24hr < '1200')) {
     navigator.notification.alert('Enter valid hours in nominated client representative signature time.', showpage, 'Error', 'OK');
     return false;
     }*/
    if (nominedectime24hr < 0) {
        navigator.notification.alert('Nominated Client Representative time field is required.', showpage, 'Error', 'OK');
        return false;
    }
    if (!validateminutes('nominemin')) {
        return false;
    }
    if ($('#sign1').val() != '1') {
        navigator.notification.alert('Collector Signature is required.', showpage, 'Error', 'OK');
        return false;
    }
    if ($('#sign2').val() != '1') {
        navigator.notification.alert('Nominated Client Representative signature is required.', showpage, 'Error', 'OK');
        return false;
    }
    if (siteval > '0') {
        $('.loader-modal').css('display', 'block');
        var jdata = $('form').serializeObject();
        if (type == '1') {
            jdata.status = '1';
        } else {
            jdata.status = '0';
        }
        jdata.formtype = '1';
        if (update == '1') {
            jdata.update = '1';
            if (localStorage.getItem("sosid") > 0) {
                jdata.idsos = localStorage.getItem("sosid");
            } else {
                jdata.idsos = '0';
            }
        } else {
            jdata.update = '0';
        }
        jdata.cocstat = '1';
        jdata.userid = localStorage.getItem("userid");
        $.ajax({
            datatype: "json",
            url: __SITE_JS_PATH__ + "addsosdata/",
            type: "POST",
            crossDomain: true,
            cache: false,
            data: JSON.stringify(jdata),
            success: function (html) {
                if (html.code == '200') {
                    localStorage.setItem("sosid", html.sosid);
                    if (html.count == '1') {
                        localStorage.setItem("cocid", html.cocid);
                        var frusrid = localStorage.getItem("userid");
                        var siteid = localStorage.getItem("siteid");
                        localStorage.setItem("userid", frusrid);
                        localStorage.setItem("siteid", $('#site').val());
                        localStorage.setItem("backtrack", '1');
                        var cocformstatus = $('#showcocformpending').val();
                        var formstatussos = $('#sosstatus').val();
                        if ((cocformstatus == '1') && (formstatussos == '0')) {
                            localStorage.setItem("backtrack", '2');
                            if ($('#smoothed').is(':visible')) {
                                savesign('canvas', siteval, 'collsign', jdata.status);
                            }
                            if ($('#smoothed1').is(':visible')) {
                                savesign('repcanvas', siteval, 'RepresentativeSignature', jdata.status);
                            }

                            setTimeout(function () {
                                window.location.href = 'coc-form-pending-list.html';
                            }, 500);
                        } else {
                            localStorage.setItem("backtrack", '1');
                            localStorage.setItem("formleft", '1');
                            if ($('#smoothed').is(':visible')) {
                                savesign('canvas', siteval, 'collsign', jdata.status);
                            }
                            if ($('#smoothed1').is(':visible')) {
                                savesign('repcanvas', siteval, 'RepresentativeSignature', jdata.status);
                            }

                            setTimeout(function () {
                                window.location.href = 'COC.html';
                            }, 500);
                        }
                    } else if (html.count > '1') {
                        localStorage.setItem("backtrack", '2');
                        if ($('#smoothed').is(':visible')) {
                            savesign('canvas', siteval, 'collsign', jdata.status);
                        }
                        if ($('#smoothed1').is(':visible')) {
                            savesign('repcanvas', siteval, 'RepresentativeSignature', jdata.status);
                        }
                        setTimeout(function () {
                            window.location.href = 'coc-form-pending-list.html';
                        }, 500);
                    }
                    $('.loader-modal').css('display', 'none');
                } else if (html.code == '203') {
                    $('.loader-modal').css('display', 'none');
                    navigator.notification.alert(html.message, showpage, 'Error', 'OK');
                } else if (html.code == '201') {
                    $('.loader-modal').css('display', 'none');
                    navigator.notification.alert(html.message, showpage, 'Error', 'OK');
                } else {
                    $('.loader-modal').css('display', 'none');
                    navigator.notification.alert("Some error occured while adding data. Please try again.", showpage, 'Error', 'OK');
                }
            }
        });
    }
}
function adddoner() {
    $('#opencoc').prop('disabled',true);
    var donercounter = $('#doner-count').val();
    var newcounter = parseInt(donercounter) + 1;
    $('#doner-count').val(newcounter);
    var html = '<div id="doner_' + newcounter + '"><div class="row"><div class="col-sm-4 col-md-5">' +
        '<div class="input-field">' +
        '<label class="col-sm-10">Donor Name</label>' +
        '<label class="col-sm-2 deldonor"><a title="Remove Donor" href="javascript:void(0);" onclick="removedonor(\'' + newcounter + '\')"><i class="fa fa-trash-o"></i></a></label>' +
        '<input type="text" name="name' + newcounter + '" id="name' + newcounter + '"/>' +
        '</div></div>';
    html += '<div class="col-sm-5 col-md-5"><div class="row"><div class="col-xs-3">' +
        '<div class="input-field"><label>Result</label>' +
        '<select name="result' + newcounter + '" id="result' + newcounter + '" class="hidedownarrow" disabled="disabled" onchange="checkcoc(\'result' + newcounter + '\');">';
    html += '<option value="0">N</option>';
    html += '<option value="1">U</option>';
    html += '</select>';
    html += '</div>';
    html += '</div>';
    html += '<div class="col-xs-3">';
    html += '<div class="input-field">';
    html += '<label>Drug</label>';
    html += '<select name="drug' + newcounter + '" class="drugdrop hidedownarrow" disabled="disabled"  id="drugnewcounter' + newcounter + '" onchange="showdrugopt(\'' + newcounter + '\');">';
    html += '<option value="0">N</option>';
    html += '<option value="1">U</option>';
    html += '</select>';
    html += '</div>';
    html += '</div>';
    html += '<div class="col-xs-3">';
    html += '<div class="input-field">';
    html += '<label>Alcohol</label>';
    html += '<select name="alcohol' + newcounter + '" class="alcoholdrop hidedownarrow" disabled="disabled" id="doneralcohol' + newcounter + '" onchange="showalcoholopt(\'' + newcounter + '\');">';
    html += '<option value="0">N</option>';
    html += '<option value="1">U</option>';
    html += '</select>';
    html += '</div>';
    html += '</div>';
    html += '<div class="col-xs-3">';
    html += '<div class="input-field">';
    html += '<label>Lab</label>';
    html += '<select name="lab' + newcounter + '" id="lab' + newcounter + '" class="hidedownarrow" disabled="disabled">';
    html += '<option value="0">N</option>';
    html += '<option value="1">Y</option>';
    html += '</select>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="col-sm-3 col-md-2">';
    html += '<div class="input-field">';
    html += '<br style="margin-bottom: 5px" />';
    html += '<button type="button" class="green-btn" onclick="savesosOpenCoc(0,0,\'name' + newcounter + '\',\'result' + newcounter + '\',\'drugtype' + newcounter + '\',\'pos1read' + newcounter + '\',\'pos2read' + newcounter + '\',\'lab' + newcounter + '\',\'oth' + newcounter + '\',0);">COC Form<span><i class="fa fa-arrow-right"></i></span></button>';
    html += '</div>';
    html += '</div>';
    html += '</div>' +
        '<div id="drug' + newcounter + '" class="drugoptfield">';

    html += '<p>Drug - Positive</p>';
    html += '<div class="row">';
    html += '<div class="col-sm-4">';
    html += '<div class="input-field">';
    html += '<div class="checkbox-field">';
    html += '<input type="checkbox" onclick="return false" id="ice' + newcounter + '" value="1" name="drugtype' + newcounter + '">Ice-Methamphetamine(mAmp)<label for="ice' + newcounter + '"></label>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="col-sm-4">';
    html += '<div class="input-field">';
    html += '<div class="checkbox-field">';
    html += '<input type="checkbox" onclick="return false" id="marijuana' + newcounter + '" value="2" name="drugtype' + newcounter + '">THC-Marijuana(THC)<label for="marijuana' + newcounter + '"></label>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="col-sm-4">';
    html += '<div class="input-field">';
    html += '<div class="checkbox-field">';
    html += '<input type="checkbox" onclick="return false" id="heroin' + newcounter + '" value="3" name="drugtype' + newcounter + '">Heroine-Opiates(OPI)<label for="heroin' + newcounter + '"></label>';
    html += '</div>';
    html += '</div>';
    html += '</div><div class="clearfix"></div>';
    html += '<div class="col-sm-4">';
    html += '<div class="input-field">';
    html += '<div class="checkbox-field">';
    html += '<input type="checkbox" onclick="return false" id="cocain' + newcounter + '" value="4" name="drugtype' + newcounter + '">Cocaine-Cocaine(COC)<label for="cocain' + newcounter + '"></label>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="col-sm-4">';
    html += '<div class="input-field">';
    html += '<div class="checkbox-field">';
    html += '<input type="checkbox" onclick="return false" id="benzos' + newcounter + '" value="5" name="drugtype' + newcounter + '">Benzodiazepines-Benzodiazepines(BZO)<label for="benzos' + newcounter + '"></label>';
    html += '</div>';
    html += '</div></div>';
    html += '<div class="col-sm-4">';
    html += '<div class="input-field">';
    html += '<div class="checkbox-field">';
    html += '<input type="checkbox" onclick="return false" id="amph' + newcounter + '" value="6" name="drugtype' + newcounter + '">Amphetamine-Amphetamine(AMP)<label for="amph' + newcounter + '"></label>';
    html += '</div>';
    html += '</div></div><div class="clearfix"></div>';
    html += '<div class="col-sm-4">';
    html += '<div class="input-field">';
    // html += '<input type="text" readonly="readonly" id="oth' + newcounter + '" value="" placeholder="Other (Specify)" name="oth' + newcounter + '"><label for="oth' + newcounter + '"></label>';
    html += '<div class="checkbox-field">';
    html += '<input type="checkbox" onclick="return false" id="oth' + newcounter + '" value="7" name="drugtype' + newcounter + '">Other<label for="oth' + newcounter + '"></label>';
    html += '</div>';
    html += '</div>';
    html += '</div>' +
        '</div>';
    html += '</div>' +
        '<div id="alcohol' + newcounter + '" class="drugoptfield">';

    html += '<p>Alcohol - Positive</p>';
    html += '<div class="row">';
    html += '<div class="col-sm-6">';
    html += '<div class="input-field">';
    html += '<input type="number" placeholder="1st Reading" readonly="readonly" id="pos1read' + newcounter + '" name="pos1read' + newcounter + '">';
    html += '</div>';
    html += '</div>';
    html += '<div class="col-sm-6">';
    html += '<div class="input-field">';
    html += '<input type="number" placeholder="2nd Reading" readonly="readonly" id="pos2read' + newcounter + '" name="pos2read' + newcounter + '">';
    html += '</div>';
    html += '</div>';
    html += '</div>' +
        '</div>';
    html += '<hr>';
    html += '</div>';
    $(html).insertAfter('#doner_' + donercounter);
    var donercountpost = $('#donercountpost').val();
    if (donercountpost > '0') {
        donercountpost = parseInt(donercountpost) + 1;
        $('#donercountpost').val(donercountpost);
        var newdonerids = $('#newdonerids').val();
        if (newdonerids != '') {
            newdonerids = newdonerids + ',' + donercountpost;
        } else {
            newdonerids = donercountpost;
        }
        $('#newdonerids').val(newdonerids);
    }
    CalOnAddDonor();
}

function removedonor(id) {
    var donercount = $('#doner-count').val();
    donercount = parseInt(donercount) - 1;

    var donercountpost = $('#donercountpost').val();
    if (donercountpost > '0') {
        donercountpost = parseInt(donercountpost) - 1;
        var newdonerids = $('#newdonerids').val();
        if (newdonerids != '') {
            if (newdonerids.length > 1) {
                var newstr = '';
                var newdonersarr = newdonerids.split(',');
                $.each(newdonersarr, function (key, value) {
                    newstr = value;
                });
                if (newstr > id) {
                    navigator.notification.alert("First remove the recently added donor(s).", showpage, 'Error', 'OK');
                    return false;
                }
            }
            newdonerids = newdonerids.substring(0, newdonerids.length - 2);
        }
        $('#donercountpost').val(donercountpost);
        $('#newdonerids').val(newdonerids);
    }
    if ((donercountpost == '0') && (id < $('#doner-count').val())) {
        navigator.notification.alert("First remove the recently added donor(s).", showpage, 'Error', 'OK');
        return false;
    }
    $('#doner-count').val(donercount);
    if($('#doner-count').val() == $('#coc-complete-count').val()){
        $('#opencoc').prop('disabled',false);
    }else{
        $('#opencoc').prop('disabled',true);
    }
    OnRemoveAdjustCalculation(id);
    $('#doner_' + id).remove();
}

function checkAvailProds(qty, prodid) {
    if (localStorage.getItem("role") == '6') {
        var jdata = {
            franchiseeid: localStorage.getItem("agentfranchiseeid"),
            prodid: $('#' + prodid).val()
        }
    } else {
        var jdata = {
            franchiseeid: localStorage.getItem("userid"),
            prodid: $('#' + prodid).val()
        }
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getfranchiseeinventory/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            if (html.code == '200') {
                var inputval = $('#' + qty).val();
                var stockval = html.dataarr[0].szQuantity;
                //alert(parseInt(inputval)+'----'+parseInt(stockval));
                if (parseInt(inputval) > parseInt(stockval)) {
                    navigator.notification.alert("Don't have enough stock for this item. Lower your input quantity or add items to your stock to fulfill this request.", function () {
                        calbackfocusfield(qty);
                    }, 'Alert!', 'OK');
                }
            } else {
                navigator.notification.alert("No DrugTest kit items are available.", showpage, 'Error', 'OK');
            }
        }
    });
}

function addkit() {
    var kitcount = $('#kitcount').val();
    var newkitcount = parseInt(kitcount) + 1;
    var kithtml = '<div class="row productsec" id="kitrow' + newkitcount + '">' +
        '<div class="col-xs-5">' +
        '<div class="input-field">' +
        '<select name="kit' + newkitcount + '" id="kit' + newkitcount + '" class="drugtestprods" onchange="checkprodexist(\'kit' + newkitcount + '\',\'' + newkitcount + '\');">' +
        '<option value="0">Product</option>' +
        '</select>' +
        '</div>' +
        '</div>' +
        '<div class="col-xs-5">' +
        '<div class="input-field">' +
        '<input type="number" placeholder="Qty" value="" step="1" min="1" max="100" onblur="checkAvailProds(\'kitqty' + newkitcount + '\',\'kit' + newkitcount + '\');" name="kitqty' + newkitcount + '" id="kitqty' + newkitcount + '" >' +
        '</div>' +
        '</div>' +
        '</div>';
    $(kithtml).insertAfter('div.productsec:last');
    getDrugtestKitItems('kit' + newkitcount);
    $('#kitcount').val(newkitcount);
    var totalkitcount = $('#totalkitcount').val();
    if (totalkitcount > '0') {
        totalkitcount = parseInt(totalkitcount) + 1;
        $('#totalkitcount').val(totalkitcount);
        var newkitids = $('#newkitids').val();
        if (newkitids != '') {
            newkitids = newkitids + ',' + totalkitcount;
        } else {
            newkitids = totalkitcount;
        }
        $('#newkitids').val(newkitids);
    }
}

function showalcoholopt(id, donorid, cocid) {
    // setTimeout(function () {
        checkcoc("doneralcohol" + id);
        var getfieldval = $('#doneralcohol' + id).val();
        var labOldVal = $('#lab' + id).val();
        var labNewVal = '';
        if (getfieldval == '1') {
            $('#alcohol' + id).show();
            $('#result' + id).val('1');
            $('#lab' + id).val('1');
            labNewVal = '1';
        } else {
            var drgval = $('#drugnewcounter' + id).val();
            if (drgval == '1') {
                $('#result' + id).val('1');
                $('#lab' + id).val('1');
                labNewVal = '1';
            } else {
                if ((donorid != undefined) && (cocid != undefined) && (donorid > '0')) {
                    $('#result' + id).val('0');
                    $('#lab' + id).val('0');
                    labNewVal = '0';
                    deldonor(donorid, cocid, "1", "doneralcohol", id);
                    /*setTimeout(function () {
                     alert(res);
                     },1000);*/
                } else {
                    $('#result' + id).val('0');
                    $('#lab' + id).val('0');
                    labNewVal = '0';
                }
            }
            $('#alcohol' + id).hide();
        }
        // if (labOldVal != labNewVal) {
            calculateResult(labNewVal,'alcohol','doneralcohol' + id);
        // }
    // }, 500);
}

function showdrugopt(id, donorid, cocid) {
    // setTimeout(function () {
        checkcoc("drugnewcounter" + id);
        var getfieldval = $('#drugnewcounter' + id).val();
        var labOldVal = $('#lab' + id).val();
        var labNewVal = '';
        if (getfieldval == '1') {
            $('#drug' + id).show();
            $('#result' + id).val('1');
            $('#lab' + id).val('1');
            labNewVal = '1';
        } else {
            var alcval = $('#doneralcohol' + id).val();
            if (alcval == '1') {
                $('#result' + id).val('1');
                $('#lab' + id).val('1');
                labNewVal = '1';
            } else {
                if ((donorid != undefined) && (cocid != undefined) && (donorid > '0')) {
                    $('#result' + id).val('0');
                    $('#lab' + id).val('0');
                    labNewVal = '0';
                    deldonor(donorid, cocid, "1", "drugnewcounter", id);
                    /*setTimeout(function () {
                     alert(res);
                     },1000);*/

                } else {
                    $('#result' + id).val('0');
                    $('#lab' + id).val('0');
                    labNewVal = '0';
                }

            }
            $('#drug' + id).hide();
        }
        // if (labOldVal != labNewVal) {
            calculateResult(labNewVal,'drug','drugnewcounter' + id);
        // }
    // }, 500);
}

function checkresult() {
    $('#complete').hide();
    $('#opencoc').show();
}

function getDrugtestKitItems(id, selid) {
    var jdata = {
        catid: '1'
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getallprodbycatid/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            $('#' + id).empty();
            if (html.code == '200') {
                $('#' + id).append($('<option>', {
                    value: 0,
                    text: 'Product'
                }));
                $.each(html.prodarr, function (key, value) {
                    if ((selid) && (value.id == selid)) {
                        $('#' + id).append($('<option>', {
                            value: value.id,
                            text: value.szProductCode,
                            selected: true
                        }));
                    } else {
                        $('#' + id).append($('<option>', {
                            value: value.id,
                            text: value.szProductCode
                        }));
                    }
                });
            } else {
                navigator.notification.alert("No DrugTest kit items are available.", showpage, 'Error', 'OK');
            }
        }
    });
}

function checkprodexist(id, counter) {
    var checkerval = $('#' + id).val();
    var totalkits = $('#kitcount').val();
    for (var i = 1; i <= totalkits; i++) {
        if (i != counter) {
            if ($('#kit' + i).val() == checkerval) {
                navigator.notification.alert('You have already selected this product. Please select other product.', function () {
                    focusonfieldbyid(id, '1');
                }, 'Alert!', 'OK');
                return false;
            }
        }
    }
}

function drugval(val) {
    var Alcohol = false;
    var Oral = false;
    var Urine = false;
    var OtherTest = false;
    var UncheckAlcohol = false;
    var UncheckOral = false;
    var UncheckUrine = false;
    var UncheckOtherTest = false;
    var totalDonor = $('#doner-count').val();
    var Drugpositive = 0;
    var Drugnegative = 0;
    var Alcoholpositive = 0;
    var Alcoholnegative = 0;
    for (var i = 1; i <= totalDonor; i++) {
        if ($(val).attr('id') == 'alcohol' && $('#alcohol').is(':checked') && $('#doneralcohol' + i).val() == 1) {
            Alcoholpositive++;
        } else {
            Alcoholnegative++;
        }
        if ($(val).attr('id') != 'alcohol' && $('#drugnewcounter' + i).val() == 1) {
            Drugpositive++;
        } else {
            Drugnegative++;
        }
    }
    if ($(val).is(':checked')) {
        switch (parseInt(val.value)) {
            case 1:
                Alcohol = true;
                break;
            case 2:
                $('#urine').prop('checked',false);
                Oral = true;
                // Alcohol = true;
                UncheckUrine = true;
                break;
            case 3:
            case 4:
                $('#oral-fluid').prop('checked',false);
                Urine = true;
                // Alcohol = true;
                UncheckOral = true;
                break;
            case 5:
                OtherTest = true;
                // Alcohol = true;
                break;
        }
    } else {
        switch (parseInt(val.value)) {
            case 1:
                UncheckAlcohol = true;
                break;
            case 2:
                UncheckOral = true;
                break;
            case 3:
            case 4:
                UncheckUrine = true;
                break;
            case 5:
                UncheckOtherTest = true;
                break;
        }
    }
    if (Alcohol) {
        $('#totalcscreen').val(totalDonor);
        $('#posalcres').val(Alcoholpositive);
        $('#negalcres').val(Alcoholnegative);
    }else if (UncheckAlcohol) {
        $('#totalcscreen').val(0);
        $('#posalcres').val(0);
        $('#negalcres').val(0);
    }
    /*else if (UncheckAlcohol) {
        $('#totalcscreen').val(0);
        $('#posalcres').val(0);
        $('#negalcres').val(0);
    }*/
    if (Oral) {
        $('#totscreeno').val(totalDonor);
        $('#furtesto').val(Drugpositive);
        $('#negreso').val(Drugnegative);
    } else if (UncheckOral) {
        $('#totscreeno').val(0);
        $('#furtesto').val(0);
        $('#negreso').val(0);
    }
    if (Urine) {
        $('#totscreenu').val(totalDonor);
        $('#furtestu').val(Drugpositive);
        $('#negresu').val(Drugnegative);
    } else if (UncheckUrine) {
        $('#totscreenu').val(0);
        $('#furtestu').val(0);
        $('#negresu').val(0);
    }

    if (OtherTest) {
        $('.othertestsec').show();
    } else if (UncheckOtherTest) {
        $('.othertestsec').hide();
    }

}

function calculateResult(labResult,opt,optid) {
    var Alcohol = $('#totalcscreen').val();
    var Oral = $('#totscreeno').val();
    var Urine = $('#totscreenu').val();
    if (Alcohol >= 0 && opt == 'alcohol') {
        $('#totalcscreen').val($('#doner-count').val());
        var alPositive = $('#posalcres').val();
        var alNegative = $('#negalcres').val();
        if ($('#'+optid).val() == '1') {
            $('#posalcres').val(parseInt(alPositive) + 1);
            $('#negalcres').val((parseInt(alNegative)>0?parseInt(alNegative) - 1:0));
        }
        if ($('#'+optid).val() == '0') {
            $('#posalcres').val((parseInt(alPositive)>0?parseInt(alPositive) - 1:0));
            $('#negalcres').val(parseInt(alNegative) + 1);
        }
    }
    if (Oral >= 0 && $('#oral-fluid').is(':checked') && opt == 'drug') {
        $('#totscreeno').val($('#doner-count').val());
        var OrPositive = $('#furtesto').val();
        var OrNegative = $('#negreso').val();
        if ($('#'+optid).val() == '1') {
            $('#furtesto').val(parseInt(OrPositive) + 1);
            $('#negreso').val((parseInt(OrNegative)>0?parseInt(OrNegative) - 1:0));
        }
        if ($('#'+optid).val() == '0') {
            $('#furtesto').val((parseInt(OrPositive)>0?parseInt(OrPositive) - 1:0));
            $('#negreso').val(parseInt(OrNegative) + 1);
        }
    }
    if (Urine >= 0 && ($('#urine').is(':checked') || $('#asnza').is(':checked')) && opt == 'drug') {
        $('#totscreenu').val($('#doner-count').val());
        var UrPositive = $('#furtestu').val();
        var UrNegative = $('#negresu').val();
        if ($('#'+optid).val() == '1') {
            $('#furtestu').val(parseInt(UrPositive) + 1);
            $('#negresu').val((parseInt(UrNegative)>0?parseInt(UrNegative) - 1:0));
        }
        if ($('#'+optid).val() == '0') {
            $('#furtestu').val((parseInt(UrPositive)>0?parseInt(UrPositive) - 1:0));
            $('#negresu').val(parseInt(UrNegative) + 1);
        }
    }
}

function CalOnAddDonor() {
    var Alcohol = $('#totalcscreen').val();
    var Oral = $('#totscreeno').val();
    var Urine = $('#totscreenu').val();
    if (Alcohol > 0) {
        var alNegative = $('#negalcres').val();
        $('#totalcscreen').val(parseInt(Alcohol) + 1);
        $('#negalcres').val(parseInt(alNegative) + 1);
    }
    if (Oral > 0) {
        var OrNegative = $('#negreso').val();
        $('#totscreeno').val(parseInt(Oral) + 1);
        $('#negreso').val(parseInt(OrNegative) + 1);
    }
    if (Urine > 0) {
        var UrNegative = $('#negresu').val();
        $('#totscreenu').val(parseInt(Urine) + 1);
        $('#negresu').val(parseInt(UrNegative) + 1);
    }
}

function OnsubmitAdjustCalculation() {
    var Alcohol = false;
    var Oral = false;
    var Urine = false;
    if ($('#alcohol').is(':checked')) {
        Alcohol = true;
    }
    if ($('#oral-fluid').is(':checked')) {
        Oral = true;
    }
    if ($('#urine').is(':checked')) {
        Urine = true;
    }
    if ($('#asnza').is(':checked')) {
        Urine = true;
    }
    var totalcount = $('#doner-count').val();
    for (var i = 1; i <= totalcount; i++) {
        var donorname = $.trim($('#name'+i).val());
        if(!donorname){
            if ($('#lab' + i).val() == 1) {
                if (Alcohol) {
                    $('#totalcscreen').val(parseInt($('#totalcscreen').val())-1);
                    $('#posalcres').val(parseInt($('#posalcres').val())-1);
                }
                if (Oral) {
                    $('#totscreeno').val(parseInt($('#totscreeno').val())-1);
                    $('#furtesto').val(parseInt($('#furtesto').val())-1);
                }
                if (Urine) {
                    $('#totscreenu').val(parseInt($('#totscreenu').val())-1);
                    $('#furtestu').val(parseInt($('#furtestu').val())-1);
                }
            } else {
                if (Alcohol) {
                    $('#totalcscreen').val(parseInt($('#totalcscreen').val())-1);
                    $('#negalcres').val(parseInt($('#negalcres').val())-1);
                }
                if (Oral) {
                    $('#totscreeno').val(parseInt($('#totscreeno').val())-1);
                    $('#negreso').val(parseInt($('#negreso').val())-1);
                }
                if (Urine) {
                    $('#totscreenu').val(parseInt($('#totscreenu').val())-1);
                    $('#negresu').val(parseInt($('#negresu').val())-1);
                }
            }
        }
    }
}

function OnRemoveAdjustCalculation(id) {
    var Alcohol = false;
    var Oral = false;
    var Urine = false;
    if ($('#alcohol').is(':checked')) {
        Alcohol = true;
    }
    if ($('#oral-fluid').is(':checked')) {
        Oral = true;
    }
    if ($('#urine').is(':checked')) {
        Urine = true;
    }
    if ($('#asnza').is(':checked')) {
        Urine = true;
    }
        if ($('#lab' + id).val() == '1') {
            if (Alcohol) {
                $('#totalcscreen').val(parseInt($('#totalcscreen').val())-1);
                $('#posalcres').val(parseInt($('#posalcres').val())-1);
            }
            if (Oral) {
                $('#totscreeno').val(parseInt($('#totscreeno').val())-1);
                $('#furtesto').val(parseInt($('#furtesto').val())-1);
            }
            if (Urine) {
                $('#totscreenu').val(parseInt($('#totscreenu').val())-1);
                $('#furtestu').val(parseInt($('#furtestu').val())-1);
            }
        } else if($('#lab' + id).val() == '0'){
            if (Alcohol) {
                $('#totalcscreen').val(parseInt($('#totalcscreen').val())-1);
                $('#negalcres').val(parseInt($('#negalcres').val())-1);
            }
            if (Oral) {
                $('#totscreeno').val(parseInt($('#totscreeno').val())-1);
                $('#negreso').val(parseInt($('#negreso').val())-1);
            }
            if (Urine) {
                $('#totscreenu').val(parseInt($('#totscreenu').val())-1);
                $('#negresu').val(parseInt($('#negresu').val())-1);
            }
        }
}

function savesosOpenCoc(type, update, donerFieldId,drugresult,drugtype,pos1read,pos2read,lab,oth,donorid) {
    var siteval = $('#site').val();
    var drugtest = $("input[name='drugtest']:checked").val();
    var screening = $("input[name='screenfacility']:checked").val();
    var servicecomm = combinetime24('sercomhr', 'sercommin');
    var serviceconcl = combinetime24('serconhr', 'serconmin');
    var nominedectime = combinetime24('nominehr', 'nominemin');
    $('#servicecomm').val(servicecomm);
    $('#servicecon').val(serviceconcl);
    $('#nominedec').val(nominedectime);
    var servicecom24hr = changetimeto24hr(servicecomm);
    var servicecon24hr = changetimeto24hr(serviceconcl);
    var nominedectime24hr = changetimeto24hr(nominedectime);

    var testdate = $('#sosdate').val();
    var reqclient = $('#reqclient').val();
    var reqsite = $('#site').val();
    var totcoccount = $('#showcocbutton').val();
    var totdonorcount = $('#doner-count').val();
    if (!testdate) {
        navigator.notification.alert('Enter a valid date.', function () {
            focusonfieldbyid('sosdate');
        }, 'Error', 'OK');
        return false;
    }else if(!validateHours('sercomhr')){
        return false;
    }else if (!validateminutes('sercommin')) {
        return false;
    }else if (servicecom24hr == '') {
        navigator.notification.alert('Service Commenced time must filled out.', function () {
            focusonfieldbyid('sercomhr');
        }, 'Error', 'OK');
        return false;
    }else if (!screening) {
        navigator.notification.alert('Please choose screening facilities.', function () {
            focusonfieldbyid('inhouse');
        }, 'Error', 'OK');
        return false;
    } else if (reqclient == 0) {
        navigator.notification.alert('Please select requesting client.', function () {
            focusonfieldbyid('reqclient');
        }, 'Error', 'OK');
        return false;
    } else if (reqsite == 0) {
        navigator.notification.alert('Please select a site.', function () {
            focusonfieldbyid('site');
        }, 'Error', 'OK');
        return false;
    }else if (!drugtest) {
        navigator.notification.alert('Please choose at least one drug test.', function () {
            focusonfieldbyid('alcohol1');
        }, 'Error', 'OK');
        return false;
    }
    else if (type == '0') {
        var donarname = $('#' + donerFieldId).val();
        if (!donarname) {
            navigator.notification.alert('Enter donor name.', function () {
                calbackfocusfield(donerFieldId);
            }, 'Error', 'OK');
            return false;
        } else {
            var getres = testname(donerFieldId, donarname, 'Donor name');
            if (getres == false) {
                return false;
            }
        }
    }
    if (type == '1') {
        var donarname = $('#' + donerFieldId).val();
        if (!donarname) {
            navigator.notification.alert('Enter donor name.', function () {
                calbackfocusfield(donerFieldId);
            }, 'Error', 'OK');
            return false;
        } else {
            var getres = testname(donerFieldId, donarname, 'Donor name');
            if (getres == false) {
                return false;
            }
        }
    }
    if (siteval > '0') {
        $('.loader-modal').css('display', 'block');
        var drugtypeList = '';
            $("input[name='"+drugtype+"']:checked").each(function() {
            drugtypeList += this.value+',';
        });
        drugtypeList = drugtypeList.substring(0,drugtypeList.length - 1);
        var jdata = $('form').serializeObject();
        jdata.donorname = $('#'+donerFieldId).val();
        jdata.drugresult = $('#'+drugresult).val();
        jdata.drugtype = drugtypeList;
        jdata.pos1read = $('#'+pos1read).val();
        jdata.pos2read = $('#'+pos2read).val();
        jdata.lab = $('#'+lab).val();
        jdata.oth = $('#'+oth).val();
        jdata.donorid = donorid;
        if (type == '1') {
            jdata.status = '1';
        } else {
            jdata.status = '0';
        }
        jdata.formtype = '0';
        if (update == '1') {
            jdata.update = '1';
        } else {
            jdata.update = '0';
        }
        if (localStorage.getItem("sosid") > 0) {
            jdata.idsos = localStorage.getItem("sosid");
        } else {
            jdata.idsos = '0';
        }
        jdata.userid = localStorage.getItem("userid");
        $.ajax({
            datatype: "json",
            url: __SITE_JS_PATH__ + "addsosdataopencoc/",
            type: "POST",
            crossDomain: true,
            cache: false,
            data: JSON.stringify(jdata),
            success: function (html) {
                if (html.code == '200') {

                    localStorage.setItem("sosid", html.sosid);
                    if (html.count == '1') {
                        localStorage.setItem("cocid", html.cocid);
                        var frusrid = localStorage.getItem("userid");
                        var siteid = localStorage.getItem("siteid");
                        localStorage.setItem("userid", frusrid);
                        localStorage.setItem("siteid", $('#site').val());
                        localStorage.setItem("backtrack", '1');
                        var cocformstatus = $('#showcocformpending').val();
                        var formstatussos = $('#sosstatus').val();
                        /*if ((cocformstatus == '1') && (formstatussos == '0')) {
                            localStorage.setItem("backtrack", '2');
                            if ($('#smoothed').is(':visible') && $('#sign1').val() == '1') {
                                savesign('canvas', siteval, 'collsign', jdata.status);
                            }
                            if ($('#smoothed1').is(':visible') && $('#sign2').val() == '1') {
                                savesign('repcanvas', siteval, 'RepresentativeSignature', jdata.status);
                            }

                            setTimeout(function () {
                                window.location.href = 'coc-form-pending-list.html';
                            }, 500);
                        } else {*/
                            localStorage.setItem("backtrack", '1');
                            localStorage.setItem("formleft", '1');
                            if ($('#smoothed').is(':visible') && $('#sign1').val() == '1') {
                                savesign('canvas', siteval, 'collsign', jdata.status);
                            }
                            if ($('#smoothed1').is(':visible') && $('#sign2').val() == '1') {
                                savesign('repcanvas', siteval, 'RepresentativeSignature', jdata.status);
                            }

                            setTimeout(function () {
                                window.location.href = 'COC.html';
                            }, 500);
                        // }
                    }else{
                        $('.loader-modal').css('display', 'none');
                        navigator.notification.alert("Count is greater than 1. Please try again.", showpage, 'Error', 'OK');
                    }
                } else if (html.code == '203') {
                    $('.loader-modal').css('display', 'none');
                    navigator.notification.alert(html.message, showpage, 'Error', 'OK');
                } else {
                    $('.loader-modal').css('display', 'none');
                    navigator.notification.alert("Some error occured while adding data. Please try again.", showpage, 'Error', 'OK');
                }
            }
        });
    }
}

function finalSubmitDrugTest(type, update,print) {
    if(!print){
        print = 0;
    }
    var siteval = $('#site').val();
    var servicecomm = combinetime24('sercomhr', 'sercommin');
    var serviceconcl = combinetime24('serconhr', 'serconmin');
    var nominedectime = combinetime24('nominehr', 'nominemin');
    $('#servicecomm').val(servicecomm);
    $('#servicecon').val(serviceconcl);
    $('#nominedec').val(nominedectime);
    var servicecom24hr = changetimeto24hr(servicecomm);
    var servicecon24hr = changetimeto24hr(serviceconcl);
    var nominedectime24hr = changetimeto24hr(nominedectime);

    var testdate = $('#sosdate').val();
    var reqclient = $('#reqclient').val();
    var reqsite = $('#site').val();
    var totcoccount = $('#showcocbutton').val();
    var totdonorcount = $('#doner-count').val();
    if (!testdate) {
        navigator.notification.alert('Enter a valid date.', function () {
            focusonfieldbyid('sosdate');
        }, 'Error', 'OK');
        return false;
    } else if (reqclient == 0) {
        navigator.notification.alert('Please select requesting client.', function () {
            focusonfieldbyid('reqclient');
        }, 'Error', 'OK');
        return false;
    } else if (reqsite == 0) {
        navigator.notification.alert('Please select a site.', function () {
            focusonfieldbyid('site');
        }, 'Error', 'OK');
        return false;
    } else if (!validateminutes('sercommin')) {
        return false;
    } else if (totcoccount > '0') {
        for (var i = 1; i <= totcoccount; i++) {

            if ($('#drugnewcounter' + i).val() == '1') {
                var iceval = getvalofcheckedone('ice' + i);
                var marijuanaval = getvalofcheckedone('marijuana' + i);
                var heroinval = getvalofcheckedone('heroin' + i);
                var cocainval = getvalofcheckedone('cocain' + i);
                var benzosval = getvalofcheckedone('benzos' + i);
                var ampval = getvalofcheckedone('amph' + i);
                var othval = $('#oth' + i).val();
                if (iceval == '0' && marijuanaval == '0' && heroinval == '0' && cocainval == '0' && benzosval == '0' && ampval == '0' && !othval) {
                    navigator.notification.alert('Please select a drug.', function () {
                        calbackfocusfield('drugnewcounter' + i);
                    }, 'Error', 'OK');
                    return false;
                }
            }
            if ($('#doneralcohol' + i).val() == '1') {
                var read1 = $.trim($('#pos1read' + i).val());
                var read2 = $.trim($('#pos2read' + i).val());
                if (read1 == '' || read1 == undefined) {
                    navigator.notification.alert('Enter alcohol 1st reading.', function () {
                        focusonfieldbyid('pos1read' + i);
                    }, 'Error', 'OK');
                    return false;
                } else if (!$.isNumeric(read1)) {
                    navigator.notification.alert('Alcohol 1st reading must be numeric.', function () {
                        focusonfieldbyid('pos1read' + i);
                    }, 'Error', 'OK');
                    return false;
                }
                if (read2 == '' || read2 == undefined) {
                    navigator.notification.alert('Enter alcohol 2nd reading.', function () {
                        focusonfieldbyid('pos2read' + i);
                    }, 'Error', 'OK');
                    return false;
                } else if (!$.isNumeric(read2)) {
                    navigator.notification.alert('Alcohol 2nd reading must be numeric.', function () {
                        focusonfieldbyid('pos2read' + i);
                    }, 'Error', 'OK');
                    return false;
                }
            }
        }
    }
    if (totdonorcount > '0') {
        for (var j = 1; j <= totdonorcount; j++) {
            var donarname = $('#name' + j).val();
            if (donarname) {
                var getres = testname('name' + j, donarname, 'Donor name');
                if (getres == false) {
                    return false;
                }
            } else {
                navigator.notification.alert('Enter donor name.', function () {
                    calbackfocusfield('#name' + j);
                }, 'Error', 'OK');
                return false;
            }
        }
    }
    if (!validateminutes('sercommin')) {
        return false;
    }
    if (servicecom24hr < 0) {
        navigator.notification.alert('Service Commenced time must filled out.', showpage, 'Error', 'OK');
        return false;
    }
    if (!validateminutes('serconmin')) {
        return false;
    }
    if (servicecon24hr < 0) {
        navigator.notification.alert('Service Concluded time must filled out.', showpage, 'Error', 'OK');
        return false;
    }
    if (servicecom24hr > servicecon24hr) {
        navigator.notification.alert('Service Commenced time must be less than Services Concluded time', showpage, 'Error', 'OK');
        return false;
    }

    var proceedcheck = false;
    var oldkitcount = $('#oldkitcount').val();
    var kitcount = $('#kitcount').val();
    if (oldkitcount > '0') {
        for (var i = 1; i <= kitcount; i++) {
            if ($('#kit' + i).val() > 0) {
                if (!$('#kitqty' + i).val() || $('#kitqty' + i).val() == '' || $('#kitqty' + i).val() == ' ' || $('#kitqty' + i).val() < 1) {
                    navigator.notification.alert('Product quantity must be filled out.', function () {
                        calbackfocusfield('kitqty' + i);
                    }, 'Error', 'OK');
                    return false;
                } else {
                    proceedcheck = true;
                }
            }
        }
        if (!proceedcheck) {
            navigator.notification.alert('You must choose at least one product and its respective quantity, to proceed further.', showpage, 'Error', 'OK');
            return false;
        }
    } else {
        for (var j = 1; j <= kitcount; j++) {
            if ($('#kit' + j).val() > 0) {
                if (!$('#kitqty' + j).val() || $('#kitqty' + j).val() == '' || $('#kitqty' + j).val() == ' ' || $('#kitqty' + j).val() < 1) {
                    navigator.notification.alert('Product quantity must be filled out.', function () {
                        calbackfocusfield('kitqty' + j);
                    }, 'Error', 'OK');
                    return false;
                } else {
                    proceedcheck = true;
                }
            }
        }
        if (!proceedcheck) {
            navigator.notification.alert('You must choose at least one product and its respective quantity, to proceed further.', showpage, 'Error', 'OK');
            return false;
        }
    }
    if (nominedectime24hr < 0) {
        navigator.notification.alert('Nominated Client Representative time field is required.', showpage, 'Error', 'OK');
        return false;
    }
    if (!validateminutes('nominemin')) {
        return false;
    }
    if(!$('#collname').val()){
        navigator.notification.alert('Collector name must be filled out.', showpage, 'Error', 'OK');
        return false;
    }
    if ($('#sign1').val() != '1') {
        navigator.notification.alert('Collector Signature is required.', showpage, 'Error', 'OK');
        return false;
    }
    if ($('#sign2').val() != '1') {
        navigator.notification.alert('Nominated Client Representative signature is required.', showpage, 'Error', 'OK');
        return false;
    }
    if (siteval > '0') {
        $('.loader-modal').css('display', 'block');
        var jdata = $('form').serializeObject();
        if (type == '1') {
            jdata.status = '1';
        } else {
            jdata.status = '0';
        }
        jdata.formtype = '1';
        if (update == '1') {
            jdata.update = '1';
            if (localStorage.getItem("sosid") > 0) {
                jdata.idsos = localStorage.getItem("sosid");
            } else {
                jdata.idsos = '0';
            }
        } else {
            jdata.update = '0';
        }
        jdata.cocstat = '1';
        jdata.userid = localStorage.getItem("userid");
        $.ajax({
            datatype: "json",
            url: __SITE_JS_PATH__ + "addsosdata/",
            type: "POST",
            crossDomain: true,
            cache: false,
            data: JSON.stringify(jdata),
            success: function (html) {
                if (html.code == '200') {
                    localStorage.setItem("sosid", html.sosid);
                    if (html.count == '1') {
                        localStorage.setItem("cocid", html.cocid);
                        var frusrid = localStorage.getItem("userid");
                        var siteid = localStorage.getItem("siteid");
                        localStorage.setItem("userid", frusrid);
                        localStorage.setItem("siteid", $('#site').val());
                        localStorage.setItem("backtrack", '1');
                        var cocformstatus = $('#showcocformpending').val();
                        var formstatussos = $('#sosstatus').val();
                        /*if ((cocformstatus == '1') && (formstatussos == '0')) {
                            localStorage.setItem("backtrack", '2');
                            if ($('#smoothed').is(':visible')) {
                                savesign('canvas', siteval, 'collsign', jdata.status);
                            }
                            if ($('#smoothed1').is(':visible')) {
                                savesign('repcanvas', siteval, 'RepresentativeSignature', jdata.status);
                            }

                            setTimeout(function () {
                                window.location.href = 'coc-form-pending-list.html';
                            }, 500);
                        } else {*/
                            localStorage.setItem("backtrack", '1');
                            localStorage.setItem("formleft", '1');
                            if ($('#smoothed').is(':visible')) {
                                savesign('canvas', siteval, 'collsign', jdata.status);
                            }
                            if ($('#smoothed1').is(':visible')) {
                                savesign('repcanvas', siteval, 'RepresentativeSignature', jdata.status);
                            }

                            setTimeout(function () {
                                // window.location.href = 'COC.html';
                                if(print == '1'){
                                    marksoscomplete(html.sosid,0,1);
                                }else{
                                    marksoscomplete(html.sosid,1);
                                }
                            }, 500);
                        // }
                    } else if (html.count > '1') {
                        localStorage.setItem("backtrack", '2');
                        if ($('#smoothed').is(':visible')) {
                            savesign('canvas', siteval, 'collsign', jdata.status);
                        }
                        if ($('#smoothed1').is(':visible')) {
                            savesign('repcanvas', siteval, 'RepresentativeSignature', jdata.status);
                        }
                        setTimeout(function () {
                            // window.location.href = 'coc-form-pending-list.html';
                            if(print == '1'){
                                marksoscomplete(html.sosid,0,1);
                            }else{
                                marksoscomplete(html.sosid,1);
                            }
                        }, 500);
                    }
                } else if (html.code == '203') {
                    $('.loader-modal').css('display', 'none');
                    navigator.notification.alert(html.message, showpage, 'Error', 'OK');
                } else if (html.code == '201') {
                    $('.loader-modal').css('display', 'none');
                    navigator.notification.alert(html.message, showpage, 'Error', 'OK');
                } else {
                    $('.loader-modal').css('display', 'none');
                    navigator.notification.alert("Some error occured while adding data. Please try again.", showpage, 'Error', 'OK');
                }
            }
        });
    }
}