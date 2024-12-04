const express = require("express");

const db = require("../db");

const router = express.Router();

//---------------------- Get Client Name  ----------------------

router.get("/get-name/:id/:type", (req, res) => {
    const { id, type } = req.params
    let query;
    if (type === "client")
        query = "SELECT client_name AS name FROM clients WHERE client_id = ?"
    else if (type === "user")
        query = "SELECT username AS name FROM users WHERE user_id = ?"
    db.query(query, [id], (err, name) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err.message);
        }
        if (name.length > 0) {
            res.status(200).json(name[0]);
        }
    });
});

//---------------------- Get Client Id  ----------------------

router.get("/client-Id/:code", (req, res) => {
    const userCode = req.params.code;
    const query = "SELECT client_id FROM sessions WHERE session_connection_code = ?";
    db.query(query, [userCode], (err, name) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err.message);
        }
        if (name.length > 0) {
            res.status(200).json(name[0].client_id);
        }
    });
});

//---------------------- Get All Chats  ----------------------

router.get("/get-chats/:id", (req, res) => {
    const userId = req.params.id;
    const query = "SELECT * FROM conversations WHERE user_id = ?";
    db.query(query, [userId], (err, chats) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err.message);
        }
        if (chats.length > 0) {
            res.status(200).json(chats);
        } else {
            res.json("No old chats.");
        }
    });
});

//---------------------- Get Chat Content  ----------------------

router.get("/get-messages/:id", (req, res) => {
    const clientId = req.params.id;
    const query = `SELECT * FROM messages INNER JOIN conversations
                    ON messages.conversation_id = conversations.conversation_id
                    WHERE client_id = ?`;
    db.query(query, [clientId], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err.message);
        }
        if (data.length > 0) {
            res.status(200).json(data);
        } else {
            res.status(204).json({ message: "No messages." });
        }
    });
});

//---------------------- Delete Message ----------------------

router.delete("/delete-message/:messageId", (req, res) => {
    const messageId = req.params.messageId;
    const senderId = req.query.senderId;
    if (!senderId) {
        return res.status(400).json("Sender ID is required.");
    }
    const deleteMessage = "DELETE FROM messages WHERE message_id = ? AND sender_id = ?";
    db.query(deleteMessage, [messageId, senderId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err.message);
        }
        if (result.affectedRows > 0) {
            return res.status(200).json("Message deleted successfully.");
        } else {
            return res.status(404).json("Message not found or sender mismatch.");
        }
    });
});

//---------------------- Send Message  ----------------------

router.post("/send-message", (req, res) => {
    const { senderId, user_id, client_id, message, repliedTo } = req.body;
    const checkChat = 'SELECT conversation_id FROM conversations WHERE client_id = ? AND user_id = ?';
    db.query(checkChat, [client_id, user_id], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err.message);
        }
        if (data.length > 0) {
            const conversationId = data[0].conversation_id;
            const insertMessage = `INSERT INTO messages (conversation_id, sender_id, content, sent_at, replied_to)
                                    VALUES (?, ?, ?, NOW(), ?);`;
            db.query(insertMessage, [conversationId, senderId, message, repliedTo], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json(err.message);
                }
                db.query('SELECT * FROM messages WHERE message_id = ?', [result.insertId], (err, data) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json(err.message);
                    }
                    const message_info = data[0];
                    res.status(201).json({ message: "Message inserted successfully.", details: message_info });
                });
            });
        } else {
            const createChat = `INSERT INTO conversations (client_id, user_id, started_at)
                                VALUES (?, ?, NOW());`;
            db.query(createChat, [client_id, user_id], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json(err.message);
                }
                const conversationId = result.insertId;
                const insertMessage = `INSERT INTO messages(conversation_id, sender_id, content, sent_at, replied_to)
                                        VALUES (?, ?, ?, NOW(), ?);`;
                db.query(insertMessage, [conversationId, senderId, message, repliedTo], (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json(err.message);
                    }
                    db.query('SELECT * FROM messages WHERE message_id = ?', [result.insertId], (err, data) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json(err.message);
                        }
                        const message_info = data[0];
                        res.status(201).json({ message: "Chat created and Message inserted successfully.", details: message_info });
                    });
                });
            });
        }
    });
});


module.exports = router;