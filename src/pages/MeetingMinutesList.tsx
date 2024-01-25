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
  Tooltip,
  Typography,
} from "@mui/material";
import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataProvider";
import Minutes from "../model/minutes";
import { format } from "../util/features";
import { BASE } from "../util/global";
import { DocumentContext } from "../context/DocumentProdiver";

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

  useEffect(() => {
    const docuList = docuManager.findAll();
    setMinutesList(() =>
      docuList.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    );
  }, [data, setMinutesList]);

  const minutesMemoList = useMemo(() => {
    const page = Number(params.page ?? 1);
    return (minutesList || []).slice((page - 1) * LIMIT, page * LIMIT);
  }, [minutesList, params.page]);

  function handleViewer(id: string) {
    navigate(`${BASE}meeting-minutes/view?id=${id}`);
  }

  function handleNavigatePage(e: ChangeEvent<unknown>, value: number) {
    navigate(`?page=${value}`);
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
      <Stack direction='row'>
        <Button
          component={Link}
          to={BASE + "meeting-minutes/add"}
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
                gap={1}
                alignItems='center'>
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
          defaultPage={1}
          count={Math.ceil(minutesList.length / LIMIT)}
          shape='rounded'
          showFirstButton
          showLastButton
          onChange={handleNavigatePage}
        />
      </Stack>
    </Stack>
  );
}

export default MeetingMinutesList;
