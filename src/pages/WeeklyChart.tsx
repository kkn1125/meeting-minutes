// TODO: 주단위 차트 렌더링
// TODO: 카카오톡 저장하기 기능 추가

import { Button, Chip, Stack, Typography } from "@mui/material";
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";
import { DocumentationManager } from "../model/documentation.manager";
import Minutes from "../model/minutes";
import { format } from "../util/features";

ChartJS.register(
  ArcElement,
  BarController,
  BarElement,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale
);

const beforeMonthTime = new Date();
const nextMonthTime = new Date();
const currentTime = new Date();
const _year = currentTime.getFullYear();
const _month = currentTime.getMonth();
const _date = currentTime.getDate();
beforeMonthTime.setMonth(beforeMonthTime.getMonth() - 1);
nextMonthTime.setMonth(nextMonthTime.getMonth() + 1);

function WeeklyChart() {
  const docuManager = new DocumentationManager();
  const [today, setToday] = useState(new Date(_year, _month, _date));
  const [weekDateList, setWeekDateList] = useState([]);
  const [documentations, setDocumentations] = useState<Minutes[][]>([]);
  const [subDatas, setSubDatas] = useState([]);

  useEffect(() => {
    const [start, end] = calulateWeek();
    const docuList = docuManager.findGroupByTime(start, end);
    setDocumentations(docuList);

    // const result: Minutes[][] = docuList.map((_) =>
    //   Object.values(
    //     _.reduce((acc, cur) => {
    //       if (!acc[cur.category]) {
    //         acc[cur.category] = [];
    //       }
    //       acc[cur.category].push(cur);
    //       return acc;
    //     }, {})
    //   )
    // );

    // const dataSet = result.map((_) =>
    //   _.length > 0
    //     ? {
    //         label: "Category: " + _[0]?.[0]?.category,
    //         data: _,
    //         borderWidth: 1,
    //         backgroundColor: "grey",
    //       }
    //     : {}
    // );

    // console.log(dataSet);
    // setSubDatas(dataSet);
  }, [today]);

  function currentWeek() {
    setToday(new Date(_year, _month, _date));
  }

  function calulateWeek() {
    const year = today.getFullYear();
    const month = today.getMonth();
    const startWeekIndex = new Date(year, month, 1).getDay();
    const date = today.getDate();
    const day = today.getDay();

    const aver = date + startWeekIndex;
    const week = Math.floor(aver / 7);

    const dateList = [];
    for (let i = date - day; i < date - day + 7; i++) {
      const dayPrint = new Date(year, month, i);
      dateList.push(dayPrint);
    }
    setWeekDateList(dateList);
    return [dateList[0], dateList[dateList.length - 1]];
  }

  function prevWeek() {
    const temp = new Date(today);
    temp.setDate(temp.getDate() - 7);
    setToday(temp);
  }

  function nextWeek() {
    const temp = new Date(today);
    temp.setDate(today.getDate() + 7);
    setToday(temp);
  }

  function dayForWeek(date: string, index: number) {
    const weekEng = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return weekEng[index] + " " + format(date, "YYYY-MM-dd");
  }

  return (
    <Stack gap={3} sx={{ m: 5 }}>
      <Stack direction='row' alignItems={"center"} gap={1}>
        <Chip
          label={"Today"}
          onClick={currentWeek}
          sx={{
            "&:hover": {
              cursor: "pointer",
            },
          }}
        />
        <Typography
          fontWeight={700}
          fontSize={(theme) => theme.typography.pxToRem(16)}>
          {format(today, "YYYY-MM-dd HH:ss")}
        </Typography>
      </Stack>
      <Stack direction='row' gap={1}>
        <Button variant='contained' onClick={prevWeek}>
          Prev Week
        </Button>
        <Button variant='contained' onClick={nextWeek}>
          Next Week
        </Button>
      </Stack>
      <Chart
        type={"bar"}
        data={{
          labels: weekDateList.map(dayForWeek),
          datasets: [
            {
              label: "Amount",
              data: documentations.map((_) => _.length),
              borderWidth: 1,
              backgroundColor: "beige",
            },
            ...subDatas,
          ],
        }}
        options={{
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </Stack>
  );
}

export default WeeklyChart;
