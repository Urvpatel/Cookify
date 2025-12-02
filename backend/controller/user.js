const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSignUp = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password is required" })
        }
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ error: "Email already exists" })
        }
        const hashPwd = await bcrypt.hash(password, 10)
        const role = email === 'admin@cookify.com' ? 'admin' : 'user'
        const newUser = await User.create({ email, password: hashPwd, role })
        let token = jwt.sign({ email, id: newUser._id, role }, process.env.SECRET_KEY)
        return res.status(200).json({ token, user: { _id: newUser._id, email: newUser.email, role: newUser.role } })
    } catch (error) {
        return res.status(500).json({ error: "Signup failed" })
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password is required" })
        }
        
        let user = await User.findOne({ email })
        
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" })
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password)
        
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid credentials" })
        }
        
        let userRole = user.role
        if (!userRole && email === 'admin@cookify.com') {
            userRole = 'admin'
            user.role = 'admin'
            await user.save()
        }
        if (!userRole) {
            userRole = 'user'
        }
        
        const userData = {
            _id: user._id,
            email: user.email,
            role: userRole
        }
        let token = jwt.sign({ email, id: user._id, role: userRole }, process.env.SECRET_KEY)
        
        return res.status(200).json({ token, user: userData })
    } catch (error) {
        return res.status(500).json({ error: "Login failed. Please try again." })
    }
}

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.json({email:user.email, _id: user._id, createdAt: user.createdAt})
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch user" })
    }
}

const getUserProfile = async (req, res) => {
    try {
        const Recipes = require("../models/recipe")
        const userId = req.user.id
        
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Get user's recipes
        const recipes = await Recipes.find({ createdBy: userId }).sort({ createdAt: -1 })
        
        // Get user stats
        const totalRecipes = recipes.length
        const recipesByCategory = await Recipes.aggregate([
            { $match: { createdBy: userId } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ])

        res.json({
            user: {
                _id: user._id,
                email: user.email,
                createdAt: user.createdAt
            },
            recipes,
            stats: {
                totalRecipes,
                recipesByCategory
            }
        })
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch user profile" })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const User = require("../models/user")
        const user = await User.findById(req.user.id)
        if (!user || (user.role !== 'admin' && user.email !== 'admin@cookify.com')) {
            return res.status(403).json({ message: "Access denied. Admin only." })
        }

        const Recipes = require("../models/recipe")
        const users = await User.find().sort({ createdAt: -1 })
        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                const recipeCount = await Recipes.countDocuments({ createdBy: user._id })
                return {
                    _id: user._id,
                    email: user.email,
                    role: user.role || 'user',
                    createdAt: user.createdAt,
                    recipeCount
                }
            })
        )
        res.json(usersWithStats)
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch users" })
    }
}

module.exports = { userLogin, userSignUp, getUser, getUserProfile, getAllUsers }