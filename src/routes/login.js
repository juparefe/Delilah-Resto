const express = require('express');
const auth = require('../security/auth');
const actions = require('../database/actions');

const router = express.Router();

/**
 * @swagger
 * /login:
 *  post:
 *      tags:
 *      - Login
 *      description: Ingresar como usuario al sistema
 *      parameters:
 *         - in: body
 *           description: Nombre de usuario y contraseña a ingresar
 *           schema:
 *             $ref: "#/components/schemas/Login"
 *      produces:
 *         - application/json
 *      responses:
 *          200:
 *              description: El usuario ha ingresado correctamente
 *              content:
 *                  application/json:   
 *                      schema:
 *                           $ref: "#/components/schemas/Login"
 */
router.post('/login', async (req, res)=> {
    const params = req.body;
    const user = {
        username: params.username,
        password: params.password
    };    
    const result = await actions.Select(`SELECT COUNT(*) as count 
    FROM users
    WHERE nombreUsuario = :username AND contrasena = :password`, user);

    if(result && Array.isArray(result) && result.length > 0) {
        if(result[0].count == 1) {
            let token = auth.generateToken({userName: user.username});
            console.log(`El usuario se encontro y se genero el Token: ${token}`)
            res.json(token);
        }else {
            res.status(404).json('Usuario no encontrado');
        }
    }else{
        res.status(404).json('Usuario no encontrado');
    }   
});

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *      Login:
 *        type: object
 *        properties:  
 *          nombreUsuario: 
 *              type: string
 *              description: Nombre del usuario
 *              example: 'Jrendon'
 *          contrasena: 
 *              type: string
 *              description: Contraseña del usuario
 *              example: '1234'
*/