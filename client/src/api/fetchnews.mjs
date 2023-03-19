import { createRequire } from "module";
const require = createRequire(import.meta.url);
import fetch from "node-fetch";
import fs from "fs";

let category = [
  "general",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];
let news = { articles: [] };

const fetchnews = async (category) => {
  let data = await fetch(
    `https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=4505aaf4588f4ae094549d614e8701fd&pageSize=100`
  );
  let parsedData = await data.json();
  for (let i = 0; i < parsedData.articles.length; i++) {
    parsedData.articles[i]["subject"] = category;
    try {
      news.articles.push(parsedData.articles[i]);
    } catch (err) {
      console.log(`Error encountered in ${category} , index: ${i}`);
      console.error(err);
    }
  }
};

const Fetch = async () => {
  for (var i = 0; i < 7; i++) {
    try {
      console.log(`${i + 1}.Fetching ${category[i]} News`);
      await fetchnews(category[i], i);
    } catch (e) {
      console.log(`Error while fetching ${category[i]} news from api`);
    }
  }
};

const removeDuplicates = () => {
  if (news.articles.length < 50) {
    console.log("News not updated , because less or no data fetched");
    return;
  }
  const results = [];
  const set = new Set();
  console.log("Removing Duplicates");
  news.articles.forEach((element) => {
    let subject = element.subject;
    element.subject = "";
    const dataAsString = JSON.stringify(element);
    if (!set.has(dataAsString)) {
      set.add(dataAsString);
      element.subject = subject;
      results.push(element);
    }
  });
  console.log("Duplicates Removed");
  news.articles = results;
  try {
    news = JSON.stringify(news);
    fs.writeFileSync(`news.json`, news);
    console.log("All the fetched News Updated Successfully");
  } catch (err) {
    console.log(`Error Updating ${category[i]} News`, err);
  }
  console.log(`Total ${results.length} News Fetched`);
};
await Fetch();
removeDuplicates();
export default Fetch;
