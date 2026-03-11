"use client";
import { useAppData, User_Service } from "@/context/AppContext";
import { User } from "@/lib/type";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Loading from "@/components/ui/Loading";
import Info from "../components/info";
import Skills from "../components/skills";

const UserAccountPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const {isAuth} = useAppData()

    const router = useRouter();
    useEffect(() => {
      if (!loading && !isAuth) {
        router.push("/login");
      }
    }, [isAuth, loading, router]);

  async function fetchUser() {
    const token = Cookies.get("token");
    try {
      const { data } = await axios.get(
        `${User_Service}/api/users/userProfile/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUser(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading) return <Loading />;

  return (
    <>
      {user && (
        <div className="w-[90%] md:w-[60%] m-auto">
          <Info user={user} isYourAccount={false} />
          {user.role === "jobseeker" && (
            <Skills user={user} isYourAccount={false} />
          )}{" "}
        </div>
      )}
    </>
  );
};

export default UserAccountPage;
