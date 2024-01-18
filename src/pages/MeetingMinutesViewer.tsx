import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import ContentListField from "../components/atoms/ContentListField";
import DateField from "../components/atoms/DateField";
import { Category } from "../model/documentation";
import Minutes from "../model/minutes";
import { DocumentationManager } from "../model/documentation.manager";
import ClassIcon from "@mui/icons-material/Class";
import { format } from "../util/features";
import { BASE } from "../util/global";

function MeetingMinutesViewer() {
  const navigate = useNavigate();
  const docuManager = new DocumentationManager();
  const params = Object.fromEntries(useSearchParams()[0].entries());
  const [minutes, setMinutes] = useState<Minutes>(null);

  useEffect(() => {
    const minutes = docuManager.findOne(params.id);
    if (minutes) {
      setMinutes(minutes);
    } else {
      navigate(BASE);
    }
  }, [params.id, docuManager.documentation.version]);

  function handleUpdateForm(id: string) {
    navigate(`${BASE}meeting-minutes/update?id=${id}`);
  }

  if (minutes === null) {
    return (
      <Stack sx={{}}>
        <Skeleton width='100%' height='2em' />
        <Skeleton width='40%' height='2em' />
      </Stack>
    );
  }

  return (
    <Box>
      <Stack
        direction='row'
        justifyContent={"space-between"}
        alignItems={"center"}
        gap={1}>
        <Stack direction='row' alignItems={"center"} gap={1}>
          <ClassIcon color='error' fontSize='large' />
          <Typography fontWeight={700} variant='h4'>
            분류:
          </Typography>
          <Typography fontWeight={700} variant='h4'>
            {minutes.category}
          </Typography>
        </Stack>
        <Button
          variant='contained'
          onClick={() => handleUpdateForm(params.id)}
          sx={{
            borderRadius: 100,
          }}>
          수정
        </Button>
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
                  content: "'title'",
                  textTransform: "uppercase",
                  color: (theme) => theme.palette.text.disabled,
                  fontSize: (theme) => theme.typography.pxToRem(12),
                },
              }}>
              {minutes.title}
            </Typography>
            <Typography
              fontWeight={500}
              variant='subtitle2'
              sx={{
                position: "relative",
                "&::before": {
                  position: "absolute",
                  bottom: "calc(100% - 0.1em)",
                  left: 0,
                  content: "'topic'",
                  textTransform: "uppercase",
                  color: (theme) => theme.palette.text.disabled,
                  fontSize: (theme) => theme.typography.pxToRem(12),
                },
              }}>
              주제: {minutes.topic}
            </Typography>
            <Typography
              sx={{
                position: "relative",
                "&::before": {
                  position: "absolute",
                  bottom: "calc(100% - 0.1em)",
                  left: 0,
                  content: "'date'",
                  textTransform: "uppercase",
                  color: (theme) => theme.palette.text.disabled,
                  fontSize: (theme) => theme.typography.pxToRem(12),
                },
              }}>
              {format(minutes.minutesDate, "YYYY. MM. dd HH:mm:ss")}
            </Typography>
          </Stack>

          {/* participants */}
          <Stack direction='row' justifyContent={"space-between"} gap={3}>
            <Stack
              direction='row'
              gap={2}
              flex={1}
              sx={{
                position: "relative",
                "&::before": {
                  position: "absolute",
                  bottom: "calc(100% - 0.1em)",
                  left: 0,
                  content: "'participants'",
                  textTransform: "uppercase",
                  color: (theme) => theme.palette.text.disabled,
                  fontSize: (theme) => theme.typography.pxToRem(12),
                },
              }}>
              {minutes.participants.map((participant, index) => (
                <Chip key={participant.name + index} label={participant.name} />
              ))}
              <Typography
                variant='caption'
                sx={{
                  my: "auto",
                  color: (theme) => theme.palette.text.disabled,
                }}>
                {minutes.participants.length}명
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* content & note */}
        <Stack direction='row' justifyContent={"space-between"} gap={3}>
          <Stack flex={1} gap={2}>
            {minutes.contents.map((content, index) => (
              <Typography key={content.item + index} variant='body1'>
                {content.item}
              </Typography>
            ))}
          </Stack>
          <Typography variant='body2' sx={{ flex: 0.3 }}>
            {minutes.note || "No Memo"}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

export default MeetingMinutesViewer;
