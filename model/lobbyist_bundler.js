const moment = require('moment'),
      Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    class LobbyistBundler extends Sequelize.Model {}

    LobbyistBundler.init({
        filing_id: DataTypes.INTEGER,
        form_type: DataTypes.STRING(50),
        filer_committee_id_number: DataTypes.STRING(50),
        transaction_id: DataTypes.STRING(50),
        back_reference_tran_id_number: DataTypes.STRING(50),
        back_reference_sched_name: DataTypes.STRING(50),
        entity_type: DataTypes.STRING(10),
        lobbyist_registrant_organization_name: DataTypes.STRING(255),
        lobbyist_registrant_last_name: DataTypes.STRING(255),
        lobbyist_registrant_first_name: DataTypes.STRING(255),
        lobbyist_registrant_middle_name: DataTypes.STRING(255),
        lobbyist_registrant_prefix: DataTypes.STRING(20),
        lobbyist_registrant_suffix: DataTypes.STRING(20),
        lobbyist_registrant_street_1: DataTypes.STRING(255),
        lobbyist_registrant_street_2: DataTypes.STRING(255),
        lobbyist_registrant_city: DataTypes.STRING(100),
        lobbyist_registrant_state: DataTypes.STRING(30),
        lobbyist_registrant_zip_code: DataTypes.STRING(30),
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
        bundled_amount_period: DataTypes.DECIMAL(12, 2),
        bundled_amount_semi_annual: DataTypes.DECIMAL(12, 2),
        contribution_purpose_descrip: DataTypes.STRING(255),
        lobbyist_registrant_employer: DataTypes.STRING(255),
        lobbyist_registrant_occupation: DataTypes.STRING(255),
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
        associated_text_record: DataTypes.STRING(255),
        memo_text: DataTypes.STRING(255),
        reference_code: DataTypes.STRING(50)
    }, {
        sequelize,
        modelName: 'fec_lobbyist_bundler',
        indexes: [{
            fields: ['filing_id']
        }, {
            fields: ['filer_committee_id_number']
        }]
    });

    LobbyistBundler.associate = models =>
        LobbyistBundler.belongsTo(models.fec_filing, {
            foreignKey: 'filing_id',
            onDelete: 'CASCADE'
        });

    LobbyistBundler.match = row => 
        row.form_type && row.form_type.match(/^SA3L/);

    return LobbyistBundler;
};
