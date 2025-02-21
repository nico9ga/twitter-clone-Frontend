import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./Auth";
import ProfilePage from "./ProfilePage";
import MainPage from "./MainPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/feed" element ={<MainPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
