import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import LogIn from "./components/LogIn/LogIn";
import SignUp from "./components/SignUp/SignUp";
import SlotBook from "./components/SlotBooking/SlotBook";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogIn />} />

          <Route path="/signup" element={<SignUp />} />

          <Route path="/slotbook" element={<SlotBook />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
