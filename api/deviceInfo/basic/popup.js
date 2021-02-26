// https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/mv2-archive/api/deviceInfo/basic/

let deviceinfos = document.getElementById('deviceinfos');

function dumpDevices(devices) {
    deviceinfos.innerHTML = '';
    deviceinfos.appendChild(outputDevicesToList(devices));
    //$('#deviceinfos').append(outputDevicesToList(devices));
}

function outputDevicesToList(devices) {
    //var table = $('<table border="1">');
    let table = document.createElement('table');
    table.setAttribute('border', '1');
    
    let tr = document.createElement('tr');
    let tr_name = document.createElement('tr');
    tr_name.innerHTML = "Name";
    let tr_os = document.createElement('tr');
    tr_os.innerHTML = "OS";
    let tr_id = document.createElement('tr');
    tr_id.innerHTML = "Id";
    let tr_type = document.createElement('tr');
    tr_type.innerHTML = "Type";
    let tr_chrome_version = document.createElement('tr');
    tr_chrome_version.innerHTML = "Chrome Version";
    
    tr.appendChild(tr_name);
    tr.appendChild(tr_os);
    tr.appendChild(tr_id);
    tr.appendChild(tr_type);
    tr.appendChild(tr_chrome_version);
    
    table.appendChild(tr);
    
    //table.append($("<tr>" +
    //               "<th>" + "Name" + "</th>" +
    //               "<th>" + "OS" + "</th>" +
    //               "<th>" + "Id" + "</th>" +
    //               "<th>" + "Type" + "</th>" +
    //               "<th>" + "Chrome Version" + "</th>" +
    //               "</tr>"));
    for (i = 0; i < devices.length; i++) {
        let trd = document.createElement('tr');
        let trd_name = document.createElement('tr');
        trd_name.innerHTML = devices[i].name;
        let trd_os = document.createElement('tr');
        trd_os.innerHTML = devices[i].os;
        let trd_id = document.createElement('tr');
        trd_id.innerHTML = devices[i].id;
        let trd_type = document.createElement('tr');
        trd_type.innerHTML = devices[i].type;
        let trd_chrome_version = document.createElement('tr');
        trd_chrome_version.innerHTML = devices[i].chromeVersion;
        
        trd.appendChild(trd_name);
        trd.appendChild(trd_os);
        trd.appendChild(trd_id);
        trd.appendChild(trd_type);
        trd.appendChild(trd_chrome_version);
    
        table.appendChild(trd);
        
        //table.append($("<tr>" +
        //               "<td>" + devices[i].name + "</td>" +
        //               "<td>" + devices[i].os + "</td>" +
        //               "<td>" + devices[i].id + "</td>" +
        //               "<td>" + devices[i].type + "</td>" +
        //               "<td>" + devices[i].chromeVersion + "</td>" +
        //               "</tr>"));
    }
    return table;
}

// Add an event listener to listen for changes to device info. The
// callback would redisplay the list of devices.
chrome.signedInDevices.onDeviceInfoChange.addListener(dumpDevices);

function populateDevices() {
  // Get the list of devices and display it.
  chrome.signedInDevices.get(false, dumpDevices);
}

document.addEventListener('DOMContentLoaded', function () {
    populateDevices();
});