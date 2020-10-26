const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../../model/models/User");

module.exports = () => {
    /**
     * @route         POST /api/register
     * @description   Register a new user
     * @access        Public
     */
    router.post(
        "/",
        [
            check("email", "A valid email is required")
                .trim()
                .isEmail(),
            check(
                "password",
                "Your password must be at least 8 characters long"
            ).isLength({ min: 8 })
        ],
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            try {
                const { email, password } = req.body;
                const user = await User.findOne({ email });

                if (user) {
                    return res.status(400).json({
                        errors: [{ msg: "Please choose another email" }]
                    });
                }

                const registeredUser = new User({
                    email,
                    password,
                    isLoggedIn: false
                });

                const salt = await bcrypt.genSalt(10);
                registeredUser.password = await bcrypt.hash(password, salt);

                await registeredUser.save();
                res.json(true);
            } catch (err) {
                res.status(500).send("Server error...");
            }
        }
    );

    return router;
};
