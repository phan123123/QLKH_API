const router = app => {
    app.use('/user',require('./controller/UserController'))
    app.use('/production',require('./controller/ProductionController'))
}

module.exports = router;
