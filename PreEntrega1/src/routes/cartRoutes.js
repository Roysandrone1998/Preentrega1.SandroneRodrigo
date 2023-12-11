
import { Router } from 'express';
import CartManager from '../managers/cartManager.js';
import ProductManager from '../managers/productManager.js';

const router = Router();
const cartManager = new CartManager('./data/carritos.json');
const manager = new ProductManager('./data/productos.json');

router.post('/', async (req, res) => {
    try {
        res.send(await cartManager.addCart());
    } catch (err) {
        res.status(500).json({ error: err.message || "Error al agregar carrito" });
    }
});

router.get('/:cid', (req, res) => {
    try {
        const products = cartManager.getProducts(Number(req.params.cid));
        if (products.error) {
            res.status(404).json({ error: products.error });
        } else {
            res.json(products);
        }
    } catch (err) {
        res.status(500).json({ error: err.message || "Error al obtener productos del carrito" });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const checkProduct = manager.getProductById(Number(pid));
        if (checkProduct === 'Not found') {
            return res.status(404).json({ error: "Producto no presente en la base de datos" });
        }
        const addedProduct = await cartManager.addProductToCart(Number(cid), Number(pid));
        if (addedProduct.error) {
            res.status(404).json({ error: addedProduct.error });
        } else {
            res.status(200).json(addedProduct);
        }
    } catch (err) {
        res.status(500).json({ error: err.message || "Error al agregar producto al carrito" });
    }
});

export default router;