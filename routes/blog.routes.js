const {Router}=require("express")
const {BlogModel} = require("../models/Blog.model")
const {UserModel} = require("../models/User.model")

const blogRouter = Router();

blogRouter.get("/",async (req,res)=>{

    const blogs = await BlogModel.find()
    res.json({blogs:blogs})
})

blogRouter.post("/create",async(req,res)=>{
    const {title,category,content }=req.body
    const author_id = req.user_id 
    const user=await UserModel.findOne({_id:author_id})
    const new_blog = BlogModel({
        title,
        category,
        author:user.name,
        content
    })
    await new_blog.save()
    res.send("blog created")
})

blogRouter.put("/edit/:blogID",async(req,res)=>{
    const {title,category,content }=req.body
    const blogID = req.params.blogID
    const payload = req.body

    const user_id = req.user_id
let user = await UserModel.findOne({_id:user_id})

const blog = await BlogModel.findOne({_id:blog_id})

if(user.name!== blog.author){

    res.send("your unothorized")
}else{
   blog.title = payload.title
    blog.content = payload.content
    blog.category = payload.category

   
}

 await  user.save()
   
    res.send('blog updated')

  
})

blogRouter.delete("/delete/:blogID",async(req,res)=>{
   
    const blogID = req.params.blogID
   

    const user_id = req.user_id
const user = await UserModel.findOne({_id:user_id})

    const user_email=user.email;
   
    const blog = await BlogModel.fidOne({_id:blogID})
    
    if(user_email != blog_author_email){
        res.send
("your unauthorised")    }else{
    await BlogModel.findByIdAndUpdate(blogID,payload)
    res.send('blog updated')
}
  
})



module.exports={blogRouter}