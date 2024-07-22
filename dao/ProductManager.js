import fs from "fs"

export default class ProductManager {
    constructor(path) {
    (this.path = path),
    (this.products = [])
    }

    getProducts = async (info) => {

    try {
        const { limit } = info

        if (fs.existsSync(this.path)) {
        const productlist = await fs.promises.readFile(this.path, "utf-8")
        const productlistJs = JSON.parse(productlist);
        if (limit) {
            const limitProducts = productlistJs.slice(0, parseInt(limit))
            return limitProducts
        } else {
            return productlistJs
        }
    } else {
        return []
    }
    } catch (error) {
        throw new Error(error)
    }
}
    getProductsView = async () => {
    try {
        if (fs.existsSync(this.path)) {
        const productlist = await fs.promises.readFile(this.path, "utf-8")
        const productlistJs = JSON.parse(productlist)
        return productlistJs;
        } else {
            return []
        }
        } catch (error) {
        throw new Error(error)
        }
};


getProductbyId = async (id) => {
    try {
        const {pid}=id
            if (fs.existsSync(this.path)) {
        const allproducts = await this.getProducts({});
        const found = allproducts.find((element) => element.id === parseInt(pid))
        if (found) {
            return found;
        } else {
            throw new Error("Producto no existe")
        }
    } else {
        throw new Error("Product file not found")
    }
    } catch (error) {
        throw new Error(error)
    }
};

generateId = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const productlist = await fs.promises.readFile(this.path, "utf-8")
        const productlistJs = JSON.parse(productlist)
        const counter = productlistJs.length
        if (counter == 0) {
          return 1
        } else {
          return productlistJs[counter - 1].id + 1
        }
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  //CREATE
  addProduct = async (obj) => {
    const {title, description, price, thumbnail,category, code, stock}=obj
    if (!title || !description || !price || !category || !code|| !stock) {
      console.error("INGRESE TODOS LOS DATOS DEL PRODUCTO")
      return
    } else {
      const listadoProductos=await this.getProducts({})
      const codigorepetido = listadoProductos.find(
        (elemento) => elemento.code === code
      )
      if (codigorepetido) {
        console.error("EL CODIGO DEL PRODUCTO QUE DESEA AGREGAR ES REPETIDO")
        return
      } else {
        const id = await this.generateId()
        const productnew = {
          id,
          title,
          description,
          price,
          category,
          thumbnail,
          code,
          stock,
        }
        listadoProductos.push(productnew)
        await fs.promises.writeFile(this.path,
          JSON.stringify(listadoProductos, null, 2)
        )
      }
    }
  }

  //UPDATE
  updateProduct = async (id,obj) => {
    const {pid}=id
    const {title, description, price, category,thumbnail, code, stock}=obj
        if(title===undefined || description===undefined || price===undefined || category===undefined ||code===undefined||stock===undefined){
      console.error("INGRESE TODOS LOS DATOS DEL PRODUCTO PARA SU ACTUALIZACION")
      return
    } else {
      const listadoProductos = await this.getProducts({});
      const codigorepetido = listadoProductos.find( (i) => i.code === code)
      if (codigorepetido) {
        console.error(
          "EL CODIGO DEL PRODUCTO QUE DESEA ACTUALIZAR ES REPETIDO"
        )
        return
      } else {
        const listadoProductos = await this.getProducts({})
        const newProductsList = listadoProductos.map((elemento) => {
          if (elemento.id === parseInt(pid)) {
                    const updatedProduct = {
                      ...elemento,
                      title,
                      description,
                      price,
                      category,
                      thumbnail,
                      code,
                      stock
                    }
            return updatedProduct
          } else {
            return elemento
          }
        })
        await fs.promises.writeFile(this.path,JSON.stringify(newProductsList, null, 2))
    
      }
    }
  }

  //DELETE
  deleteProduct = async (id) => {
    const allproducts = await this.getProducts({})
    const productswithoutfound = allproducts.filter(
  (elemento) => elemento.id !==  parseInt(id)
    )
    await fs.promises.writeFile(this.path,JSON.stringify(productswithoutfound, null, 2)
    )
      return `Producto Eliminado`
  }
}