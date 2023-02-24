import fetch from "node-fetch";
import fs from "fs";
import { parse as json2csv } from "json2csv";
import createCsvParser from "csv-parser";

let category = [
  "general",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];
let fields = [
  "author",
  "title",
  "text",
  "url",
  "urlToImage",
  "subject",
  "date",
];
let rows = [];

const fetchnews = async (category) => {
  let parsedData;
  try {
    let data = await fetch(
      `https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=4505aaf4588f4ae094549d614e8701fd&pageSize=100`
    );
    parsedData = await data.json();
    // data = JSON.stringify(parsedData);
    console.log(parsedData.articles.length);
    news[category] = parsedData.a;
    news.articles.concat
  } catch (err) {
    console.log(`Error in fetching ${category} news`);
    return;
  }
  for (let i = 0; i < parsedData.articles.length; i++) {
    let newsData = {
      author: "",
      title: "",
      text: "",
      url: "",
      urlToImage: "",
      subject: "",
      date: "",
      source: "",
    };
    try {
      newsData.author = await parsedData.articles[i].author;
      newsData.title = await parsedData.articles[i].title;
      newsData.text = await parsedData.articles[i].description;
      newsData.url = await parsedData.articles[i].url;
      newsData.urlToImage = await parsedData.articles[i].urlToImage;
      newsData.subject = category;
      newsData.date = await parsedData.articles[i].publishedAt.substring(0, 10);
      newsData.source = await parsedData.articles[i].source.name;
      rows.push(newsData);
    } catch (err) {
      console.log(`Error encountered in ${category} , index: ${i}`);
      console.error(err);
    }
  }
};
const writeData = async (filename, fields, data) => {
  rows = json2csv(data, { header: true });
  // Append file function can create new file too.
  fs.writeFileSync(filename, rows);
  fs.appendFileSync(filename, "\r\n");
};

let Fetch = async () => {
  for (var i = 0; i < 7; i++) {
    console.log(`Fetching ${category[i]} News....`);
    await fetchnews(category[i]);
  }

  if (rows.length !== 0) {
    await writeData("News.csv", fields, rows);
    console.log("News Added to News.csv");
  } else {
    console.log("No news to add");
  }

  const results = [];
  const set = new Set();
  fs.createReadStream("News.csv")
    .pipe(createCsvParser())
    .on("data", (data) => {
      let subject = data.subject;
      data.subject = "";
      const dataAsString = JSON.stringify(data);
      if (!set.has(dataAsString)) {
        set.add(dataAsString);
        data.subject = subject;
        results.push(data);
      }
    })
    .on("end", () => {
      console.log("Removing Duplicates");
      writeData("News.csv", fields, results);
      console.log("Duplicates Removed");
    });
  return results;
};
await Fetch();
export { Fetch };
