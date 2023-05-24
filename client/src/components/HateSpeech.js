import React, { useState, useContext, useEffect } from "react";
import { MethodContext } from "../context/MethodState";
import Spinner from "./Spinner";

function HateSpeech(props) {
  const context = useContext(MethodContext);
  const { predict, calculatePercentage,countWords } = context;
  const [speechText, setSpeechText] = useState("");
  const [loading, setLoading] = useState(0);
  const [status, setStatus] = useState(1);
  const [results, setResults] = useState([]);
  const [refresh,setRefresh]=useState(0);

  const handleOnChange = (event) => {
    setSpeechText(event.target.value);
  };

  const loaddata = async () => {
    if ("speechResults" in localStorage) {
      let localRes = JSON.parse(localStorage.getItem("speechResults"));
      setResults(localRes);
    }
     else {
      localStorage.setItem("speechResults", "[]");
    }
  };

  const handleUpClick = async (e) => {
    setRefresh(0)
    e.preventDefault();
    if (countWords(speechText) < 2) {
      props.showAlert("Invalid Input",`Enter atleast 2 words,current words: ${countWords(speechText)}`,"danger");
      return;
    }
    setStatus(1);
    setLoading(1);
    const url = props.url+"detectSpeech"
    let res = await predict(url,speechText);
    if (res.status === "success") {
      res.result.percent = await calculatePercentage(res.result);
      res.result.text = speechText;
      console.log(res.result)
      let localRes = await JSON.parse(localStorage.getItem("speechResults"));
      localRes.push(res.result);
      localStorage.setItem("speechResults", JSON.stringify(localRes));
    } else {
      setStatus(0);
    }
    setSpeechText("");
    setLoading(0);
    setRefresh(1)
  };

  const deleteResult = async (index) => {
    setRefresh(0)
    let localRes = await JSON.parse(localStorage.getItem("speechResults"));
    localRes.splice(index, 1);
    localStorage.setItem("speechResults", JSON.stringify(localRes));
    setRefresh(1)
  };
  useEffect(() => {
    document.title = `Detect Speech`;
    loaddata();
  }, [refresh]);
  return (
    <>
      <div className="container my-3">
        <h1 style={{ textAlign: "left" }}>Detect Hate Speech</h1>
        <div className="card ">
          <div className="card-body">
            <h5 className="card-title">Add a Speech</h5>
            <div className="form-group">
              <textarea
                value={speechText}
                placeholder="Write your speech here..."
                onChange={handleOnChange}
                required
                className="form-control"
                id="addTxt"
                rows="5"
              ></textarea>
            </div>
            <button
              type="submit"
              onClick={handleUpClick}
              name="predict"
              className="btn btn-primary my-2"
              id="addBtn"
            >
              Detect
            </button>
            {loading ? <Spinner></Spinner> : <></>}
            {!status ? (
              <div className="text-danger placeholder d-flex justify-content-center">
                !!!Failed to Predict, Seems issue from server side
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <hr />
        <h1>Your Results</h1>
        <hr />
        <div id="notes" className="row container-fluid">
          {results.map((elem, key) => (
            <div
              key={key}
              className="noteCard my-2 mx-2 card "
              style={{ width: "20rem", display: "block" }}
            >
              <span
                style={{ float: "right", cursor: "pointer" }}
                onClick={() => deleteResult(key)}
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </span>
              <div className="card-body">
                <h5
                  className={`btn-sm user-select-none text-center ${
                    elem.percent >= 50 ? "btn-danger" : "btn-success"
                  }`}
                >
                  {elem.percent >= 50 ? "Hate Speech" : "Not a Hate Speech"}
                </h5>
                <p className="card-text ">{elem.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default HateSpeech;
