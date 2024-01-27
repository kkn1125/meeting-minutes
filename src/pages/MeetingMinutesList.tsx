import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import {
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItemButton,
  Pagination,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataProvider";
import { DocumentContext } from "../context/DocumentProdiver";
import Minutes from "../model/minutes";
import { format } from "../util/features";
import { BASE } from "../util/global";

const LIMIT = 5;
function MeetingMinutesList() {
  const data = useContext(DataContext);
  const docuManager = useContext(DocumentContext);
  const navigate = useNavigate();
  const [minutesList, setMinutesList] = useState<Minutes[]>(null);
  const locate = useLocation();
  const params = Object.fromEntries(
    new URLSearchParams(locate.search).entries()
  );
  const [currentPage, setCurrentPage] = useState(Number(params.page) || 1);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    const docuList = docuManager.findAll();

    setMinutesList(() =>
      docuList.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    );
  }, [data, setMinutesList]);

  const minutesMemoList = useMemo(() => {
    const page = Number(params.page ?? 1);
    setCurrentPage(page);
    return (minutesList || []).slice((page - 1) * LIMIT, page * LIMIT);
  }, [minutesList, params.page]);

  function handleViewer(id: string) {
    navigate(`${BASE}meeting-minutes/view?id=${id}`);
  }

  function handleNavigatePage(e: ChangeEvent<unknown>, value: number) {
    navigate(`?page=${value}`);
  }

  function handleSearch(e: ChangeEvent) {
    const target = e.target as HTMLInputElement;
    const totalList = docuManager.findAll();
    const searchList =
      target.value === ""
        ? totalList
        : totalList.filter((minutes) => {
            return (
              minutes.id.match(target.value) ||
              minutes.title.match(target.value) ||
              minutes.topic.match(target.value) ||
              minutes.contents.filter((content) =>
                content.item.match(target.value)
              ).length > 0 ||
              minutes.note.match(target.value)
            );
          });

    setMinutesList(searchList);
    const totalPage = Math.ceil(searchList.length / LIMIT);
    const currentPage = Number(params.page);
    if (totalPage < currentPage) {
      handleNavigatePage(null, 1);
    }
  }

  if (minutesList === null) {
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
          to={BASE + "meeting-minutes/add"}
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
        {minutesList.length === 0 && (
          <Typography>등록된 회의록이 없습니다.</Typography>
        )}
        {minutesMemoList.map(({ id, title, category, createdAt }) => (
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
            {isMdUp && <InsertDriveFileOutlinedIcon color='info' />}
            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              gap={1}
              justifyContent={"space-between"}
              alignItems={{ xs: "flex-start", md: "center" }}
              flex={1}>
              <Stack
                direction={{
                  xs: "column",
                  md: "row",
                }}
                gap={1}
                alignItems={{ xs: "flex-start", md: "center" }}>
                <Chip size='small' label={id.slice(0, 8)} />
                <Tooltip title='분류'>
                  <Box>
                    <Chip label={category} size='small' />
                  </Box>
                </Tooltip>
                <Typography>{title}</Typography>
              </Stack>
              <Typography
                variant='body2'
                color={(theme) => theme.palette.text.disabled}>
                {format(createdAt, "YYYY-MM-dd HH:mm:ss")}
              </Typography>
            </Stack>
          </ListItemButton>
        ))}
      </List>
      <Stack direction='row' justifyContent={"center"} sx={{ mt: 1, mb: 3 }}>
        <Pagination
          count={Math.ceil(minutesList.length / LIMIT)}
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

export default MeetingMinutesList;
