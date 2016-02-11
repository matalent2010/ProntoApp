/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var MobileOS;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        MobileOS = "";
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        MobileOS = (navigator.userAgent.match(/iPhone|iPod|iPad/i)) ? "ios" : (navigator.userAgent.match(/Android/i)) == "Android" ? "android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "";        
        // alert("Device OS: " + MobileOS + "\n userAgent: " + navigator.userAgent); 

        // var deviceOS  = device.platform  ;  //fetch the device operating system
        // var deviceOSVersion = device.version ;  //fetch the device OS version        
        // alert("Device OS: " + deviceOS + "\nDevice OS Version: " + deviceOSVersion);   
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        console.log('Received Event: ' + id);
    }
};

var UserInfo = [];
jQuery(function($) {


    $('#myTable').on('click', 'input#delrow', function () {
        $(this).closest('tr').remove();
    });

    $('p input#adduser').click(function () {
        $('#myTable').append('<tr><td><input type="text" placeholder="User Name" class="fname" /><td><input type="text" placeholder="Password" class="fpassword" /></td><td><input type="button" id="delrow" value="-" /></td></tr>')
    });

    $('p input#save').click(function () {
        saveDataToLocal();
        disablePopup();
    });

    $('#userinfo').click(function(){
        $("#myTable").find("tr:gt(0)").remove();
        var str;
        $.each($(UserInfo), function(i, obj){
            str = '<tr><td><input type="text" placeholder="User Name" class="fname" value="'+ obj['username']+'"><td><input type="text" placeholder="Password" class="fpassword" value="' + obj['password'] + '"><td><input type="button" id="delrow" value="-" /></td></tr>';
            $('#myTable').append(str);
        });
        loadPopup();
    });

    $('#userlist').change(function () {
        setPasswordWithUsername();
    });

    $('#btnLogin').click(function(e){
        e.preventDefault();
        $('#loadingspinner').show();
        $.ajax({
            type: 'GET',
            url: 'http://myusedrideisthebomb.com/admin/index.php',
            data: {
                signout: true
            },
            error: function() {
                $('#loadingspinner').hide();
                alert("Internet Error");
            },
            success: function(data, textStatus, jqXHR) {
                $.ajax({
                    type: 'POST',
                    url: 'http://myusedrideisthebomb.com/admin/index.php',
                    data: {
                        username: $('#userlist').val(), 
                        password:$('#password').val(),
                        iniLog:'true', 
                        mobile: MobileOS
                    },
                    error: function() {
                        $('#loadingspinner').hide();
                        alert("Internet Error");
                    },
                    dataType: 'html',
                    success: function(data, textStatus, jqXHR) {
                        $('#loadingspinner').hide();
                        if( loginSuccess(JSON.stringify(data)) == true ){
                            window.open("http://myusedrideisthebomb.com/admin/index.php", "_self", "hardwareback=no,location=no");
                        } else {
                            alert("Please check your username and password");
                        }
                    }   
                });
            }   
        });
        
    });

    loadDataFromLocal();
    setNewUserlist();
    setPasswordWithUsername();
});

function saveDataToLocal(){
    UserInfo = [];
    $.each($('#myTable tr'), function(i, obj){
        if( $(obj).find('.fname').val() && ($(obj).find('.fname').val()).length ){
            var user={};
            user['username'] = $(obj).find('.fname').val();
            user['password'] = $(obj).find('.fpassword').val();
            UserInfo.push(user);
        }
    });
    localStorage.setItem("userinfo", JSON.stringify(UserInfo));
    setNewUserlist();
}

function loadDataFromLocal(){
    //localStorage.setItem("userinfo", JSON.stringify("a"));
    var oldData = JSON.parse(localStorage["userinfo"]);
    if(oldData.length && oldData[0]['username'] && oldData[0]['username'].length){
        UserInfo = oldData;
    }
}

function setNewUserlist(){
    var hmtl = "";
    $.each($(UserInfo), function(i, obj){
            hmtl += '<option value="' + obj['username'] + '">' + obj['username'] + '</option>';
        });
    $('#userlist').html(hmtl);
}

function loginSuccess(data){
    var object = $('<div/>').html(data);
    if( object.find("form.login-form").length ) {
        return false;
    }
    return true;
}

function setPasswordWithUsername(){
    var str = "";
    $( "#userlist option:selected" ).each(function() {
      str = $( this ).text();
    });
    var selectedUser = $.grep(UserInfo, function(user, i){
        return user['username']==str;
    });
    if(selectedUser.length){
        $( "#password" ).val( selectedUser[0]['password'] );
    } else {
        $( "#password" ) = "";
    }
}

function barcodeScanning(){
    cordova.plugins.barcodeScanner.scan(
      function (result) {
          // alert("We got a barcode\n" +
          //       "Result: " + result.text + "\n" +
          //       "Format: " + result.format + "\n" +
          //       "Cancelled: " + result.cancelled);
        window.open("http://myusedrideisthebomb.com/admin/cp-list-add.php?vin="+result.text, "_self", "location=no");
      }, 
      function (error) {
          alert("Scanning failed: " + error);
      }
   );
}