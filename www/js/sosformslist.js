function getFormsList() {
    $('.loader-modal').css('display', 'block');

    var jdata = {
        siteid: localStorage.getItem("clientsite"),
        status:'1'
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getsosformdatabysiteid/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            if (html.code == '200') {
                var htmldata = '';
                $.each( html.dataarr, function( key, value ) {
                    var onclickvar = '';
                    var testdatearr = value.testdate.split(" ");
                    var testdate = formatdate(testdatearr[0]);
                    onclickvar = 'onclick="opensosdata('+value.id+',\''+testdate+'\');"';
                    htmldata += '<p><button type="button" class="button green-btn" '+onclickvar+'> Drug Test - '+testdate+'<span><i class="fa fa-building" aria-hidden="true"></i></span></button></p>';
                });
                $('.forms-list').html(htmldata);
                $('.loader-modal').css('display', 'none');
            } else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, showpage, 'Error', 'OK');
            }
        }
    });
}

function formatdate(val) {
    var datearr = val.split('-');
    var dateval = datearr[2]+'/'+datearr[1]+'/'+datearr[0];
    if((dateval != '00/00/0000') && (dateval != '31/12/1969')){
        return dateval;
    }else{
        return '';
    }
}

function opensosdata(sosid,testdate) {
    var modalhtml ='<div class="modal fade custommodal" id="openoptions" role="dialog">'+
        '<div class="modal-dialog">'+
        '<div class="modal-content">'+
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
        '<h4 class="modal-title">Drug Test - '+testdate+'</h4>'+
        '</div>'+
        '<div class="modal-body">'+
        '<p><button type="button" class="btn btn-default" onclick="showformdata('+sosid+');">Open SOS Info</button></p>'+
        '<p><button type="button" class="btn btn-default" onclick="showdonorinfo('+sosid+');">Donors - COC Info</button></p>'+
        '<a href="#opensosdata" id="opensos" data-toggle="modal" style="display: none"></a> </td>' +
        '<a href="#donorsdetmodal" id="showdonor" data-toggle="modal" style="display: none"></a> </td>' +
        '</div>'+
        '<div class="modal-footer">'+
        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>';
    $('.show-custom-modal').html(modalhtml);
    $('#openoptions').modal('show');
}

