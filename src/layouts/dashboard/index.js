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

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import Projects2 from "layouts/dashboard/components/Projects2";
// import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import ReactWordcloud from "react-wordcloud";
// import axios from "axios";
import MDButton from "components/MDButton";
import React, { useState, useEffect } from "react";

function httpGet(theURL) {
  console.log(theURL);
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  return JSON.parse(xmlHttp.responseText);
}
localStorage.setItem("keyword", "");
const start = httpGet("http://172.16.120.19:5000/keyword/".concat(localStorage.getItem("keyword")));
console.log("me3");
localStorage.setItem("keyword_data", JSON.stringify(start));
// keyword 데이터 로드 및 할당

function handleClick() {
  console.log(document.getElementById("keyword").value);
  localStorage.setItem("keyword", document.getElementById("keyword").value);
  const word = httpGet(
    "http://172.16.120.19:5000/keyword/".concat(localStorage.getItem("keyword"))
  );
  localStorage.setItem("keyword_data", JSON.stringify(word));
  window.dispatchEvent(new Event("keyword_data"));
  console.log("me");
}
function handleClick2(word) {
  document.getElementById("keyword").value = word.text;
  console.log(document.getElementById("keyword").value);
  localStorage.setItem("keyword", word.text);
  const words = httpGet(
    "http://172.16.120.19:5000/keyword/".concat(localStorage.getItem("keyword"))
  );
  localStorage.setItem("keyword_data", JSON.stringify(words));
  window.dispatchEvent(new Event("keyword_data"));
  console.log("me2");
}
function Dashboard() {
  console.log("loaded");

  const { tasks } = reportsLineChartData;
  //  const { sum, avg } = reportsBarChartData;
  const [words, setWords] = useState("");
  const [sum, setSum] = useState("");
  const [avg, setAvg] = useState("");
  const [len, setLen] = useState("");
  const [per, setPer] = useState("");
  const [minidx, setMinidx] = useState("");
  const [minval, setMinval] = useState("");
  const [maxidx, setMaxidx] = useState("");
  const [maxval, setMaxval] = useState("");
  const [count, setCount] = useState("");
  const [countval, setCountval] = useState("");
  useEffect(() => {
    window.addEventListener(
      "keyword_data",
      () => {
        const topfreqs = JSON.parse(localStorage.getItem("keyword_data"));
        const topfreqList = [];
        for (let i = 0; i < topfreqs.top_freq.length; i += 1) {
          const item = {
            text: topfreqs.top_freq[i][0],
            value: topfreqs.top_freq[i][1],
          };
          topfreqList.push(item);
        }
        setWords(topfreqList);

        const sumDict = {
          labels: topfreqs.total_sum.date,
          datasets: {
            label: "total_sum",
            data: topfreqs.total_sum.score,
          },
        };
        setSum(sumDict);
        const avgDict = {
          labels: topfreqs.total_avg.date,
          datasets: {
            label: "total_avg",
            data: topfreqs.total_avg.score,
          },
        };

        setAvg(avgDict);
        setLen(topfreqs.total_len);
        setPer(topfreqs.percent);
        setMinidx(topfreqs.min_idx);
        setMinval(topfreqs.min_val);
        setMaxidx(topfreqs.max_idx);
        setMaxval(topfreqs.max_val);
        setCount(topfreqs.count_idx);
        setCountval(topfreqs.count);
      },
      []
    );
  }, false);

  const callbacks = {
    //  getWordColor: (word) => (word.value > 50 ? "blue" : "red"),
    onWordClick: (word) => handleClick2(word),
    //    onWordMouseOver: console.log,
    getWordTooltip: (word) => `${word.text} : ${word.value}`,
  };
  // [${word.value > 50 ? "good" : "bad"}]`,

  const options = {
    colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
    enableTooltip: true,
    deterministic: false,
    fontFamily: "impact",
    fontSizes: [30, 70],
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 1,
    rotations: 3,
    rotationAngles: [0, 50],
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 1000,
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} px={80} display="flex" justifyContent="space-between" alignItems="center">
        <input type="text" id="keyword" />
        <MDButton variant="gradient" color="dark" onClick={() => handleClick()}>
          &nbsp;GO
        </MDButton>
      </MDBox>
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={5}>
            <ReactWordcloud
              words={words}
              callbacks={callbacks}
              size={[600, 400]}
              options={options}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={2} mt={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="관련 기사 수 (전 기간)"
                count={len}
                percentage={{
                  color: "success",
                  amount: `${per} %`,
                  label: "를 차지 (전체기사 대비)",
                }}
              />
            </MDBox>
            <MDBox mb={1.5} mt={5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="긍정점수 최고일"
                count={maxidx}
                percentage={{
                  color: "success",
                  amount: `${maxval}`,
                  label: " 스코어",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="기사 수가 가장 많았던 날"
                count={count}
                percentage={{
                  color: "success",
                  amount: `${countval} 개의 헤드라인`,
                  label: "",
                }}
              />
            </MDBox>
            <MDBox mb={1.5} mt={5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="부정점수 최고일"
                count={minidx}
                percentage={{
                  color: "success",
                  amount: `${minval} `,
                  label: " 스코어",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <Projects2 />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="score sum"
                  description="스코어 합산"
                  date="2017년 이후"
                  chart={sum}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="success"
                  title="score avg"
                  description="스코어 평균"
                  date="2017년 이후"
                  chart={avg}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="수익률"
                  description="Last Campaign Performance"
                  date="2017년 이후"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
