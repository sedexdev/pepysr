const mongoose = require("mongoose");

const JournalSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    journal_id: {
        type: String,
        unique: true
    },
    url: {
        type: String,
        unique: true
    },
    entries: {
        type: [Object]
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Journal = mongoose.model("journal", JournalSchema);
