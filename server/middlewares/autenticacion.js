const jwt = require('jsonwebtoken');



///++++++++========================================
/// verificar token
//+++++++++++++++++++++++++++++++++++++++++++++++++


let verificatoken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decode.usuario;
        next();
    });

};

///++++++++========================================
/// verifica admin role
//+++++++++++++++++++++++++++++++++++++++++++++++++


let verificaadminrole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {

        next();

    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });

    }

};



///++++++++========================================
/// verifica tokenimagen
//+++++++++++++++++++++++++++++++++++++++++++++++++


let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decode.usuario;
        next();
    });


}


module.exports = {
    verificatoken,
    verificaadminrole,
    verificaTokenImg
}