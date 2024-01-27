import { Box } from "@mui/material";
import { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/templates/Layout.tsx";
import { DocumentContext } from "./context/DocumentProdiver.tsx";
import {
  MESSAGE_ACTION,
  MessageDispatchContext,
} from "./context/MessageProvider.tsx";
import Download from "./pages/Download.tsx";
import Home from "./pages/Home";
import MeetingMinutes from "./pages/MeetingMinutes.tsx";
import MeetingMinutesList from "./pages/MeetingMinutesList.tsx";
import MeetingMinutesViewer from "./pages/MeetingMinutesViewer.tsx";
import QuadrantChart from "./pages/QuadrantChart.tsx";
import TodoEditor from "./pages/TodoEditor.tsx";
import TodoViewer from "./pages/TodoViewer.tsx";
import Todos from "./pages/Todos.tsx";
import WeeklyChart from "./pages/WeeklyChart.tsx";
import { BASE } from "./util/global.ts";

function App() {
  const docuManager = useContext(DocumentContext);
  const messageDispatch = useContext(MessageDispatchContext);

  useEffect(() => {
    messageDispatch({
      type: MESSAGE_ACTION.SET_DOCU,
      docuManager,
    });
  }, []);

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
          <Route path='quadrant-chart' element={<QuadrantChart />} />
          <Route path='download' element={<Download />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
