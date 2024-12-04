const express = require("express");
const db = require("../db");

const router = express.Router();

//---------------------- Save File ----------------------

router.post("/save/:id", (req, res) => {
    const { filename, filetype, totalBufferSize: filesize } = req.body.metadata;
    const { session_id } = req.body.sessionInfo;
    const { id: senderId } = req.params;
    // Check sender
    db.query('SELECT * FROM sessions WHERE (user_id = ? OR client_id = ?) AND session_id = ?'
        , [senderId, senderId, session_id], (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).json(err.message);
            }
            if (data.length === 0) {
                return res.status(404).json({ error: 'Sender not found' });
            }
            // Insert file
            const insertFile = 'INSERT INTO files (file_name, file_type, file_size) VALUES (?, ?, ?)';
            db.query(insertFile, [filename, filetype, filesize], (err, fileRecord) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json(err.message);
                }
                // Insert Transfer
                const insertTransfer = `INSERT INTO file_transfers
                (session_id, file_id, sender_id, transferred_at) VALUES (?, ?, ?, NOW())`;
                db.query(insertTransfer, [session_id, fileRecord.insertId, senderId], (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json(err.message);
                    }
                    res.status(201).json('File saved successfully.');
                });
            });
        });
});

module.exports = router;
