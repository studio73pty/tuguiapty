const handleEliminarPost = (req, res, db) => {
    const { id } = req.params;
    db('blog').where({ id: id})
    .del()
    .then(res.json('borrado exitoso!'))
    if(err){
         res.status(400).json(err);
    }
}


module.exports = {
    handleEliminarPost: handleEliminarPost
}