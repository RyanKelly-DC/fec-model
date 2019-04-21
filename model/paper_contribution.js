const moment = require('moment'),
      Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    class PaperContribution extends Sequelize.Model {}

    PaperContribution.init({
        filing_id: DataTypes.INTEGER,
        form_type: DataTypes.STRING(50),
        filer_committee_id_number: DataTypes.STRING(50),
        contributor_organization_name: DataTypes.STRING(255),
        contributor_last_name: DataTypes.STRING(255),
        contributor_first_name: DataTypes.STRING(255),
        contributor_middle_name: DataTypes.STRING(255),
        contributor_prefix: DataTypes.STRING(20),
        contributor_suffix: DataTypes.STRING(20),
        contributor_street_1: DataTypes.STRING(255),
        contributor_street_2: DataTypes.STRING(255),
        contributor_city: DataTypes.STRING(100),
        contributor_state: DataTypes.STRING(30),
        contributor_zip_code: DataTypes.STRING(30),
        election_code: DataTypes.STRING(30),
        election_other_description: DataTypes.STRING(255),
        contribution_date: {
            type: DataTypes.DATEONLY,
            set: function(val) {
                if (val && !(val instanceof Date) && val.match(/^[0-9]{8}$/)) {
                    var m = moment(val, 'YYYYMMDD');
                    if (m.isValid()) {
                        this.setDataValue('contribution_date', m.toDate());
                    }
                    else {
                        this.setDataValue('contribution_date', null);
                    }
                } else {
                    this.setDataValue('contribution_date', val);
                }
            }
        },
        contribution_amount: DataTypes.DECIMAL(12,2),
        contribution_aggregate: DataTypes.DECIMAL(12,2),
        contributor_employer: DataTypes.STRING(255),
        contributor_occupation: DataTypes.STRING(255),
        donor_committee_fec_id: DataTypes.STRING(50),
        memo_code: DataTypes.STRING(10),
        memo_text_description: DataTypes.STRING(255),
        image_number: DataTypes.STRING(200)
    }, {
        sequelize,
        modelName: 'fec_paper_contribution',
        indexes: [{
            fields: ['filing_id']
        },{
            fields: ['filer_committee_id_number']
        }, {
            fields: ['memo_code']
        }, {
            fields: ['form_type']
        }, {
            name: 'fec_paper_contribution_contributor_organization_name',
            fields: sequelize.getDialect() == 'postgres' ?
                [sequelize.fn('to_tsvector', 'english', sequelize.col('contributor_organization_name') )] :
                'contributor_organization_name',
            using: sequelize.getDialect() == 'postgres' ?
                'gin'
                : null
        }, {
            name: 'fec_paper_contribution_contributor_first_name',
            fields: sequelize.getDialect() == 'postgres' ?
            [sequelize.fn('lower', sequelize.col('contributor_first_name') )] :
            'contributor_first_name'
        }, {
            name: 'fec_paper_contribution_contributor_last_name',
            fields: sequelize.getDialect() == 'postgres' ?
            [sequelize.fn('lower', sequelize.col('contributor_last_name') )] :
            'contributor_last_name'
        }, {
            name: 'fec_paper_contribution_contributor_state',
            fields: sequelize.getDialect() == 'postgres' ?
            [sequelize.fn('lower', sequelize.col('contributor_state') )] :
            'contributor_state'
        }]
    });

    PaperContribution.associate = models =>
        PaperContribution.belongsTo(models.fec_paper_filing,{
            foreignKey: 'filing_id',
            onDelete: 'CASCADE'
        });

    PaperContribution.match = row =>
        row.form_type && row.form_type.match(/^SA/) && 
                    !row.form_type.match(/^(SA3L)/) && row.image_number;

    return PaperContribution;
};
