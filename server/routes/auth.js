const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

//---------------------- Signup ----------------------

router.post("/signup", (req, res) => {
    const q = "SELECT * FROM users WHERE email = ? OR username = ?";
    // Check if user already exists
    db.query(q, [req.body.email, req.body.username], (err, data) => {
        if (err) return res.status(500).json(err.message);
        if (data.length > 0) if (data.length) {
            if (data[0].username === req.body.username) {
                return res.status(409).json("Username already taken!");
            }
            if (data[0].email === req.body.email) {
                return res.status(409).json("Email already in use!");
            }
        }
        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        // Insert new user
        const insertQuery = "INSERT INTO users(`username`, `email`, `password`) VALUES (?)";
        const values = [req.body.username, req.body.email, hash];
        db.query(insertQuery, [values], (err, newUser) => {
            if (err) return res.status(500).json(err.message);
            // Fetch created user
            db.query("SELECT * FROM users WHERE user_id = ?", [newUser.insertId], (err, userRecord) => {
                if (err) return res.status(500).json(err.message);
                const { password, ...other } = userRecord[0];
                // Generate JWT token
                const token = jwt.sign({ id: newUser.insertId }, "jwtkey");
                // Set cookie with token
                res
                    .cookie("access_token", token, {
                        httpOnly: true,
                    })
                    .status(201)
                    .json(other);
            });
        });
    });
});

//---------------------- Login ----------------------

router.post("/login", (req, res) => {
    const q = "SELECT * FROM users WHERE username = ?";
    // Check username
    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err.message);
        if (data.length === 0) return res.status(404).json("User not found!");
        const { password, ...other } = data[0];
        // Check password
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, password);
        if (!isPasswordCorrect) return res.status(400).json("Wrong password!");
        // Generate JWT token
        const token = jwt.sign({ id: data[0].user_id }, "jwtkey");
        // Set cookie with token
        res
            .cookie("access_token", token, {
                httpOnly: true,
            })
            .status(200)
            .json(other);
    });
});

//---------------------- Logout ----------------------

router.post("/logout", (req, res) => {
    res
        .clearCookie("access_token", {
            sameSite: "none",
            secure: true,
        })
        .status(200)
        .json("User has been logged out.");
});

module.exports = router;
