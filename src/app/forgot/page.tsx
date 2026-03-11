"use client";

import { Auth_Service, useAppData } from "@/context/AppContext";
import axios from "axios";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ForgotPage = () => {
  const [email, setEmail] = useState("");
  const [btnLoading, setbtnLoading] = useState(false);
  const { isAuth } = useAppData();

  if (isAuth) return redirect("/");
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setbtnLoading(true);

    try {
      const { data } = await axios.post(`${Auth_Service}/api/auth/forgot-password`, {
        email,
      });

      toast.success(data.message);
      setEmail("")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setbtnLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Forgot Password</h1>
          <p className="text-sm opacity-70">Enter your email to reset your password</p>
        </div>

        <div className="border border-gray-400 rounded-2xl p-8 shadow-lg backdrop-blur-sm">
          <form onSubmit={submitHandler} className="space-y-5">

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>

              <div className="relative">
                <Mail className="icon-style" />

                <Input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={email}
                  required
                  className="pl-10 h-11"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <Button disabled={btnLoading} className="w-full">
              {btnLoading ? "Sending..." : "Send Reset Link"}
              <ArrowRight size={18} />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-400">
            <p className="text-center text-sm">
              Remember your password? {" "}
              <Link
                href="/login"
                className="text-blue-600 font-medium hover:underline transition-all"
              >
                Back to login
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPage;
