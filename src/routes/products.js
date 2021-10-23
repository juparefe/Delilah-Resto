const express = require('express');
const router = express.Router();
const actions = require('../database/actions');
const auth = require('../security/auth');

/**
 * @swagger
 * /products:
 *  get:
 *      tags:
 *      - Products
 *      description: Trae todos los productos del sistema
 *      produces:
 *         - application/json
 *      responses:
 *          200:
 *              description: Todos los productos del sistema
 *              content:
 *                  application/json:   
 *                      schema:
 *                          type: "array"
 *                          items:
 *                              $ref: "#/components/schemas/Product"
 */
router.get('/products', auth.authToken, async (req, res)=> {
    let result = await actions.Select('SELECT * FROM products', {});
    res.json(result);
});

/**
 * @swagger
 * /product/:id:
 *  get:
 *      tags:
 *      - Products
 *      description: Trae un producto del sistema
 *      parameters:
 *         - in: header
 *           name: authorization
 *           description: Identificador unico del usuario
 *           schema:
 *             type: string
 *         - in: path
 *           name: id
 *           description: Identificador unico del producto
 *           schema:
 *             type: string
 *      produces:
 *         - application/json
 *      responses:
 *          200:
 *              description: Un solo producto del sistema
 *              content:
 *                  application/json:   
 *                      schema:
 *                           $ref: "#/components/schemas/Product"
 */
router.get('/product/:id', auth.authToken, async (req, res)=> {
    const result = await actions.Select('SELECT * FROM products WHERE idproducts = :id', { id: req.params.id });
    res.json(result);
});

/**
 * @swagger
 * /product:
 *  post:
 *      tags:
 *      - Products
 *      description: Ingresar un producto al sistema
 *      parameters:
 *         - in: header
 *           name: authorization
 *           description: Identificador unico del usuario
 *           schema:
 *             type: string
 *         - in: body
 *           description: Informacion del producto a registrar
 *           schema:
 *             $ref: "#/components/schemas/Product"
 *      produces:
 *         - application/json
 *      responses:
 *          200:
 *              description: Producto creado
 *              content:
 *                  application/json:   
 *                      schema:
 *                           $ref: "#/components/schemas/Product"
 */
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

/**
 * @swagger
 * /product/:id:
 *  put:
 *      tags:
 *      - Products
 *      description: Actualiza un producto del sistema
 *      parameters:
 *         - in: header
 *           name: authorization
 *           description: Identificador unico del usuario
 *           schema:
 *             type: string
 *         - in: body
 *           description: Informacion del producto a actualizar
 *           schema:
 *             $ref: "#/components/schemas/Product"
 *      produces:
 *         - application/json
 *      responses:
 *          200:
 *              description: Producto actualizado
 *              content:
 *                  application/json:   
 *                      schema:
 *                           $ref: "#/components/schemas/Product"
 */
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

/**
 * @swagger
 * /product/:id:
 *  delete:
 *      tags:
 *      - Products
 *      description: Elimina un producto del sistema
 *      parameters:
 *         - in: header
 *           name: authorization
 *           description: Identificador unico del usuario
 *           schema:
 *             type: string
 *      produces:
 *         - application/json
 *      responses:
 *          200:
 *              description: Producto eliminado
 *              content:
 *                  application/json:   
 *                      schema:
 *                           $ref: "#/components/schemas/Product"
 */
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
 *      Product:
 *        type: object
 *        properties:  
 *          id: 
 *              type: integer
 *              description: id del producto
 *              example: 1  
 *          nombre: 
 *              type: string
 *              description: Nombre del producto
 *              example: 'Hamburguesa'
 *          valor: 
 *              type: number
 *              description: Valor del producto
 *              example: '7000'
 *          foto: 
 *              type: string
 *              description: Foto del producto
 *              example: 'https://cdn.computerhoy.com/sites/navi.axelspringer.es/public/styles/1200/public/media/image/2020/08/hamburguesa-2028707.jpg?itok=ujl3qgM9'
*/