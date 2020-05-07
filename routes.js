const router = app => {
    app.use('/user',require('./controller/UserController'))
    app.use('/production',require('./controller/ProductionController'))
    app.use('/producer',require('./controller/ProducerController'))
    app.use('/import',require('./controller/ImportController'))
    app.use('/export',require('./controller/ExportController'))
    app.use('/statistic',require('./controller/StatisticController'))
}

module.exports = router;
