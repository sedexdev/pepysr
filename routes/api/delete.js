const express = require("express");
const router = express.Router();
const config = require("config");

const User = require("../../model/models/User");
const Journal = require("../../model/models/Journal");

module.exports = () => {
    /**
     * @route           DELETE api/delete
     * @description     Delete a user, delete an associated journal and
     *                  destroy the current session
     * @access          Private
     */
    router.delete("/", async (req, res) => {
        try {
            const session = req.session;
            const { userId, email } = req.session.user;
            if (session) {
                session.destroy(err => {
                    if (err) throw err;
                    res.clearCookie(config.get("sessionName"));
                });
                await User.findOneAndDelete({ email });
                await Journal.findOneAndDelete({ user: userId });
                res.status(200).json({ msg: "User successfully deleted" });
            } else {
                res.status(401).json("Bad request...");
            }
        } catch (err) {
            res.status(500).send("Server error...");
        }
    });

    return router;
};
