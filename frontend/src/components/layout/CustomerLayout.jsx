import { Outlet } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-radial-[at_25%_25%] from-gray-900 via-gray-950 to-black">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
