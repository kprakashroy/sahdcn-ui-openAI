import { NextResponse } from "next/server";
import connectToDatabase from "@/helper/server-helper";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


import {rateLimitMiddleware} from "@/middleware/middlewareRateLimiting";



export async function POST(request: Request) {

    var rate = await rateLimitMiddleware(request)
    
    if(rate){
        return NextResponse.json({error:1, msg:"rate limit exceeded"});
    }
    

  const data = await request.json();

  const { userName, userBio } = data;

  console.log(data);

  const existingUser = await prisma.user.findFirst({
    where: { userName: userName , userBio: userBio},
  })

  if(existingUser){

  console.log(existingUser);

  return NextResponse.json(existingUser);

  }

  const prompt = `Recommend me the username and bio based on the given userName:${userName} and userBio:${userBio}  and provide the response in form of a json where two fields are userName and userBio`;

  

  const payload = {
    model: "gpt-4-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 256,
    temperature: 1,
    stream: false,
  };
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer sk-proj-x4B57pMQvueZq07GRZmYT3BlbkFJR2c3jH8pDy2emQiyhZRD",
    },
    body: JSON.stringify(payload),
  });

  const dataAI = await response.json();
  const content = dataAI.choices[0].message.content;
  const first = content.indexOf("{");
  const last = content.indexOf("}");

  const final = JSON.parse(dataAI.choices[0].message.content.slice(first, last + 1));

  const nameAI = final.userName;
  const bioAI = final.userBio;
  console.log({ data: { userName, userBio, nameAI, bioAI } });

  await connectToDatabase();

  const newuser = await prisma.user.create({
    data: { userName, userBio, nameAI, bioAI },
  });

  console.log(newuser);

  return NextResponse.json(newuser);
}
