"use client";
import { useAppData } from "@/context/AppContext";
import React, { useEffect } from "react";
import Loading from "@/components/ui/Loading";
import Info from "./components/info";
import Skills from "./components/skills";
import Company from "./components/company";
import { useRouter } from "next/navigation";
import MyApplications from "./components/applications";

const AccountPage = () => {
  const { isAuth, loading, user } = useAppData();

  const router = useRouter();
  useEffect(() => {
    if (!loading && !isAuth) {
      router.push("/login");
    }
  }, [isAuth, loading, router]);

  if (loading) return <Loading />;
  return (
    <>
      {user && (
        <div className="w-[90%] md:w-[60%] m-auto">
          <Info user={user} isYourAccount={true} />
          {user.role === "jobseeker" && (
            <>
              <Skills user={user} isYourAccount={true} />
              <MyApplications   />
            </>
          )}
          {user.role === "recruiter" && <Company />}
        </div>
      )}
    </>
  );
};

export default AccountPage;
