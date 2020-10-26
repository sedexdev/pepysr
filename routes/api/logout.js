const express = require("express");
const router = express.Router();
const config = require("config");

module.exports = () => {
    /**
     * @route          DELETE /api/logout
     * @description    Deletes the users session from the database
     * @access         Private
     */
    router.delete("/", (req, res) => {
        try {
            const session = req.session;
            if (session) {
                session.destroy(err => {
                    if (err) throw err;
                    res.clearCookie(config.get("sessionName"));
                    return res.status(200).json("Logged out");
                });
            } else {
                res.status(401).json("Bad request...");
            }
        } catch (err) {
            res.status(500).json("Server error...");
        }
    });

    return router;
};
