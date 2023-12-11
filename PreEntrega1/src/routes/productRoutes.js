import { Router } from 'express';
import ProductManager from '../managers/productManager.js';

const router = Router();
const manager = new ProductManager('./data/productos.json');
const products = ProductManager.products;
router.get('/', (req, res) => {
    try {
        const { limit } = req.query;
        const productos = manager.getProducts();
        if (Number(limit)) {
            res.json(productos.slice(0, limit));
        } else {
            res.json(productos);
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get('/:pid', (req, res) => {
    try {
        const { pid } = req.params;
        const producto = manager.getProductById(pid);
        res.json(producto);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.post('/', async (req, res) => {
    try {
        const producto = req.body;
        const newProduct = await manager.addProduct(producto);
        res.status(201).json({ message: "Producto agregado correctamente", data: newProduct });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const productoModificado = req.body;
        const modified = await manager.updateProduct(Number(req.params.pid), productoModificado);
        res.status(200).json({ message: "Producto actualizado correctamente", data: modified });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const deleted = await manager.deleteProduct(Number(req.params.pid));
        if (deleted?.error) {
            return res.status(404).json(deleted.error);
        }
        res.status(201).json(deleted.message);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

export default router;