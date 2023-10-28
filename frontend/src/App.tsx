import "./App.css";

import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import { Payments } from "./payments";
import { Profile } from "./profile";

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/payments">Payments</Link>
          </li>
          <li>
            <Link to="/customers">Profile</Link>
          </li>
        </ul>
      </nav>

      <div className="App">
        <Outlet />
      </div>
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="payments" element={<Payments />} />
          <Route path="customers" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
