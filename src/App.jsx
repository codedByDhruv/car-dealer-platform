import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserApp from "./routes/UserApp";
import AdminApp from "./routes/AdminApp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User website routes */}
        <Route path="/*" element={<UserApp />} />

        {/* Admin panel routes */}
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
