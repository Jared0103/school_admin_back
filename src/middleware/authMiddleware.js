const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }

    // El encabezado de autorización debe tener el formato "Bearer <token>"
    const tokenParts = authHeader.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Invalid authorization header format' });
    }

    const token = tokenParts[1];

    jwt.verify(token, process.env.TOP_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Si el token es válido, puedes almacenar los datos decodificados en el objeto de solicitud para su uso posterior
        req.user = decoded;
        next(); // Llama a next() para pasar la solicitud al siguiente middleware o controlador
    });
};

module.exports = verifyToken;
