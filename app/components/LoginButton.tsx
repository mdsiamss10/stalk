"use client";

import { signIn } from "next-auth/react";

function LoginButton({ buttonText }: { buttonText: string }) {
  return (
    <button
      className="btn btn-neutral"
      onClick={() => {
        void signIn("auth0");
      }}
    >
      {buttonText}
    </button>
  );
}

export default LoginButton;
