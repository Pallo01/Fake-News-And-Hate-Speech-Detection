import React, { useState, useEffect, useContext } from "react";
import Spinner from "../components/Spinner";
import { MethodContext } from "../context/MethodState";

const NewsItem = (props) => {
  let { title, description, imageUrl, newsUrl, author, date, source } = props;
  const context = useContext(MethodContext);
  const { predict, calculatePercentage } = context;
  const [status, setStatus] = useState(1);
  const [loading, setLoading] = useState(0);
  const [results, setresults] = useState({});
  const [percent, setPercent] = useState(null);

  const prediction = async (text) => {
    const url=props.url+"detectNews";
    setStatus(1);
    setLoading(1);
    let res = await predict(url,text);
    if (res.status === "success") {
      setresults(res.result);
      setPercent(await calculatePercentage(res.result));
    } else {
      setStatus(0);
    }
    setLoading(0);
  };
  useEffect(() => {}, [results, percent]);
  return (
    <div className="my-3">
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            position: "absolute",
            right: "0",
          }}
        >
          <span className="badge rounded-pill bg-danger"> {source} </span>
        </div>
        <img
          src={
            !imageUrl
              ? "https://dd7tel2830j4w.cloudfront.net/f1550965374835x373311315531899650/newsapi.svg"
              : imageUrl
          }
          style={{ height: "20em" }}
          className="card-img-top"
          alt="..."
        />
        <div className="card-body">
          <h5 className="card-title"> {title} </h5>
          <p className="card-text"> {description} </p>
          <p className="card-text">
            <small className="text-muted">
              By {!author ? "Unknown" : author}
              on {new Date(date).toGMTString()}
            </small>
          </p>
          <a
            rel="noreferrer"
            href={newsUrl}
            target="_blank"
            className="btn btn-sm btn-dark"
            S
          >
            Read More
          </a>
          {/* Prediction */}
          <div
            style={{ display: "inline", position: "relative", right: "-8rem" }}
            className="card-text container"
          >
            {!loading ? (
              <>
                {status ? (
                  <>
                    {percent == null ? (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => prediction(description)}
                      >
                        Predict
                      </button>
                    ) : (
                      <div
                        style={{
                          display: "table-row",
                          position: "relative",
                          textAlign: "center",
                        }}
                      >
                        <div
                          className={`btn-sm user-select-none ${
                            percent > 70
                              ? "btn-success"
                              : percent >= 40 && percent <= 70
                              ? "btn-warning"
                              : "btn-danger"
                          }`}
                        >
                          &nbsp; {percent}% &nbsp;
                        </div>
                        <div
                          className="retry"
                          onClick={() => prediction(description)}
                        >
                          <i
                            className="fa fa-refresh fa-sm"
                            aria-hidden="true"
                          ></i>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className="d-table-row position-relative"
                    style={{
                      bottom: "-0.2rem",
                      right: "2.5rem",
                      textAlign: "center",
                    }}
                  >
                    <div className="btn-sm btn-danger">Server Error!</div>
                    <div
                      className="retry"
                      onClick={() => prediction(description)}
                    >
                      <i className="fa fa-refresh fa-sm" aria-hidden="true"></i>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <span style={{ position: "absolute" }}>
                <Spinner />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;
