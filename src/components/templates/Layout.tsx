import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Chip,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { DATA_ACTION, DataDispatchContext } from "../../context/DataProvider";
import { DocumentContext } from "../../context/DocumentProdiver";
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
  "quadrant-chart": "QUADRANT CHART",
};

function Layout() {
  const docuManager = useContext(DocumentContext);
  const [isAgreeNotification, setIsAgreeNotification] = useState(false);
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
      navigator.serviceWorker.removeEventListener(
        "message",
        handleWorkerMessage
      );
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

  useEffect(() => {
    if (!("minutes-agree" in localStorage)) {
      setIsAgreeNotification(false);
    } else {
      const isAgree = JSON.parse(
        localStorage.getItem("minutes-agree") || "false"
      );
      setIsAgreeNotification(isAgree);
    }
  }, [localStorage.getItem("minutes-agree")]);

  function handleWorkerMessage(e: Event) {
    if ("source" in (e as any).data && (e as any).data.source.match(/react/))
      return;
    const { type, action, data } = (e as any).data;
    const { title, body, icon, id } = data;
    import.meta.env.DEV && console.log(action);
    if (type === "worker") {
      if (action === "todo/view") {
        dataDispatch({
          type: DATA_ACTION.LOAD,
        });
        navigate(`${BASE}todos/view?id=${id}`);
      } else if (action === "todo/rerender") {
        docuManager.saveAll();
        docuManager.todoManager.todoList = docuManager.todoManager.load();
        const todo = docuManager.todoManager.findOne(id);
        if (title.startsWith("[시작]")) {
          todo.notifyStart();
          docuManager.saveAll();
        }
        if (title.startsWith("[종료]")) {
          todo.notifyEnd();
          docuManager.saveAll();
        }

        dataDispatch({
          type: DATA_ACTION.LOAD,
        });
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
    const target = e.target as HTMLElement;
    const formEl = target.closest("form");

    if (formEl) {
      e.preventDefault();
    } else {
      if (e.dataTransfer.files.length > 0 || e.dataTransfer.items.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        if (
          e.dataTransfer.files?.[0]?.type.match("json") ||
          e.dataTransfer.items?.[0]?.type.match("json")
        ) {
          document.body.classList.add("dragover");
        }
      }
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
            p: isMdUp ? 5 : 3,
            width: {
              lg: "60%",
              md: "80%",
              xs: "90%",
            },
          }}>
          <Outlet />
        </Paper>
      </Box>
      <Box
        sx={{
          position: "relative",
        }}>
        <Box
          sx={{
            position: "absolute",
            right: 20,
            bottom: 20,
            userSelect: "none",
          }}>
          {isAgreeNotification ? (
            <Chip
              size='small'
              label='알림 활성화'
              color='success'
              sx={{
                fontSize: (theme) => theme.typography.pxToRem(10),
                fontWeight: 700,
              }}
            />
          ) : (
            <Chip
              size='small'
              label='알림 비활성화'
              color='warning'
              sx={{
                fontSize: (theme) => theme.typography.pxToRem(10),
                fontWeight: 700,
              }}
            />
          )}
        </Box>
      </Box>
      <Footer />
    </Stack>
  );
}

export default Layout;
