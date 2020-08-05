const handleBuscarPost = (req, res, db) => {
    const { id } = req.params;
    db.select('*').from('blog').where({
        id: id
    }).then(post => {
        if(post.length){
            res.json(post[0])
        }else{
            res.status(400).json('post no encontrado')
        }
    })
    .catch(err => res.status(400).json('error buscando post'))

}

module.exports = {
    handleBuscarPost
}