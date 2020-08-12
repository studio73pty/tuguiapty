const handleModificarPost = (req, res, db) =>{
    const { id } = req.params;
    const{
        titulo,
        intro,
        contenido 
          } = req.body;

               db('blog').where({ id: id }).update({     
                titulo,
                intro,
                contenido
             }).then(res.status(200).json('post actualizado'))
          
            //  .catch(err => res.status(400).json(err));

         }
 module.exports = {
     handleModificarPost: handleModificarPost
 }