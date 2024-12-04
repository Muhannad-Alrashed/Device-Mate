const express = require("express");
const db = require("../db");

const router = express.Router();

//---------------------- End Session ----------------------

router.post('/end-session', (req, res) => {
    const queryUpdateSession = `UPDATE sessions
                                SET end_Time = NOW(), status = 0 WHERE session_id = ?`;
    db.query(queryUpdateSession, [req.body.session_id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err.message);
        }
    })
    res.status(200).json('Connection ended successfully');
})

//---------------------- Check Session Exist ----------------------

router.get("/code-exist/:code/:id", (req, res) => {
    const { code, id } = req.params;
    const query = `SELECT 1 FROM sessions WHERE session_connection_code = ? AND user_id = ?`;
    db.query(query, [code, id], (err, result) => {
        if (err)
            return res.status(500).json(err.message);
        res.json({ exists: result.length > 0 });
    });
});

//---------------------- Check Client Exist ----------------------

router.get("/name-exist/:name/:id", (req, res) => {
    const { name: clientName, id: userId } = req.params;
    const query = `SELECT 1 FROM clients WHERE client_name = ? AND user_id = ? `;
    db.query(query, [clientName, userId], (err, result) => {
        if (err)
            return res.status(500).json(err.message);
        res.json({ exists: result.length > 0 });
    });
});

//---------------------- Get Current Session ----------------------

router.get("/get-current/:code", (req, res) => {
    const { code } = req.params;
    const query = `SELECT clients.client_name,sessions.*
                FROM sessions INNER JOIN clients ON sessions.client_id = clients.client_id
                WHERE session_connection_code = ? AND status = 1`;
    db.query(query, [code], (err, sessions) => {
        if (err) {
            return res.status(500).json(err.message);
        }
        if (sessions.length === 0) {
            return res.status(404).json('No active session found.');
        }
        return res.status(200).json(sessions[0]);
    });
});

//---------------------- Start Session ----------------------

router.post('/start-session', (req, res) => {
    const {
        user: { code: userCode, state: userState, id: userId },
        client: { code: clientCode, state: clientState, name: clientName },
        clientDeviceInfo: { Device_Type, Platform, Operating_System, Network_Type },
    } = req.body;
    if (!clientName) {
        // Open existing session
        const checkSessionQuery = `SELECT * FROM sessions WHERE session_connection_code = ?`;
        db.query(checkSessionQuery, [userCode], (err, sessionRecords) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json(err.message);
            }
            const { session_id: sessionId } = sessionRecords[0];
            const updateSessionQuery = "UPDATE sessions SET start_time = NOW(), end_time = null, status = 1 WHERE session_id = ?";
            db.query(updateSessionQuery, [sessionId], (err) => {
                if (err) {
                    console.log(err.message);
                    return res.status(500).json(err.message);
                }
                return res.status(200).json({ message: 'Reconnected Successfully.', result: sessionRecords[0] });
            });
        });
    } else {
        // Create new session
        const findClientQuery = `SELECT clients.client_id FROM clients 
                                INNER JOIN sessions ON sessions.client_id = clients.client_id 
                                WHERE client_name = ? AND clients.user_id = ?`;
        db.query(findClientQuery, [clientName, userId], (err, clientRecords) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json(err.message);
            }
            let clientId;
            if (clientRecords.length !== 0) {
                // Client exists
                clientId = clientRecords[0].client_id;
                createSession(clientId);
            } else {
                // New client
                const insertClientQuery = "INSERT INTO clients (client_name, created_at, user_id) VALUES (?, NOW(), ?)";
                db.query(insertClientQuery, [clientName, userId], (err, result) => {
                    if (err) {
                        console.log(err.message);
                        return res.status(500).json(err.message);
                    }
                    clientId = result.insertId;
                    createSession(clientId);
                });
            }
            // Create session function
            const createSession = (clientId) => {
                // Create session
                const insertSessionQuery = `
                    INSERT INTO sessions (client_id, user_id, session_connection_code, start_time, status) 
                    VALUES (?, ?, ?, NOW(), 1)`;
                db.query(insertSessionQuery, [clientId, userId, userCode], (err, result) => {
                    if (err) {
                        console.log(err.message);
                        return res.status(500).json(err.message);
                    }
                    const sessionId = result.insertId;
                    // Save device info
                    const query = `INSERT INTO device_info
                    (device_type,platform,operating_system,network_type,client_id)
                    VALUES (?, ?, ?, ?, ?);`
                    db.query(query, [Device_Type, Platform, Operating_System, Network_Type, clientId], (err) => {
                        if (err) {
                            console.log(err.message);
                            return res.status(500).json(err.message);
                        }
                        // Retrieve session
                        const getSessionQuery = `SELECT clients.client_name,sessions.*
                                                FROM sessions INNER JOIN clients ON sessions.client_id = clients.client_id
                                                WHERE session_connection_code = ?`;
                        db.query(getSessionQuery, [sessionId], (err, sessionRecords) => {
                            if (err) {
                                console.log(err.message);
                                return res.status(500).json(err.message);
                            }
                            return res.status(201).json({ message: 'Connection created successfully', result: sessionRecords[0] });
                        })
                    });
                });
            };
        });
    }
});

module.exports = router;
