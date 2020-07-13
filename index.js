const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');

// LLamando a los controladores
const home = require('./controllers/Home');
const registro = require('./controllers/Registro');
const inicioSesion = require('./controllers/IniciarSesion');
const borrarEmpresa = require('./controllers/EliminarEmpresa');
const modificarEmpresa = require('./controllers/ModificarEmpresa');



// Llamando a Uploads y Cloudinary
const upload = require('./controllers/ImageUploader/multer');
const cloudinary = require('./controllers/ImageUploader/Cloudinary');

// Creando conexion a la base de datos
const db = knex({
    client: 'mysql',
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      port: 3306,
      database: process.env.DATABASE
    }
  });

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

//Inicio de endpoints

app.get('/', (req, res) => {res.json('estoy vivo!')});

app.get('/home', (req, res) => { home.handleHome(req, res, db) });

//Registro
app.post('/registro', (req, res) =>  { registro.handleRegistro(req, res, db, bcrypt) });

//Iniciar Sesion
app.post('/iniciar-sesion', (req, res) =>  { inicioSesion.handleInicioSesion(req, res, db, bcrypt) });


// Borrar empresa
app.delete('/borrar-empresa/:id', (req, res) => {borrarEmpresa.handleEliminarEmpresa(req, res, db)});



//Agregar Empresa
app.use('/agregar-empresa', upload.array('image'), async(req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, 'Tu Guia PTY');
  let safeUrl = '';
  const insert = (str, index, value) => {
    safeUrl = str.substr(0, index) + value + str.substr(index);
}


  const { 
    categoria, nombre, descripcion,
    direccion, telefono, email, website 
      } = req.body;

      if (req.method === 'POST') {
        const urls = [];
        const files = req.files;
  
        for(const file of files) {
            const { path } = file;
  
            const newPath = await uploader(path);
  
            urls.push(newPath);
  
            fs.unlinkSync(path);
        
            };
            const unsafeUrl = urls[0].url;
            insert(unsafeUrl, 4, 's');

               db('empresas').insert({
                categoria,             
                nombre,
                descripcion,
                direccion,
                telefono,
                email, 
                website,   
                imagen: safeUrl   
             }).then(res.status(200).json('producto agregado'))
               // id: urls[0].id
          } else {
        res.status(405).json({
            err: "No se pudo subir la imagen"
        })
    }
  
  
})


//Empresa solo si no se tienen las imageenes
app.post('/empresa', (req, res) => {
  const{
      categoria, nombre, descripcion,
      direccion, telefono, email, website 
        } = req.body;

        db('empresas').insert({
          categoria,             
          nombre,
          descripcion,
          direccion,
          telefono,
          email, 
          website 
       })
       .then(res.status(200).json('empresa agregada'))
       .catch(err => res.status(400).json(err));
  
})



//Modificar empresa 
app.patch('/modificar-empresa/:id', (req, res) => {modificarEmpresa.handleModificarEmpresa(req, res, db)});


//Modificar imagen Producto
app.use('/modificar-imagen/:id', upload.array('image'), async(req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, 'Tu Guia PTY');
  let safeUrl = '';
  const insert = (str, index, value) => {
    safeUrl = str.substr(0, index) + value + str.substr(index);
}
const { id } = req.params;
if (req.method === 'PATCH') {
    const urls = [];
    const files = req.files;

    for(const file of files) {
        const { path } = file;

        const newPath = await uploader(path);

        urls.push(newPath);

        fs.unlinkSync(path);
    
        };
        const unsafeUrl = urls[0].url;
        insert(unsafeUrl, 4, 's');

          db('empresas').where({id: id}).update({             
            imagen: safeUrl
           // id: urls[0].id

        })
           .then(console.log)           
        
    res.status(200).json('exito');
} else {
    res.status(405).json({
        err: "No se pudo subir la imagen"
    })
}

})



const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`I'm alive here ${port}`))