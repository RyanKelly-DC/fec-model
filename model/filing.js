const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    class Filing extends Sequelize.Model {}

    Filing.init({
        filing_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        record_type: DataTypes.STRING(100),
        ef_type: DataTypes.STRING(100),
        fec_version: DataTypes.STRING(100),
        soft_name: DataTypes.STRING(255),
        soft_ver: DataTypes.STRING(100),
        report_id: {
            type: DataTypes.INTEGER,
            set: function(val) {
                if (val) {
                    this.setDataValue('report_id', parseInt(val.replace('FEC-','').replace('SEN-','')));
                }
                else {
                    this.setDataValue('report_id', val);
                }
            }
        },
        report_number: DataTypes.INTEGER,
        comment: DataTypes.STRING(255)
    }, {
        sequelize,
        modelName: 'fec_filing',
        timestamps: true,
        indexes: [{
            fields: ['report_id']
        },{
            fields: ['report_number']
        }]
    });

    Filing.match = row => 
        row.record_type && row.record_type == 'HDR';

    return Filing;
};
