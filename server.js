const express = require("express")
const app = express()
const dotenv=require("dotenv")
dotenv.config()
const userRouter=require("./router/userRouter")
const categoriesRouter=require("./router/categoriesRouter")
const session=require("express-session")
const passport=require("passport")
require("./helper/googleAuth")
const path=require('path')



app.use(express.static(path.join(__dirname,'client')));

const bodyParser = require('body-parser');



const { connection } = require("./database/db")

require("./database/db")
const port = process.env.PORT;
app.use(bodyParser.json());

; (async () => await connection("chesed_anytime"))()

app.use(express.json())

app.use("/api", userRouter)
app.use("/api",categoriesRouter)


// //////////////////////////////////////////////////////
function isLogggedIn(req,res,next){
    req.user ? next() : res.status(401).send("Unauthorized");
}


app.use(session({
    secret:process.env.JWT_SECRET_KEY,
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}  
}))

app.use(passport.initialize());
app.use(passport.session())
app.get('/',(req,res)=>{
    res.sendFile('index.html')
})
app.get('/auth/google',
  passport.authenticate('google', { scope: ['email' ,'profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { 
  successRedirect:'/auth/protected',
  failureRedirect:'/auth/google/failure'

   }),
);
app.get('/auth/google/failure',(req,res)=>{
    res.send("somthing Went wrong")
})
app.get('/auth/protected',isLogggedIn,(req,res)=>{
    let name = req.user.displayName;
    res.send(`WELCOME ${name}`)
})


// app.use(express.urlencoded({extended:true}))
app.listen(port, () => {
    console.log(`server running at ${port}`)
})

