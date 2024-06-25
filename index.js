import express from "express"
import bodyParser from "body-parser"
import pg from "pg"
import env from "dotenv";


const app=express();
const port=3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
env.config();

const db=new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
});
db.connect();
var posts=[];
var id=0;

const today = new Date();
const date = today.getDate() +"-"+ today.getMonth() +"-"+ today.getFullYear();
const hours= today.getHours();
const ampm = hours >= 12 ? "PM" : "AM";
const time = `${(hours%12)||12}:${today.getMinutes()} ${ampm}`;
//console.log("Current time:", time,date);


app.get("/",async(req,res)=>{
    const result=await db.query("SELECT * FROM posts")
    posts=(result.rows);
    res.render("index.ejs",{
        blogs:posts
    })
})

app.get("/create",(req,res)=>{
    res.render("index3.ejs",{
        blogs:posts,
    })
})


app.post("/add",async(req,res)=>{
    var content=req.body["blog"];
    var name=req.body["Name"];
    var title=req.body["Title"];
    await db.query("INSERT INTO posts (post_date,post_time,author,title,post) VALUES ($1,$2,$3,$4,$5)",[date,time,name,title,content]);
    res.redirect("/#blogspage");
})
    
app.post("/edit",async (req,res)=>{
    const result=await db.query("SELECT * FROM posts WHERE id=$1",[req.body.Id]);
    res.render("index3.ejs",{
        blog:result.rows,
    })
})

app.post("/edited",async(req,res)=>{
    const x=req.body;
    await db.query("UPDATE posts SET author = $1, title = $2, post = $3 WHERE id = $4",[x.Name,x.Title,x.blog,x.id]);
    //console.log(x.name,x.title,x.blog,x.id);
    res.redirect("/#blogspage");
})

app.post("/delete",async(req,res)=>{
    await db.query("DELETE FROM posts WHERE id=$1",[req.body.Id]);
    res.redirect("/#blogspage");
})

app.listen(port,()=>{
    console.log("server is running on port ",+port);
})
