import { authOptions } from "@/lib/auth";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import Image from "next/image";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import NavDeleteMsgButton from "./components/NavDeleteMsgButton";
import SessionProvider from "./components/SessionProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stalk | BySiam",
  description: "This app is made by Siam",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <div className="container max-w-3xl px-4 mx-auto flex flex-col">
            <nav className="flex items-center bg-white select-none justify-between py-4">
              <h1 className="text-3xl font-bold cursor-pointer">Stalk</h1>
              {!session ? (
                <LoginButton buttonText="Login" />
              ) : (
                <>
                  <div className="flex items-center gap-5">
                    <div className="dropdown dropdown-bottom dropdown-end">
                      <label tabIndex={0}>
                        <Image
                          src={session.user?.image as string}
                          width={1000}
                          height={1000}
                          quality={100}
                          className="w-14 rounded-full cursor-pointer"
                          alt="Dashboard Image"
                        />
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                      >
                        {session.user?.email ===
                          "ohiduzzamansiam@gmail.com" && (
                          <li>
                            <NavDeleteMsgButton />
                          </li>
                        )}
                        <li>
                          <label>{session.user?.email?.split("@")[0]}</label>
                        </li>
                      </ul>
                    </div>
                    <LogoutButton />
                  </div>
                </>
              )}
            </nav>
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
