import ClassIcon from "@mui/icons-material/Class";
import {
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItemButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { docuManager } from "../model/documentation.manager";
import Minutes, { CONTENT_TYPE } from "../model/minutes";
import { format } from "../util/features";
import { BASE } from "../util/global";
//@ts-ignore
import { toPng } from "html-to-image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { jsPDF } from "jspdf";
import ImageIcon from "@mui/icons-material/Image";

function MeetingMinutesViewer() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();
  const params = Object.fromEntries(useSearchParams()[0].entries());
  const [minutes, setMinutes] = useState<Minutes>(null);
  useEffect(() => {
    const minutes = docuManager.findOne(params.id);
    if (minutes) {
      setMinutes(minutes);
    } else {
      navigate(BASE);
    }
  }, [params.id, docuManager]);

  function handleUpdateForm(id: string) {
    navigate(`${BASE}meeting-minutes/update?id=${id}`);
  }

  function handleRemove(id: string) {
    if (!confirm("문서를 삭제하면 복구가 불가능합니다. 정말 삭제하시겠습니까?"))
      return;
    docuManager.remove(id);
    navigate(`${BASE}meeting-minutes`);
  }

  function getAllStyles(element) {
    // let styleData = "";

    function processElement(elem) {
      const computedStyle = window.getComputedStyle(elem);

      // 스타일 문자열로 변환
      let elementStyle = "";
      for (const style of computedStyle) {
        elementStyle += `${style}: ${computedStyle.getPropertyValue(style)};`;
      }
      // let className = "";
      // if (typeof elem.className === "object") {
      //   if (elem.className.baseVal === "") {
      //     className = "";
      //   } else {
      //     className = elem.className.baseVal.split(" ").join(".");
      //   }
      // } else {
      //   className = elem.className.split(" ").join(".");
      // }
      // if (className !== "") {
      // 스타일 태그로 래핑
      elem.style.cssText = elementStyle;
      elem.removeAttribute("class");
      // styleData += `<style type='text/css'>.${className} { ${elementStyle} }</style>`;
      // }
      // 자식 엘리먼트에 대해서도 재귀적으로 처리
      Array.from(elem.children).forEach((child) => processElement(child));
    }

    processElement(element);
    // return styleData;
    return element;
  }

  function saveToPdf(id: string) {
    const viewer = document.getElementById("minutes-viewer");
    const parent = viewer.parentElement;
    const { width: pWidth, height: pHeight } = parent.getBoundingClientRect();

    toPng(parent).then((dataUrl) => {
      const pdf = new jsPDF({ unit: "px" });
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      const scale = 0.75;

      const pRatio = pHeight / pWidth;

      const applyWidth = width * scale;
      const applyHeight = width * pRatio * scale;

      const paddingX = (width - applyWidth) / 2;
      const paddingY = Math.abs(height - applyHeight) / 2;
      pdf.addImage(dataUrl, "PNG", paddingX, paddingY, applyWidth, applyHeight);
      pdf.addImage(dataUrl, "PNG", paddingX, paddingY, applyWidth, applyHeight);
      pdf.save("todo-" + id + ".pdf");
    });
  }

  function saveToPng(id: string) {
    const viewer = document.getElementById("minutes-viewer");
    const parent = viewer.parentElement;

    toPng(parent).then((dataUrl) => {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "todo-" + id + ".png";
      a.click();
      a.remove();
    });
  }

  function copyToClipboardToPng(id: string) {
    const viewer = document.getElementById("minutes-viewer");
    const parent = viewer.parentElement;

    toPng(parent).then((dataUrl) => {
      const image = new Image();
      image.src = dataUrl;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        canvas.toBlob((blob) => {
          const file = new File([blob], "todo-" + id + ".png", {
            type: "image/png",
          });
          const clipboardItem = new ClipboardItem({
            [file.type]: file,
          });
          navigator.clipboard.write([clipboardItem]).then((v) => {
            alert(`"${id}" 문서를 클립보드에 PNG이미지로 복사했습니다.`);
          });
        });
        image.remove();
      };
    });
  }

  if (minutes === null) {
    return (
      <Box
        sx={{
          position: "relative",
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
      id='minutes-viewer'
      sx={{
        position: "relative",
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
        <Stack
          direction={{ xs: "column", lg: "row" }}
          alignItems={"center"}
          gap={1}>
          <Stack direction='row' gap={1} alignItems={"center"}>
            <ClassIcon color='error' fontSize='large' />
            <Typography fontWeight={700} variant={isMdUp ? "h4" : "h5"}>
              분류:
            </Typography>
          </Stack>
          <Typography fontWeight={700} variant={isMdUp ? "h4" : "h5"}>
            {minutes.category}
          </Typography>
        </Stack>
        <Stack direction='row' gap={1} alignItems='center' flexWrap={"wrap"}>
          <Button
            size={isMdUp ? "medium" : "small"}
            variant='contained'
            onClick={() => saveToPdf(params.id)}
            sx={{
              borderRadius: 100,
            }}
            startIcon={<PictureAsPdfIcon />}>
            PDF
          </Button>
          <Button
            size={isMdUp ? "medium" : "small"}
            variant='contained'
            onClick={() => saveToPng(params.id)}
            sx={{
              borderRadius: 100,
            }}
            startIcon={<ImageIcon />}>
            PNG
          </Button>
          <Button
            size={isMdUp ? "medium" : "small"}
            variant='contained'
            onClick={() => copyToClipboardToPng(params.id)}
            sx={{
              borderRadius: 100,
            }}
            startIcon={<ImageIcon />}>
            이미지로 복사
          </Button>
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

        <Box
          sx={{
            borderTop: (theme) => `1px solid ${theme.palette.text.disabled}`,
          }}
        />

        {/* content & note */}
        <Stack component={List} justifyContent={"space-between"} gap={3}>
          <Stack flex={1} gap={1}>
            {minutes.contents.map(({ item, type }, index, o) => (
              <Fragment key={item + index}>
                <ListItemButton>
                  {type === CONTENT_TYPE.IMAGE ? (
                    <Stack
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
                  ) : type === CONTENT_TYPE.LINK ? (
                    <Typography
                      key={item + index}
                      variant='body1'
                      sx={{
                        "&::before": {
                          content: '"🔗"',
                          mr: 1,
                          textDecoration: "none",
                        },
                      }}>
                      <Typography
                        component={Link}
                        to={item}
                        target='_blank'
                        sx={{
                          color: (theme) => theme.palette.text.disabled,
                        }}>
                        {item}
                      </Typography>
                    </Typography>
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
                  )}
                </ListItemButton>
                {index < o.length - 1 && (
                  <Box
                    sx={{
                      borderTop: (theme) =>
                        `1px solid ${theme.palette.text.disabled}`,
                    }}
                  />
                )}
              </Fragment>
            ))}
          </Stack>
          <Typography
            component={Paper}
            elevation={3}
            variant='body2'
            sx={{
              position: "relative",
              flex: 0.3,
              p: 2,
              whiteSpace: "pre-wrap",
              wordBreak: "keep-all",
              "&::before": {
                fontWeight: 700,
                fontSize: (theme) => theme.typography.pxToRem(12),
                textTransform: "uppercase",
                textDecorationLine: "underline",
                textDecorationThickness: 2,
                textUnderlineOffset: 3,
                content: '"note"',
                position: "absolute",
                top: 0,
                transform: "translateY(-50%)",
                left: 10,
              },
            }}>
            {minutes.note || "empty :)"}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

export default MeetingMinutesViewer;
