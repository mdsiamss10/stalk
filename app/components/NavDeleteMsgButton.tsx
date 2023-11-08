"use client";

import { deleteAllMessage } from "@/action";

function NavDeleteMsgButton() {
  return (
    <>
      <a
        className="text-red-500"
        onClick={() => {
          void deleteAllMessage();
          location.reload();
        }}
      >
        Delete all messages
      </a>
    </>
  );
}

export default NavDeleteMsgButton;
