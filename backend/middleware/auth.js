const jwt=require("jsonwebtoken")

const verifyToken=async(req,res,next)=>{
    try {
        let token=req.headers["authorization"] || req.headers["Authorization"]
        if(!token){
            return res.status(401).json({message:"No token provided"})
        }
        if(token.startsWith("Bearer ") || token.startsWith("bearer ")){
            token=token.split(" ")[1]
        }
        if(!process.env.SECRET_KEY){
            return res.status(500).json({message:"Server configuration error"})
        }
        jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
            if(err){
                return res.status(401).json({message:"Invalid token"})
            }
            req.user=decoded
            next()
        })
    } catch (error) {
        return res.status(401).json({message:"Authentication failed"})
    }
}
module.exports=verifyToken