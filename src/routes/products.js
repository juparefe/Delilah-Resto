const express = require('express');
const router = express.Router();
const actions = require('../database/actions');
const auth = require('../security/auth');

router.get('/products', async (req, res)=> {
    let result = await actions.Select('SELECT * FROM products', {});
    res.json(result);
});

router.get('/product/:id', async (req, res)=> {
    const result = await actions.Select('SELECT * FROM products WHERE idproducts = :id', { id: req.params.id });
    res.json(result);
});

router.post('/product', auth.authToken, auth.authRole, async (req, res)=> {
    const product = req.body;
    const result = await actions.Insert(`INSERT INTO products (nombre, valor) 
    VALUES (:name, :value)`, product);
    if(result.error) {
        res.status(500).json(result.message);
    } else {
        res.json(result);
    }    
});

router.put('/product/:id', auth.authToken, auth.authRole, async (req, res)=> {
    const id = req.params.id;
    const product = req.body;
    const resultProductUpdate = await actions.Update(`UPDATE products 
    SET nombre = :name, valor = :value WHERE idproducts = :id`, { id, ...product});

    if(resultProductUpdate.error) {
        res.status(500).json(result.message);
    } else {
        res.json(resultProductUpdate);
    }
});

router.delete('/product/:id', auth.authToken, auth.authRole, async (req, res)=> {
    const id = req.params.id;
    await actions.Delete(`DELETE FROM products WHERE idproducts = :id`,{id});
    res.send(`Se elimino correctamente el producto con el Id: ${id}`);
});

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *      Order:
 *        type: object
 *        properties:  
 *          id: 
 *              type: integer
 *              description: id del usuario
 *              example: 1  
 *          nombreUsuaurio: 
 *              type: string
 *              description: nombre del usuario
 *              example: 'Wvanegas'
 *          nombreCompleto: 
 *              type: string
 *              description: nombre completo del usuario
 *              example: 'Walter vanegas'
 *          email: 
 *              type: string
 *              description: email del usuario
 *              example: 'Waltervanegas@gmail.com'
 *          telefono: 
 *              type: string
 *              description: telefono del usuario
 *              example: '3007002250'
 *          direccion: 
 *              type: string
 *              description: direccion del usuario
 *              example: 'N/A'
 *          contrasena: 
 *              type: string
 *              description: contraseña del usuario
 *              example: '1234'
 *          idRole: 
 *              type: integer
 *              description: rol del usuario
 *              example: '2'
 * 
*/