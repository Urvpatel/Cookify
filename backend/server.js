const express=require("express")
const app=express()
const dotenv=require("dotenv").config()
const connectDb=require("./config/connectionDb")
const cors=require("cors")
const { ensureAdminExists } = require("./middleware/adminAuth")

const PORT=process.env.PORT || 3000
const mongoose = require("mongoose")

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5000'],
  credentials: true
}))
app.use(express.static("public"))
app.use("/images", express.static("public/images"))

// Routes
app.use("/",require("./routes/user"))
app.use("/recipe",require("./routes/recipe"))
app.use("/admin",require("./routes/admin"))
app.use("/category",require("./routes/category"))

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal server error"
  })
})

connectDb().then(async (connected) => {
  if (connected) {
    mongoose.connection.once('open', async () => {
      await ensureAdminExists()
    })
    setTimeout(async () => {
      if (mongoose.connection.readyState === 1) {
        await ensureAdminExists()
      }
    }, 3000)
  }
})

app.listen(PORT)