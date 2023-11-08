import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginButton from "./components/LoginButton";

async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/chat");
  }
  return (
    <>
      <div className="max-w-xl mx-auto p-10 mt-32">
        <h1 className="text-4xl font-bold text-center">Insist of privacy.</h1>
        <div className="text-center mt-5">
          <LoginButton buttonText="Let's Hide" />
        </div>
      </div>
    </>
  );
}

export default Home;
