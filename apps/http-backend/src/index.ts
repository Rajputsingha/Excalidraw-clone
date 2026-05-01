import "dotenv/config";
import express from"express";
import { JWT_SECRET } from "@repo/backend-comman/config";
import jwt  from "jsonwebtoken";
import { CreateUserSchema,SigninSchema,CreateRoomSchema } from "@repo/comman/types";
import { prismaClient } from "@repo/db/Db";
import { authmiddleware,AuthenticatedRequest } from "./middleware";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors())
app.post("/signup", async (req, res) => {
const parsedData = CreateUserSchema.safeParse(req.body);
if (!parsedData.success) {
    console.log(parsedData.error);
    res.json({
        message: "Incorrect inputs"
    })
    return;
}
try {
    const user = await prismaClient.user.create({
        data: {
            email: parsedData.data?.username,
            // TODO: Hash the pw
            password: parsedData.data.password,
            name: parsedData.data.name
        }

    })
    res.status(201).json({
        message:"User register Sucessfully",
   user: {
       id: user.id,
       email: user.email,
       name: user.name
   }
    })
   
}catch(e){
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
}

})


 
app.post("/signin",async(req,res)=>{
const parsedata=SigninSchema.safeParse(req.body);
if(!parsedata.success){
    res.json({
message:"incorrect inputs"
    });
    return;
}
const user=await prismaClient.user.findFirst({
    where:{
        email:parsedata.data.username,
        password:parsedata.data.password

    }
})
if(!user){
    res.json({
        message:"Not authenticate"
    });
    return;
}


    const token=jwt.sign({
        userId:user?.id
    },JWT_SECRET);

    res.json({
        token
    });
})


app.post("/room", authmiddleware, async (req: AuthenticatedRequest, res) => {
    const parsedata = CreateRoomSchema.safeParse(req.body);
    if (!parsedata.success) {
        res.json({
            message: "incorrect inputs"
        });
        return;
    }

    if (!req.userId) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

try{
 const room=await prismaClient.room.create({
    data:{
        slug:parsedata.data.name,
        adminId:req.userId
    }
});

res.json({
    roomId:room.id
});
} catch(e){
    res. status(411).json({
        message:"room already exists with this name"
    });
}
})

app.get("/chats/:roomId",async(req,res)=>{
    try{
    const roomId= Number(req.params.roomId);
    const messages= await prismaClient.chat.findMany({
   where:{
    roomId:roomId
   },
   orderBy:{
    id:"desc"
   },
   take:1000
    });
    res.json({
        messages
    });
    }catch(e){
        console.log(e);
        res.json({
            message:[]
        });
    }


})
app.get("/room/:slug",async(req,res)=>{
    const slug=req.params.slug;
    const room=await prismaClient.room.findFirst({
        where:{
   slug
        }
    });
    res.json({
        room
    });
})



app.listen(3001,()=>{
    console.log("Server is listening to the port");
})