var rread = require('readdir-recursive'),
    path = require('path'),
    Sequelize = require('sequelize'),
    sync = require('./sync');

module.exports = function (options) {
    var basename = path.basename(module.filename);

    var sequelize = new Sequelize(options.name, options.user, options.pass,{
        host: options.host,
        dialect: options.driver,
        port: options.port,
        define: {
            createdAt: 'created_date',
            updatedAt: 'updated_date',
            underscored: true
        },
        logging: false
    });

    var db = {};

    rread
        .fileSync(__dirname)
        .filter(function(file) {
            file = path.basename(file);
            return (file.slice(-3) === '.js') && (file.indexOf('.') !== 0) && (file !== basename);
        })
        .forEach(function(file) {
            var model = sequelize['import'](file);
            db[model.name] = model;
        });

    Object.keys(db).forEach(function(modelName) {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    db.sync = sync;

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    return db;
};
