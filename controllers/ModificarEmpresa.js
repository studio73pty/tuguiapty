const handleModificarEmpresa = (req, res, db) =>{
    const { id } = req.params;
    const{
        categoria, nombre, descripcion,
        direccion, telefono, email, website 
          } = req.body;

               db('empresas').where({ id: id }).update({     
                categoria,             
                nombre,
                descripcion,
                direccion,
                telefono,
                email, 
                website 
             }).then(res.status(200).json('producto actualizado'))
          
            //  .catch(err => res.status(400).json(err));

         }
 module.exports = {
     handleModificarEmpresa: handleModificarEmpresa
 }