import { useState, useRef, useEffect } from "react";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { getServerSession } from "next-auth";
import { redirect, useRouter } from "next/navigation";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import { useSession } from "next-auth/react";
import { Toaster } from "sonner";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [userdata, setUserData] = useState();
  const { data: session, status } = useSession();
  const router = useRouter();
  // console.log(session);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    } else {
      setUserData(session.user);
    }
  }, [session, status, router]);

  // use the code below if you want to use server session in backend
  //     const session = await getServerSession(authOptions);
  //     if (!session) {
  //       redirect("/login");
  //     }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = async () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
    });
    router.push("/");
  };
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Toaster />
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        logout={logout}
      />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <Header
          setSidebarOpen={setSidebarOpen}
          setProfileDropdownOpen={setProfileDropdownOpen}
          profileDropdownOpen={profileDropdownOpen}
          dropdownRef={dropdownRef}
          userData={userdata}
          logout={logout}
        />

        {/* Main Content Area with Scroll */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <div className="container-fluid mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
