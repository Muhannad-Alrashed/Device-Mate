const express = require("express");
const db = require("../db");
const bcrypt = require("bcryptjs");

const router = express.Router();

//---------------------- Check Password ----------------------

router.get("/check-password/:id", (req, res) => {
    const userId = req.params.id;
    const { password } = req.query;
    const query = "SELECT password FROM users WHERE user_id = ?";
    db.query(query, [userId], (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json("Server error.");
        }
        if (data.length === 0) {
            return res.status(404).json("User not found.");
        }
        // Compare to password
        const hashedPassword = data[0].password;
        const isPasswordValid = bcrypt.compareSync(password, hashedPassword);
        if (!isPasswordValid) {
            return res.status(401).json("Wrong password.");
        }
        return res.status(200).json(true);
    });
});

//---------------------- Save Password ----------------------

router.put("/save-password/:id", (req, res) => {
    const userId = req.params.id;
    const newPassword = req.body.password;
    const selectQuery = "SELECT password FROM users WHERE user_id = ?";
    db.query(selectQuery, [userId], (err, data) => {
        if (err) return res.status(500).json(err.message);
        if (data.length === 0) {
            return res.status(404).json("User not found");
        }
        // Compare to old password
        const oldPasswordHash = data[0].password;
        if (bcrypt.compareSync(newPassword, oldPasswordHash)) {
            return res.status(400).json("The new password cannot be the same as the old one.");
        }
        // Update password
        const hashedPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
        const updateQuery = "UPDATE users SET password = ? WHERE user_id = ?";
        db.query(updateQuery, [hashedPassword, userId], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json(err.message);
            }
            return res.status(200).json(result.affectedRows);
        });
    });
});

//---------------------- Save User Info  ----------------------

router.put("/save-info/:id", (req, res) => {
    const userId = req.params.id;
    const { username, email, phone, about } = req.body;
    // Helper promise function
    const queryPromise = (query, params) => {
        return new Promise((resolve, reject) => {
            db.query(query, params, (err, data) => {
                if (err) reject(err.message);
                else resolve(data);
            });
        });
    };
    // Update function
    const updateUser = async () => {
        try {
            // Check user
            const userCheckQuery = "SELECT 1 FROM users WHERE user_id = ?";
            const userCheck = await queryPromise(userCheckQuery, [userId]);
            if (userCheck.length === 0) {
                return res.status(404).json("User not found");
            }
            // Check username
            const usernameCheckQuery = "SELECT 1 FROM users WHERE username = ? AND user_id != ?";
            const usernameCheck = await queryPromise(usernameCheckQuery, [username, userId]);
            if (usernameCheck.length !== 0) {
                return res.status(400).json("Another account has the same username.");
            }
            // Check email
            const emailCheckQuery = "SELECT 1 FROM users WHERE email = ? AND user_id != ?";
            const emailCheck = await queryPromise(emailCheckQuery, [email, userId]);
            if (emailCheck.length !== 0) {
                return res.status(400).json("This email is used for another account.");
            }
            // Check phone
            const phoneCheckQuery = "SELECT 1 FROM users WHERE phone = ? AND user_id != ?";
            const phoneCheck = await queryPromise(phoneCheckQuery, [phone, userId]);
            if (phoneCheck.length !== 0) {
                return res.status(400).json("Another account is using this phone number.");
            }
            // Update user info
            const updateQuery = `UPDATE users SET username = ?, email = ?, phone = ?, about = ?, 
                                    updated_at = NOW() WHERE user_id = ?`;
            const result = await queryPromise(updateQuery, [username, email, phone, about, userId]);
            const getinfoQuery = 'SELECT * FROM users WHERE user_id = ?';
            const newUserInfo = await queryPromise(getinfoQuery, [userId]);
            return res.status(200).json(newUserInfo[0]);
            ////
        } catch (err) {
            console.error(err);
            return res.status(500).json(err.message);
        }
    };
    // Call the function
    updateUser();
});

//---------------------- Delete Account ----------------------

router.delete("/delete-account/:id", (req, res) => {
    const userId = req.params.id;
    const getUser = 'SELECT * FROM users WHERE user_id = ?';
    db.query(getUser, [userId], (err, data) => {
        if (err) {
            return res.status(500).json(err.message);
        }
        if (data.length === 0) {
            return res.status(404).json("User data wasn't found.");
        }
        const deleteUser = 'DELETE FROM users WHERE user_id = ?';
        db.query(deleteUser, [userId], (err) => {
            if (err) {
                return res.status(500).json(err.message);
            }
            return res.status(200).json("User account deleted successfully.");
        });
    });
});

module.exports = router;
