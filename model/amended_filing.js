const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    class AmendedFiling extends Sequelize.Model {}

    AmendedFiling.init({
        filing_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        report_id: DataTypes.INTEGER,
        report_number: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'fec_amended_filing',
        timestamps: false,
        underscored: true
    });

    return AmendedFiling;
};
