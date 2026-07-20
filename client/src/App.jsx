import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CheckIn from "./pages/CheckIn";
import CheckOut from "./pages/CheckOut";
import Records from "./pages/Records";
import Tracking from "./pages/Tracking";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/checkin" element={<CheckIn />} />

        <Route path="/checkout/:bagId" element={<CheckOut />} />

        <Route path="/records" element={<Records />} />

        <Route path="/tracking" element={<Tracking />} />

        <Route path="/tracking/:bagId" element={<Tracking />} />

      </Routes>

    </BrowserRouter>

  );

}

export default App;