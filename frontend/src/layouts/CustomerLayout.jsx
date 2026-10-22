import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />
      {/* pt-20 to clear the fixed announcement bar (32px) + navbar (56px) + small gap */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
