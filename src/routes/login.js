const express = require('express');
const auth = require('../security/auth');
const actions = require('../database/actions');

const router = express.Router();

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