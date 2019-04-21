const moment = require('moment'),
      Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    class PaperFiling extends Sequelize.Model {}

    PaperFiling.init({
        filing_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        record_type: DataTypes.STRING(100),
        fec_version: DataTypes.STRING(100),
        soft_name: DataTypes.STRING(255),
        batch_number: DataTypes.STRING(100),
        received_date: {
            type: DataTypes.DATEONLY,
            set: function(val) {
                if (val && !(val instanceof Date) && val.toString().match(/^[0-9]{8}$/)) {
                    var m = moment(val, 'YYYYMMDD');
                    if (m.isValid()) {
                        this.setDataValue('received_date', m.toDate());
                    }
                    else {
                        this.setDataValue('received_date', null);
                    }
                } else {
                    this.setDataValue('received_date', val);
                }
            }
        },
        report_id: {
            type: DataTypes.INTEGER,
            set: function(val) {
                if (val) {
                    this.setDataValue('report_id', parseInt(val.replace('FEC-','')));
                }
                else {
                    this.setDataValue('report_id', val);
                }
            }
        }
    }, {
        sequelize,
        modelName: 'fec_paper_filing',
        timestamps: true,
        indexes: [{
            fields: ['report_id']
        }]
    });

    PaperFiling.match = row =>
        row.record_type && row.record_type == 'HDR' && row.fec_version[0] == 'P';

    return PaperFiling;
};
