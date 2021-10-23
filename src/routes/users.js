const express = require('express');
const auth = require('../security/auth');
const actions = require('../database/actions');

const router = express.Router();

/**
 * @swagger
 * /users:
 *  get:
 *      tags:
 *      - Users
 *      description: Trae todos los usuarios del sistema
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
 *              description: Todos los usuarios del sistema
 *              content:
 *                  application/json:   
 *                      schema:
 *                          type: "array"
 *                          items:
 *                              $ref: "#/components/schemas/User"
 */
router.get('/users', auth.authToken, auth.authRole, async (req, res)=> {
    let result;
    if(req.roleAdmin){
        result = await actions.Select('SELECT * FROM users', {});
    }else{
        result = await actions.Select('SELECT * FROM users WHERE nombreUsuario = :userName', {userName: req.user.userName});
    }
    res.json(result);
});

/**
 * @swagger
 * /user/:id:
 *  get:
 *      tags:
 *      - Users
 *      description: Trae un usuario del sistema
 *      parameters:
 *         - in: header
 *           name: token
 *           description: Identificador unico del usuario
 *           schema:
 *             type: string
 *         - in: path
 *           name: id
 *           description: Identificador unico del usuario
 *           schema:
 *             type: string
 *      produces:
 *         - application/json
 *      responses:
 *          200:
 *              description: Un usuario del sistema
 *              content:
 *                  application/json:   
 *                      schema:
 *                           $ref: "#/components/schemas/User"
 */
router.get('/user/:id', auth.authToken, auth.authRole, async (req, res)=> {
    let result;
    if (req.roleAdmin) {
        result = await actions.Select('SELECT * FROM users WHERE idusers = :id', { id: req.params.id });
        res.json(result); 
    } else {
        res.json({
            error: 'El usuario no tiene privilegios suficientes para buscar otros usuarios',
            codeError: 01
        }); 
    }
    
    
});

/**
 * @swagger
 * /user:
 *  post:
 *      tags:
 *      - Users
 *      description: Ingresar un usuario al sistema
 *      parameters:
 *         - in: header
 *           name: authorization
 *           description: Identificador unico del usuario
 *           schema:
 *             type: string
 *         - in: body
 *           description: Informacion del usuario a registrar
 *           schema:
 *             $ref: "#/components/schemas/User"
 *      produces:
 *         - application/json
 *      responses:
 *          200:
 *              description: Usuario creado
 *              content:
 *                  application/json:   
 *                      schema:
 *                           $ref: "#/components/schemas/User"
 */
router.post('/user', auth.authUser, async (req, res)=> {
    const user = req.body;
    user.idRole = 2;
    let result;
    user.username = user.username.toLowerCase();
    result = await actions.Insert(`INSERT INTO users (nombreUsuario, nombreCompleto, email, 
    telefono, direccion, contrasena, idRole) 
    VALUES (:username, :nombreCompleto, :email, :telefono, :direccion, :contrasena, :idRole)`, user);
    if(result.error) {
        res.status(500).json(result.message);
    } else {
        res.json(result);
    }    
});

/**
 * @swagger
 * /user/:id:
 *  put:
 *      tags:
 *      - Users
 *      description: Actualiza un usuario del sistema
 *      parameters:
 *         - in: header
 *           name: authorization
 *           description: Identificador unico del usuario
 *           schema:
 *             type: string
 *         - in: body
 *           description: Informacion del usuario a actualizar
 *           schema:
 *             $ref: "#/components/schemas/User"
 *      produces:
 *         - application/json
 *      responses:
 *          200:
 *              description: Usuario actualizado
 *              content:
 *                  application/json:   
 *                      schema:
 *                           $ref: "#/components/schemas/User"
 */
router.put('/user/:id', auth.authToken, auth.authRole, async (req, res)=> {
    const user = req.body;
    console.log("El rol es: ",user);
    const id = req.params.id;
    console.log("El id es: ",id);
    if (req.roleAdmin) {
        const result = await actions.Update(`UPDATE users 
        SET nombreUsuario = :nombreUsuario, nombreCompleto = :nombreCompleto, 
        email = :email, telefono = :telefono, direccion = :direccion, idRole = :idRole 
        WHERE idusers = :id`, { id, ...user});    
        res.json(result);
    }else{
        res.json({
            error: 'El usuario no tiene privilegios suficientes para modificar usuarios',
            codeError: 01
        }); 
    }
});

/**
 * @swagger
 * /user/:id:
 *  patch:
 *      tags:
 *      - Users
 *      description: Actualiza un usuario del sistema
 *      parameters:
 *         - in: header
 *           name: authorization
 *           description: Identificador unico del usuario
 *           schema:
 *             type: string
 *         - in: body
 *           description: Informacion del usuario a actualizar
 *           schema:
 *             $ref: "#/components/schemas/User"
 *      produces:
 *         - application/json
 *      responses:
 *          200:
 *              description: Usuario actualizado
 *              content:
 *                  application/json:   
 *                      schema:
 *                           $ref: "#/components/schemas/User"
 */
router.patch('/user/:id', auth.authToken, auth.authRole, async (req, res)=> {
    const user = req.body.idRole;
    console.log("El rol que se quiere poner al usuario es: ",user);
    const id = req.params.id;
    console.log("El id del usuario a modificar es: ",id);
    if (req.roleAdmin) {
        const result = await actions.Update(`UPDATE users SET idRole = :idRole WHERE idusers = :id`, {idRole: user, id});
        res.json(result);
    }else{
        res.json({
            error: 'El usuario no tiene privilegios suficientes para modificar usuarios',
            codeError: 01
        }); 
    }
});

/**
 * @swagger
 * /user/:id:
 *  delete:
 *      tags:
 *      - Users
 *      description: Elimina un usuario del sistema
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
 *              description: Usuario Eliminado
 *              content:
 *                  application/json:   
 *                      schema:
 *                           $ref: "#/components/schemas/User"
 */
router.delete('/user/:id', auth.authToken, auth.authRole, async (req, res)=> {
    const id = req.params.id;
    if (req.roleAdmin) {
        await actions.Delete(`DELETE FROM users WHERE idusers = :id`,{id});
        res.send(`Se elimino correctamente el usuario con el Id: ${id}`);
    } else {
        res.json({
            error: 'El usuario no tiene privilegios suficientes para eliminar usuarios',
            codeError: 01
        }); 
    }
});

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *      User:
 *        type: object
 *        properties:  
 *          id: 
 *              type: integer
 *              description: Id del usuario
 *              example: 1  
 *          nombreUsuario: 
 *              type: string
 *              description: Nombre del usuario
 *              example: 'Jrendon'
 *          nombreCompleto: 
 *              type: string
 *              description: Nombre completo del usuario
 *              example: 'Juan Rendon'
 *          email: 
 *              type: string
 *              description: email del usuario
 *              example: 'email@gmail.com'
 *          telefono: 
 *              type: string
 *              description: Telefono del usuario
 *              example: '3006002050'
 *          direccion: 
 *              type: string
 *              description: Direccion del usuario
 *              example: 'N/A'
 *          contrasena: 
 *              type: string
 *              description: Contraseña del usuario
 *              example: '1234'
 *          idRole: 
 *              type: integer
 *              description: Rol del usuario
 *              example: '2'
 * 
*/