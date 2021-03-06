/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**


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
  const rows = [];
  const keyworddata = JSON.parse(localStorage.getItem("keyword_data"));
  for (let i = 0; i < keyworddata.data_neg.title.length; i += 1) {
    rows[i] = {
      headline: keyworddata.data_neg.title[i],
      date: keyworddata.data_neg.date[i],
      score: keyworddata.data_neg.score[i],
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
