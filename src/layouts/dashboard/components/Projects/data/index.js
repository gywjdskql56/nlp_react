/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Images
//  function httpGet(theURL) {
//  console.log(theURL);
//  const xmlHttp = new XMLHttpRequest();
//  xmlHttp.open("GET", theURL, false);
//  xmlHttp.send(null);
//  return JSON.parse(xmlHttp.responseText);
//  }
export default function data() {
  //  const keyworddata = httpGet("http://127.0.0.1:5001/keyword/");
  //  localStorage.setItem("keyword_data", JSON.stringify(keyworddata));
  const keyworddata = JSON.parse(localStorage.getItem("keyword_data"));
  const rows = [];
  for (let i = 0; i < 10; i += 1) {
    rows[i] = {
      headline: keyworddata.data_pos.title[i],
      date: keyworddata.data_pos.date[i],
      score: keyworddata.data_pos.score[i],
    };
  }

  return {
    columns: [
      { Header: "Headline", accessor: "headline", width: "30%", align: "left" },
      { Header: "Date", accessor: "date", width: "7%", align: "left" },
      { Header: "Score", accessor: "score", align: "left" },
    ],
    rows,
  };
}
