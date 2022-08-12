const fs = require("fs");

class Container {
  constructor(file) {
    this.file = file;
  }

  // FUNCIÓN PARA GUARDAR
  async save(item) {
    try {
      let items = [];
      // Traer items
      const contenido = await fs.promises.readFile(this.file, "utf-8");
      // Si no hay items, el id será 1
      if (contenido === "" || contenido === "[]") {
        item.id = 1;
        items.push(item);
        // Si hay items, el id será igual al id del último + 1
      } else {
        const listaItems = JSON.parse(contenido);
        const ultimoID = listaItems.length - 1;
        if (ultimoID >= 3) {
          return;
        }
        item.id = listaItems[ultimoID].id + 1;
        listaItems.push(item);
        items = listaItems;
      }
      const itemsString = JSON.stringify(items, null, 2);
      await fs.promises.writeFile(this.file, itemsString);
      // Retorna el id guardado
      return item.id;
    } catch (error) {
      console.log("error: ", error);
    }
  }

  // FUNCIÓN PARA EDITAR
  async edit(editedItem) {
    try {
      // Traer items
      const contenido = await fs.promises.readFile(this.file, "utf-8");
      const listaItems = JSON.parse(contenido);

      // NUEVO ARRAY
      let itemsNuevo = listaItems.map((item) => {
        if (item.id == editedItem.id) {
          return { ...editedItem };
        }
        return { ...item };
      });

      const itemsString = JSON.stringify(itemsNuevo, null, 2);
      await fs.promises.writeFile(this.file, itemsString);
      // Retorna el id guardado
      return editedItem.id;
    } catch (error) {
      console.log("error: ", error);
    }
  }

  // FUNCIÓN PARA RETORNAR UN ID ESPECÍFICO
  async getById(id) {
    try {
      const contenido = await fs.promises.readFile(this.file, "utf-8");
      // Si no hay items retorna null
      if (contenido === "") {
        return "No hay items.";
        // Si hay items, busca el id
      } else {
        const listaItems = JSON.parse(contenido);
        const encontrado = listaItems.find((prod) => prod.id === id);
        // Si encontró retorna un objeto
        if (encontrado) {
          return encontrado;
        }
        // Si no se encuentra el ID retorna null
        return null;
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  // FUNCIÓN PARA RETORNAR TODOS LOS PRODUCTOS
  async getAll() {
    try {
      const contenido = await fs.promises.readFile(this.file, "utf-8");
      // Si no hay items retorna un mensaje
      if (contenido === "") {
        return "No hay items.";
        // Si hay items los retorna
      } else {
        const listaItems = JSON.parse(contenido);
        return listaItems;
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  // FUNCIÓN PARA BORRAR UN PRODUCTO SEGÚN ID
  async deleteById(id) {
    try {
      const contenido = await fs.promises.readFile(this.file, "utf-8");
      // Si no hay items retorna un mensaje
      if (contenido === "") {
        return "No hay items.";
        // Si hay items buscar el id y lo elimina
      } else {
        const listaItems = JSON.parse(contenido);
        const itemDelete = listaItems.find((prod) => prod.id === id);
        const indexDelete = listaItems.indexOf(itemDelete);
        listaItems.splice(indexDelete, 1);
        await fs.promises.writeFile(
          this.file,
          JSON.stringify(listaItems, null, 2)
        );
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  // FUNCIÓN PARA BORRAR TODOS LOS OBJETOS
  async deleteAll() {
    try {
      const contenido = await fs.promises.readFile(this.file, "utf-8");
      // Si no hay items retorna un mensaje
      if (contenido === "") {
        return "No hay items que borrar.";
        // Si hay items borrar todo reescribiendo el archivo sin items
      } else {
        await fs.promises.writeFile(this.file, "");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }
}

module.exports = Container;
