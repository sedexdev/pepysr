const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const setSessionData = require("../../utils/session-data");

const User = require("../../model/models/User");

module.exports = () => {
    /**
     * @route          POST /api/login
     * @description    Logs in a registered user
     * @access         Public
     */
    router.post(
        "/",
        [
            check("email", "A valid email is required")
                .trim()
                .isEmail(),
            check("password", "Password is required")
                .not()
                .isEmpty()
        ],
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            try {
                const { email, password } = req.body;
                let user = await User.findOne({ email });

                if (!user) {
                    res.status(400).json({
                        errors: [{ msg: "Invalid credentials" }]
                    });
                }

                const passwordMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!passwordMatch) {
                    res.status(400).json({
                        errors: [{ msg: "Invalid credentials" }]
                    });
                }

                user.isLoggedIn = true;

                const sessionUser = setSessionData(user);
                req.session.user = sessionUser;
                res.json(sessionUser);
            } catch (err) {
                res.status(500).send("Server error...");
            }
        }
    );

    return router;
};
