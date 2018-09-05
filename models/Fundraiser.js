const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let FundraiserSchema = new Schema ({
    title: {
        type: String,
        required: true,
        unique: true
    },

    summary: {
        type: String,
        required: true,
        unique: true
    },

    city: {
        type: String
    },
    
    moneyRaised: {
        type: Number,
        required: true
    }
});

let Fundraiser = mongoose.model('Fundraiser', FundraiserSchema);

module.exports = Fundraiser;