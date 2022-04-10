const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const { create_tokens, verify_tokens } = require("./JWT")

const user_model = require("./models/user");
const post_model = require("./models/post")

mongoose.connect("mongodb+srv://saksham:saksham@cluster0.xzjl6.mongodb.net/linkedin-clone?retryWrites=true&w=majority")

app.use(cors())
app.use(express.json())

app.get("/getUsers" , (req,res)=>{
    user_model.find({}, (err,data)=>{
        if(err){
            res.json(err)
        }else{
            res.json(data)
        } 
    })
})

app.post("/createUser" , async (req,res)=>{
    const user_data = req.body;
    const user = new user_model(user_data);
    await user.save()

    res.json(user_data)
})

app.post("/login" , async(req,res)=>{
    const user = await user_model.findOne(
        {email:req.body.email,
        password:req.body.password},
    )

    if(user){
        const token = create_tokens(user)

        res.json({ status:"ok" , user:token })
    }else{
        res.json({ status:404 , user:false })
    }
})

app.get("/getPosts", (req,res)=>{
    post_model.find({}, (err,data)=>{
        if(err){
            res.json(err)
        }else{
            res.json(data)
        }
    })
})

app.post("/createPost" , async (req,res)=>{
    const post_data = req.body
    const post = new post_model(post_data);
    await post.save()

    res.json(post_data)
})

app.post("/updatePosts" , async (req,res) => {
    await post_model.findOneAndUpdate(
        {"name" : req.body.name,
        "time"  : req.body.time},
        {"likes" : req.body.likes,
        "people_liked" : req.body.people_liked}
    )

    res.json({ status:"ok" })
})

app.post("/deletePost", async(req,res)=>{
    await post_model.deleteOne(
        {"email": req.body.email,
        "time" : req.body.time} 
    ).then(()=>{
        return res.json({ status:"ok" })
    }).catch(()=>{
        return res.json({ status:404 })
    })
})

app.post("/deleteUser" , async(req,res)=>{
    await user_model.deleteOne(
        {"email" : req.body.email}
    ).then(()=>{
        return res.json({ status : "ok" })
    }).catch(()=>{
        return res.json({ status:404 })
    })
})

app.get("/api/login" , async(req,res)=>{
    const token = req.headers['user-token'];

    try{
        const decoded = verify_tokens(token);
        const user = await user_model.findOne({ email:decoded.email, password:decoded.password });

        if(user){
            return res.json({ status:"ok" , userExists:true })
        }else{
            return res.json({ status : 404 , userExists:false })
        }
    }catch{
        return res.json({ status : 404 , userExists:false })
    }

})

app.listen(3001 , ()=>{
    console.log("The server is listening at http://localhost:3001")
})