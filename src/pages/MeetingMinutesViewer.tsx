import ClassIcon from "@mui/icons-material/Class";
import {
  Box,
  Button,
  Chip,
  Divider,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DocumentationManager } from "../model/documentation.manager";
import Minutes from "../model/minutes";
import { format } from "../util/features";
import { BASE } from "../util/global";

function MeetingMinutesViewer() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
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

  function handleRemove(id: string) {
    if (!confirm("문서를 삭제하면 복구가 불가능합니다. 정말 삭제하시겠습니까?"))
      return;
    docuManager.remove(id);
    navigate(`${BASE}meeting-minutes`);
  }

  if (minutes === null) {
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
        <Stack direction='row' alignItems={"center"} gap={1}>
          <ClassIcon color='error' fontSize='large' />
          <Typography fontWeight={700} variant={isMdUp ? "h4" : "h5"}>
            분류:
          </Typography>
          <Typography fontWeight={700} variant={isMdUp ? "h4" : "h5"}>
            {minutes.category}
          </Typography>
        </Stack>
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
              {minutes.title}
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
                  content: "'목표'",
                  textTransform: "uppercase",
                  color: (theme) => theme.palette.text.disabled,
                  fontSize: (theme) => theme.typography.pxToRem(12),
                },
              }}>
              {minutes.topic}
            </Typography>
            <Typography
              sx={{
                position: "relative",
                "&::before": {
                  fontWeight: 700,
                  position: "absolute",
                  bottom: "calc(100% - 0.1em)",
                  left: 0,
                  content: "'날짜'",
                  textTransform: "uppercase",
                  color: (theme) => theme.palette.text.disabled,
                  fontSize: (theme) => theme.typography.pxToRem(12),
                },
              }}>
              {format(minutes.minutesDate, "YYYY. MM. dd HH:mm:ss")}
            </Typography>
            {/* participants */}
            <Stack direction='row' justifyContent={"space-between"} gap={3}>
              <Stack
                direction='row'
                gap={2}
                flex={1}
                sx={{
                  position: "relative",
                  "&::before": {
                    fontWeight: 700,
                    position: "absolute",
                    bottom: "calc(100% - 0.1em)",
                    left: 0,
                    content: "'참여 인원'",
                    textTransform: "uppercase",
                    color: (theme) => theme.palette.text.disabled,
                    fontSize: (theme) => theme.typography.pxToRem(12),
                  },
                }}>
                {minutes.participants.map((participant, index) => (
                  <Chip
                    key={participant.name + index}
                    label={participant.name}
                  />
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

            {/* create & update time */}
            <Typography
              sx={{
                position: "relative",
                "&::before": {
                  fontWeight: 700,
                  position: "absolute",
                  bottom: "calc(100% - 0.1em)",
                  left: 0,
                  content: "'생성일자'",
                  textTransform: "uppercase",
                  color: (theme) => theme.palette.text.disabled,
                  fontSize: (theme) => theme.typography.pxToRem(12),
                },
              }}>
              {format(minutes.createdAt, "YYYY. MM. dd HH:mm:ss")}
            </Typography>
            <Typography
              sx={{
                position: "relative",
                "&::before": {
                  fontWeight: 700,
                  position: "absolute",
                  bottom: "calc(100% - 0.1em)",
                  left: 0,
                  content: "'수정일자'",
                  textTransform: "uppercase",
                  color: (theme) => theme.palette.text.disabled,
                  fontSize: (theme) => theme.typography.pxToRem(12),
                },
              }}>
              {format(minutes.updatedAt, "YYYY. MM. dd HH:mm:ss")}
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* content & note */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent={"space-between"}
          gap={3}>
          <Stack flex={1} gap={2}>
            {minutes.contents.map(({ item }, index) =>
              item.startsWith("data:image/") ? (
                <Stack
                  key={item + index}
                  direction='row'
                  gap={1}
                  sx={{
                    "&::before": {
                      content: '"🖼️"',
                    },
                  }}>
                  <Stack>
                    <Box
                      component='img'
                      src={item}
                      sx={{
                        width: "100%",
                      }}
                    />
                    <Typography
                      align='center'
                      variant='body2'
                      sx={{
                        p: 1,
                        backgroundColor: (theme) =>
                          theme.palette.background.paper,
                        color: (theme) => theme.palette.text.secondary,
                      }}>
                      image
                    </Typography>
                  </Stack>
                </Stack>
              ) : (
                <Typography
                  key={item + index}
                  variant='body1'
                  sx={{
                    "&::before": {
                      content: '"✏️"',
                      mr: 1,
                    },
                  }}>
                  {item}
                </Typography>
              )
            )}
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
