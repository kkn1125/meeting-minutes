import { Box } from "@mui/material";
import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/templates/Layout.tsx";
import { ThemeContext } from "./context/DarkModeProvider";
import Home from "./pages/Home";
import MeetingMinutes from "./pages/MeetingMinutes.tsx";
import MeetingMinutesList from "./pages/MeetingMinutesList.tsx";
import MeetingMinutesViewer from "./pages/MeetingMinutesViewer.tsx";
import { BASE } from "./util/global.ts";

function App() {
  const theme = useContext(ThemeContext);

  return (
    <Box
      component='main'
      className={`${theme.mode} text-foreground bg-background`}>
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
