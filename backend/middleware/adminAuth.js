const jwt = require("jsonwebtoken")
const User = require("../models/user")

// Constant admin credentials
const ADMIN_EMAIL = "admin@cookify.com"
const ADMIN_PASSWORD = "admin123" // Constant admin password

const verifyAdmin = async (req, res, next) => {
    try {
        let token = req.headers["authorization"]

        if (!token) {
            return res.status(401).json({ message: "No token provided" })
        }

        token = token.split(" ")[1]
        
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token" })
            }
            
            const user = await User.findById(decoded.id)
            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }

            if (user.role === 'admin' || user.email === ADMIN_EMAIL) {
                req.user = decoded
                req.user.role = 'admin'
                next()
            } else {
                return res.status(403).json({ message: "Access denied. Admin only." })
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "Authentication error" })
    }
}

const isAdminEmail = (email) => {
    return email === ADMIN_EMAIL
}

const ensureAdminExists = async () => {
    try {
        const bcrypt = require("bcrypt")
        const mongoose = require("mongoose")
        
        if (mongoose.connection.readyState !== 1) {
            setTimeout(() => ensureAdminExists(), 2000)
            return
        }
        
        const admin = await User.findOne({ email: ADMIN_EMAIL })
        
        if (!admin) {
            const hashPwd = await bcrypt.hash(ADMIN_PASSWORD, 10)
            await User.create({
                email: ADMIN_EMAIL,
                password: hashPwd,
                role: 'admin'
            })
        } else {
            if (admin.role !== 'admin') {
                admin.role = 'admin'
                await admin.save()
            }
        }
    } catch (error) {
        // Admin creation failed
    }
}

module.exports = { verifyAdmin, isAdminEmail, ensureAdminExists, ADMIN_EMAIL, ADMIN_PASSWORD }

