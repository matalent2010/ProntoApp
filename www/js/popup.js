jQuery(function($) {
    
    $("div.close").click(function() {
        disablePopup();  // function close pop up
    });
    
    $("div#backgroundPopup").click(function() {
        saveDataToLocal();
        disablePopup();  // function close pop up
    });
    
    $('a.livebox').click(function() {
        alert('Hello World!');
    return false;
    });

}); // jQuery End


 /************** start: functions. **************/
function loading() {
    $("div.loader").show();  
}
function closeloading() {
    $("div.loader").fadeOut('normal');  
}

var popupStatus = 0; // set value

function loadPopup() {
    if(popupStatus == 0) { // if value is 0, show popup
        closeloading(); // fadeout loading
        $("#backgroundPanel").show(0, function(){
            $("#toPopup").slideDown(0300); // fadein popup div        
            $("#backgroundPopup").fadeIn(0001);
        });        
        popupStatus = 1; // and set value to 1
    }    
}
    
function disablePopup() {
    if(popupStatus == 1) { // if value is 1, close popup
        $("#backgroundPanel").fadeOut("fast",function(){
            $("#toPopup").hide();
            $("#backgroundPopup").hide();
        });  
        popupStatus = 0;  // and set value to 0
    }
}
/************** end: functions. **************/