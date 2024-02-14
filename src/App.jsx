import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <div className="App">
      <Navbar />
      <div>
        <Sidebar />
        <main className="main-container">
          <Home />
          <Projects />
          <About />
          <Contact />
        </main>
      </div>
    </div>
  );
}
