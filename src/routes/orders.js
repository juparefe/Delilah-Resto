const express = require('express');
const router = express.Router();
const auth = require('../security/auth');
const actions = require('../database/actions');

/**
 * @swagger
 * /orders:
 *  get:
 *      tags:
 *      - Orders
 *      description: Trae todas las ordenes del sistema
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
 *              description: Todas las ordenes del sistema
 *              content:
 *                  application/json:   
 *                      schema:
 *                          type: "array"
 *                          items:
 *                              $ref: "#/components/schemas/Order"
 */
router.get('/orders', async (req, res)=> {
    let result = await actions.Select('SELECT * FROM orders', {});
    res.json(result);
});

/**
 * @swagger
 * /order/:id:
 *  get:
 *      tags:
 *      - Orders
 *      description: Trae una orden del sistema
 *      parameters:
 *         - in: header
 *           name: authorization
 *           description: Identificador unico del usuario
 *           schema:
 *             type: string
 *         - in: path
 *           name: id
 *           description: Identificador unico de la orden
 *           schema:
 *             type: string
 *      produces:
 *         - application/json
 *      responses:
 *          200:
 *              description: Una sola orden del sistema
 *              content:
 *                  application/json:   
 *                      schema:
 *                           $ref: "#/components/schemas/Order"
 */
router.get('/order/:id', async (req, res)=> {
    const result = await actions.Select('SELECT * FROM orders WHERE id = :id', { id: req.params.id });
    res.json(result);
});

/**
 * @swagger
 * /order:
 *  post:
 *      tags:
 *      - Orders
 *      description: Ingresar una orden al sistema
 *      parameters:
 *         - in: header
 *           name: authorization
 *           description: Identificador unico del usuario
 *           schema:
 *             type: string
 *         - in: body
 *           description: Informacion de la orden a registrar
 *           schema:
 *             $ref: "#/components/schemas/Order"
 *      produces:
 *         - application/json
 *      responses:
 *          200:
 *              description: Orden creada
 *              content:
 *                  application/json:   
 *                      schema:
 *                           $ref: "#/components/schemas/Order"
 */
router.post('/order', async (req, res)=> {
    const reqComplete = req.body

    const orderInfo = reqComplete.order;
    console.log(orderInfo);
    const detallesOrderInfo = reqComplete.orderDetail;
    console.log(detallesOrderInfo);

    //Crea la orden para poder tener el id
    const resultOrderInsert = await actions.Insert(`INSERT INTO orders  
    (hora, tipoPago, idUser, estado) 
    VALUES (NOW(), :tipoPago, :idUser, :estado)`, orderInfo);
    console.log("Este es el insert en la orden: ", resultOrderInsert);

    const idOrden = resultOrderInsert[0];
    console.log("Este es el id de la orden: ", idOrden);
    
    //Crea el detalle de la orden con el id de la orden
    for (const detalleOrderInfo of detallesOrderInfo) {
        const orderdetails = await actions.Insert(`INSERT INTO orderdetails  
        (idOrder, idProduct, cantidad) 
        VALUES (:idOrden, :idProducto, :cantidad)`, { idOrden, ...detalleOrderInfo});
        console.log(orderdetails);
    }

    //Hace la consulta como se necesita con nombre y total de la orden para poder actualizar despues
    const resultQueryName = await actions.Select(`
    SELECT SUM(p.valor * do.cantidad) as total,
    GROUP_CONCAT(CONCAT(do.cantidad, "x ", p.nombre)) as name 
    FROM orderdetails do
    INNER JOIN products p ON (p.idproducts = do.idProduct)
    WHERE do.idOrder = :idOrden`, { idOrden });
    console.log("Esta es la consulta del nombre y valor de la orden: ", resultQueryName);

    //Actualiza la orden
    const resultOrderUpdate = await actions.Update(`UPDATE orders 
    SET nombre = :nombre, total = :total WHERE idOrders = :idOrden`, { idOrden, nombre: resultQueryName[0].name, total: resultQueryName[0].total });

    if(resultOrderUpdate.error) {
        res.status(500).json(result.message);
    } else {
        res.json(resultOrderUpdate);
    }    
});

