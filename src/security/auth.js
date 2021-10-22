const jwt = require('jsonwebtoken');
const actions = require('../database/actions');

const firma = 'Firma_para_proyecto';

module.exports.generateToken = (data) => {
    return jwt.sign(data, firma);
}

module.exports.authToken = (req, res, next) => {
    try {
       const token = req.headers.authorization.split(' ')[1];
       const tokenVerificado = jwt.verify(token, firma);
       if(tokenVerificado) {
        req.user = tokenVerificado;
        console.log(req.user);
        console.log("El token esta verificado y continua");
        return next();
       }
    } catch (error) {
        res.json({
            error: 'El usuario que esta intentando ingresar no tiene privilegios suficientes',
            codeError: 01
        })
    }
};

module.exports.authUser = (req, res, next) => {
    try {
       const user = req.body;
       const email = validateEmail(user.email);
       const phone = validateNumber(user.telefono);
       if(!phone) {
           console.log("Telefono no valido: ", phone);
           throw "El telefono ingresado no es valido" 
        }
       else if(!email) {throw "El email ingresado no es valido"} 
       return next();
    } catch (error) {
        res.json({
            error: 'El dato que esta intentando ingresar no valido',
            codeError: 02
        })
    }
};

function validateEmail(email) {
    let result = false;
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i.test(email)) {
        result = true;
    }
    return result;
}

function validateNumber(number) {
    let result = false;
    if (/^(\(\+?\d{2,3}\)[\*|\s|\-|\.]?(([\d][\*|\s|\-|\.]?){6})(([\d][\s|\-|\.]?){2})?|(\+?[\d][\s|\-|\.]?){8}(([\d][\s|\-|\.]?){2}(([\d][\s|\-|\.]?){2})?)?)$/i.test(number)) {
        result = true;
    }
    return result;
}

module.exports.authRole = async (req, res, next) => {
    try {
       const username = req.user.userName;
       console.log(username);
       const result = await actions.Select(`SELECT * FROM users WHERE nombreUsuario = :nombreUsuario`, { nombreUsuario: username });
       console.log("Hace el Select y continua");
       console.log(result);
       const roleAdmin = result[0].idRole === 1 ? true:false;
       req.roleAdmin = roleAdmin;
       req.userId = result[0].id;
       return next();
    } catch (error) {
        res.json({
            error: 'El usuario no tiene un rol valido',
            codeError: 03
        })
    }
};
