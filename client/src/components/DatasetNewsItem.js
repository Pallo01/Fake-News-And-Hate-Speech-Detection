import React, { useState, useEffect, useContext } from "react";
import Spinner from "./Spinner";
import { MethodContext } from "../context/MethodState";

const NewsItem = (props) => {
  let { title, text, imageUrl, author, date, source } = props;
  const context = useContext(MethodContext);
  const { predict, calculatePercentage } = context;
  const [status, setStatus] = useState(1);
  const [loading, setLoading] = useState(0);
  const [results, setresults] = useState({});
  const [percent, setPercent] = useState(null);
  const [description,setDesc]=useState(text.substr(0,300))

  const prediction = async (text) => {
    console.log(text)
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
  const copyText=async(txt)=>{
    navigator.clipboard.writeText(txt);
    props.showAlert("Copied","News Copied to Clipboard","success",1000)
  }

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
          style={{ height: "10em" }}
          className="card-img-top"
          alt="..."
        />
        <div className="card-body">
          <h5 className="card-title"> {title}
          <div style={{float:"right"}}>
            <span style={{marginRight:"20px",paddingLeft:"5px"}} onClick={()=>setDesc(text.substr(0,300))}><i className="fa fa-arrow-up fa-sm retry" aria-hidden="true"></i></span>
            <span onClick={()=>copyText(text)}><i className="fa fa-clipboard retry" aria-hidden="true"></i></span>
          </div>
          </h5>
          <p className="card-text"> {description} </p>
          <p className="card-text">
            <small className="text-muted">
              By {!author ? "Unknown" : author}
              on {new Date(date).toGMTString()}
            </small>
          </p>
          <button
            rel="noreferrer"
            onClick={()=>setDesc(text)}
            target="_blank"
            className="btn btn-sm btn-dark"
            
          >
            Read More
          </button>
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
                        onClick={() => prediction(text)}
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
                          onClick={() => prediction(text)}
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
                      onClick={() => prediction(text)}
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
