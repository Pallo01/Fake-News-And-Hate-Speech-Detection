import React, { useEffect, useState } from "react";
import NewsItem from "./DatasetNewsItem";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "./Spinner";
import testNews from "../api/testNews.json";
import img from "./img/kaggle.png"

const LatestNews = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const FetchNewsLocal = () => {
    testNews.sort(function (a, b) {return Math.random() - 0.5;});
    setLoading(true);
    setTotalResults(testNews.length);
    setArticles(testNews.slice(0, page * 6));
    setLoading(false);
  };

  const fetchMoreNews = () => {
    setArticles(articles.concat(testNews.slice(6 * page, 6 * (page + 1))));
    setPage(page + 1);
  };

  useEffect(() => {
    document.title = `Testing News from Datasets`;
    FetchNewsLocal();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="news">
      <h1
        className="text-center"
        style={{ margin: "35px 0px", marginTop: "90px" }}
      >
        Untrained News From the Datasets
      </h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreNews}
        hasMore={articles.length !== totalResults}
      ></InfiniteScroll>
      <div className="container">
        <div className="row">
          {articles.map((element, index) => {
            return (
              <div className="col-md-4" key={index}>
                <NewsItem
                  title={element.title ? element.title : ""}
                  text={element.text ? element.text : ""}
                  imageUrl={img}
                  author={"Unknown "}
                  date={element.date}
                  source={"kaggle.com"}
                  url={props.url}
                  showAlert={props.showAlert}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LatestNews;
