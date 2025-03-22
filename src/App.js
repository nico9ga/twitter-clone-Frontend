import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./Auth";
import ProfilePage from "./ProfilePage";
import MainPage from "./MainPage";
import EditProfilePage from "./EditProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/feed" element ={<MainPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/profile/:username/edit" element={<EditProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
