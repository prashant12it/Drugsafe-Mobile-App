if(localStorage.getItem("userid") > '0'){
    if((localStorage.getItem("role") == '3') || (localStorage.getItem("role") == '4')){
        window.location.href = 'clientreport.html';
    }
}