function showformdata(sosid) {
    $('.loader-modal').css('display', 'block');
    var jdata = {
        sosid: sosid
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getsosformdatabysosid/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            if (html.code == '200') {
                console.log(html);
                var modalhtml = '<div class="modal fade custommodal" id="opensosdata" role="dialog">'+
                    '<div class="modal-dialog">'+
                    '<div class="modal-content">'+
                    '<div class="modal-header">'+
                    '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                    '<h4 class="modal-title">SOS Data</h4>'+
                    '</div>'+
                    '<div class="modal-body">'+
                        '<div class="table-responsive">'+
                    '<table class="table sosmodaltable">' +
                    '<tbody>';
                $.each( html.dataarr, function( key, value ) {

                        var alchohol = false;
                        var oral = false;
                        var urineasnza = false;
                        var asnza = false;
                    var otherTest = false;
                    var InHouse = false;
                    var OnClinic = false;
                        var testtypesarr = value.Drugtestid.split(',');
                    var screeningArr = value.screening_facilities.split(',');
                        if (testtypesarr) {
                            if (testtypesarr[0] == '1') {
                                alchohol = true;
                            } else if (testtypesarr[0] == '2') {
                                oral = true;
                            } else if (testtypesarr[0] == '3') {
                                urineasnza = true;
                            } else if (testtypesarr[0] == '4') {
                                asnza = true;
                            }else if (testtypesarr[0] == '5') {
                                otherTest = true;
                            }

                            if (testtypesarr[1] == '1') {
                                alchohol = true;
                            } else if (testtypesarr[1] == '2') {
                                oral = true;
                            } else if (testtypesarr[1] == '3') {
                                urineasnza = true;
                            } else if (testtypesarr[1] == '4') {
                                asnza = true;
                            }else if (testtypesarr[1] == '5') {
                                otherTest = true;
                            }

                            if (testtypesarr[2] == '1') {
                                alchohol = true;
                            } else if (testtypesarr[2] == '2') {
                                oral = true;
                            } else if (testtypesarr[2] == '3') {
                                urineasnza = true;
                            } else if (testtypesarr[2] == '4') {
                                asnza = true;
                            }else if (testtypesarr[2] == '5') {
                                otherTest = true;
                            }

                            if (testtypesarr[3] == '1') {
                                alchohol = true;
                            } else if (testtypesarr[3] == '2') {
                                oral = true;
                            } else if (testtypesarr[3] == '3') {
                                urineasnza = true;
                            } else if (testtypesarr[3] == '4') {
                                asnza = true;
                            }else if (testtypesarr[3] == '5') {
                                otherTest = true;
                            }

                            if (testtypesarr[4] == '1') {
                                alchohol = true;
                            } else if (testtypesarr[4] == '2') {
                                oral = true;
                            } else if (testtypesarr[4] == '3') {
                                urineasnza = true;
                            } else if (testtypesarr[4] == '4') {
                                asnza = true;
                            }else if (testtypesarr[4] == '5') {
                                otherTest = true;
                            }
                        }

                    if (screeningArr) {
                        if (screeningArr[0] == '1') {
                            InHouse = true;
                        } else if (screeningArr[0] == '2') {
                            OnClinic = true;
                        }
                        if (screeningArr[1] == '1') {
                            InHouse = true;
                        } else if (screeningArr[1] == '2') {
                            OnClinic = true;
                        }
                    }
                        var drugteststring = '';
                        if (alchohol) {
                            drugteststring = 'Alcohol<br>';
                        }
                        if (oral) {
                            drugteststring += 'Oral Fluid<br>';
                        }
                        if (urineasnza) {
                            drugteststring += 'Urine<br>';
                        }
                        /*if (asnza) {
                            drugteststring += 'AS/NZA 4308:2008<br>';
                        }*/
                    if (otherTest) {
                        drugteststring += 'Other: '+value.other_drug_test+'<br>';
                    }
                        var drugtesttr = '<tr><th>Drugs Tested:</th><td colspan="3">' + (drugteststring != '' ? drugteststring : 'Other') + '</td></tr>';
                        modalhtml += '<tr><td colspan="4"><button type="button" class="btn btn-default" onclick="showsospdf(' + sosid + ');">Print</button></td> </tr>' +
                            '<tr><th>Service Commenced:</th><td colspan="3">' + value.ServiceCommencedOn + '</td></tr>' +
                            '<tr><th>Services Concluded:</th><td colspan="3">' + value.ServiceConcludedOn + '</td></tr>' +
                            drugtesttr +
                            '<tr><th>Screening Facilities:</th><td colspan="3">' + (InHouse?'In House':'')+(InHouse && OnClinic?', ':'') +(OnClinic?'Mobile Clinic':'')+ '</td></tr>' +
                            '<tr><th>Start(km):</th><td colspan="3">' + value.start_km + '</td></tr>' +
                            '<tr><th>End(km):</th><td colspan="3">' + value.end_km + '</td></tr>' +
                            '<tr><th>Total(km):</th><td colspan="3">' + value.total_km + '</td></tr>' +
                            '<tr><td colspan="4"><p><button type="button" class="btn btn-default" onclick="donorsview('+sosid+');">Donors Info</button></p>'+
                            '<a href="#donorsdetmodal" id="addeddonors" data-toggle="modal" style="display: none"></a> </td></tr>' +
                            '<tr><th>Total Donor Screenings/Collections:</th><td>Urine: ' + (value.TotalDonarScreeningUrine > 0 ? value.TotalDonarScreeningUrine : '0') + '</td><td colspan="2">Oral: ' + (value.TotalDonarScreeningOral > 0 ? value.TotalDonarScreeningOral : '0') + '</td></tr>' +
                            '<tr><th>Negative Results:</th><td>Urine: ' + (value.NegativeResultUrine > 0 ? value.NegativeResultUrine : '0') + '</td><td colspan="2">Oral: ' + (value.NegativeResultOral > 0 ? value.NegativeResultOral : '0') + '</td></tr>' +
                            '<tr><th>Results Requiring Further Testing:</th><td>Urine: ' + (value.FurtherTestUrine > 0 ? value.FurtherTestUrine : '0') + '</td><td colspan="2">Oral: ' + (value.FurtherTestOral > 0 ? value.FurtherTestOral : '0') + '</td></tr>' +
                            '<tr><th>Alcohol Results:</th><td>Total No Alcohol Screen: ' + (value.TotalAlcoholScreening > 0 ? value.TotalAlcoholScreening : '0') + '</td><td>Negative Alcohol Results: ' + (value.NegativeAlcohol > 0 ? value.NegativeAlcohol : '0') + '</td><td>Positive Alcohol Results: ' + (value.PositiveAlcohol > 0 ? value.PositiveAlcohol : '0') + '</td></tr>' +
                            '<tr><th>Refusals:</th><td colspan="3">' + value.Refusals + '</td></tr>' +
                            // '<tr><th>Device Name:</th><td colspan="3">' + value.DeviceName + '</td></tr>' +
                            '<tr><th>Extra Used:</th><td colspan="3">' + value.ExtraUsed + '</td></tr>' +
                            // '<tr><th>Breath Testing Unit:</th><td colspan="3">' + value.BreathTesting + '</td></tr>' +
                            '<tr><th>Declaration:</th><td colspan="3">I\'ve conducted the alcohol and/or drug screening/collection service detailed above and confirm that all procedures were undertaken in accordance with the relevant Standard.</td></tr>' +
                            '<tr><th>Collector Name:</th><td colspan="3">' + value.collname + '</td></tr>' +
                            '<tr><th>Collector Signature:</th><td colspan="3"><img src="' + __SITE_SIGN_URL__ + value.collsign + '" /></td></tr>' +
                            '<tr><th>Comments or Observation:</th><td colspan="3">' + value.Comments + '</td></tr>' +
                            '<tr><th>Nominated Client Representative:</th><td colspan="3">' + value.ClientRepresentative + '</td></tr>' +
                            '<tr><th>Time:</th><td colspan="3">' + value.RepresentativeSignatureTime + '</td></tr>' +
                            '<tr><th>Signature:</th><td colspan="3"><img src="' + __SITE_SIGN_URL__ + value.RepresentativeSignature + '" /></td></tr>';
                    });
                modalhtml += '</tbody></table>' +
                    '</div>'+
                       /* '<p><button type="button" class="btn btn-default" onclick="usedprodsdets('+sosid+');">Used Products</button></p>'+
                    '<a href="#productsdetmodal" id="usedprods" data-toggle="modal" style="display: none"></a> </td>' +*/
                '</div>'+
                '<div class="modal-footer">'+
                '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                '</div>'+
                '</div>'+
                '</div>'+
                '</div>';
                $('.show-stack-modal').html(modalhtml);
                $('.loader-modal').css('display', 'none');
                $('#opensos').click();
            } else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, showpage, 'Error', 'OK');
            }
        }
    });
}

