/**
 * Created by whiz16 on 26-Dec-16.
 */
if (!(localStorage.getItem("userid") > '0')) {
    window.location.href = 'index.html';
}else{
var backtrack = localStorage.getItem("backtrack");
    var backtrackpage = '';
    if(backtrack == '1'){
        backtrackpage = 'SOS.html';
    }else if(backtrack == '2'){
        backtrackpage = 'coc-form-pending-list.html';
    }
    $('.page-back').prop('href',backtrackpage);
    var jdata = {
        cocid: localStorage.getItem("cocid")
    }
    $('.loader-modal').css('display', 'block');
    var formleft = localStorage.getItem("formleft");
    formleft = parseInt(formleft)-1;
    if(formleft > '0'){
        $('#formleftcount').html(formleft);
        if(formleft>'1'){
            $('#formlefttext').html('Forms');
        }else {
            $('#formlefttext').html('Form');
        }
        $('#formleft').show();
    }else {
        $('#formleft').hide();
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getsosbycocid/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            //var obj = JSON.parse(html);
            console.log(html);
            if (html.code == '200') {
                $('#cocid').val(html.dataarr[0].cocid);
                    $.each( html.dataarr, function( key, value ) {
                        var alchohol = false;
                        var oral = false;
                        var urine = false;
                        var otherTest = false;
                        var testtypesarr = value.Drugtestid.split(',');
                        if (testtypesarr) {
                            if (testtypesarr[0] == '1') {
                                alchohol = true;
                            } else if (testtypesarr[0] == '2') {
                                oral = true;
                            } else if (testtypesarr[0] == '3') {
                                urine = true;
                            }else if (testtypesarr[0] == '5') {
                                otherTest = true;
                            }

                            if (testtypesarr[1] == '1') {
                                alchohol = true;
                            } else if (testtypesarr[1] == '2') {
                                oral = true;
                            } else if (testtypesarr[1] == '3') {
                                urine = true;
                            }else if (testtypesarr[1] == '5') {
                                otherTest = true;
                            }

                            if (testtypesarr[2] == '1') {
                                alchohol = true;
                            } else if (testtypesarr[2] == '2') {
                                oral = true;
                            } else if (testtypesarr[2] == '3') {
                                urine = true;
                            }else if (testtypesarr[2] == '5') {
                                otherTest = true;
                            }

                            if (testtypesarr[3] == '1') {
                                alchohol = true;
                            } else if (testtypesarr[3] == '2') {
                                oral = true;
                            } else if (testtypesarr[3] == '3') {
                                urine = true;
                            }else if (testtypesarr[3] == '5') {
                                otherTest = true;
                            }
                        }
                        var cocdate = formatdate(value.cocdate);
                        var dob = formatdob(value.dob);
                        var intectexpiry = formatdate(value.intectexpiry);
                        var lotexpiry = formatdate(value.lotexpiry);
                        var receiveronedate = formatdate(value.receiveronedate);
                        var receivertwodate = formatdate(value.receivertwodate);
                        var donordecdate = formatdate(value.donordecdate);
                        var donorsigndate = formatdate(value.donorsigndate);

                        if(value.drugtest == '1'){
                            $('#alcohol').prop('checked',true);
                            setTimeout(function () {
                                $('#alcohol').click();
                            },500);
                        }else if(value.drugtest == '2'){
                            $('#oral-fluid').prop('checked',true);
                            setTimeout(function () {
                                $('#oral-fluid').click();
                            },500);
                        }else if(value.drugtest == '3'){
                            $('#urine').prop('checked',true);
                            setTimeout(function () {
                                $('#urine').click();
                            },500);
                        }else if(value.drugtest == '5'){
                            $('#otherdrug').prop('checked',true);
                            setTimeout(function () {
                                $('#otherdrug').click();
                            },500);
                        }

                        if(value.drug){
                            $('#drugpositive').val(1);
                        }
                        if(value.alcoholreading1 || value.alcoholreading2){
                            $('#drugpositive').val(0);
                        }
                        if((value.drug) && (value.alcoholreading1 || value.alcoholreading2)){
                            $('#drugpositive').val(3);
                        }
                        if(value.employeetype == '1'){
                            $('#employee').prop('checked',true);
                        }else if(value.employeetype == '2'){
                            $('#contractor').prop('checked',true);
                            $('#contractordet').prop('disabled',false);
                        }
                        if(value.onsitescreeningrepo == '1'){
                            $('#final').prop('checked',true);
                            $('#completecoc').prop('disabled',false);
                            $('#completecoc').css('background','rgba(17,156,111,1)');
                        }else if(value.onsitescreeningrepo == '2'){
                            $('#interim').prop('checked',true);
                            $('#completecoc').prop('disabled',false);
                            $('#completecoc').css('background','rgba(17,156,111,1)');
                        }
                        $('#contractordet').val(value.contractor);
                        $('#idtype').val(value.idtype);
                        $('#idnumber').val(value.idnumber);
                        $('#lastweekq').val(value.lastweekq);
                        if(value.donorsign){
                            $('#coc1').hide();
                            $('.coc1-change-sign').show();
                            $('#cocsign1').attr('src',__SITE_SIGN_URL__+value.donorsign);
                        }
                        //$('#donorsign').val(value.donorsign);
                        $('#devicesrno').val(value.devicesrno);
                        $('#cutoff').val(value.cutoff);
                        $('#donwaittime').val(value.donwaittime);
                        $('#dontest1').val(value.dontest1);
                        var dontesttime1arr = value.dontesttime1.split(" ");
                        $('#dontesthr1').val(dontesttime1arr[0]);
                        $('#dontestmin1').val((dontesttime1arr[0]?dontesttime1arr[2]:''));
                        $('#dontesttime1').val(value.dontesttime1);
                        $('#dontest2').val(value.dontest2);
                        var dontesttime2arr = value.dontesttime2.split(" ");
                        $('#dontesthr2').val(dontesttime2arr[0]);
                        $('#dontestmin2').val((dontesttime2arr[0]?dontesttime2arr[2]:''));
                        $('#dontesttime2').val(value.dontesttime2);
                        var voidtimearr = value.voidtime.split(" ");
                        $('#voidtimehr').val(voidtimearr[0]);
                        $('#voidtimemin').val((voidtimearr[0]?voidtimearr[2]:''));
                        $('#voidtime').val(value.voidtime);
                        $('#sampletempc').val(value.sampletempc);
                        var tempreadtimearr = value.tempreadtime.split(" ");
                        $('#tempreadtimehr').val(tempreadtimearr[0]);
                        $('#tempreadtimemin').val((tempreadtimearr[0]?tempreadtimearr[2]:''));
                        $('#tempreadtime').val(value.tempreadtime);
                        $('#intect').val(value.intect);
                        /*setTimeout(function () {
                            enableexpiry();
                        },500);*/
                        $('#visualcolor').val(value.visualcolor);
                        $('#creatinine').val(value.creatinine);
                        $('#otherintegrity').val(value.otherintegrity);
                        $('#hudration').val(value.hudration);
                        $('#devicename').val(value.cocdevice);
                        $('#reference').val(value.reference);
                        $('#lotno').val(value.lotno);
                        $('#cocain').val(value.cocain);
                        $('#amp').val(value.amp);
                        $('#mamp').val(value.mamp);
                        $('#thc').val(value.thc);
                        $('#opiates').val(value.opiates);
                        $('#benzo').val(value.benzo);
                        $('#otherdc').val(value.otherdc);
                        var ctstimearr = value.ctstime.split(" ");
                        $('#ctstimehr').val(ctstimearr[0]);
                        $('#ctstimemin').val((ctstimearr[0]?ctstimearr[2]:''));
                        $('#ctstime').val(value.ctstime);
                        $('#signcoc1').val(value.signcoc1);
                        $('#signcoc2').val(value.signcoc2);
                        $('#signcoc3').val(value.signcoc3);
                        $('#signcoc4').val(value.signcoc4);
                        $('#signcoc5').val(value.signcoc5);
                        $('#signcoc6').val(value.signcoc6);
                        $('#cocchangesign1').val(value.signcoc1);
                        $('#cocchangesign2').val(value.signcoc2);
                        $('#cocchangesign3').val(value.signcoc3);
                        $('#cocchangesign4').val(value.signcoc4);
                        $('#cocchangesign5').val(value.signcoc5);
                        $('#cocchangesign6').val(value.signcoc6);
                        $('#donordecdate').val((donordecdate!='01/01/1970'?donordecdate:''));
                        $('#donorsigndate').val((donorsigndate!='01/01/1970'?donorsigndate:''));
                        //$('#donordecsign').val(value.donordecsign);
                        if(value.donordecsign){
                            $('#coc2').hide();
                            $('.coc2-change-sign').show();
                            $('#cocsign2').attr('src',__SITE_SIGN_URL__+value.donordecsign);
                        }
                        $('#collectorone').val(value.collectorone);
                        $('#collectortwo').val(value.collectortwo);
                        if(value.collectorsignone){
                            $('#coc3').hide();
                            $('.coc3-change-sign').show();
                            $('#cocsign3').attr('src',__SITE_SIGN_URL__+value.collectorsignone);
                        }
                        //$('#collectorsignone').val(value.collectorsignone);
                        $('#commentscol1').val(value.commentscol1);
                        if(value.collectorsigntwo){
                            $('#coc4').hide();
                            $('.coc4-change-sign').show();
                            $('#cocsign4').attr('src',__SITE_SIGN_URL__+value.collectorsigntwo);
                        }
                       // $('#collectorsigntwo').val(value.collectorsigntwo);
                        $('#comments').val(value.comments);
                        $('#receiverone').val(value.receiverone);
                        var receiveronetimearr = value.receiveronetime.split(" ");
                        $('#receiveronetimehr').val(receiveronetimearr[0]);
                        $('#receiveronetimemin').val((receiveronetimearr[0]?receiveronetimearr[2]:''));
                        $('#receiveronetimedur').val(receiveronetimearr[3]);
                        $('#receiveronetime').val(value.receiveronetime);
                        $('#receiveroneseal').val(value.receiveroneseal);
                        $('#receiveronelabel').val(value.receiveronelabel);
                        if(value.receiveronesign){
                            $('#coc5').hide();
                            $('.coc5-change-sign').show();
                            $('#cocsign5').attr('src',__SITE_SIGN_URL__+value.receiveronesign);
                        }
                        //$('#receiveronesign').val(value.receiveronesign);
                        $('#receivertwo').val(value.receivertwo);
                        /*setTimeout(function () {
                            enablereceiver();
                        },500);*/
                        if($('#receivertwo').val()){
                            $('#receivertwodate').val((receivertwodate!='01/01/1970'?receivertwodate:''));
                            if(value.receivertwosign){
                                $('#coc6').hide();
                                $('.coc6-change-sign').show();
                                $('#cocsign6').attr('src',__SITE_SIGN_URL__+value.receivertwosign);
                            }
                            //$('#receivertwosign').val(value.receivertwosign);
                            var receivertwotimearr = value.receivertwotime.split(" ");
                            $('#receivertwotimehr').val(receivertwotimearr[0]);
                            $('#receivertwotimemin').val((receivertwotimearr[0]?receivertwotimearr[2]:''));
                            $('#receivertwotimedur').val(receivertwotimearr[3]);
                            $('#receivertwotime').val(value.receivertwotime);
                            $('#receivertwoseal').val(value.receivertwoseal);
                            $('#receivertwolabel').val(value.receivertwolabel);
                        }else {
                            $('#receivertwodate').val('');
                            $('#receivertwosign').val('');
                            $('#receivertwotime').val('');
                            $('#receivertwoseal').val('');
                            $('#receivertwolabel').val('');
                        }

                        $('#cocdate').val((cocdate!='01/01/1970'?cocdate:''));
                        // $('#nominatedrep').val(value.ClientRepresentative);
                        if(!alchohol){
                            $('#alcohol').prop('disabled',true);
                        }else{
                            $('#alcohol').prop('checked',true);
                            $('.alctest').show();
                            $('.nonalctest').hide();
                            $('#alcohol').attr('onclick','return false');
                            /*setTimeout(function () {
                                $('#alcohol').click();
                            },300);*/
                        }
                        if(!oral){
                            $('#oral-fluid').prop('disabled',true);
                        }else{
                            $('#oral-fluid').prop('checked',true);
                            $('.alctest').show();
                            $('.nonalctest').show();
                            $('.oral-hide').hide();
                            $('#oral-fluid').attr('onclick','return false');
                            /*setTimeout(function () {
                                $('#oral-fluid').click();
                            },300);*/
                        }
                        if(!urine){
                            $('#urine').prop('disabled',true);
                        }else{
                            $('#urine').prop('checked',true);
                            $('.alctest').show();
                            $('.nonalctest').show();
                            $('.oral-hide').show();
                            $('#urine').attr('onclick','return false');
                            /*setTimeout(function () {
                                $('#urine').click();
                            },300);*/
                        }
                        if(otherTest){
                            $('#otherdrug').prop('checked',true);
                            $('#othertest').val(value.other_drug_test);
                            $('.alctest').show();
                            $('.nonalctest').show();
                            $('.oral-hide').show();
                            $('.hide-oth-drugtest').show();
                        }else {
                            $('#otherdrug').prop('disabled',true);
                            $('#othertest').val('');
                            $('.hide-oth-drugtest').hide();
                        }

                        /*if(oral && !alchohol && !urine && !otherTest){
                            $('.oral-hide').hide();
                        }else{
                            $('.oral-hide').show();
                        }*/
                        $('#doner').val(value.donerName);
                        $('#dob').val(dob);
                        if($('#intect').val() != '' || $('#intect').val() != undefined){
                            $('#intectexpiry').val((intectexpiry!='01/01/1970'?intectexpiry:''));
                        }else {
                            $('#intectexpiry').val('');
                        }
                        $('#lotexpiry').val((lotexpiry!='01/01/1970'?lotexpiry:''));
                        $('#receiveronedate').val((receiveronedate!='01/01/1970'?receiveronedate:''));

                    });
                getfranchiseebysite(html.dataarr[0].Clientid);
                // $('.loader-modal').css('display', 'none');
            } else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, showpage, 'Error', 'OK');
            }
        }
    });
}
function enableexpiry() {
    var intectval = $('#intect').val();
    if(intectval){
        //alert('1---'.intectval);
        $('#intectexpiry').prop('disabled',false);
    }else{
        //alert('2---'.intectval);
        $('#intectexpiry').prop('disabled',true);
    }
}
function enablereceiver() {
    var rectwo = $('#receivertwo').val();
    if(rectwo){
        $('#receivertwodate').prop('disabled',false);
        $('#receivertwotime').prop('disabled',false);
        $('#receivertwoseal').prop('disabled',false);
        $('#receivertwolabel').prop('disabled',false);
        $('#receivertwosign').prop('disabled',false);
    }else{
        $('#receivertwodate').prop('disabled',true);
        $('#receivertwotime').prop('disabled',true);
        $('#receivertwoseal').prop('disabled',true);
        $('#receivertwolabel').prop('disabled',true);
        $('#receivertwosign').prop('disabled',true);
    }
}
function getfranchiseebysite(siteid) {
    var jdata = {
        siteid: siteid
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getuserhierarchybysiteid/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            console.log(html);
            if (html.code == '200') {
                getClientDets(html.dataarr[0].clientType);
                getSiteDets(siteid);
                setTimeout(function () {
                    $('.loader-modal').css('display', 'none');
                },300);
                // getfranchiseechildren(html.dataarr[0].franchiseeId);
            } else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, showpage, 'Error', 'OK');
            }
        }
    });
}

