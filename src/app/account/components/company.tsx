"use client";
import { Job_Service, useAppData } from "@/context/AppContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const Company = () => {
  const { loading } = useAppData();
  const addRef = useRef<HTMLButtonElement | null>(null);
  const openDialog = () => {
    addRef?.current?.click();
  };

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [companies, setCompanies] = useState([]);

  const clearData = () => {
    setName("");
    setDescription("");
    setWebsite("");
    setLogo(null);
  };

  const token = Cookies.get("token");

  async function fetchCompanies() {
    try {
      const { data } = await axios.get(
        `${Job_Service}/api/job/getCompany/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCompanies(data);
      //   setCompanies(data.companies);
    } catch (error: any) {
      console.log(error);
    }
  }

  
  useEffect(() => {
    fetchCompanies();
  }, []);
  return <div>Company</div>;
};

export default Company;
