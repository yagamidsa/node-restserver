///============================================
///puerto
///========================================


process.env.PORT = process.env.PORT || 3000;




///============================================
///Entorno
///============================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


///============================================
///Vencimiento token
///============================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;



///============================================
///SEED de autenticacion
///============================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


///============================================
///Entorno
///============================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://yagamidsa:Lxc19dXlsi4QpvKs@cafe-zscnd.mongodb.net/cafe?retryWrites=true&w=majority';
}

process.env.URLDB = urlDB;


///============================================
///google Client ID
///============================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '939300670695-mibij51k21n4nsnhpb7dv889i47jkeil.apps.googleusercontent.com';