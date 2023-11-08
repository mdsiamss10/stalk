/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import moment from "moment";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Pusher from "pusher-js";
import { useEffect, useRef, useState } from "react";

interface messageProps {
  id: string;
  email: string | null;
  message: string;
  User: {
    image: string | null;
    name: string | null;
  } | null;
  createdAt: Date;
}

interface allUsersProps {
  email: string | null;
  image: string | null;
  isTyping: boolean;
}

function fromNow(createdAt: Date) {
  return moment(createdAt).fromNow();
}

function ChatComponent({
  data,
  allUsers,
}: {
  data: messageProps[];
  allUsers: allUsersProps[];
}) {
  const { data: session, status } = useSession();
  const [messageData, setMessageData] = useState(data);
  const [isMessageLoading, setIsMessageLoading] = useState(true);
  const messageEndRef = useRef<HTMLInputElement>(null);
  const [whoIsTyping, setWhoIsTyping] = useState<allUsersProps[] | []>([]);
  const pusher = new Pusher("bddcf695493a197412a3", {
    cluster: "ap2",
  });

  useEffect(() => {
    const channel = pusher.subscribe("chat");
    channel.bind("chat-event", function (data: any) {
      setMessageData((prev) => [...prev, JSON.parse(data.message)]);
    });
    return () => channel.unsubscribe();
  }, []);

  useEffect(() => {
    if (whoIsTyping.length === 0) {
      setWhoIsTyping(allUsers);
    }
  }, []);

  useEffect(() => {
    const channel = pusher.subscribe("type");
    channel.bind("type-event", function (data: allUsersProps) {
      setWhoIsTyping((prevUsers) => {
        const i = prevUsers.findIndex((user) => user.email === data.email);
        if (i !== -1) {
          const newArray = [...prevUsers];
          newArray[i].isTyping = data.isTyping;
          return newArray;
        }
        return prevUsers;
      });
    });

    return () => channel.unsubscribe();
  }, []);

  useEffect(() => {
    setIsMessageLoading(status === "loading");
  }, [status]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageData]);
  if (isMessageLoading) {
    return (
      <div className="flex-1 grid place-content-center">
        <span className="loading loading-infinity w-[5rem] text-primary"></span>
      </div>
    );
  }

  if (messageData.length === 0) {
    return (
      <div className="flex-1 grid place-content-center">
        <span className="text-slate-700">No message available.</span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      {messageData.map((chat, index) => (
        <>
          <div key={index}>
            {/* @ts-ignore */}
            {session?.user?.email == chat.email ? (
              <>
                <div className="flex flex-col text-right gap-0 my-3">
                  <div className="flex items-center justify-end ml-auto">
                    <div className="chat chat-end">
                      <div className="chat-bubble max-w-[100%] bg-primary text-white whitespace-pre-wrap">
                        {chat.message}
                      </div>
                    </div>
                  </div>
                  <p className="mr-1 text-sm text-slate-400">
                    {fromNow(chat.createdAt)}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-start mr-auto gap-2 my-3">
                  {allUsers.map((user) => (
                    <>
                      <Image
                        src={chat.User?.image as string}
                        width={1000}
                        height={1000}
                        className={`w-10 rounded-full ${
                          user.isTyping && user.email !== session?.user?.email
                            ? "border-4 border-primary transition-all rounded-full"
                            : ""
                        } ${user.email !== session?.user?.email && "hidden"}`}
                        alt="Image"
                      />
                    </>
                  ))}
                  <div>
                    <div className="chat chat-start">
                      <div className="chat-bubble max-w-[100%] text-gray-900 bg-slate-200 whitespace-pre-wrap">
                        {chat.message}
                      </div>
                    </div>
                    <p className="mr-1 text-sm text-slate-400 ml-1">
                      {fromNow(chat.createdAt)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      ))}
      <div ref={messageEndRef} />
    </div>
  );
}

export default ChatComponent;
