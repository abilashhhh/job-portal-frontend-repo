"use client";
import { Auth_Service, useAppData, User_Service } from "@/context/AppContext";
import axios from "axios";
import { redirect } from "next/navigation";
import React, { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { Label } from "@/components/ui/label";
import { ArrowRight, Briefcase, Lock, Mail, User, Phone, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/Loading";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const { isAuth, setUser, loading, setIsAuth } = useAppData();
  if (loading) return <Loading />;
  if (isAuth) return redirect("/");

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading(true);

    const formData = new FormData();
    formData.append("role", role);
    formData.append("name", name);
    formData.append("phone_number", phoneNumber);
    formData.append("password", password);
    formData.append("email", email);
    if (role === "jobseeker") {
      formData.append("bio", bio);
      if (resume) {
        formData.append("file", resume);
      }
    }

    try {
      const { data } = await axios.post(
        `${Auth_Service}/api/auth/register`,
        formData,
      );
      Cookies.set("token", data.token, {
        expires: 15,
        secure: true,
        path: "/",
      });
      setUser(data.registeredUser);
      setIsAuth(true);
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsAuth(false);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to HireHeaven</h1>
          <p className="text-sm opacity-70">Signup and create a new account</p>
        </div>
        <div className="border border-gray-400 rounded-2xl p-8 shadow-lg backdrop-blur-sm">
          <form onSubmit={submitHandler} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">
                I want to
              </Label>
              <div className="relative">
                <Briefcase className="icon-style" />
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-11 pl-10 pr-7 border-2 border-gray-300 rounded-md bg-transparent"
                  required
                >
                  <option value="" disabled>Select your role</option>
                  <option value="jobseeker">Find a job</option>
                  <option value="recruiter">Hire talents</option>
                </select>
              </div>
            </div>

            {role && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full name
                  </Label>
                  <div className="relative">
                    <User className="icon-style" />
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={name}
                      required
                      className="pl-10 h-11"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="icon-style" />
                    <Input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="+91 1234567"
                      value={phoneNumber}
                      required
                      className="pl-10 h-11"
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="icon-style" />
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="you@example.com"
                      value={email}
                      required
                      className="pl-10 h-11"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="icon-style" />
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="**********"
                      value={password}
                      required
                      className="pl-10 h-11"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {role === "jobseeker" && (
                  <div className="space-y-5 pt-4 border-t border-gray-400">
                    <div className="space-y-2">
                      <Label htmlFor="resume" className="text-sm font-medium">
                        Resume (PDF)
                      </Label>
                      <div className="relative">
                        <FileText className="icon-style" />
                        <Input
                          type="file"
                          id="resume"
                          accept="application/pdf"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setResume(e.target.files[0]);
                            }
                          }}
                          className="h-11 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium">
                        Bio
                      </Label>
                      <div className="relative">
                        <User className="icon-style" />
                        <Input
                          type="text"
                          id="bio"
                          name="bio"
                          placeholder="I am an s/w engg"
                          value={bio}
                          required
                          className="pl-10 h-11"
                          onChange={(e) => setBio(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <Button disabled={btnLoading} className="w-full">
                  {btnLoading ? "Registering..." : "Register"}
                  <ArrowRight size={18} />
                </Button>
              </div>
            )}
          </form>

          <div className="mt-6 pt-6 border-t border-gray-400">
            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link
                href={"/login"}
                className="text-blue-600 font-medium hover:underline transition-all"
              >
                Login here
              </Link>{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
