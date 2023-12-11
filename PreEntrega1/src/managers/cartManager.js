import fs from 'fs';

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.loadCarts(); 
    }

    async addCart() {
        console.log('Adding a new cart...');
        let cart = new Cart();
        if (this.carts.length === 0) {
            cart.id = 1;
        } else {
            cart.id = this.carts[this.carts.length - 1].id + 1;
        }

        this.carts.push(cart);
        await this.saveCarts();
        return cart;
    }

    loadCarts() {
        if (!this.carts.length) {
            this.carts = JSON.parse(fs.readFileSync(this.path));
        }
    }

    async saveCarts() {
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    getProducts(id) {
        this.loadCarts();
        let cart = this.carts.find((element) => element.id == id);
        return cart ? cart.products : { error: "Carrito no encontrado" };
    }

    async addProductToCart(cartId, productId) {
        this.loadCarts();
        let cart_to_modify = this.carts.find((element) => element.id == cartId);
        if (!cart_to_modify) {
            return { error: "Carrito inexistente" };
        }
        const product = manager.getProductById(Number(productId));
        if (product === "Not found") {
            return { error: "Producto no encontrado en la base de datos" };
        }

        const existingProduct = cart_to_modify.products.find((element) => element.product === productId);
        if (!existingProduct) {
            cart_to_modify.products.push({ product: productId, quantity: 1 });
        } else {
            existingProduct.quantity += 1;
        }

        this.carts[this.carts.findIndex((element) => element.id == cartId)] = cart_to_modify;
        await this.saveCarts();
        return this.carts.find((element) => element.id == cartId);
    }
}

class Cart {
    constructor() {
        this.products = [];
    }
}

export default CartManager;