function usedprodsdets(sosid) {
    $('.loader-modal').css('display', 'block');
    var jdata = {
        sosid: sosid,
        used: 1
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getsavedkitsbysosid/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            if(html.code == '200'){
                var prodmodalhtml = '<div class="modal fade custommodal" id="productsdetmodal" role="dialog">'+
                    '<div class="modal-dialog">'+
                    '<div class="modal-content">'+
                    '<div class="modal-header">'+
                    '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                    '<h4 class="modal-title">Used Products</h4>'+
                    '</div>'+
                    '<div class="modal-body">'+
                    '<div class="table-responsive">'+
                    '<table class="table">' +
                    '<thead>' +
                    '<tr><th>Product</th><th>Quantity</th></tr>' +
                    '</thead>' +
                    '<tbody>';
                $.each( html.kitarr, function( key, value ) {

                    prodmodalhtml += '<tr><td>'+value.szProductCode+'</td><td>'+value.quantity+'</td></tr>';
                });
                prodmodalhtml += '</tbody></table>' +
                    '</div>'+
                    '</div>'+
                    '<div class="modal-footer">'+
                    '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    '</div>';
                $('.show-stackonstack-modal').html(prodmodalhtml);
                $('.loader-modal').css('display', 'none');
                $('#usedprods').click();
            } else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, showpage, 'Error', 'OK');
            }
        }
    });
}

