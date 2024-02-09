import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <div className="App">
      <Navbar />
      <div>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}
