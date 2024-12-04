const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(403).json({ message: "Not authenticated!" });
    }

    jwt.verify(token, "jwtkey", (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token!" });
        req.user = user;
        next();
    });
};

module.exports = verifyToken;
