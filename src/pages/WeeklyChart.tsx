// TODO: 주단위 차트 렌더링
// TODO: 카카오톡 저장하기 기능 추가

import {
  Button,
  Chip,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
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
import { useContext, useEffect, useRef, useState } from "react";
import { Chart } from "react-chartjs-2";
import { DocumentContext } from "../context/DocumentProdiver";
import Minutes from "../model/minutes";
import Todo from "../model/todo";
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
  const theme = useTheme();
  const docuManager = useContext(DocumentContext);
  const chartRef = useRef<ChartJS>(null);
  const [today, setToday] = useState(new Date(_year, _month, _date));
  const [weekDateList, setWeekDateList] = useState([]);
  const [documentations, setDocumentations] = useState<Minutes[][]>([]);
  const [todos, setTodos] = useState<Todo[][]>([]);
  const [subDatas, setSubDatas] = useState([]);
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    handleResizeChart();
  }, [isMdUp]);

  useEffect(() => {
    const [start, end] = calulateWeek();
    const docuList = docuManager.findGroupByTime(start, end);
    const categories = getCategories(docuManager.findAll());
    const categoryGroup = categories.map((category) => {
      return [category, filterCategory(docuList, category)];
    });
    const removeEmpty = categoryGroup.filter(
      ([category, group]: [string, Minutes[][]]) =>
        group.filter((c) => {
          return c.length > 0;
        }).length > 0
    );
    const subData = removeEmpty.map(
      ([category, group]: [string, Minutes[][]]) => ({
        label: "Category: " + category,
        data: group.map((_) => _.length),
        borderWidth: 1,
        backgroundColor: `#${randomColor().join("")}`,
      })
    );
    const todoList = docuManager.todoManager.findGroupByTime(start, end);
    setSubDatas(subData);
    setDocumentations(docuList);
    setTodos(todoList);
  }, [today]);

  function handleResizeChart() {
    const chart = chartRef.current;
    if (chart) {
      setTimeout(() => {
        chart.resize();
        chart.draw();
      }, 50);
    }
  }

  function randomColor() {
    const r = randomHex();
    const g = randomHex();
    const b = randomHex();
    return [r.toString(16), g.toString(16), b.toString(16)];
  }

  function randomHex() {
    return Math.floor(Math.random() * 255) + 1;
  }

  function getCategories(docus: Minutes[]) {
    const categories = docus.map((docu) => docu.category);
    return [...new Set(categories)];
  }

  function filterCategory(docuList: Minutes[][], category: string) {
    return docuList.map((docu) => docu.filter((d) => d.category === category));
  }

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
    // const week = Math.floor(aver / 7);

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
    <Stack gap={3}>
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
      <Stack flex={1}>
        <Chart
          ref={chartRef}
          type={"bar"}
          data={{
            labels: weekDateList.map(dayForWeek),
            datasets: [
              {
                label: "Documentation amount",
                data: documentations.map((_) => _.length),
                borderWidth: 1,
                backgroundColor: "beige",
              },
              {
                label: "Todo amount",
                data: todos.map((_) => _.length),
                borderWidth: 1,
                backgroundColor: "green",
              },
              {
                label: "Todo before amount",
                data: todos.map((_) => _.filter(($) => !$.started).length),
                borderWidth: 1,
                backgroundColor: "grey",
              },
              {
                label: "Todo after amount",
                data: todos.map((_) => _.filter(($) => $.finished).length),
                borderWidth: 1,
                backgroundColor: "lightblue",
              },
              ...subDatas,
            ],
          }}
          options={{
            aspectRatio: isMdUp ? 2 : 0.85,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </Stack>
    </Stack>
  );
}

export default WeeklyChart;
