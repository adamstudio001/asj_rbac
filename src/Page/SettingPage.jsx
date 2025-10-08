import React, { useEffect, useState } from "react";
import { formatDistanceToNowStrict, isValid } from "date-fns";
import clsx from "clsx";
import Navbar from "@src/Components/Navbar";
import { useSearch } from "@src/Providers/SearchProvider";

const SettingPage = () => {
  const { search, setSearch } = useSearch();

  useEffect(()=>{
    setSearch("");
  },[]);

  return (
    <>
      <Navbar />

      <main className="flex-1 items-center p-6 overflow-auto">
      
      </main>
    </>
  );
};

export default SettingPage;
