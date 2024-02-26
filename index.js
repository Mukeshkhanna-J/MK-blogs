import express from "express"
import bodyParser from "body-parser"


const app=express();
const port=3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var bloglist=[];

app.get("/",(req,res)=>{  
    bloglist=[];
    res.render("index.ejs",{
        blogs:bloglist,
    })
})

app.get("/create",(req,res)=>{
    res.render("index3.ejs",{
        blogs:bloglist,
    })
})


app.post("/add",(req,res)=>{
    var content=req.body["blog"];
    var name=req.body["Name"];
    var title=req.body["Title"];
    bloglist.push({content:content,name:name,title:title});
    //
    res.render("index.ejs",{
        blogs:bloglist,
    })
})
    



app.listen(port,()=>{
    console.log("server is running on port ",+port);
})