import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../components/Spinner";
import news from "./api/news.json";

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const FetchNewsLocal = () => {
    setLoading(true);
    setTotalResults(news.articles.length);
    setArticles(news.articles.slice(0, page * 6));
    setLoading(false);
  };

  const fetchMoreNews = () => {
    setArticles(articles.concat(news.articles.slice(6 * page, 6 * (page + 1))));
    setPage(page + 1);
  };

  useEffect(() => {
    document.title = `Latest Live News`;
    FetchNewsLocal();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="news">
      <h1
        className="text-center"
        style={{ margin: "35px 0px", marginTop: "90px" }}
      >
        Latest News Headlines
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
                  description={element.description ? element.description : ""}
                  imageUrl={element.urlToImage}
                  newsUrl={element.url}
                  author={element.author}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default News;
