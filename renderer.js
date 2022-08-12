const { default: axios } = require("axios");
let { remote } = require("electron");
// console.log(process.versions.electron);

const log = (text) => {
  document.getElementById("log").innerHTML = text;
};

const { PosPrinter } = remote.require("electron-pos-printer");
// const { PosPrinter } = require("electron-pos-printer"); //dont work in production (??)

const path = require("path");

let webContents = remote.getCurrentWebContents();
let printers = webContents.getPrinters(); // list of printers

const SIZES = {
  0: 300,
  1: 218,
};

async function silentPrint(printerName, typePrint, dataPrint) {
  const options = {
    preview: false, // Preview in window or print
    width: SIZES[typePrint], //  width of content body
    margin: "0 0 0 0", // margin of content body
    copies: 1, // Number of copies to print
    printerName: printerName, // printerName: string, check it at webContent.getPrinters()
    timeOutPerLine: 400,
    silent: true,
  };

  if (dataPrint) {
    PosPrinter.print(dataPrint, options)
      .then(() => {
        return "ok";
      })
      .catch((error) => {
        throw new Error(error);
      });
  } else {
    throw new Error("La información enviada para imprimir es incorrecta.");
  }
}

async function readPrinters() {
  let printersAdded = [];
  let response;
  try {
    response = await axios.get("http://localhost:5636/api/printers");
  } catch (e) {
    response = e;
  }
  if (response.status === 200) {
    printersAdded = [...response.data];
  }

  document.getElementById("table_printers").innerHTML = `
  <tr>
    <th>N°</th>
    <th class="select">Seleccione su impresora</th>
    <th></th>
  </tr>`;

  printersAdded.map((item, index) => {
    let printersHTML = `<select name="${item.id}" onchange="pintar(this)">`;

    printers.map((printer, index) => {
      printersHTML += `<option value="${printer.name}" ${
        printer.name === item.name && "selected"
      }>${printer.name}</option>`;
    });

    printersHTML += `</select>`;

    document.getElementById("table_printers").innerHTML += `
    <tr>
      <td style="font-weight: bold;">${item.id}</td>
      <td>
        ${printersHTML}
      </td>
      <td><button class="trash" onclick="deletePrinter(${item.id})" /></td>
    </tr>
    `;
  });
}

async function addPrinter() {
  try {
    await axios.post("http://localhost:5636/api/printers", {
      name: printers[0].name,
    });
  } catch (e) {
    alert(e);
  }
  readPrinters();
}

async function editPrinter(id, object) {
  try {
    await axios.put(`http://localhost:5636/api/printers/${id}`, object);
  } catch (e) {
    alert(e);
  }
  readPrinters();
}

async function deletePrinter(printerId) {
  try {
    await axios.delete(`http://localhost:5636/api/printers/${printerId}`);
  } catch (e) {
    alert(e);
  }
  readPrinters();
}

function pintar(selectedObject) {
  const id = selectedObject.name;
  const value = selectedObject.value;
  editPrinter(id, {
    name: value,
  });
}