function showdonorinfo(sosid) {
    $('.loader-modal').css('display', 'block');
    var jdata = {
        sosid: sosid
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getdonorsbysosid/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            if(html.code == '200'){
                var donormodalhtml = '<div class="modal fade custommodal" id="donorsdetmodal" role="dialog">'+
                    '<div class="modal-dialog">'+
                    '<div class="modal-content">'+
                    '<div class="modal-header">'+
                    '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                    '<h4 class="modal-title">Donors List</h4>'+
                    '</div>'+
                    '<div class="modal-body">'+
                    '<div class="table-responsive">'+
                    '<table class="table">' +
                    '<thead>' +
                    '<tr><th>Donors</th><th colspan="2" style="text-align:center">Action</th></tr>' +
                    '</thead>' +
                    '<tbody>';
                $.each( html.dataarr, function( key, value ) {
                    if(value.cocid>0){
                        donormodalhtml += '<tr><td>'+value.donerName+'</td>' +
                            '<td><button type="button" class="btn btn-default infobtn" data-toggle="modal" href="#viewdonorinfo'+value.id+'"><span class="spleft">Donor</span><span class="spright"><i class="fa fa-info-circle" aria-hidden="true"></i></span></button></td>' +
                            '<td><button type="button" class="btn btn-default infobtn" onclick="viewcocdets(\''+value.cocid+'\',\''+value.donerName+'\');"><span class="spleft">COC</span><span class="spright"><i class="fa fa-info-circle" aria-hidden="true"></i></span></button>' +
                            '<a href="" id="cocview" data-toggle="modal" style="display: none"></a> </td>' +
                            '</tr>';
                    }
                });
                donormodalhtml += '</tbody></table>' +
                    '</div>'+
                    '</div>'+
                    '<div class="modal-footer">'+
                    '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    '</div>';
                $.each( html.dataarr, function( key1, value1 ) {
                    var drugs = '';
                    var drugarr = value1.drug.split(',');
                    if(drugarr[0] == '1'){
                        drugs += 'Ice-Methamphetamine(mAmp)<br>';
                    }else if(drugarr[1] == '1'){
                        drugs += 'Ice-Methamphetamine(mAmp)<br>';
                    }else if(drugarr[2] == '1'){
                        drugs += 'Ice-Methamphetamine(mAmp)<br>';
                    }else if(drugarr[3] == '1'){
                        drugs += 'Ice-Methamphetamine(mAmp)<br>';
                    }else if(drugarr[4] == '1'){
                        drugs += 'Ice-Methamphetamine(mAmp)<br>';
                    }else if(drugarr[5] == '1'){
                        drugs += 'Ice-Methamphetamine(mAmp)<br>';
                    }else if(drugarr[6] == '1'){
                        drugs += 'Ice-Methamphetamine(mAmp)<br>';
                    }

                    if(drugarr[0] == '2'){
                        drugs += 'THC-Marijuana(THC)<br>';
                    }else if(drugarr[1] == '2'){
                        drugs += 'THC-Marijuana(THC)<br>';
                    }else if(drugarr[2] == '2'){
                        drugs += 'THC-Marijuana(THC)<br>';
                    }else if(drugarr[3] == '2'){
                        drugs += 'THC-Marijuana(THC)<br>';
                    }else if(drugarr[4] == '2'){
                        drugs += 'THC-Marijuana(THC)<br>';
                    }else if(drugarr[5] == '2'){
                        drugs += 'THC-Marijuana(THC)<br>';
                    }else if(drugarr[6] == '2'){
                        drugs += 'THC-Marijuana(THC)<br>';
                    }

                    if(drugarr[0] == '3'){
                        drugs += 'Heroine-Opiates(OPI)<br>';
                    }else if(drugarr[1] == '3'){
                        drugs += 'Heroine-Opiates(OPI)<br>';
                    }else if(drugarr[2] == '3'){
                        drugs += 'Heroine-Opiates(OPI)<br>';
                    }else if(drugarr[3] == '3'){
                        drugs += 'Heroine-Opiates(OPI)<br>';
                    }else if(drugarr[4] == '3'){
                        drugs += 'Heroine-Opiates(OPI)<br>';
                    }else if(drugarr[5] == '3'){
                        drugs += 'Heroine-Opiates(OPI)<br>';
                    }else if(drugarr[6] == '3'){
                        drugs += 'Heroine-Opiates(OPI)<br>';
                    }

                    if(drugarr[0] == '4'){
                        drugs += 'Cocaine-Cocaine(COC)<br>';
                    }else if(drugarr[1] == '4'){
                        drugs += 'Cocaine-Cocaine(COC)<br>';
                    }else if(drugarr[2] == '4'){
                        drugs += 'Cocaine-Cocaine(COC)<br>';
                    }else if(drugarr[3] == '4'){
                        drugs += 'Cocaine-Cocaine(COC)<br>';
                    }else if(drugarr[4] == '4'){
                        drugs += 'Cocaine-Cocaine(COC)<br>';
                    }else if(drugarr[5] == '4'){
                        drugs += 'Cocaine-Cocaine(COC)<br>';
                    }else if(drugarr[6] == '4'){
                        drugs += 'Cocaine-Cocaine(COC)<br>';
                    }

                    if(drugarr[0] == '5'){
                        drugs += 'Benzodiazepines-Benzodiazepines(BZO)<br>';
                    }else if(drugarr[1] == '5'){
                        drugs += 'Benzodiazepines-Benzodiazepines(BZO)<br>';
                    }else if(drugarr[2] == '5'){
                        drugs += 'Benzodiazepines-Benzodiazepines(BZO)<br>';
                    }else if(drugarr[3] == '5'){
                        drugs += 'Benzodiazepines-Benzodiazepines(BZO)<br>';
                    }else if(drugarr[4] == '5'){
                        drugs += 'Benzodiazepines-Benzodiazepines(BZO)<br>';
                    }else if(drugarr[5] == '5'){
                        drugs += 'Benzodiazepines-Benzodiazepines(BZO)<br>';
                    }else if(drugarr[6] == '5'){
                        drugs += 'Benzodiazepines-Benzodiazepines(BZO)<br>';
                    }

                    if(drugarr[0] == '6'){
                        drugs += 'Amphetamine-Amphetamine(AMP)<br>';
                    }else if(drugarr[1] == '6'){
                        drugs += 'Amphetamine-Amphetamine(AMP)<br>';
                    }else if(drugarr[2] == '6'){
                        drugs += 'Amphetamine-Amphetamine(AMP)<br>';
                    }else if(drugarr[3] == '6'){
                        drugs += 'Amphetamine-Amphetamine(AMP)<br>';
                    }else if(drugarr[4] == '6'){
                        drugs += 'Amphetamine-Amphetamine(AMP)<br>';
                    }else if(drugarr[5] == '6'){
                        drugs += 'Amphetamine-Amphetamine(AMP)<br>';
                    }else if(drugarr[6] == '6'){
                        drugs += 'Amphetamine-Amphetamine(AMP)<br>';
                    }

                    if(drugarr[0] == '7'){
                        drugs += 'Other<br>';
                    }else if(drugarr[1] == '7'){
                        drugs += 'Other<br>';
                    }else if(drugarr[2] == '7'){
                        drugs += 'Other<br>';
                    }else if(drugarr[3] == '7'){
                        drugs += 'Other<br>';
                    }else if(drugarr[4] == '7'){
                        drugs += 'Other<br>';
                    }else if(drugarr[5] == '7'){
                        drugs += 'Other<br>';
                    }else if(drugarr[6] == '7'){
                        drugs += 'Other<br>';
                    }

                    if(value1.otherdrug){
                        drugs += value1.otherdrug+'<br>';
                    }
                    var alcoholread1 = '';
                    var alcoholread2 = '';
                    if(value1.alcoholreading1){
                        alcoholread1 = value1.alcoholreading1;
                    }
                    if(value1.alcoholreading2){
                        alcoholread2 = value1.alcoholreading2;
                    }
                    donormodalhtml +='<div class="modal fade custommodal" id="viewdonorinfo'+value1.id+'" role="dialog">'+
                        '<div class="modal-dialog">'+
                        '<div class="modal-content">'+
                        '<div class="modal-header">'+
                        '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                        '<h4 class="modal-title">Donors Info</h4>'+
                        '</div>'+
                        '<div class="modal-body">'+
                        '<div class="table-responsive">'+
                        '<table class="table modaltable">' +
                        '<tbody>' +
                        '<tr><th>Drugs:</th><td>'+(drugs!=''?drugs:'N/A')+'</td></tr>' +
                        '<tr><th>Alcohol:</th><td>'+(alcoholread1!=''?'P, ':'N, ')+'Reading One:'+(alcoholread1!=''?alcoholread1:'N/A')+'<br />'+(alcoholread2!=''?'P, ':'N, ')+'Reading Two:'+(alcoholread2!=''?alcoholread2:'N/A')+'</td></tr>' +
                        '</tbody></table>' +
                        '</div>'+
                        '</div>'+
                        '<div class="modal-footer">'+
                        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                        '</div>'+
                        '</div>'+
                        '</div>'+
                        '</div>';
                });
                $('.show-stack-modal').html(donormodalhtml);
                $('.loader-modal').css('display', 'none');
                $('#showdonor').click();
            } else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, showpage, 'Error', 'OK');
            }
        }
    });
}

