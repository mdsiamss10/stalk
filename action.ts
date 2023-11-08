"use server";

import { getServerSession } from "next-auth";
import Pusher from "pusher";
import { authOptions } from "./lib/auth";
import { prisma } from "./lib/db";

export async function postData(text: string) {
  "use server";

  const session = await getServerSession(authOptions);
  await prisma.message.create({
    data: {
      message: text,
      email: session?.user?.email,
    },
    include: {
      User: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
}

interface pushMessageType {
  User: {
    name: string | null | undefined;
    image: string | null | undefined;
  };
  email: string | null | undefined;
  message: FormDataEntryValue | null;
}

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.PUSHER_APP_KEY as string,
  secret: process.env.PUSHER_APP_SECRET as string,
  cluster: "ap2",
  useTLS: true,
});

export async function pushMessage(message: pushMessageType) {
  pusher.trigger("chat", "chat-event", {
    message: `${JSON.stringify(message)}\n\n`,
  });
}

export async function deleteAllMessage() {
  "use server";
  await prisma.message.deleteMany();
}

export interface whoIsTypingProps {
  name: string;
  photo: string;
  email: string;
  isTyping: boolean;
}

export async function whoIsTyping(user: whoIsTypingProps, isTyping: boolean) {
  pusher.trigger("type", "type-event", {
    email: user?.email,
    photo: user?.photo,
    isTyping,
  });
}
