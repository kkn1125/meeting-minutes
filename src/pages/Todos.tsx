import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import {
  Button,
  Chip,
  Divider,
  List,
  ListItemButton,
  Pagination,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataProvider";
import { docuManager } from "../model/documentation.manager";
import Todo from "../model/todo";
import { format } from "../util/features";
import { BASE } from "../util/global";

const LIMIT = 5;

function Todos() {
  const data = useContext(DataContext);
  const navigate = useNavigate();
  const locate = useLocation();
  const params = Object.fromEntries(
    new URLSearchParams(locate.search).entries()
  );
  const [todosList, setTodosList] = useState<Todo[]>(null);

  useEffect(() => {
    setTodosList(docuManager.todoManager.findAll());
  }, [data, setTodosList]);

  function handleNavigatePage(e: ChangeEvent<unknown>, value: number) {
    navigate(`?page=${value}`);
  }

  const todosMemoList = useMemo(() => {
    const page = Number(params.page ?? 1);
    return (todosList || []).slice((page - 1) * LIMIT, page * LIMIT);
  }, [todosList, params.page]);

  function handleViewer(id: any): void {
    navigate(`${BASE}todos/view?id=${id}`);
  }

  if (todosList === null) {
    return (
      <List component={Stack} gap={1}>
        <Stack direction='row' alignItems='center' gap={2}>
          <InsertDriveFileOutlinedIcon color='info' />
          <Skeleton width='100%' sx={{ fontSize: "2em" }} />
        </Stack>
        <Stack direction='row' alignItems='center' gap={2}>
          <InsertDriveFileOutlinedIcon color='info' />
          <Skeleton width='100%' sx={{ fontSize: "2em" }} />
        </Stack>
        <Stack direction='row' alignItems='center' gap={2}>
          <InsertDriveFileOutlinedIcon color='info' />
          <Skeleton width='100%' sx={{ fontSize: "2em" }} />
        </Stack>
      </List>
    );
  }

  return (
    <Stack>
      <Stack direction='row'>
        <Button
          component={Link}
          to={BASE + "todos/add"}
          variant='contained'
          color='success'>
          Write
        </Button>
      </Stack>
      <Divider sx={{ my: 2 }} />
      <List
        component={Stack}
        gap={1}
        sx={{
          minHeight: 280,
        }}>
        {todosList.length === 0 && (
          <Typography>등록된 알림이 없습니다.</Typography>
        )}
        {todosMemoList.map(
          ({ id, title, content, startTime, endTime, finished }) => (
            <ListItemButton
              key={id}
              component={Stack}
              direction='row'
              alignItems='center'
              gap={1}
              onClick={() => handleViewer(id)}
              sx={{
                flex: 0,
              }}>
              <InsertDriveFileOutlinedIcon color='info' />
              <Stack
                direction={{
                  xs: "column",
                  md: "row",
                }}
                gap={1}
                justifyContent={"space-between"}
                alignItems='center'
                flex={1}>
                <Stack
                  direction={{
                    xs: "column",
                    md: "row",
                  }}
                  gap={1}>
                  <Typography>{title}</Typography>
                </Stack>
                <Stack direction='row' gap={1} alignItems='center'>
                  <Typography
                    variant='body2'
                    color={(theme) => theme.palette.text.disabled}>
                    {format(startTime, "YYYY-MM-dd HH:mm:ss")}
                  </Typography>
                  <Typography
                    variant='body2'
                    color={(theme) => theme.palette.text.disabled}>
                    ~
                  </Typography>
                  <Typography
                    variant='body2'
                    color={(theme) => theme.palette.text.disabled}>
                    {format(endTime, "YYYY-MM-dd HH:mm:ss")}
                  </Typography>
                  <Chip
                    label={finished ? "종료" : "알림 예정"}
                    color={finished ? "default" : "success"}
                  />
                </Stack>
              </Stack>
            </ListItemButton>
          )
        )}
      </List>
      <Stack direction='row' justifyContent={"center"} sx={{ mt: 1, mb: 3 }}>
        <Pagination
          defaultPage={1}
          count={Math.ceil(todosList.length / LIMIT)}
          shape='rounded'
          showFirstButton
          showLastButton
          onChange={handleNavigatePage}
        />
      </Stack>
    </Stack>
  );
}

export default Todos;
