import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserApp from "./routes/UserApp";
import AdminApp from "./routes/AdminApp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin panel routes FIRST */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* User website routes */}
        <Route path="/*" element={<UserApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
