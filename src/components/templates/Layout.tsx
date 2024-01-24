import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { DATA_ACTION, DataDispatchContext } from "../../context/DataProvider";
import { docuManager } from "../../model/documentation.manager";
import { BASE } from "../../util/global";
import DarkModeButton from "../atoms/DarkModeButton";
import MenuItems from "../moleculars/MenuItems";
import Footer from "../organisms/Footer";

declare global {
  interface Window {
    Kakao: any;
  }
}

type Crumb = {
  name: string;
  to: string;
};

const crumbTo = {
  "": "HOME",
  "meeting-minutes": "MEETING MINUTES",
  add: "WRITE",
  update: "UPDATE",
  view: "VIEW",
  chart: "CHART",
  todos: "TODOS",
};

function Layout() {
  const navigate = useNavigate();
  const dataDispatch = useContext(DataDispatchContext);

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const locate = useLocation();
  const params = Object.fromEntries(
    new URLSearchParams(locate.search).entries()
  );
  const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>([]);

  useEffect(() => {
    navigator.serviceWorker.addEventListener("message", handleWorkerMessage);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("message", handleWorkerMessage);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const path = locate.pathname.slice(BASE.length);
    const crumbs = path.split(/\/+/g).filter((_) => _);
    const crumblist = crumbs.reduce(
      (acc, cur, index) => {
        acc.push({
          to: BASE + crumbs.slice(0, index + 1).join("/"),
          name: crumbTo[cur],
        });
        return acc;
      },
      [{ to: BASE, name: "HOME" }]
    );
    if (params.id) {
      crumblist.at(-1).to = crumblist.at(-1).to + "?id=" + params.id;
      crumblist.at(-1).name = crumblist.at(-1).name + " : " + params.id;
    }
    if (params.view) {
      crumblist.at(-1).to = crumblist.at(-1).to + "?view=" + params.view;
      crumblist.at(-1).name =
        crumblist.at(-1).name + " : " + params.view.toUpperCase();
    }
    setBreadcrumbs(() => crumblist);
  }, [locate.pathname]);

  function handleWorkerMessage(e: Event) {
    if ("source" in (e as any).data && (e as any).data.source.match(/react/))
      return;
    // console.log((e as any).data);
    const { type, action, data } = (e as any).data;
    const { title, body, icon, tag } = data;
    if (type === "worker") {
      if (action === "todo/view") {
        navigate("/todos/view?id=" + tag);
      }
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const dropFile = e.dataTransfer.files[0];
    if (dropFile) {
      if (dropFile.type.match(/json/)) {
        docuManager.import("json", dropFile, () => {
          dataDispatch({
            type: DATA_ACTION.LOAD,
          });
          alert("등록이 완료되었습니다.");
        });
      } else {
        alert("지원되지 않는 파일 타입입니다.");
      }
    }
    document.body.classList.remove("dragover");
  }

  function handleDragOver(e: DragEvent) {
    if (e.dataTransfer.files.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      document.body.classList.add("dragover");
      // console.log(e);
    }
  }

  function handleMouseLeave(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    document.body.classList.remove("dragover");
  }

  return (
    <Stack sx={{ height: "inherit" }}>
      <Stack
        spacing={2}
        sx={{
          mx: 5,
          my: 2,
          zIndex: 5,
        }}>
        <Stack
          direction='row'
          justifyContent={"space-between"}
          alignItems={"center"}>
          <Stack direction='row' alignItems={"center"} gap={2}>
            <Link to={BASE}>
              <Avatar
                src={`${BASE}favicon/favicon-32x32.png`}
                sx={{
                  width: 32,
                  height: 32,
                }}
              />
            </Link>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize='small' />}
              aria-label='breadcrumb'>
              {breadcrumbs.map(({ name, to }, index) => (
                <Typography
                  component={Link}
                  key={index}
                  to={to}
                  fontSize={(theme) =>
                    theme.typography.pxToRem(isMdUp ? 16 : 10)
                  }
                  color={(theme) => theme.palette.text.primary}
                  sx={{
                    textDecoration: "none",
                  }}>
                  {name}
                </Typography>
              ))}
            </Breadcrumbs>
          </Stack>
          <Stack direction='row' alignItems='center' gap={2}>
            <DarkModeButton />
            <MenuItems />
          </Stack>
        </Stack>
      </Stack>
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
        }}>
        <Paper
          component={Stack}
          elevation={5}
          sx={{
            my: 5,
            mx: "auto",
            width: {
              lg: "60%",
              md: "80%",
              xs: "90%",
            },
          }}>
          <Outlet />
        </Paper>
      </Box>
      <Footer />
    </Stack>
  );
}

export default Layout;
