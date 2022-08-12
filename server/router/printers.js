const express = require("express");
const printersRouter = express.Router();

// Clase de item
const Container = require("../Container");
const printerContainer = new Container("./data/printers.json");

// FUNCTION PRINTER
let { remote } = require("electron");
// const { PosPrinter } = remote.require("electron-pos-printer");
const { PosPrinter } = require("electron-pos-printer"); //dont work in production (??)
const path = require("path");

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
}

printersRouter.get("/", async (req, res) => {
  const data = await printerContainer.getAll();
  res.status(200).json(data);
});

printersRouter.get("/:id", async (req, res) => {
  const paramId = parseInt(req.params.id);
  const item = await printerContainer.getById(paramId);
  if (item === null) {
    res.send({
      error: "Item no encontrado",
    });
  } else {
    res.json(item);
  }
});

printersRouter.post("/", async (req, res) => {
  const newItem = req.body;
  const idSave = await printerContainer.save(newItem);
  if (idSave) {
    res.json({
      ...newItem,
      id: idSave,
    });
  } else {
    res.send("Máximo de impresoras alcanzado");
  }
});

printersRouter.put("/:id", async (req, res) => {
  const paramId = parseInt(req.params.id);
  const item = req.body;
  const editItem = {
    ...item,
    id: paramId,
  };
  const idEdit = await printerContainer.edit(editItem);
  res.send({
    messagge: "success",
    data: idEdit,
  });
});

printersRouter.delete("/:id", async (req, res) => {
  const paramId = parseInt(req.params.id);
  const item = await printerContainer.deleteById(paramId);
  res.send({
    messagge: "deleted",
  });
});

// ENDPOINT IMPRIMIR
printersRouter.post("/print/:id", async (req, res) => {
  const paramId = parseInt(req.params.id);
  const printInfo = req.body;
  let typePrint = printInfo.type || 0;
  let dataPrint = printInfo.data || null;

  const item = await printerContainer.getById(paramId);
  if (item === null) {
    res.send({
      error: "Impresora no encontrada",
    });
  } else {
    try {
      silentPrint(item.name, typePrint, dataPrint);
      res.status(200).send("ok");
    } catch (e) {
      res.send({
        error: "Algo falló al momento de imprimir.",
      });
    }
  }
});

module.exports = printersRouter;
