

const {Configuration, OpenAIApi} = require("openai")

import { NextResponse } from "next/server";

import connectToDatabase from "@/helper/server-helper";

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();






export async function POST(request: Request){
    var data = await request.json()

    var userName = data.username
    var userBio =  data.bio
    var nameAI = "check"
    var bioAI = "check"

    await connectToDatabase()

    var newuser = await prisma.user.create({data:{userName,userBio,nameAI,bioAI}})

    

    const prompt = `Recommend me the username and bio based on the given ${data}`

    console.log(data)

    var payload = {
        model:"gpt-3.5-turbo",
        prompt : prompt,
        max_tokens:256,
        temperature: 1,
        stream:false
    }
    // const response =  await fetch("https://api.openai.com/v1/chat/completions",{
    //     method:"POST",
    //     headers:{
    //         'Content-Type':"application/json",
    //         
    //     },
    //     body: JSON.stringify(payload)


    // })
    
    // console.log(response.json())

    return NextResponse.json(data)

    

 
}

