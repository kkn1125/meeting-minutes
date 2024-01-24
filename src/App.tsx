import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/templates/Layout.tsx";
import Home from "./pages/Home";
import MeetingMinutes from "./pages/MeetingMinutes.tsx";
import MeetingMinutesList from "./pages/MeetingMinutesList.tsx";
import MeetingMinutesViewer from "./pages/MeetingMinutesViewer.tsx";
import { BASE } from "./util/global.ts";
import WeeklyChart from "./pages/WeeklyChart.tsx";
import Download from "./pages/Download.tsx";
import Todos from "./pages/Todos.tsx";
import TodoEditor from "./pages/TodoEditor.tsx";
import TodoViewer from "./pages/TodoViewer.tsx";

function App() {
  return (
    <Box
      component='main'
      sx={{
        background: (theme) => theme.palette.background.default,
      }}>
      <Routes>
        <Route path={BASE} element={<Layout />}>
          <Route path='' element={<Home />} />
          <Route path='todos'>
            <Route path='' element={<Todos />} />
            <Route path='add' element={<TodoEditor />} />
            <Route path='view' element={<TodoViewer />} />
            <Route path='update' element={<TodoEditor />} />
          </Route>
          <Route path='meeting-minutes'>
            <Route path='' element={<MeetingMinutesList />}></Route>
            <Route path='add' element={<MeetingMinutes />} />
            <Route path='view' element={<MeetingMinutesViewer />} />
            <Route path='update' element={<MeetingMinutes />} />
          </Route>
          <Route path='chart' element={<WeeklyChart />} />
          <Route path='download' element={<Download />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
