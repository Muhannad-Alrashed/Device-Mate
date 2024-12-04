module.exports = (io) => {
    io.on('connection', (socket) => {

        //---------------------- Connecting ----------------------

        socket.on('sender-join', (data) => {
            socket.join(data.user_code);
            if (data.client_code !== "")
                if (io.sockets.adapter.rooms.get(data.client_code))
                    socket.to(data.client_code).emit('sender-joined', data.user_code);
        });

        socket.on('receiver-join', (data, callback) => {
            const userSession = io.sockets.adapter.rooms.get(data.user_code);
            if (userSession) {
                socket.join(data.client_code);
                const clientSession = io.sockets.adapter.rooms.get(data.client_code);
                if (clientSession) {
                    callback({ success: true });
                    socket.to(data.user_code).emit('receiver-joined', data.client_code);
                } else {
                    callback({ success: false, message: "Connection failed: Server error." });
                }
            } else {
                callback({ success: false, message: "Session Is not open, or wrong connection code." });
            }
        });

        socket.on('end-socket', (data) => {
            socket.leave(data.sender_code);
            socket.to(data.receiver_code).emit('socket-ended');
        });

        socket.on('send-client-device-info', (data) => {
            socket.to(data.receiver_code).emit('get-client-device-info', data.device_info)
        })

        socket.on('cancel-connection', (clientCode) => {
            socket.to(clientCode).emit('connection-canceled');
        })

        //---------------------- Transfer Files ----------------------

        // Export
        socket.on('ex-send-meta', (data) => {
            socket.to(data.receiver_code).emit('ex-meta-received',
                { receiver_code: data.receiver_code, metadata: data.metadata })
        });
        socket.on('ex-file-start', (data) => {
            socket.to(data.sender_code).emit('ex-file-share', {});
        });
        socket.on('ex-share-chunk', (data) => {
            socket.to(data.receiver_code).emit('ex-file-share', data.file_chunk);
        });

        // Trigger import
        socket.on('trigger-import', (receiver_code, callback) => {
            socket.to(receiver_code).emit('trigger-export');
            callback({ success: true });
        });
        socket.on('cancel-export', () => {
            io.emit('cancel-import')
        })

        // Import
        socket.on('im-send-meta', (data) => {
            socket.to(data.receiver_code).emit('im-meta-received',
                { receiver_code: data.receiver_code, metadata: data.metadata })
        });
        socket.on('im-file-start', (data) => {
            socket.to(data.sender_code).emit('im-file-share', {});
        });
        socket.on('im-share-chunk', (data) => {
            socket.to(data.receiver_code).emit('im-file-share', data.file_chunk);
        });

        // Cancel transfer
        socket.on('cancel-share', (data) => {
            socket.to(data.receiver_code).emit('cancel-share', (data.item))
        })

        //------------------------ Chatting  -------------------------

        socket.on('send-message', (data) => {
            socket.to(data.receiver_code).emit('receive-message', data.new_message)
        })

        socket.on('delete-message', (data) => {
            socket.to(data.receiver_code).emit('message-deleted', data.deleted_message)
        })
    });
};