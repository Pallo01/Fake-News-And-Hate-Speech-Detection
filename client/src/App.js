import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Alert from "./components/Alert";
import Homepage from "./components/Homepage";
import HateSpeech from "./components/HateSpeech";
import FakeNews from "./components/FakeNews";
import LatestNews from "./components/LatestNews";
import DatasetNews from "./components/DatasetNews";
import { MethodState } from "./context/MethodState";
function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (msg,text,label,time=2000) => {
    setAlert({ msg:msg,text:text,label:label});
    setTimeout(() => {
      setAlert(null);
    }, time);
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
                element={<LatestNews showAlert={showAlert} url={url} />}
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
              <Route exact path="/latestNews" element={<LatestNews showAlert={showAlert} url={url}></LatestNews>}></Route>
              <Route exact path="/datasetNews" element={<DatasetNews showAlert={showAlert} url={url}></DatasetNews>}></Route>
            </Routes>
          </div>
        </Router>
      </MethodState>
    </>
  );
}

export default App;
