const handleBuscarPorCat = (req, res, db) =>{
    const { categoria } = req.body;

    db.select().table('empresas')
    .where({ categoria })
    .then(response => {
        res.json(response);
    })
    .catch(err => res.status(400).json(err));
}

module.exports = {
    handleBuscarPorCat
}