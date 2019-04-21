const fs = require('fs');

function syncModels(options,cb) {
    let models = require('./index')(options);

    console.info('syncing models to database');
    models.sequelize.sync()
        .then(function () {

            console.info('creating amended filing view if it doesn\'t exist');
            models.sequelize.query(fs.readFileSync(__dirname + '/model/amended_filing.sql','utf8'))
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


function createExtension(options,cb) {
    const { Client } = require('pg');
    
    const client = new Client({
        ...options,
        password: options.pass || process.env.PGPASSWORD,
        database: options.name || process.env.PGDATABASE || process.env.USER
    });

    console.info('connecting to database server');
    client.connect();

    console.info('creating pg_trgm extension if it doesn\'t exist');
    client.query('CREATE EXTENSION pg_trgm;', function(err) {
        client.end();

        cb();
    });
}

function createDatabase(options,cb) {
    if (options.driver == 'postgres') {
        // try to create database first if dialect is postgres
        
        const { Client } = require('pg');

        const client = new Client({
            ...options,
            password: options.pass || process.env.PGPASSWORD,
            database: 'postgres'
        });

        console.info('connecting to database server');
        client.connect();

        console.info('creating database if it doesn\'t exist');
        client.query('CREATE DATABASE ' + options.name, function(err) {
            client.end();

            createExtension(options,cb);
        });
    }
    else {
        cb();
    }
}

module.exports = function (options,cb) {
    createDatabase(options,syncModels.bind(this,options,cb));
};
