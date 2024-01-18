import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/templates/Layout.tsx";
import Home from "./pages/Home";
import MeetingMinutes from "./pages/MeetingMinutes.tsx";
import MeetingMinutesList from "./pages/MeetingMinutesList.tsx";
import MeetingMinutesViewer from "./pages/MeetingMinutesViewer.tsx";
import { BASE } from "./util/global.ts";

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
          <Route path='meeting-minutes'>
            <Route path='' element={<MeetingMinutesList />}></Route>
            <Route path='add' element={<MeetingMinutes />} />
            <Route path='view' element={<MeetingMinutesViewer />} />
            <Route path='update' element={<MeetingMinutes />} />
          </Route>
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
