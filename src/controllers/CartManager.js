import { captureRejections } from "events";
import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import ProductManager from "./ProductManager.js";

const productAll = ProductManager;

class CartManager {
  constructor() {
    this.path = "./src/models/carts.json";
  }
  readCarts = async () => {
    let carts = await fs.readFile(this.path, "utf-8");
    return JSON.parse(carts);
  };
  writeCarts = async (carts) => {
    await fs.writeFile(this.path, JSON.stringify(carts));
  };
  exist = async (id) => {
    let carts = await this.readCarts();
    return carts.find((cart) => cart.id === id);
  };
  addCarts = async () => {
    let cartsOld = await this.readCarts();
    let id = nanoid();
    let cartsConcat = [{ id: id, products: [] }, ...cartsOld];
    await this.writeCarts(cartsConcat);
    return "Carrito Agegado";
  };
  getCartsById = async (id) => {
    let cartById = await this.exist(id);
    if (!cartById) return "Carrito No Encontrado";
    return cartById;
  };
  addProductInCart = async (cartId, productId) => {
    let cart = await this.exist(cartId);
    if (!cart) return "Carrito No Encontrado";

    let product = await productAll.exist(productId);
    if (!product) return "Producto No Encontrado";

    let existingProduct = cart.products.find((prod) => prod.id === productId);
    if (existingProduct) {
      existingProduct.cantidad++;
    } else {
      cart.products.push({ id: productId, cantidad: 1 });
    }

    // Guardar los cambios en el carrito
    await this.updateCart(cart);

    return "Producto agregado al carrito";
  };
}

export default CartManager;
