import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Navbar from "@/components/navbar";
import ApplicationForm from "@/components/application-form";

import StudentDashboard from "@/components/student-dashboard";
import FacultyDashboard from "@/components/faculty-dashboard";
import AdminDashboard from "@/components/admin-dashboard";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [accountType, setAccountType] = useState("");

  const [navBarPage, setNavBarPage] = useState("Dashboard");

  const [searchTerm, setSearchTerm] = useState("");

  const [gotAccType, setGotAccType] = useState(false);

  const fetchAccountType = async () => {
    try {
      const response = await fetch("/makeups/api/check-account-type", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session?.user?.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch account type");
      }

      const data = await response.json();
      setAccountType(data.accountType);
      setGotAccType(true);

    } catch (error) {
      alert("Unauthorized access")
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    } else if (status === "authenticated" && session) {
      fetchAccountType();
    }
  }, [status, router, session]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        navBarPage={navBarPage}
        setNavBarPage={setNavBarPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        userEmail = {session?.user?.email ?? ""}
      />

      <div className="flex-grow">
        {gotAccType && navBarPage === "Dashboard" ? (
          accountType === "admin" ? (
            <AdminDashboard searchTerm={searchTerm}/>
          ) : accountType === "faculty" ? (
            <FacultyDashboard searchTerm={searchTerm}/>
          ) : (
            <StudentDashboard searchTerm={searchTerm}/>
          )
        ) : navBarPage === "Application Form" ? (
          <ApplicationForm user={session?.user?.name ?? ""} email={session?.user?.email ?? ""}/>
        ) : (
          <div>Error</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
