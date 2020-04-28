const router = app => {
    app.use('/user',require('./controller/UserController'))
}

module.exports = router;
      
