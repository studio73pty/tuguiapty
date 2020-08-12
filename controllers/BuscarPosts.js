const handleHomeBlog = (req, res, db) => {
    db.select().table('blog')
    .then(response => {
            response.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(a.fecha) - new Date(b.fecha);
          });
        res.json(response);
    })
    .catch(err => res.status(400).json(err));
}

module.exports = {
    handleHomeBlog: handleHomeBlog
}