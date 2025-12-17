const jwt = require('jsonwebtoken')

const isAuth = async (req, res, next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message: "Authorization header missing or not correct"})
        
    }
    const token = authHeader.split(" ")[1];
    try {
        const decode = await jwt.verify(token, process.env.JWT_SECRET)
        req.user=decode;
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Invalid or expired token"
        })
    }
}

module.exports ={isAuth}