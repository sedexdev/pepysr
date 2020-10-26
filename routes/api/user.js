const express = require("express");
const router = express.Router();

module.exports = () => {
    /**
     * @route           GET api/user
     * @description     Get the current users session data
     * @access          Pubic
     */
    router.get("/", ({ session: { user }, res }) => {
        if (user) {
            return res.json(user);
        }
        res.status(401).json("Bad request...");
    });

    return router;
};
