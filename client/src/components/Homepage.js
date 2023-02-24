import React, { useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import Axios from "axios";
import Spinner from "./Spinner";

function Homepage(props) {
  const [newsText, setnewsText] = useState("");
  const [results, setresults] = useState({});
  const [percentage, setPercentage] = useState(null);
  const [loading, setLoading] = useState(0);
  const [status, setStatus] = useState(1);

  const handleOnChange = (event) => {
    setnewsText(event.target.value);
  };

  function calculatePercentage(result) {
    let models = Object.keys(result);
    let total = 0,
      totalReal = 0;
    models.forEach((i) => {
      if (result[i] === "1") {
        totalReal = totalReal + 1;
      }
      total = total + 1;
    });
    let percent = (totalReal / total) * 100;
    setPercentage(Math.ceil(percent));
    return result;
  }

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
    setStatus(1);
    if (countWords(newsText) < 10) {
      props.showAlert(countWords(newsText));
      return;
    }
    setLoading(1);
    try {
      const response = await Axios.post(props.url, { text: newsText });
      let res = await response.data;
      if (res.status === "success") {
        res = await calculatePercentage(res.result);
        setresults(res);
      } else {
        setStatus(0);
      }
    } catch (err) {
      console.log(err);
      setStatus(0);
    } finally {
      setLoading(0);
    }
  };

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
                placeholder="Write your text here..."
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
                Predict
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
              completed={percentage}
              customLabel={percentage + "% True"}
            />
            <h5>{percentage}%</h5>
          </strong>
          {Object.keys(results).length !== 0 ? (
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
