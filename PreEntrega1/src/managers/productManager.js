import fs from 'fs';

class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path;
        this.loadProducts(); 
    }

    async addProduct(producto) {
        let { title, description, code, price, status, stock, category } = producto;

        if (!title || !description || !price || !code || !stock || !category) {
            throw new Error("Producto incompleto, no se registrará");
        }

        if (status === undefined) {
            producto.status = true;
        }


        const repetido = this.products.find((element) => element.code === producto.code);
if (repetido !== undefined) {
    throw new Error("Producto con código ya agregado");
} else {
            if (this.products.length === 0) {
                producto.id = 1;
            } else {
                producto.id = this.products[this.products.length - 1].id + 1;
            }

            this.products.push(producto);
            await this.saveProducts();
            return producto;
        }
    }

    loadProducts() {
        if (!this.products.length) {
            this.products = JSON.parse(fs.readFileSync(this.path));
        }
    }

    async saveProducts() {
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
    }

    getProducts() {
        this.loadProducts();
        return this.products;
    }

    getProductById(id) {
        let porId = this.products.find((element) => element.id == id);

        if (porId === undefined) {
            return "Not found";
        } else {
            return porId;
        }
    }

    async updateProduct(id, updateInfo) {
        if (this.products.find((element) => element.code == updateInfo.code) !== undefined) {
            return "Código ya existente en otro producto, no se actualizará la información";
        } else {
            let elementoPorId = this.products.find((element) => element.id == id);

            if (elementoPorId === undefined) {
                return { error: "Not found" };
            } else {
                let indicePorID = this.products.findIndex((element) => element.id == id);

                this.products[indicePorID] = { ...elementoPorId, ...updateInfo };
                await this.saveProducts();
                return this.products[indicePorID];
            }
        }
    }

    async deleteProduct(id) {
        let indicePorID = this.products.findIndex((element) => element.id == id);
        if (indicePorID !== -1) {
            this.products.splice(indicePorID, 1);
            await this.saveProducts();
            return { message: "Producto Eliminado." };
        } else {
            return { error: "Not Found" };
        }
    }
}

export default ProductManager;