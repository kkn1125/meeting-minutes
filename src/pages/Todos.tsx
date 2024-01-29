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
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataProvider";
import { DocumentContext } from "../context/DocumentProdiver";
import Timestamp from "../model/timestamp";
import Todo from "../model/todo";
import { format } from "../util/features";
import { BASE } from "../util/global";

const LIMIT = 5;

const conditions = [];

function Todos() {
  const data = useContext(DataContext);
  const docuManager = useContext(DocumentContext);
  const navigate = useNavigate();
  const locate = useLocation();
  const params = Object.fromEntries(
    new URLSearchParams(locate.search).entries()
  );
  const [todosList, setTodosList] = useState<Todo[]>(null);
  const [currentPage, setCurrentPage] = useState(Number(params.page) || 1);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    setTodosList(docuManager.todoManager.findAll());
  }, [data, setTodosList]);

  const todosMemoList = useMemo(() => {
    const page = Number(params.page ?? 1);
    setCurrentPage(page);

    addCondition((a: Todo, b: Todo) => {
      const bEnd = new Timestamp(b.endTime);
      const aEnd = new Timestamp(a.endTime);
      return bEnd.isAfterThan(aEnd) ? 1 : 0;
    });
    addCondition((a: Todo, b: Todo) => {
      const bStart = new Timestamp(b.startTime);
      const aStart = new Timestamp(a.startTime);
      return bStart.isAfterThan(aStart) ? 1 : -1;
    });

    return multiSort(todosList || [], conditions).slice(
      (page - 1) * LIMIT,
      page * LIMIT
    );
  }, [todosList, params.page]);

  const status = useCallback(
    (
      todo: Todo
    ): {
      word: string;
      color: "default" | "primary" | "success";
    } => {
      if (!todo) {
        return {
          word: "",
          color: "default",
        };
      }
      if (todo.ended || todo.finished) {
        return {
          word: "완료",
          color: "success",
        };
      } else if (todo.started) {
        return {
          word: "진행",
          color: "primary",
        };
      } else if (!todo.started) {
        return {
          word: "대기",
          color: "default",
        };
      }
    },
    [todosList]
  );

  function multiSort(array: Todo[], sortConditions) {
    return array.sort((a: Todo, b: Todo) => {
      for (let i = 0; i < sortConditions.length; i++) {
        const condition = sortConditions[i];
        const comparison = condition(a, b);

        if (comparison !== 0) return comparison;
      }
      return 0;
    });
  }
  function addCondition(condition) {
    conditions.push(condition);
  }

  function handleNavigatePage(e: ChangeEvent<unknown>, value: number) {
    navigate(`?page=${value}`);
  }

  function handleViewer(id: any): void {
    navigate(`${BASE}todos/view?id=${id}`);
  }

  function handleSearch(e: ChangeEvent) {
    const target = e.target as HTMLInputElement;
    const totalList = docuManager.todoManager.findAll();
    const searchList =
      target.value === ""
        ? totalList
        : totalList.filter((todo) => {
            return (
              todo.id.match(target.value) ||
              todo.title.match(target.value) ||
              todo.content.match(target.value)
            );
          });

    setTodosList(searchList);
    const totalPage = Math.ceil(searchList.length / LIMIT);
    const currentPage = Number(params.page);
    if (totalPage < currentPage) {
      handleNavigatePage(null, 1);
    }
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
      <Stack direction='row' justifyContent={"space-between"} gap={3}>
        <Button
          component={Link}
          to={BASE + "todos/add"}
          variant='contained'
          color='success'>
          Write
        </Button>
        <TextField label='Seach' sx={{ flex: 1 }} onChange={handleSearch} />
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
        {todosMemoList.map((todo) => {
          const { id, title, startTime, endTime } = todo;
          return (
            <ListItemButton
              key={id}
              component={Stack}
              direction='row'
              alignItems='center'
              gap={1}
              onClick={() => handleViewer(id)}
              sx={{
                flex: 0,
                flexWrap: "wrap",
              }}>
              {isMdUp && <InsertDriveFileOutlinedIcon color='info' />}
              <Stack
                direction={{
                  xs: "column",
                  md: "row",
                }}
                gap={1}
                justifyContent='space-between'
                alignItems={{ xs: "flex-start", md: "center" }}
                flex={1}>
                <Stack
                  direction='row'
                  justifyContent={{
                    xs: "center",
                    md: "inherit",
                  }}
                  alignItems={{
                    xs: "inherit",
                    md: "center",
                  }}
                  gap={1}>
                  <Chip size='small' label={id.slice(5, 13)} />
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
                  <Chip label={status(todo).word} color={status(todo).color} />
                </Stack>
              </Stack>
            </ListItemButton>
          );
        })}
      </List>
      <Stack direction='row' justifyContent={"center"} sx={{ mt: 1, mb: 3 }}>
        <Pagination
          count={Math.ceil(todosList.length / LIMIT)}
          shape='rounded'
          showFirstButton
          showLastButton
          onChange={handleNavigatePage}
          page={currentPage}
        />
      </Stack>
    </Stack>
  );
}

export default Todos;
