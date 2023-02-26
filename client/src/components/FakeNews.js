import React, { useState,useContext,useEffect } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import Spinner from "./Spinner";
import { MethodContext } from "../context/MethodState";
function Homepage(props) {
  const context = useContext(MethodContext);
  const { predict, results,calculatePercentage } = context;

  const [newsText, setnewsText] = useState("");
  const [percentage, setPercentage] = useState(null);
  const [loading, setLoading] = useState(0);
  const [status, setStatus] = useState(1);

  const handleOnChange = (event) => {
    setnewsText(event.target.value);
  };

  function renameModel(old) {
    if (old === "CNN") return "Convolutional Neural Networks (CNNs)";
    else if (old === "RNN") return "Recurrent Neural Networks (RNNs)";
    else if (old === "SVM") return "Support Vector Machine";
    return old;
  }
  function countWords(text) {
    return text.split(/\s+/).filter((element) => {
      return element.length !== 0;
    }).length;
  }
  const handleUpClick = async (e) => {
    e.preventDefault();
    const url = props.url+"detectNews"
    setStatus(1);
    if (countWords(newsText) < 10) {
      props.showAlert(countWords(newsText),10);
      return;
    }
    setLoading(1);
    let res = await predict(url,newsText);
    if (res.status === "success") {
      setPercentage(await calculatePercentage(res.result));
    } else {
      setStatus(0);
    }
    setLoading(0);
  };
  useEffect(() => {
    document.title = `Fake News Detection`;
  }, [newsText,results,percentage]);

  return (
    <div>
      <p style={{ textAlign: "center" }}>
        A fake news detection web application using Deep Learning algorithms,
        developed using Python and React.js.
      </p>
      <p style={{ textAlign: "center" }}>Enter your text to try it.</p>
      <br />
      <div className="container">
        <form>
          <div className="col-three-forth text-center col-md-offset-2">
            <div className="form-group">
              <textarea
                className="form-control jTextarea mt-3"
                id="Textarea'"
                rows="5"
                name="text"
                placeholder="Write your news here..."
                value={newsText}
                onChange={handleOnChange}
                required
              ></textarea>
              <br />
              <button
                className="btn btn-primary btn-outline btn-md"
                type="submit"
                onClick={handleUpClick}
                name="predict"
              >
                Detect
              </button>
            </div>
          </div>
        </form>
      </div>
      <br />
      {loading ? <Spinner /> : <></>}
      {status ? (
        <div style={{ textAlign: "center" }}>
          <strong>
            Prediction
            <ProgressBar
              bgColor="#0d6efd"
              height="60px"
              completed={percentage==null?0:percentage}
              customLabel={percentage + "% True"}
            />
            <h5>{percentage}%</h5>
          </strong>
          {percentage !==null ? (
            <>
              <span className="placeholder col-6">
                The prediction percentage is based on Results of all the models
              </span>
              <br />
              <br />
              <div className="collapseWindow ">
                <p>
                  <button
                    className="btn btn-primary"
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapseExample"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                  >
                    Click to View Results Individually
                  </button>
                </p>
                <div className="collapse" id="collapseExample">
                  <ul style={{ textAlign: "initial" }} className="list-group">
                    {Object.keys(results)
                      .sort()
                      .map((model, key) => (
                        <li className="list-group-item" key={key}>
                          {renameModel(model)}&emsp;:&emsp;
                          <div
                            className={
                              results[model] === "1"
                                ? "btn btn-success btn-sm"
                                : "btn btn-danger btn-sm"
                            }
                          >
                            {results[model] === "1" ? "Real" : "Fake"}
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className="text-danger placeholder d-flex justify-content-center">
          !!!Failed to Predict, Seems issue from server side
        </div>
      )}
    </div>
  );
}

export default Homepage;
