"use client";
import { useAppData } from "@/context/AppContext";
import React from "react";
import Loading from "@/components/ui/Loading";
import Info from "./components/info";
import Skills from "./components/skills";
import Company from "./components/company";
import { redirect } from "next/navigation";

const AccountPage = () => {
  const { isAuth, loading, user } = useAppData();

  if (!isAuth) return redirect("/login");
  if (loading) return <Loading />;
  return (
    <>
      {user && (
        <div className="w-[90%] md:w-[60%] m-auto">
          <Info user={user} isYourAccount={true} />
          {user.role === "jobseeker" && (
            <Skills user={user} isYourAccount={true} />
          )}
          {user.role === "recruiter" && <Company />}
        </div>
      )}
    </>
  );
};

export default AccountPage;
