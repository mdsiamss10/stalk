import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ChatComponent from "../components/ChatComponent";
import Form from "../components/Form";

async function getData() {
  const data = await prisma.message.findMany({
    select: {
      id: true,
      message: true,
      email: true,
      createdAt: true,
      User: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 50,
  });
  return data;
}

async function getAllUsers() {
  const data = await prisma.user.findMany({
    select: {
      email: true,
      image: true,
    },
  });
  return data.map((user) => ({ ...user, isTyping: false }));
}

async function Chat() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const allChats = await getData();
  const allUsers = await getAllUsers();
  return (
    <>
      <ChatComponent data={allChats as any} allUsers={allUsers as any} />
      <Form />
    </>
  );
}

export default Chat;
