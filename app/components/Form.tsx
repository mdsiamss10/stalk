/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { postData, pushMessage, whoIsTyping } from "@/action";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

function Form() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formText, setFormText] = useState("");
  const [formTempText, setFormTempText] = useState("");
  const { data: session, status } = useSession();

  let user: any;

  if (status !== "loading") {
    user = {
      name: session?.user?.name,
      email: session?.user?.email,
      photo: session?.user?.image,
    };
  }

  function onClickButton() {
    void whoIsTyping(user as any, false);
  }

  useEffect(() => {
    setFormTempText(formText);
    if (formText.length > 0) {
      void whoIsTyping(user as any, true);
    } else {
      void whoIsTyping(user as any, false);
    }
  }, [formText]);

  return (
    <>
      <div className="w-full py-4 bg-white">
        <form
          action={async () => {
            if (formText.length == 0) return;
            const message = {
              User: {
                name: session?.user?.name,
                image: session?.user?.image,
              },
              email: session?.user?.email,
              message: formText,
            };
            await pushMessage(message);
            await postData(formText);
          }}
          ref={formRef}
          className="w-full flex gap-2"
        >
          <input
            type="text"
            placeholder="Type here..."
            value={formTempText}
            onChange={(e) => {
              setFormText(e.target.value);
            }}
            name="message"
            className="w-full input input-primary"
          />
          <button
            onClick={() => {
              setFormTempText("");
              onClickButton();
            }}
            type="submit"
            className="btn bg-primary text-white"
          >
            SEND
          </button>
        </form>
      </div>
    </>
  );
}

export default Form;
