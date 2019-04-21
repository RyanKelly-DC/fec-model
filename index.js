const rread = require('readdir-recursive'),
    path = require('path'),
    Sequelize = require('sequelize'),
    sync = require('./sync');

module.exports = function (options) {
    let basename = path.basename(module.filename + '/model');

    let sequelize = new Sequelize(options.name, options.user, options.pass,{
        host: options.host,
        dialect: options.driver,
        port: options.port,
        define: {
            createdAt: 'created_date',
            updatedAt: 'updated_date',
            underscored: true,
            timestamps: false
        },
        logging: false
    });

    let db = {};

    rread
        .fileSync(__dirname + '/model')
        .filter(file => {
            file = path.basename(file);
            return (file.slice(-3) === '.js') && (file !== basename);
        })
        .forEach(file => {
            let model = sequelize['import'](file);
            db[model.name] = model;
        });

    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    db.sync = sync.bind(this,options);

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    return db;
};
