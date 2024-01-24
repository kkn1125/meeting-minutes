import ClassIcon from "@mui/icons-material/Class";
import {
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItemButton,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { docuManager } from "../model/documentation.manager";
import { format } from "../util/features";
import { BASE } from "../util/global";
import Todo from "../model/todo";

function TodoViewer() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();
  const params = Object.fromEntries(useSearchParams()[0].entries());
  const [todos, setTodos] = useState<Todo>(null);
  useEffect(() => {
    const todos = docuManager.todoManager.findOne(params.id);
    if (todos) {
      setTodos(todos);
    } else {
      navigate(BASE);
    }
  }, [params.id, docuManager.documentation.version]);

  function handleUpdateForm(id: string) {
    navigate(`${BASE}todos/update?id=${id}`);
  }

  function handleRemove(id: string) {
    if (!confirm("알림를 삭제하면 복구가 불가능합니다. 정말 삭제하시겠습니까?"))
      return;
    docuManager.remove(id);
    navigate(`${BASE}todos`);
  }

  if (todos === null) {
    return (
      <Box
        sx={{
          position: "relative",
          m: 5,
        }}>
        <Stack>
          <Skeleton width='100%' height='2em' />
          <Skeleton width='40%' height='2em' />
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        m: 5,
      }}>
      <Stack
        direction={{ xs: "column-reverse", md: "row" }}
        justifyContent={{
          xs: "flex-start",
          md: "space-between",
        }}
        alignItems={{
          xs: "flex-start",
          md: "center",
        }}
        gap={1}>
        <Stack direction='row' gap={1}>
          <Button
            size={isMdUp ? "medium" : "small"}
            variant='contained'
            onClick={() => handleUpdateForm(params.id)}
            sx={{
              borderRadius: 100,
            }}>
            수정
          </Button>
          <Button
            color='error'
            size={isMdUp ? "medium" : "small"}
            variant='contained'
            onClick={() => handleRemove(params.id)}
            sx={{
              borderRadius: 100,
            }}>
            삭제
          </Button>
        </Stack>
      </Stack>
      <Stack gap={4} sx={{ mt: 3 }}>
        <Stack flex={1} gap={4}>
          {/* title & topic */}
          <Stack gap={3}>
            <Typography
              fontWeight={700}
              variant='h6'
              sx={{
                position: "relative",
                "&::before": {
                  position: "absolute",
                  bottom: "calc(100% - 0.1em)",
                  left: 0,
                  content: "'주제'",
                  textTransform: "uppercase",
                  color: (theme) => theme.palette.text.disabled,
                  fontSize: (theme) => theme.typography.pxToRem(12),
                },
              }}>
              {todos.title}
            </Typography>
            <Typography
              variant='subtitle2'
              sx={{
                position: "relative",
                "&::before": {
                  fontWeight: 700,
                  position: "absolute",
                  bottom: "calc(100% - 0.1em)",
                  left: 0,
                  content: "'내용'",
                  textTransform: "uppercase",
                  color: (theme) => theme.palette.text.disabled,
                  fontSize: (theme) => theme.typography.pxToRem(12),
                },
              }}>
              {todos.content}
            </Typography>

            {/* create & update time */}
            <Typography
              sx={{
                position: "relative",
                "&::before": {
                  fontWeight: 700,
                  position: "absolute",
                  bottom: "calc(100% - 0.1em)",
                  left: 0,
                  content: "'시작 시간'",
                  textTransform: "uppercase",
                  color: (theme) => theme.palette.text.disabled,
                  fontSize: (theme) => theme.typography.pxToRem(12),
                },
              }}>
              {format(todos.startTime, "YYYY. MM. dd HH:mm:ss")}
            </Typography>
            <Typography
              sx={{
                position: "relative",
                "&::before": {
                  fontWeight: 700,
                  position: "absolute",
                  bottom: "calc(100% - 0.1em)",
                  left: 0,
                  content: "'종료 시간'",
                  textTransform: "uppercase",
                  color: (theme) => theme.palette.text.disabled,
                  fontSize: (theme) => theme.typography.pxToRem(12),
                },
              }}>
              {format(todos.endTime, "YYYY. MM. dd HH:mm:ss")}
            </Typography>
          </Stack>
          <Stack direction='row' gap={1}>
            <Chip
              label={todos.finished ? "종료" : "알림 예정"}
              color={todos.finished ? "default" : "success"}
            />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

export default TodoViewer;
