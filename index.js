const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');

// LLamando a los controladores
const buscarEmpresas = require('./controllers/BuscarEmpresas');
const registro = require('./controllers/Registro');
const inicioSesion = require('./controllers/IniciarSesion');
const borrarEmpresa = require('./controllers/EliminarEmpresa');
const modificarEmpresa = require('./controllers/ModificarEmpresa');
const modificarPost = require('./controllers/ModificarPost');
const borrarPost = require('./controllers/EliminarPost');
const buscarBlog = require('./controllers/BuscarPosts');


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

app.get('/home-empresas', (req, res) => { buscarEmpresas.handleBuscarEmpresas(req, res, db) });

//Registro
app.post('/registro', (req, res) =>  { registro.handleRegistro(req, res, db, bcrypt) });

//Iniciar Sesion
app.post('/iniciar-sesion', (req, res) =>  { inicioSesion.handleInicioSesion(req, res, db, bcrypt) });



//------------------- Endpoints de empresas


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
app.use('/modificar-imagen-empresa/:id', upload.array('image'), async(req, res) => {
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


// Borrar empresa
app.delete('/borrar-empresa/:id', (req, res) => {borrarEmpresa.handleEliminarEmpresa(req, res, db)});


//-------------------- Endpoints Blog

//Buscar todos los Posts
app.get('/home-blog', (req, res) => {buscarBlog.handleHomeBlog(req, res, db)});

//Agregar Blog Post
app.post('/agregar-post',upload.array('image'), async(req, res) =>{
  const uploader = async (path) => await cloudinary.uploads(path, 'Tu Guia PTY');
  let safeUrl = '';
  const insert = (str, index, value) => {
    safeUrl = str.substr(0, index) + value + str.substr(index);
}
const fecha = new Date();

  const { 
    titulo,contenido 
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

               db('blog').insert({
                titulo,
                contenido, 
                fecha,
                image: safeUrl   
             }).then(res.status(200).json('post agregado'))
               // id: urls[0].id
          } else {
        res.status(405).json({
            err: "No se pudo subir la imagen"
        })
    }
  
});

//Modificar Post
app.patch('/modificar-post/:id', (req, res) => {modificarPost.handleModificarPost(req, res, db)});

//Modificar Imagen Blog
app.use('/modificar-imagen-blog/:id', upload.array('image'), async(req, res) => {
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

          db('blog').where({id: id}).update({             
            image: safeUrl
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

//Borrar Post
app.delete('/borrar-post/:id', (req, res) => {borrarPost.handleEliminarPost(req, res, db)});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`I'm alive here ${port}`))