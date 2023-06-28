import { promises as fs } from "fs";
import { nanoid } from "nanoid";
class ProductManager {
  constructor() {
    this.path = "./src/models/products.json";
  }
  readProducts = async () => {
    let products = await fs.readFile(this.path, "utf-8");
    return JSON.parse(products);
  };
  writeProducts = async (product) => {
    await fs.writeFile(this.path, JSON.stringify(product));
  };

  exist = async (id) => {
    let products = await this.readProducts();
    return products.find((prod) => prod.id === id);
  };

  addProducts = async (product) => {
    let productsOld = await this.readProducts();
    product.id = nanoid();
    let productAll = [...productsOld, product];
    await this.writeProducts(productAll);
    return "Producto Agregado";
  };
  getProducts = async () => {
    return await this.readProducts();
  };
  getProductsById = async (id) => {
    let productById = await this.exist(id);
    if (!productById) return "Producto No Encontrado";
    return productById;
  };
  updateProduct = async (id, product) => {
    let productById = await this.exist(id);

    if (!productById) return "Producto No Encontrado";

    // Obtener los productos existentes

    let productOld = await this.readProducts();

    // Buscar el índice del producto a actualizar

    let productIndex = productOld.findIndex((p) => p.id === id);

    if (productIndex === -1) return "Producto No Encontrado";

    // Actualizar el producto existente

    productOld[productIndex] = { ...product, id: id };

    // Escribir los productos actualizados

    await this.writeProducts(productOld);

    return "Producto Actualizado";
  };
}

deleteProducts = async (id) => {
  let products = await this.readProducts();
  let existProducts = products.some((prod) => prod.id === id);
  if (existProducts) {
    let filterProducts = products.filter((prod) => prod.id !== id); // Corrección aquí
    await this.writeProducts(filterProducts);
    return "Producto Eliminado";
  }
  return "Producto a Eliminar Inexistente";
};

export default ProductManager;