function viewcocdets(cocid,donorname){
    $('.loader-modal').css('display', 'block');
    var jdata = {
        cocid: cocid
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getcocdatabycocid/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            if(html.code == '200'){
                var cocmodalhtml = '';
                $.each( html.dataarr, function( key, value ) {
                    $('#cocview').attr('href','#cocdatamodal'+ value.id);
                    cocmodalhtml = '<div class="modal fade custommodal" id="cocdatamodal' + value.id + '" role="dialog">' +
                        '<div class="modal-dialog">' +
                        '<div class="modal-content">' +
                        '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                        '<h4 class="modal-title">COC Data</h4>' +
                        '</div>' +
                        '<div class="modal-body">' +
                        '<div class="table-responsive">' +
                        '<table class="table modaltable">' +
                        '<tbody>'+
                        '<tr><th>Test Date:</th><td>'+formatdate(value.cocdate)+'</td></tr>' +
                        '<tr><th colspan="2" class="col-md-2"><button type="button" class="btn btn-default" onclick="showcocpdf(\''+cocid+'\');">Print</button></th> </tr>' +
                        '<tr><th colspan="2" class="col-md-2"><h3 class="coc-det-head">Donor Information</h3></th> </tr>' +
                        '<tr><th class="col-md-2">Donor Name:</th><td class="col-md-2">'+donorname+'</td></tr>' +
                        '<tr><th class="col-md-2">Date of birth:</th><td class="col-md-2">'+formatdate(value.dob)+'</td></tr>' +
                        '<tr><th class="col-md-2">Employment Type:</th><td class="col-md-2">'+(value.employeetype=='1'?'Employee':(value.employeetype=='2'?'Contractor':''))+'</td></tr>' +
                        (value.employeetype=='2'?'<tr><th class="col-md-2">Contractor Details:</th><td class="col-md-2">'+value.contractor+'</td></tr>':'' )+
                        '<tr><th class="col-md-2">ID Type:</th><td class="col-md-2">'+(value.idtype == '1'?'Driving License':(value.idtype == '2'?'Medicare Card':(value.idtype == '3'?'Passport':'')))+'</td></tr>' +
                        '<tr><th class="col-md-2">ID Number:</th><td class="col-md-2">'+value.idnumber+'</td></tr>' +
                        '<tr><th class="col-md-2">Declaration:</th class="col-md-2"><td >I consent to the testing of my breath/urine/oral fluid sample for alcohol &/or drugs.</td></tr>' +
                        '<tr><th >Have you taken any medication, drugs or other non-prescription agents in last week?:</th><td>'+value.lastweekq+'</td></tr>' +
                        '<tr><th class="col-md-2">Donor Signature:</th><td class="col-md-2"><img src="'+__SITE_SIGN_URL__+value.donorsign+'" /></td></tr>' +
                        '<tr><th colspan="2" ><h3 class="coc-det-head">Alcohol Breath Test</h3></th> </tr>' +
                        '<tr><th class="col-md-2">Device Serial#:</th><td class="col-md-2">'+value.devicesrno+'</td></tr>' +
                        '<tr><th class="col-md-2">Cut off Level:</th><td class="col-md-2">'+value.cutoff+'</td></tr>' +
                        '<tr><th class="col-md-2">Wait Time <sub>[Minutes]</sub>:</th><td class="col-md-2">'+formattime(value.donwaittime)+'</td></tr>' +
                        '<tr><th class="col-md-2">Test 1:</th><td class="col-md-2">'+value.dontest1+'</td></tr>' +
                        '<tr><th class="col-md-2">Time <sub>[24 hr]</sub>:</th><td class="col-md-2">'+formattime(value.dontesttime1)+'</td></tr>' +
                        '<tr><th class="col-md-2">Test 2:</th><td class="col-md-2">'+value.dontest2+'</td></tr>' +
                        '<tr><th class="col-md-2">Time <sub>[24 hr]</sub>:</th><td class="col-md-2">'+formattime(value.dontesttime2)+'</td></tr>' +
                        '<tr><th colspan="2" class="col-md-2"><h3 class="coc-det-head nowhitespace">Collection of Sample/On-Site Drug Screening Results</h3></th> </tr>' +
                        '<tr><th class="col-md-2">Void Time <sub>[24 hr]</sub>:</th><td class="col-md-2">'+formattime(value.voidtime)+'</td></tr>' +
                        '<tr><th class="col-md-2">Sample Temp C:</th><td class="col-md-2">'+value.sampletempc+'</td></tr>' +
                        '<tr><th class="col-md-2">Temp Read Time within 4 min <sub>[24 hr]</sub>:</th><td class="col-md-2">'+formattime(value.tempreadtime)+'</td></tr>' +
                        '<tr><th class="col-md-2">Adulterant Test Lot No.:</th><td class="col-md-2">'+value.intect+'</td></tr>' +
                        '<tr><th class="col-md-2">Expiry:</th><td class="col-md-2">'+formatdate(value.intectexpiry)+'</td></tr>' +
                        '<tr><th class="col-md-2">Visual Colour:</th><td class="col-md-2">'+value.visualcolor+'</td></tr>' +
                        '<tr><th class="col-md-2">Creatinine:</th><td class="col-md-2">'+value.creatinine+'</td></tr>' +
                        '<tr><th class="col-md-2">Other Integrity:</th><td class="col-md-2">'+value.otherintegrity+'</td></tr>' +
                        '<tr><th class="col-md-2">Hydration:</th><td class="col-md-2">'+value.hudration+'</td> </tr>' +
                        '<tr><th class="col-md-2">Drug Device Name:</th><td class="col-md-2">'+value.devicename+'</td></tr>' +
                        '<tr><th class="col-md-2">Reference#:</th><td class="col-md-2">'+value.reference+'</td></tr>' +
                        '<tr><th class="col-md-2">Lot#:</th><td class="col-md-2">'+value.lotno+'</td></tr>' +
                        '<tr><th class="col-md-2">Expiry:</th><td class="col-md-2">'+formatdate(value.lotexpiry)+'</td></tr>' +
                        '<tr><th colspan="2" class="col-md-2"><h3 class="coc-det-head">Drugs Class</h3></th> </tr>' +
                        '<tr><th class="col-md-2">Cocaine:</th><td class="col-md-2">'+(value.cocain=='U'?'Further Testing Required':(value.cocain=='N'?'Negative':''))+'</td></tr>' +
                        '<tr><th class="col-md-2">Amp:</th><td class="col-md-2">'+(value.amp=='U'?'Further Testing Required':(value.amp=='N'?'Negative':''))+'</td></tr>' +
                        '<tr><th class="col-md-2">mAmp:</th><td class="col-md-2">'+(value.mamp=='U'?'Further Testing Required':(value.mamp=='N'?'Negative':''))+'</td></tr>' +
                        '<tr><th class="col-md-2">THC:</th><td class="col-md-2">'+(value.thc=='U'?'Further Testing Required':(value.thc=='N'?'Negative':''))+'</td></tr>' +
                        '<tr><th class="col-md-2">Opiates:</th><td class="col-md-2">'+(value.opiates=='U'?'Further Testing Required':(value.opiates=='N'?'Negative':''))+'</td></tr>' +
                        '<tr><th class="col-md-2">Benzo:</th><td class="col-md-2">'+(value.benzo=='U'?'Further Testing Required':(value.benzo=='N'?'Negative':''))+'</td></tr>' +
                        '<tr><th class="col-md-2">Other:</th><td class="col-md-2">'+(value.otherdc=='U'?'Further Testing Required':(value.otherdc=='N'?'Negative':''))+'</td></tr>' +
                        '<tr><th class="col-md-2">Collection time of sample <sub>[24 hr]</sub>:</th><td class="col-md-2">'+formattime(value.ctstime)+'</td></tr>' +
                        '<tr><th colspan="2" class="col-md-2"><h3 class="coc-det-head">Donor Declaration</h3></th> </tr>' +
                        '<tr><td colspan="2" class="col-md-2">I certify that the specimen(s) accompanying this form is my own. Where on-site screening was performed, such screening was carried out in my presence. In the case of my specimen(s) being sent to the laboratory for testing, I  certify that the specimen containers were sealed with tamper evident seals in my presence and the identifying information on the label is correct. I certify that the information provided  on this form to be correct and I consent to the release of all test results  together with any relevant details  contained on this form to the nominated representative of the requesting authority.</td></tr>' +
                        '<tr><th class="col-md-2">Date:</th><td class="col-md-2">'+formatdate(value.donordecdate)+'</td></tr>' +
                        '<tr><th class="col-md-2">Signature:</th><td class="col-md-2"><img src="'+__SITE_SIGN_URL__+value.donordecsign+'" /></td></tr>' +
                        '<tr><th colspan="2" class="col-md-2"><h3 class="coc-det-head">Collector Certification</h3></th> </tr>' +
                        '<tr><td colspan="2" class="col-md-2">I certify that I witnessed the  Donor signature and that the specimen(s) identified on this form was provided to me by the Donor whose consent and  declaration appears above,  bears the same Donor identification as  set forth above, and that the specimen(s) has been collected and if needed divided, labelled and sealed in accordance  with the relevant Standard. *If two Collectors are present the second Collector (2) is to perform sample collection/screening for Alcohol and Urine.</td></tr>' +
                        '<tr><th class="col-md-2">Collector 1 Name/Number:</th><td class="col-md-2">'+value.collectorone+'</td></tr>' +
                        '<tr><th class="col-md-2">Signature:</th><td class="col-md-2"><img src="'+__SITE_SIGN_URL__+value.collectorsignone+'" /></td></tr>' +
                        '<tr><th class="col-md-2">Comments or Observation:</th><td class="col-md-2">'+value.commentscol1+'</td></tr>' +
                        '<tr><th class="col-md-2">Collector 2 Name/Number:</th><td class="col-md-2">'+value.collectortwo+'</td></tr>' +
                        '<tr><th class="col-md-2">Signature:</th><td class="col-md-2"><img src="'+__SITE_SIGN_URL__+value.collectorsigntwo+'" /></td></tr>' +
                        '<tr><th class="col-md-2">Comments or Observation:</th><td class="col-md-2">'+value.comments+'</td></tr>' +
                        '<tr><th class="col-md-2">On-Site Screening Report:</th><td class="col-md-2">'+(value.onsitescreeningrepo == '1'?'Final':(value.onsitescreeningrepo == '2'?'Interim':''))+'</td></tr>' +
                        '</tbody></table>' +
                        '</div>' +
                        '</div>' +
                        '<div class="modal-footer">' +
                        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                });
                $('.show-stackonstack-modal').html(cocmodalhtml);
                $('#cocview').click();
                $('.loader-modal').css('display', 'none');
            } else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, showpage, 'COC Form', 'OK');
            }
        }
    });
}

