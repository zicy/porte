

// Send data to Google Apps
function sendData(rowNumber) {

    // Your Google Apps Script Web App URL (replace YOUR_DEPLOYED_SCRIPT_URL with the actual URL)
    const apiUrl = 'https://script.google.com/macros/s/AKfycbyyJ-7OOpHOHu3FWiOO1nKJcG5TVS_MSWoasRF8bAWXQHZAt_ftZAiviYmTecKBFun0/exec';

    // Select the row's input fields and dropdowns
    const row = document.getElementById(`row-${rowNumber}`);
    const inputText = row.querySelector(".inputText").value;
    const dropdown1 = row.querySelector(".dropdown1").value;
    const dropdown2 = row.querySelector(".dropdown2").value;

    // Create the data object to send to the Google Sheet
    const data = {
        rowNumber: rowNumber,
        inputText: inputText,
        dropdown1: dropdown1,
        dropdown2: dropdown2
    };

    // Send the data to the Google Apps Script API using fetch()
    fetch(apiUrl, {
        redirect: "follow",
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        },
    })
        .then(response => response.text())
        .then(data => {
            console.log('Success:', data);
            alert('Row submitted successfully!');
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Get data to Google Apps
function getData(number) {

    // Your Google Apps Script Web App URL (replace YOUR_DEPLOYED_SCRIPT_URL with the actual URL)
    const apiUrl = 'https://script.google.com/macros/s/AKfycbxdjgJqQFnNVGSoZ8Kxb2j_ijNJ18VKEhGHQELAtDPYsnnd2MqKjr-6cslpkeDhlxyiGw/exec';

    // Send the data to the Google Apps Script API using fetch()
    fetch(apiUrl, {
        redirect: "follow",
        method: "GET",
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        },
    })
        .then(response => response.text())
        .then(data => {
            // console.log('Success:', JSON.parse(data));
            const rows = JSON.parse(data);

            rows.forEach(row => {
                // console.log(`Row: ${row.row}, Value: ${row.value}`);

                const gate = row.row;
                const info = row.value;

                // If gate is not a number, then skip
                if (isNaN(gate)) {
                    return
                }

                // If gate is higher than 'number', then skip
                if (gate > number) {
                    return
                }

                // Search for the input-x field and update its value
                const inputField = document.getElementById(`input-${gate}`);
                inputField.value = info;
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Create x number of rows 
function newrow(number) {
    let html = '';
    for (let i = 1; i <= number; i++) {
        html += `
                  <div class="row" id="row-${i}">
                      <span class="number">Port ${i}</span>
                      <input type="text" placeholder="Info" class="inputText" id="input-${i}">
                      
                      <!-- First dropdown menu -->
                      <select class="dropdown1" onchange="changeColor(${i}, this.value)">
                          <option value="default"></option>
                          <option value="unload">Unload</option>
                          <option value="load">Load</option>
                          <option value="special">Special</option>
                      </select>
      
                      <!-- Second dropdown menu with 5 options -->
                      <select class="dropdown2">
                          <option value="option1"></option>
                          <option value="ARDO">ARDO</option>
                          <option value="TCB">TCB</option>
                          <option value="Flensted">Flensted</option>
                          <option value="TF">TF</option>
                      </select>
                      <button onclick="sendData(${i})">Submit Row</button>
    
                      <button onclick="clearRow(${i})">Clear row</button>
                  </div>
              `;
    }
    return html;
}

// Create EventListener to run at page load
document.addEventListener('DOMContentLoaded', async function () {
    div = document.getElementById("container")

    rows = 15;

    div.innerHTML = newrow(rows)

    getData(rows);


})


// Function to change the color of the row based on dropdown selection
function changeColor(rowNumber, selectedOption) {
    const row = document.getElementById(`row-${rowNumber}`);

    // Clear existing color classes
    row.classList.remove('unload', 'load', 'special');

    // Apply the selected color class
    if (selectedOption === 'unload') {
        row.classList.add('unload');
    } else if (selectedOption === 'load') {
        row.classList.add('load');
    } else if (selectedOption === 'special') {
        row.classList.add('special');
    }
}


// Function to clear the row's selection, reset color, and clear the input field
function clearRow(rowNumber) {
    const row = document.getElementById(`row-${rowNumber}`);

    // Reset first dropdown (color-select)
    const firstDropdown = row.querySelector('.dropdown1');
    firstDropdown.value = 'default';

    // Reset second dropdown (option-select)
    const secondDropdown = row.querySelector('.dropdown2');
    secondDropdown.value = 'option1'; // Default to the first option

    // Clear the text input field
    const inputField = document.getElementById(`input-${rowNumber}`);
    inputField.value = '';

    // Remove any background color
    row.classList.remove('unload', 'load', 'special');
}