function getClientDets(clientid) {
    var jdata = {
        clientid: clientid
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getclientdetailsbyclientid/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            if (html.code == '200') {
                $('#client').val(html.dataarr[0].szBusinessName);
                $('#nominatedrep').val(html.dataarr[0].szName);
            } else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, showpage, 'Error', 'OK');
            }
        }
    });
}
function getSiteDets(siteid) {
    var jdata = {
        userid: siteid
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getuserdetails/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            if (html.code == '200') {
                $('#site').val(html.szName);
            } else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, showpage, 'Error', 'OK');
            }
        }
    });
}
function getfranchiseechildren(franchiseeid) {
    var jdata = {
        franchiseeid: franchiseeid
    }
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "getfranchiseesosdata/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            console.log(html);
            if (html.code == '200') {
                $('#site').val(html.dataarr[0][0][0].sitename);
                $('#client').val(html.dataarr[0][0][0].clientBusinessName);
                $('#nominatedrep').val(html.dataarr[0][0][0].clientname);
                $('.loader-modal').css('display', 'none');
            } else {
                $('.loader-modal').css('display', 'none');
                navigator.notification.alert(html.message, showpage, 'Error', 'OK');
            }
        }
    });
}
function formatdob(val) {
    var datearr = val.split('-');
    var dateval = datearr[2]+'/'+datearr[1]+'/'+datearr[0];
    if(dateval != '00/00/0000'){
            return dateval;
    }else{
        return '';
    }
}
function formatdate(val) {
    var datearr = val.split('-');
    var dateval = datearr[2]+'/'+datearr[1]+'/'+datearr[0];
    if(dateval != '00/00/0000'){
        if(datearr[0] == '1969' || datearr[0] == '1970'){
            dateval = '';
            return dateval;
        }else{
            return dateval;
        }
    }else{
        return '';
    }
}
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
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

