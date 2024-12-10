const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve the static files from the React build folder
app.use(express.static(path.join(__dirname, 'build')));

// For any other route, serve the React index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
