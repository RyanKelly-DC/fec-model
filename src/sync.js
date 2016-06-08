var fs = require('fs');

function syncModels(cb) {
    var models = require('../models');

    console.info('syncing models to database');
    models.sequelize.sync()
        .then(function () {

            console.info('creating amended filing view if it doesn\'t exist');
            models.sequelize.query(fs.readFileSync(__dirname + '/../model/amended_filing.sql','utf8'))
                .catch(function (err) {
                    if (err.name !== 'SequelizeDatabaseError') {
                        cb(err);
                    }
                    else {
                        cb();
                    }
                })
                .then(function () {
                    cb();
                });
        });
}

function createDatabase(options,cb) {
    if (options.driver == 'postgres') {
        // try to create database first if dialect is postgres
        
        var pg = require('pg');

        var conString = 'postgres://' + options.user + ':' + options.pass +
                        '@' + options.host + ':' + options.port +'/postgres';

        console.info('connecting to database server');
        pg.connect(conString, function(err, client, done) {
            console.info('creating database if it doesn\'t exist');
            client.query('CREATE DATABASE ' + options.name, function(err) {
                client.end();

                cb();
            });
        });
    }
    else {
        cb();
    }
}

module.exports = function (options,cb) {
    createDatabase(syncModels.bind(this,cb));
};
