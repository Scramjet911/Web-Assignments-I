let xmlRoot = '<students></students>';
let parser = new DOMParser();
let serializer = new XMLSerializer();
let xmlDoc = parser.parseFromString(xmlRoot, "text/xml");

(function ($) {
    "use strict";

    // Validating the Inputs
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', function () {
        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).val().trim() == '') {
            return false;
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

})(jQuery);

document.addEventListener('DOMContentLoaded', (event) => {
    render();
})

// Button Onclicks : Update and Clear
document.getElementById('btnClear').addEventListener("click", () => {
    document.getElementById('name').value = "";
    document.getElementById('address').value = "";
});

document.getElementById('btnUpdate').addEventListener("click", () => {
    let tempName = document.getElementById('name').value;
    let tempAddr = document.getElementById('address').value;
    if (tempName === "" || tempAddr === "") {
        let active = document.querySelector(".modal");
        active.classList.add("is-active");
    } else {
        let students = xmlDoc.getElementsByTagName("students")[0];
        let newStdRoot = xmlDoc.createElement("std");
        let newStdName = xmlDoc.createElement("name");
        newStdName.innerHTML = tempName;
        let newStdAddr = xmlDoc.createElement("address");
        newStdAddr.innerHTML = tempAddr;
        newStdRoot.appendChild(newStdName);
        newStdRoot.appendChild(newStdAddr);
        students.appendChild(newStdRoot);
        render();
        document.getElementById('name').value = "";
        document.getElementById('address').value = "";
    }
});

// Formatting the Address
let formatAddr = (addr) => {
    let lines = addr.split(/\r?\n/);
    let final = '';
    for (let i = 0; i < lines.length - 1; i++) {
        if (lines[i] !== "") {
            final = final + lines[i] + '<br>';
        }
    }
    if (lines[lines.length - 1] !== "") {
        final = final + lines[lines.length - 1];
    } else {
        final = final.substring(0, final.length - 4);
    }
    return final;
}

// Rendering the Table after the Update Queries
let render = () => {
    let students = xmlDoc.getElementsByTagName("std");
    let tableLines = '';
    for (let i = 0; i < students.length; i++) {
        let tempName = students[i].getElementsByTagName('name')[0].innerHTML;
        let tempAddr = students[i].getElementsByTagName('address')[0].innerHTML;
        tempAddr = formatAddr(tempAddr);
        tableLines = tableLines + '<tr><th>' + (i + 1) + '</th><td><strong>' + tempName + '</strong></td><td>' + tempAddr + '</td></tr>';
    }
    document.getElementById('tblBody').innerHTML = tableLines;
}

// To UpperCase and LowerCase Buttons
document.getElementById('btnUpr').addEventListener('click', () => {
    let http = new XMLHttpRequest();
    let url = 'http://localhost:4600/upper';
    http.open('POST', url, true);

    // Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    // Call a function when the state changes.
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            xmlDoc = parser.parseFromString(http.responseText, "text/xml");
            render();
        }
    }
    let dataToSend = serializer.serializeToString(xmlDoc);
    http.send(dataToSend);
})

document.getElementById('btnLwr').addEventListener('click', () => {
    let http = new XMLHttpRequest();
    let url = 'http://localhost:4600/lower';
    http.open('POST', url, true);

    // Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    // Call a function when the state changes.
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            xmlDoc = parser.parseFromString(http.responseText, "text/xml");
            render();
        }
    }
    let dataToSend = serializer.serializeToString(xmlDoc);
    http.send(dataToSend);
})