function focusonfieldbyid(fieldid) {
    $('#'+fieldid).focus();
}

function testname(fieldid,val,message) {
    var regex = /^[a-zA-Z\s]*$/;
    if (!regex.test(val)) {
        navigator.notification.alert('Enter valid '+message+'. Only alphabets are allowed.', function () {
            calbackfocusfield(fieldid);
        }, 'Error', 'OK');
        return false;
    }
}

function combinetime(hourid,minid,durationid) {
    var hour = $('#'+hourid).val();
    var min = $('#'+minid).val();
    if(min=='' || min== ' '){
        //$('#'+minid).val('00');
        min = '00';
    }
    var ampm = $('#'+durationid).val();
    var combinetime = hour+' : '+min+' '+ampm;
    return combinetime;
}

function savecocform(type) {
    var drugtestoptval = $("input[name='drugtest']:checked").val();
    var cocid = $('#cocid').val();
    var dontesttime1 = combinetime24('dontesthr1','dontestmin1');
    var dontesttime2 = combinetime24('dontesthr2','dontestmin2');
    var voidtime = combinetime24('voidtimehr','voidtimemin');
    var ctstime = combinetime24('ctstimehr','ctstimemin');
    var tempreadtime = combinetime24('tempreadtimehr','tempreadtimemin');
    $('#dontesttime1').val(dontesttime1);
    $('#dontesttime2').val(dontesttime2);
    $('#voidtime').val(voidtime);
    $('#ctstime').val(ctstime);
    $('#tempreadtime').val(tempreadtime);
    /*if(drugtestoptval == '1'){
        $('.nonoralinp, .oralinp').val('');
    }else if(drugtestoptval == '2'){
        $('.nonoralinp, .alcinp').val('');
    }else if(drugtestoptval == '3'){
        $('.alcinp').val('');
    }*/
    var update = true;
    if(type == '1'){
        var drugpositive = parseInt($('#drugpositive').val());
        if ($('#contractor').is(':checked') && $('#contractordet').val() == '') {
            navigator.notification.alert("Please enter contractor details", function () {
                focusonfieldbyid('contractordet');
            }, 'Error', 'OK');
            return false;
        }else if((drugtestoptval == '1') && ((dontesttime1 == ' : 00') || ($('#dontesthr1').val() > 23) || ($('#dontesthr1').val() == '') || ($('#dontesthr1').val() == ' '))){
            navigator.notification.alert("Enter valid hours for test1.",showpage, 'Error', 'OK');
            return false;
        }else if((drugtestoptval == '1') && (!validateminutes('dontestmin1'))){
            return false;
        }else if((drugtestoptval == '1') && ((dontesttime2 == ' : 00') || ($('#dontesthr2').val() > 23) || ($('#dontesthr2').val() == '') || ($('#dontesthr2').val() == ' '))){
            navigator.notification.alert("Enter valid hours for test2.",showpage, 'Error', 'OK');
            return false;
        }else if((drugtestoptval == '1') && (!validateminutes('dontestmin2'))){
            return false;
        }else if((drugtestoptval == '2' || drugtestoptval == '3') && ((voidtime == ' : 00') || ($('#voidtimehr').val() > 23) || ($('#voidtimehr').val() == '') || ($('#voidtimehr').val() == ' '))){
            navigator.notification.alert("Enter valid hours for void time.",showpage, 'Error', 'OK');
            return false;
        }else if((drugtestoptval == '2' || drugtestoptval == '3') && (!validateminutes('voidtimemin'))){
            return false;
        }else if((drugtestoptval == '3') && (!$('#sampletempc').val())){
            navigator.notification.alert("Enter sample temp C value.",showpage, 'Error', 'OK');
            return false;
        }else if((drugtestoptval == '3') && ((tempreadtime == ' : 00') || ($('#tempreadtimehr').val()>23) || ($('#tempreadtimehr').val() == '') || ($('#tempreadtimehr').val() == ' '))){
            navigator.notification.alert("Enter valid hours for temp read time within 4 min.",showpage, 'Error', 'OK');
            return false;
        }else if((drugtestoptval == '3') && (!validateminutes('tempreadtimemin'))){
            return false;
        }else if((drugtestoptval == '3') && (($('#intect').val()) && (!$('#intectexpiry').val()))){
            navigator.notification.alert("Please enter expiry date", function () {
                focusonfieldbyid('intectexpiry');
            }, 'Error', 'OK');
            return false;
        }else if((drugtestoptval == '3') && (($('#intect').val()) && (!$('#visualcolor').val()))){
            navigator.notification.alert("Please enter visual color", function () {
                focusonfieldbyid('visualcolor');
            }, 'Error', 'OK');
            return false;
        }else if((drugtestoptval == '3') && (($('#intect').val()) && (!$('#creatinine').val()))){
            navigator.notification.alert("Please enter creatinine value", function () {
                focusonfieldbyid('creatinine');
            }, 'Error', 'OK');
            return false;
        }else if((drugtestoptval == '3') && (($('#intect').val()) && (!$('#otherintegrity').val()))){
            navigator.notification.alert("Please enter other integrity value", function () {
                focusonfieldbyid('otherintegrity');
            }, 'Error', 'OK');
            return false;
        }else if((drugtestoptval == '2' || drugtestoptval == '3') && (!$('#devicename').val())){
            navigator.notification.alert("Please enter drug device name", function () {
                focusonfieldbyid('devicename');
            }, 'Error', 'OK');
            return false;
        }else if((drugtestoptval == '2' || drugtestoptval == '3') && (!$('#reference').val())){
            navigator.notification.alert("Please enter Ref# value", function () {
                focusonfieldbyid('reference');
            }, 'Error', 'OK');
            return false;
        }else if((drugtestoptval == '2' || drugtestoptval == '3') && (!$('#lotno').val())){
            navigator.notification.alert("Please enter Lot# value", function () {
                focusonfieldbyid('lotno');
            }, 'Error', 'OK');
            return false;
        }else if((drugtestoptval == '2' || drugtestoptval == '3') && (!$('#lotexpiry').val())){
            navigator.notification.alert("Please enter lot expiry date", function () {
                focusonfieldbyid('lotexpiry');
            }, 'Error', 'OK');
            return false;
        }
        if((ctstime == ' : 00') || ($('#ctstimehr').val() > 23) || ($('#ctstimehr').val() == '') || ($('#ctstimehr').val() == ' ')){
            navigator.notification.alert("Enter valid hours for collection time of sample.",showpage, 'Error', 'OK');
            return false;
        }else if(!validateminutes('ctstimemin')){
            return false;
        }
        if(parseInt($('#signcoc1').val()) != 1){
            navigator.notification.alert('Donor Signature is required.',showpage, 'Error', 'OK');
            return false;
        }else if(!$('#donorsigndate').val()) {
            navigator.notification.alert("Please enter donor signature date", function () {
                focusonfieldbyid('donorsigndate');
            }, 'Error', 'OK');
            return false;
        }
        if(parseInt($('#signcoc2').val()) != 1){
            navigator.notification.alert('Donor Declaration Signature is required.',showpage, 'Error', 'OK');
            return false;
        }
        if(parseInt($('#signcoc3').val()) != 1){
            navigator.notification.alert('Collector 1 Signature is required.',showpage, 'Error', 'OK');
            return false;
        }
        if($('#collectortwo').val() && parseInt($('#signcoc4').val()) != 1){
            navigator.notification.alert('Collector 2 Signature is required.',showpage, 'Error', 'OK');
            return false;
        }
    }
    if(parseInt($('#cocchangesign1').val()) == '1' && parseInt($('#signcoc1').val()) == 0){
        update = false;
        navigator.notification.confirm(
            'You have clicked on change signature but you have left it blank. Do you want to change your signature?', // message
            function(buttonIndex){
                changesignoptions(buttonIndex,'signcoc1','coc1');
            },
            'Alert!',
            ['Keep Original','Change Signature']     // buttonLabels
        );
    }
    if(parseInt($('#cocchangesign2').val()) == 1 && parseInt($('#signcoc2').val()) == 0){
        update = false;
        navigator.notification.confirm(
            'You have clicked on change signature but you have left it blank. Do you want to change your signature?', // message
            function(buttonIndex){
                changesignoptions(buttonIndex,'signcoc2','coc2');
            },
            'Alert!',
            ['Keep Original','Change Signature']     // buttonLabels
        );
    }
    if(parseInt($('#cocchangesign3').val()) == 1 && parseInt($('#signcoc3').val()) == 0){
        update = false;
        navigator.notification.confirm(
            'You have clicked on change signature but you have left it blank. Do you want to change your signature?', // message
            function(buttonIndex){
                changesignoptions(buttonIndex,'signcoc3','coc3');
            },
            'Alert!',
            ['Keep Original','Change Signature']     // buttonLabels
        );
    }
    if($('#collectortwo').val() && parseInt($('#cocchangesign4').val()) == 1 && parseInt($('#signcoc4').val()) == 0){
        update = false;
        navigator.notification.confirm(
            'You have clicked on change signature but you have left it blank. Do you want to change your signature?', // message
            function(buttonIndex){
                changesignoptions(buttonIndex,'signcoc4','coc4');
            },
            'Alert!',
            ['Keep Original','Change Signature']     // buttonLabels
        );
    }
    if(parseInt($('#cocchangesign5').val()) == 1 && parseInt($('#signcoc5').val()) == 0){
        update = false;
        navigator.notification.confirm(
            'You have clicked on change signature but you have left it blank. Do you want to change your signature?', // message
            function(buttonIndex){
                changesignoptions(buttonIndex,'signcoc5','coc5');
            },
            'Alert!',
            ['Keep Original','Change Signature']     // buttonLabels
        );
    }

if(update) {
    $('.loader-modal').css('display', 'block');
    var jdata = $('#cocformdata').serializeObject();
    if (type == '1') {
        jdata.status = '1';
    } else {
        jdata.status = '0';
    }
    console.log(jdata);
    $.ajax({
        datatype: "json",
        url: __SITE_JS_PATH__ + "addcocdata/",
        type: "POST",
        crossDomain: true,
        cache: false,
        data: JSON.stringify(jdata),
        success: function (html) {
            if (html.code == '200') {
                if($('#coc1').is(':visible')){
                    savecocsign('coccanvas1',cocid,'donorsign');
                }
                if($('#coc2').is(':visible')){
                    savecocsign('coccanvas2',cocid,'donordecsign');
                }
                if($('#coc3').is(':visible')){
                    savecocsign('coccanvas3',cocid,'collectorsignone');
                }
                if($('#coc4').is(':visible')){
                    savecocsign('coccanvas4',cocid,'collectorsigntwo');
                }
                /*if($('#coc5').is(':visible')){
                    savecocsign('coccanvas5',cocid,'receiveronesign');
                }
                if($('#coc6').is(':visible')){
                    savecocsign('coccanvas6',cocid,'receivertwosign');
                }*/
                if (type == '1') {
                    setTimeout(function () {
                        navigator.notification.confirm(
                            'COC form has been successfully completed. Do you want to print COC form?', // message
                            function (buttonIndex) {
                                printcoc(buttonIndex, cocid);
                            },            // callback to invoke with index of button pressed
                            'Confirmation',           // title
                            ['Print', 'Close']     // buttonLabels
                        );
                        // navigator.notification.alert(html.message, callbackcoc, 'Success', 'OK');
                    }, 1000);
                }else{
                    navigator.notification.alert(html.message, function () {
                        callbackcoc('SOS.html');
                    }, 'Success', 'OK');
                }
            } else if (html.code == '202') {
                window.location.href = "coc-form-pending-list.html";
                $('.loader-modal').css('display', 'none');
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

function callbackcoc(pagename) {
    if(!pagename){
        pagename = "coc-form-pending-list.html";
    }
    window.location.href = pagename;
}

function savecocsign(canvasid,cocid,fieldname) {
    var canvas = document.getElementById(canvasid);
    var imgdata = canvas.toDataURL("image/png");
    $.ajax({
        type: "POST",
        url: __SITE_JS_PATH__ + "uploadcocdata/",
        data: {
            imgBase64: imgdata,
            cocid:cocid,
            fieldname:fieldname
        }
    }).done(function(o) {
        console.log(o);
    });
}

function printcoc(buttonIndex,cocid) {
    if(buttonIndex == '1'){
        var jdata = {
            cocid: cocid,
            sosstat: "0"
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
                    setTimeout(function () {
                        callbackcoc('SOS.html');
                    },2000);
                }
            }
        });
    }else {
        callbackcoc('SOS.html');
    }
}

function markandshowform(ele) {
    // $('.drugtestopt').prop('checked',false);
    $(ele).prop('checked',true);
    var eleval = $(ele).val();
    if(eleval == '1'){
        $('.alctest').show();
        $('.nonalctest').hide();
    }else if(eleval == '2'){
        $('.alctest').show();
        $('.nonalctest').show();
        $('.oral-hide').hide();
    }else if(eleval == '3'){
        $('.alctest').show();
        $('.nonalctest').show();
        $('.oral-hide').show();
    }
}