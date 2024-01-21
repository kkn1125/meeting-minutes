import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import {
  List,
  ListItemButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataProvider";
import { DocumentationManager } from "../model/documentation.manager";
import Minutes from "../model/minutes";
import { BASE } from "../util/global";

function MeetingMinutesList() {
  const docuManager = new DocumentationManager();
  const data = useContext(DataContext);
  // const dataDispatch = useContext(DataDispatchContext);
  const navigate = useNavigate();
  const [minutesList, setMinutesList] = useState<Minutes[]>(null);

  useEffect(() => {
    setMinutesList(() => docuManager.findAll());
  }, [data.data, data.version]);

  function handleViewer(id: string) {
    navigate(`${BASE}meeting-minutes/view?id=${id}`);
  }

  if (minutesList === null) {
    return (
      <List
        component={Stack}
        gap={1}
        sx={{
          m: 5,
        }}>
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
    <List
      component={Stack}
      gap={1}
      sx={{
        m: 5,
      }}>
      {minutesList.length === 0 && (
        <Typography>등록된 회의록이 없습니다.</Typography>
      )}
      {minutesList.map(({ id, title }) => (
        <ListItemButton
          key={id}
          component={Stack}
          direction='row'
          gap={1}
          onClick={() => handleViewer(id)}>
          <InsertDriveFileOutlinedIcon color='info' />
          <Typography>{title}</Typography>
        </ListItemButton>
      ))}
    </List>
  );
}

export default MeetingMinutesList;
