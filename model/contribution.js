const moment = require('moment'),
      Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    class Contribution extends Sequelize.Model {}

    Contribution.init({
        // cycle: DataTypes.STRING(5),
        filing_id: DataTypes.INTEGER,
        form_type: DataTypes.STRING(50),
        filer_committee_id_number: DataTypes.STRING(50),
        transaction_id: DataTypes.STRING(50),
        back_reference_tran_id_number: DataTypes.STRING(50),
        back_reference_sched_name: DataTypes.STRING(50),
        entity_type: DataTypes.STRING(10),
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
                    this.setDataValue('contribution_date', moment(val, 'YYYYMMDD').toDate());
                } else {
                    this.setDataValue('contribution_date', val);
                }
            }
        },
        contribution_amount: DataTypes.DECIMAL(12,2),
        contribution_aggregate: DataTypes.DECIMAL(12,2),
        contribution_purpose_descrip: DataTypes.STRING(255),
        contributor_employer: DataTypes.STRING(255),
        contributor_occupation: DataTypes.STRING(255),
        donor_committee_fec_id: DataTypes.STRING(50),
        donor_committee_name: DataTypes.STRING(255),
        donor_candidate_fec_id: DataTypes.STRING(50),
        donor_candidate_last_name: DataTypes.STRING(255),
        donor_candidate_first_name: DataTypes.STRING(255),
        donor_candidate_middle_name: DataTypes.STRING(255),
        donor_candidate_prefix: DataTypes.STRING(30),
        donor_candidate_suffix: DataTypes.STRING(30),
        donor_candidate_office: DataTypes.STRING(100),
        donor_candidate_state: DataTypes.STRING(30),
        donor_candidate_district: DataTypes.STRING(30),
        conduit_name: DataTypes.STRING(255),
        conduit_street1: DataTypes.STRING(200),
        conduit_street2: DataTypes.STRING(200),
        conduit_city: DataTypes.STRING(100),
        conduit_state: DataTypes.STRING(20),
        conduit_zip_code: DataTypes.STRING(30),
        memo_code: DataTypes.STRING(10),
        memo_text_description: DataTypes.STRING(255),
        reference_code: DataTypes.STRING(50)
    }, {
        sequelize,
        modelName: 'fec_contribution',
        indexes: [{
            fields: ['filing_id']
        },{
            fields: ['filer_committee_id_number']
        }, {
            fields: ['memo_code']
        }, {
            fields: ['form_type']
        }, {
            name: 'fec_contributions_contributor_organization_name_trgm',
            fields: ['contributor_organization_name'],
            using: sequelize.getDialect() == 'postgres' ? 'gin' : null,
            operator: sequelize.getDialect() == 'postgres' ? 'gin_trgm_ops' : null
        }, {
            name: 'fec_contributions_contributor_first_name_trgm',
            fields: ['contributor_first_name'],
            using: sequelize.getDialect() == 'postgres' ? 'gin' : null,
            operator: sequelize.getDialect() == 'postgres' ? 'gin_trgm_ops' : null
        }, {
            name: 'fec_contributions_contributor_last_name_trgm',
            fields: ['contributor_last_name'],
            using: sequelize.getDialect() == 'postgres' ? 'gin' : null,
            operator: sequelize.getDialect() == 'postgres' ? 'gin_trgm_ops' : null
        }, {
            name: 'fec_contributions_contributor_state',
            fields: sequelize.getDialect() == 'postgres' ?
                [sequelize.fn('upper', sequelize.col('contributor_state') )] :
                ['contributor_state']
        }]
    });

    Contribution.associate = models => 
        Contribution.belongsTo(models.fec_filing,{
            foreignKey: 'filing_id',
            onDelete: 'CASCADE'
        });
    
    Contribution.match = row => 
        row.form_type && row.form_type.match(/^SA/) && 
            !row.form_type.match(/^(SA3L)/);

    return Contribution;
};
