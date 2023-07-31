const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors')

const { connection } = require("./config/db");
const { UserModel } = require("./models/User.model")
const {authentication}=require("./middleware/authentication")
const {blogRouter}=require("./routes/blog.routes")
require("dotenv").config();



const app = express();


app.use(cors({
    origin: "*"
}))

app.use(express.json())

app.get("/", async (req, res) => {
    res.json("welcome to blogs application")
})


app.post("/signup", async (req, res) => {
    let { name, email, password } = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, 5);
        const new_user = new UserModel({ name, email, password: hashedPassword });
        await new_user.save();
        res.json({ msg: "signup successful" })
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong. Please try again later")
    }
})


app.post("/login", async (req, res) => {
    let { email, password } = req.body


    const user = await UserModel.findOne({ email })
    if (!user) {
        res.send("Sign up first")
    } else {
        const hashedPassword = user.password
        bcrypt.compare(password, hashedPassword, function (err, result) {
            if (result) {
                let token = jwt.sign({ user_id: user._id }, process.env.SECRET_KEY)
                res.send({ msg: "login success", token: token })
            }
            else {
                res.json("login failed invalid credentials")
            }
        })
    }

})

app.use("/blogs",authentication,blogRouter)

app.listen(process.env.PORT, async () => {
    try {
        await connection
        console.log("connected to db server")
    } catch (error) {
        console.log(error)
        console.log("error connecting to db server")
    }
    console.log("listening on 8000 port server")
})