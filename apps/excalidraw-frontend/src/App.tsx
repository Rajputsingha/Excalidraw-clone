import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./Signin/Signini";
import Signup from "./Signup/Signup";
import "./App.css";
import LandingPage from "./LandingPage";
import CanvasPage from "./canvas/page";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />

          {/* FIXED */}
          <Route path="/canvas/:roomId" element={<CanvasPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

