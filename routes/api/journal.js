const express = require("express");
const router = express.Router();
const uuid = require("uuid");

const entryEncryption = require("../../utils/secure-entry");
const encryptEntry = entryEncryption.encryptEntry;
const decryptEntry = entryEncryption.decryptEntry;

const Journal = require("../../model/models/Journal");

module.exports = () => {
    /**
     * @route          GET /api/journal
     * @description    Creates a new journal with a unique ID and links it to the user
     * @access         Private
     */
    router.get("/", async (req, res) => {
        try {
            const session = req.session;
            if (session) {
                const id = session.user.userId;

                let journal = await Journal.findOne({ user: id });

                if (journal) {
                    return res.status(400).json({
                        errors: [{ msg: "You already have a journal" }]
                    });
                }

                const journalId = uuid.v4();

                journal = new Journal({
                    user: id,
                    journal_id: journalId,
                    url: `/id/${journalId}`,
                    entries: []
                });

                await journal.save();
                res.json(journal);
            } else {
                res.status(400).json("Bad request...");
            }
        } catch (err) {
            res.status(500).json({ msg: "Server error..." });
        }
    });

    /**
     * @route          GET /api/journal/data
     * @description    Get the current users journal
     * @access         Private
     */
    router.get("/data", async (req, res) => {
        try {
            const session = req.session;
            if (session && session.user) {
                const id = session.user.userId;
                const journal = await Journal.findOne({ user: id });

                if (journal && journal.entries.length > 0) {
                    for (let entry of journal.entries) {
                        entry.content = decryptEntry(entry.content);
                    }
                }

                res.json(journal);
            } else {
                res.status(400).json("Bad request...");
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Server error..." });
        }
    });

    /**
     * @route          POST /api/journal/entry
     * @description    Adds a new entry to the current users journal
     * @access         Private
     */
    router.post("/entry", async (req, res) => {
        try {
            const session = req.session;
            if (session) {
                let { date, content } = req.body;
                const id = session.user.userId;

                let journal = await Journal.findOne({ user: id });

                if (!journal) {
                    return res
                        .status(400)
                        .json({ msg: "Couldn't find user's journal" });
                }

                let contentUpdated = false;
                content = encryptEntry(content);

                for (let entry of journal.entries) {
                    if (entry.date === date) {
                        entry.content = content;
                        contentUpdated = true;
                    }
                }

                journal = await Journal.findOneAndUpdate(
                    { user: id },
                    {
                        $set: {
                            entries: contentUpdated
                                ? [...journal.entries]
                                : [...journal.entries, { date, content }]
                        }
                    },
                    { new: true }
                );
                await journal.save();

                // Decrypt the entries again before sending the data
                // back to the client
                for (let entry of journal.entries) {
                    entry.content = decryptEntry(entry.content);
                }

                res.json(journal);
            } else {
                res.status(400).json("Bad request...");
            }
        } catch (err) {
            console.error(err);
            res.status(500).json("Server error...");
        }
    });

    return router;
};
