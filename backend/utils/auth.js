const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'badtzisthegoat';

function generateToken(user) {
    return jwt.sign({ 
        id: user._id, 
        email: user.email }, 
        JWT_SECRET, { expiresIn: '1h' }
    );
}

function authenticateToken(req, res, next) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Invalid token." });
        }
        req.user = decoded;
        next();
    });
}

module.exports = { generateToken, authenticateToken };