function formattime(timeval){
    timeval = timeval.split(':');
    if(parseInt(timeval[0].trim())>0){
    timeval = ("0" + parseInt((timeval[0]?timeval[0].trim():0))).slice(-2)+' : '+("0" + parseInt((timeval[1]?timeval[1].trim():0))).slice(-2);
    return timeval;
    }else{
        return "";
    }
}

function format12hrtime(timeval) {
    timeval = timeval.split(' ');
    var format = timeval[3];
    timeval = timeval[0]+' : '+timeval[2];
    return formattime(timeval)+' '+format;
}

function showcocpdf(cocid) {
    $('.loader-modal').css('display', 'block');
    var jdata = {
        cocid: cocid,
        sosstat: "1"
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "cocformpdf/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            if(html.code == '200'){
                $('.loader-modal').css('display', 'none');
                window.open(html.file,'_system');
            }
        }
    });
}

function donorsview(sosid) {
    $('.loader-modal').css('display', 'block');
    var jdata = {
        sosid: sosid
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getdonorsbysosid/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            if(html.code == '200'){
                var prodmodalhtml = '<div class="modal fade custommodal" id="donorsdetmodal" role="dialog">'+
                    '<div class="modal-dialog">'+
                    '<div class="modal-content">'+
                    '<div class="modal-header">'+
                    '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                    '<h4 class="modal-title">Donors Info</h4>'+
                    '</div>'+
                    '<div class="modal-body">'+
                    '<div class="table-responsive">'+
                    '<table class="table">' +
                    '<thead>' +
                    '<tr><th>Donor Name</th><th>Result</th></tr>' +
                    '</thead>' +
                    '<tbody>';
                $.each( html.dataarr, function( key, value ) {

                    prodmodalhtml += '<tr><td>'+value.donerName+'</td><td>'+((!value.drug && !value.alcoholreading1 && !value.alcoholreading2)?"Negative":"Positive" )+'</td></tr>';
                });
                prodmodalhtml += '</tbody></table>' +
                    '</div>'+
                    '</div>'+
                    '<div class="modal-footer">'+
                    '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    '</div>';
                $('.show-stackonstack-modal').html(prodmodalhtml);
                $('.loader-modal').css('display', 'none');
                $('#addeddonors').click();
            } else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, showpage, 'Error', 'OK');
            }
        }
    });
}