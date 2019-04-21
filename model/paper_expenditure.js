const moment = require('moment'),
      Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    class PaperExpenditure extends Sequelize.Model {}

    PaperExpenditure.init({
        filing_id: DataTypes.INTEGER,
        form_type: DataTypes.STRING(20),
        filer_committee_id_number: DataTypes.STRING(30),
        payee_organization_name: DataTypes.STRING(255),
        payee_last_name: DataTypes.STRING(255),
        payee_first_name: DataTypes.STRING(255),
        payee_middle_name: DataTypes.STRING(255),
        payee_prefix: DataTypes.STRING(10),
        payee_suffix: DataTypes.STRING(10),
        payee_street_1: DataTypes.STRING(255),
        payee_street_2: DataTypes.STRING(255),
        payee_city: DataTypes.STRING(100),
        payee_state: DataTypes.STRING(30),
        payee_zip_code: DataTypes.STRING(50),
        election_code: DataTypes.STRING(30),
        election_other_description: DataTypes.STRING(255),
        expenditure_date: {
            type: DataTypes.DATEONLY,
            set: function(val) {
                if (val && !(val instanceof Date) && val.match(/^[0-9]{8}$/)) {
                    var m = moment(val, 'YYYYMMDD');
                    if (m.isValid()) {
                        this.setDataValue('expenditure_date', m.toDate());
                    }
                    else {
                        this.setDataValue('expenditure_date', null);
                    }
                }
                else {
                    this.setDataValue('expenditure_date', val);
                }
            }
        },
        expenditure_amount: DataTypes.DECIMAL(12,2),
        semi_annual_refunded_bundled_amt: DataTypes.STRING(50),
        expenditure_purpose_descrip: DataTypes.STRING(255),
        category_code: DataTypes.STRING(10),
        beneficiary_committee_name: DataTypes.STRING(255),
        beneficiary_candidate_last_name: DataTypes.STRING(100),
        beneficiary_candidate_first_name: DataTypes.STRING(100),
        beneficiary_candidate_middle_name: DataTypes.STRING(100),
        beneficiary_candidate_prefix: DataTypes.STRING(10),
        beneficiary_candidate_office: DataTypes.STRING(50),
        beneficiary_candidate_suffix: DataTypes.STRING(10),
        beneficiary_candidate_state: DataTypes.STRING(10),
        beneficiary_candidate_district: DataTypes.STRING(10),
        memo_code: DataTypes.STRING(5),
        memo_text_description: DataTypes.STRING(200),
        image_number: DataTypes.STRING(200)
    },{
        sequelize,
        modelName: 'fec_paper_expenditure',
        indexes: [{
            fields: ['filing_id']
        },{
            fields: ['filer_committee_id_number']
        }, {
            fields: ['memo_code']
        }, {
            fields: ['form_type']
        }, {
            name: 'fec_paper_expenditures_payee_organization_name',
            fields: sequelize.getDialect() == 'postgres' ?
                [sequelize.fn('to_tsvector', 'english', sequelize.col('payee_organization_name') )] :
                'payee_organization_name',
            using: sequelize.getDialect() == 'postgres' ?
                'gin' : null
        }, {
            name: 'fec_paper_expenditures_payee_payee_first_name',
            fields: sequelize.getDialect() == 'postgres' ?
                [sequelize.fn('lower', sequelize.col('payee_first_name') )] :
                'payee_first_name'
        }, {
            name: 'fec_paper_expenditures_payee_payee_last_name',
            fields: sequelize.getDialect() == 'postgres' ?
                [sequelize.fn('lower', sequelize.col('payee_last_name') )] :
                'payee_last_name'
        }, {
            name: 'fec_paper_expenditures_payee_payee_state',
            fields: sequelize.getDialect() == 'postgres' ?
                [sequelize.fn('lower', sequelize.col('payee_state') )] :
                'payee_state'
        }]
    });

    PaperExpenditure.associate = models => 
        PaperExpenditure.belongsTo(models.fec_paper_filing,{
            as: 'Filing',
            foreignKey: 'filing_id',
            onDelete: 'CASCADE'
        });

    PaperExpenditure.match = row => 
        row.form_type && row.form_type.match(/^SB/) && row.image_number;

    return PaperExpenditure;
};
