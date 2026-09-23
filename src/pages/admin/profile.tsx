import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function AdminProfilePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard?tab=profile");
  }, [router]);

  return (
    <>
      <Head>
        <title>Admin Profile | International Institute of Law & Politics</title>
      </Head>
      <div className="min-h-screen bg-[#f4faff] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-[#00bfff] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[#00698c] font-sans font-medium">Opening Profile Settings...</p>
      </div>
    </>
  );
}
