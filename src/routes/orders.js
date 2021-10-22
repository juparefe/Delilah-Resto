const express = require('express');
const router = express.Router();
const auth = require('../security/auth');
const actions = require('../database/actions');

router.get('/orders', async (req, res)=> {
    let result = await actions.Select('SELECT * FROM orders', {});
    res.json(result);
});

router.get('/order/:id', async (req, res)=> {
    const result = await actions.Select('SELECT * FROM orders WHERE id = :id', { id: req.params.id });
    res.json(result);
});

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