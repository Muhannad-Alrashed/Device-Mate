const express = require("express");
const db = require("../db");

const router = express.Router();

//---------------------- Get Session Info ----------------------

router.get("/get-session/:id", (req, res) => {
    const sessionId = req.params.id;
    const query = `SELECT clients.client_name,clients.client_id,sessions.* FROM sessions
                    INNER JOIN clients ON sessions.client_id = clients.client_id
                    WHERE session_id = ?`;
    db.query(query, [sessionId], (err, sessions) => {
        if (err) {
            return res.status(500).json(err.message);
        }
        if (sessions.length === 0) {
            return res.status(404).json('No session found.');
        }
        res.status(200).json(sessions[0]);
    });
});


//---------------------- Get Device Info ----------------------

router.get("/get-device-info/:id", (req, res) => {
    const clientId = req.params.id;
    const query = `SELECT * FROM device_info WHERE client_id = ?`;
    db.query(query, [clientId], (err, devices) => {
        if (err) {
            return res.status(500).json(err.message);
        }
        if (devices.length === 0) {
            return res.status(404).json('No device found.');
        }
        res.status(200).json(devices[0]);
    });
});

//---------------------- Get Sessions ----------------------

router.get("/get-sessions/:id/:count", (req, res) => {
    const { id: userId, count } = req.params;
    let query;
    if (count === "all")
        query = `SELECT session_id,clients.client_name,sessions.client_id,session_connection_code,
                device_type,platform,operating_system,network_type,start_time,end_time
                FROM sessions INNER JOIN device_info ON device_info.client_id = sessions.client_id
                INNER JOIN clients ON sessions.client_id = clients.client_id
                WHERE sessions.user_id = ?`;
    else
        query = `SELECT session_id,clients.client_name,sessions.client_id,session_connection_code,
                device_type,platform,operating_system,network_type,start_time,end_time
                FROM sessions INNER JOIN device_info ON device_info.client_id = sessions.client_id
                INNER JOIN clients ON sessions.client_id = clients.client_id
                WHERE sessions.user_id = ? LIMIT 5`;
    db.query(query, [userId], (err, sessions) => {
        if (err) {
            return res.status(500).json(err.message);
        }
        if (sessions.length === 0) {
            return res.status(404).json('No completed sessions yet.');
        }
        res.status(200).json(sessions);
    });
});

//---------------------- Get Transfered Files  ----------------------

router.get("/get-files/:id", (req, res) => {
    const { id: session_id } = req.params;
    const query = `SELECT file_transfers.transfer_id, file_transfers.sender_id,
                    file_transfers.transferred_at,files.file_name,files.file_type,files.file_size FROM
                    files INNER JOIN file_transfers ON files.file_id = file_transfers.file_id
                    INNER JOIN sessions ON file_transfers.session_id = sessions.session_id
                    WHERE sessions.session_id = ? `;
    db.query(query, [session_id], (err, files) => {
        if (err) {
            return res.status(500).json(err.message);
        }
        if (files.length === 0) {
            return res.status(404).json('No transferred files yet.');
        }
        res.status(200).json(files);
    });
});

//---------------------- Delete File ----------------------

router.delete('/delete-file/:id', (req, res) => {
    const transferId = req.params.id;
    const getFile = 'SELECT file_id FROM file_transfers WHERE transfer_id = ?';
    db.query(getFile, [transferId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err.message);
        }
        if (result.length > 0) {
            const fileId = result[0].file_id;
            const deleteFile = 'DELETE FROM files WHERE file_id = ?';
            db.query(deleteFile, [fileId], (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json(err.message);
                }
                return res.status(200).json('File deleted successfully');
            });
        } else {
            return res.status(404).json('File does not exist');
        }
    });
});

//---------------------- Delete Session ----------------------

router.delete('/delete-session/:id', (req, res) => {
    const clientId = req.params.id
    const deleteSession = 'DELETE FROM sessions WHERE client_id = ?';
    db.query(deleteSession, [clientId], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err.message);
        }
        const deleteClient = 'DELETE FROM clients WHERE client_id = ?';
        db.query(deleteClient, [clientId], (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json(err.message);
            }
            return res.status(200).json('Session deleted successfully');
        });
    });
});


module.exports = router;

