"use client";

import { signOut } from "next-auth/react";

function LogoutButton() {
  return (
    <>
      <label
        onClick={() => {}}
        htmlFor="my_modal_7"
        className="btn text-white bg-red-500"
      >
        Logout
      </label>
      <input type="checkbox" id="my_modal_7" className="modal-toggle" />
      <div className="modal text-black">
        <div className="modal-box text-center">
          <h3 className="text-lg font-bold">
            Are you sure you want to logout?
          </h3>
          <button
            onClick={() => {
              void signOut();
            }}
            className="btn bg-red-500 mt-3 text-white"
          >
            Yes!!!
          </button>
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_7">
          Close
        </label>
      </div>
    </>
  );
}

export default LogoutButton;
