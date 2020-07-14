const handleHomeBlog = (req, res, db) => {
    db.select().table('blog')
    .then(response => {
        res.json(response);
    })
    .catch(err => res.status(400).json(err));
}

module.exports = {
    handleHomeBlog: handleHomeBlog
}