/**
 * @swagger
 * /order/:id:
 *  put:
 *      tags:
 *      - Orders
 *      description: Actualiza una orden del sistema
 *      parameters:
 *         - in: header
 *           name: authorization
 *           description: Identificador unico del usuario
 *           schema:
 *             type: string
 *         - in: body
 *           description: Informacion de la orden a actualizar
 *           schema:
 *             $ref: "#/components/schemas/Order"
 *      produces:
 *         - application/json
 *      responses:
 *          200:
 *              description: Orden actualizada
 *              content:
 *                  application/json:   
 *                      schema:
 *                           $ref: "#/components/schemas/Order"
 */
router.put('/order/:id', auth.authToken, auth.authRole, async (req, res)=> {
    const id = req.params.id;
    const order = req.body;
    const resultOrderUpdate = await actions.Update(`UPDATE orders 
    SET nombre = :nombre, hora = NOW(), total = :total, tipoPago = :tipoPago, 
    idUser = :idUser, estado = :estado WHERE idOrders = :id`, { id, ...order});

    if(resultOrderUpdate.error) {
        res.status(500).json(result.message);
    } else {
        res.json(resultOrderUpdate);
    }
});

/**
 * @swagger
 * /order/:id:
 *  patch:
 *      tags:
 *      - Orders
 *      description: Actualizar una orden del sistema
 *      parameters:
 *         - in: header
 *           name: authorization
 *           description: Identificador unico del usuario
 *           schema:
 *             type: string
 *         - in: body
 *           description: Informacion de la orden a actualizar
 *           schema:
 *             $ref: "#/components/schemas/User"
 *      produces:
 *         - application/json
 *      responses:
 *          200:
 *              description: Orden actualizada
 *              content:
 *                  application/json:   
 *                      schema:
 *                           $ref: "#/components/schemas/Order"
 */
 router.patch('/order/:id', auth.authToken, auth.authRole, async (req, res)=> {
    const order = req.body.estado;
    console.log("El estado que se quiere poner a la orden es: ",order);
    const id = req.params.id;
    console.log("El id de la orden a modificar es: ",id);
    if (req.roleAdmin) {
        const result = await actions.Update(`UPDATE orders SET estado = :estado WHERE idOrders = :id`, {estado: order, id});
        res.json(result);
    }else{
        res.json({
            error: 'El usuario no tiene privilegios suficientes para modificar ordenes',
            codeError: 01
        }); 
    }
});

/**
 * @swagger
 * /order/:id:
 *  delete:
 *      tags:
 *      - Orders
 *      description: Elimina una orden del sistema
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
 *              description: Orden eliminada
 *              content:
 *                  application/json:   
 *                      schema:
 *                           $ref: "#/components/schemas/Order"
 */
router.delete('/order/:id', auth.authToken, auth.authRole, async (req, res)=> {
    const id = req.params.id;
    await actions.Delete(`DELETE FROM orders WHERE idOrders = :id`,{id});
    res.send(`Se elimino correctamente la orden con el Id: ${id}`);
});

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *      Order:
 *        type: object
 *        properties:  
 *          idOrders: 
 *              type: integer
 *              description: Id de la orden
 *              example: 1  
 *          nombre: 
 *              type: string
 *              description: Nombre de la orden
 *              example: '4xHamburguesa,2xEnsalada Cesar,3xSandwich'
 *          hora: 
 *              type: string
 *              description: Hora de la orden
 *              example: '07:05:00'
 *          total: 
 *              type: number
 *              description: Total de la orden
 *              example: '20000'
 *          tipoPago: 
 *              type: integer
 *              description: Tipo de pago de la orden
 *              example: '1'
 *          idUser: 
 *              type: integer
 *              description: Id del usuario
 *              example: '2'
 *          estado: 
 *              type: integer
 *              description: Estado de la orden
 *              example: '1'
*/