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
console.log(JSON.parse(localStorage.getItem("keyword_data")).total_sum.date.slice(2, 100));
console.log(JSON.parse(localStorage.getItem("keyword_data")).total_sum.score.slice(2, 100));
export default {
  sum: {
    labels: JSON.parse(localStorage.getItem("keyword_data")).total_sum.date.slice(2, 100),
    datasets: {
      label: "total_sum",
      data: JSON.parse(localStorage.getItem("keyword_data")).total_sum.score.slice(2, 100),
    },
  },
  avg: {
    labels: JSON.parse(localStorage.getItem("keyword_data")).total_avg.date.slice(2, 100),
    datasets: {
      label: "total_avg",
      data: JSON.parse(localStorage.getItem("keyword_data")).total_avg.score.slice(2, 100),
    },
  },
};
