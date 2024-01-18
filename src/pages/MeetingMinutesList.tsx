import {
  List,
  ListItemButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DocumentationManager } from "../model/documentation.manager";
import Minutes from "../model/minutes";
import {
  DATA_ACTION,
  DataContext,
  DataDispatchContext,
} from "../context/DataProvider";
import { BASE } from "../util/global";

function MeetingMinutesList() {
  const docuManager = new DocumentationManager();
  const data = useContext(DataContext);
  const dataDispatch = useContext(DataDispatchContext);
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
      <List component={Stack} gap={1}>
        <Skeleton width='100%' height='3em' />
        <Skeleton width='100%' height='3em' />
        <Skeleton width='100%' height='3em' />
        <Skeleton width='100%' height='3em' />
      </List>
    );
  }

  return (
    <div>
      {minutesList.length === 0 && (
        <Typography>등록된 회의록이 없습니다.</Typography>
      )}
      <List component={Stack} gap={1}>
        {minutesList.map(({ id, title }) => (
          <ListItemButton
            key={id}
            component={Stack}
            direction='row'
            gap={1}
            onClick={() => handleViewer(id)}>
            <Typography>{id}</Typography>
            <Typography>{title}</Typography>
          </ListItemButton>
        ))}
      </List>
    </div>
  );
}

export default MeetingMinutesList;
