import { NextResponse } from "next/server";
import connectToDatabase from "@/helper/server-helper";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export async function POST(request: Request) {
  const data = await request.json();

  const { userName, userBio } = data;

  const prompt = `Recommend me the username and bio based on the given userName:${userName} and userBio:${userBio}  and provide the response in form of a json where two fields are userName and userBio`;

  console.log(data);

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
