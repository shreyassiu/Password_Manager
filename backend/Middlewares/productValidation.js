const jwt = require('jsonwebtoken')



const ensureAuth = (req, res, next) => {

    const auth = req.headers['authorization'];
    if (!auth) {
        return res.status(403).json({ message: "Unauthorized,Jwt token not found", success: false })
    }
    try{
        const decoded = jwt.verify(auth, process.env.JWT_SECRET_KEY)
        req.user = decoded
        next();
    }
    catch(err){
        return res.status(403).json({ message: "Unauthorized,Jwt is wrong", success: false })
    }
}
module.exports = ensureAuth;