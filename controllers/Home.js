const handleHome = (req, res, db) => {
    db.select().table('empresas')
    .then(response => {
        res.json(response);
    })
    .catch(err => res.status(400).json(err));
}

module.exports = {
    handleHome: handleHome
}