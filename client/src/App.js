import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Alert from "./components/Alert";
import Homepage from "./components/Homepage";
import HateSpeech from "./components/HateSpeech";
import FakeNews from "./components/FakeNews";
import News from "./news/News";
import { MethodState } from "./context/MethodState";
function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (curr,req) => {
    setAlert({ curr:curr,req: req });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };
  let url = "http://localhost:5000/"
  return (
    <>
      <MethodState >
        <Router>
          <Navbar />
          <Alert alert={alert} />
          <div className="container my-5 py-3">
            <Routes className>
              <Route
                exact
                path="/"
                element={<Homepage showAlert={showAlert} url={url} />}
              ></Route>
              <Route
                exact
                path="/detectfakeNews"
                element={<FakeNews showAlert={showAlert} url={url} />}
              ></Route>
              <Route
                exact
                path="/detectHateSpeech"
                element={<HateSpeech showAlert={showAlert} url={url} />}
              ></Route>
              <Route exact path="/news" element={<News url={url}></News>}></Route>
            </Routes>
          </div>
        </Router>
      </MethodState>
    </>
  );
}

export default App;
