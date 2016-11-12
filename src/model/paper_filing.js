var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
    var Filing = sequelize.define('fec_paper_filing', {
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
        timestamps: true,
        classMethods: {
            match: function (row) {
                if (row.record_type && row.record_type == 'HDR' && row.fec_version[0] == 'P') {
                    return true;
                }
                return false;
            }
        },
        indexes: [{
            fields: ['report_id']
        }]
    });

    return Filing;
};
