import AddIcon from "@mui/icons-material/Add";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, IconButton, Stack, TextField, Tooltip } from "@mui/material";
import { FormikProps } from "formik";
import {
  ChangeEvent,
  ClipboardEvent,
  Fragment,
  useEffect,
  KeyboardEvent as ReactKeyboardEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { InitialValues } from "../../model/minutes";

type ContentListFieldProps = {
  name: string;
  formik: FormikProps<InitialValues>;
};

function ContentListField({ name, formik }: ContentListFieldProps) {
  const dragIndex = useRef(-1);
  const [dragNum, setDragNum] = useState(-1);
  const focusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.addEventListener("dragstart", handleDragStart);
    window.addEventListener("dragover", handleDragMove);
    window.addEventListener("drop", handleDragEnd);
    window.addEventListener("dragend", handleEscapeDrag);
    return () => {
      window.removeEventListener("dragstart", handleDragStart);
      window.removeEventListener("dragover", handleDragMove);
      window.removeEventListener("drop", handleDragEnd);
      window.removeEventListener("keydown", handleEscapeDrag);
    };
  }, [formik.values.contents]);

  function handleEscapeDrag(e: DragEvent) {
    if (e.dataTransfer.dropEffect === "none") {
      e.dataTransfer.clearData();
      setDragNum(() => -1);
      dragIndex.current = -1;
    }
  }

  function handleDragStart(e: DragEvent) {
    const target = e.target as HTMLDivElement;
    const draggableEl = target.closest("[draggable]") as HTMLDivElement;
    const index = draggableEl.dataset.index;
    e.dataTransfer.clearData();
    e.dataTransfer.setData("origin", index);
  }

  function handleDragEnd(e: DragEvent) {
    const indexString = e.dataTransfer.getData("origin");
    const origin = Number(indexString);
    const dragIndexNum = dragIndex.current;

    if (dragIndexNum !== -1) {
      const isOver = origin < dragIndexNum;
      const [item] = formik.values.contents.splice(origin, 1);
      if (item) {
        const sliceIndex = dragIndexNum - (isOver ? 1 : 0);
        formik.values.contents.splice(sliceIndex > 0 ? sliceIndex : 0, 0, item);
        formik.setFieldValue("contents", formik.values.contents);
      }
    }
    setDragNum(() => -1);
    dragIndex.current = -1;
    e.dataTransfer.clearData();
  }

  function handleDragMove(e: DragEvent) {
    const target = e.target as HTMLDivElement;
    const draggableEl = target.closest("[draggable]") as HTMLDivElement;
    if (draggableEl) {
      const { height } = draggableEl.getBoundingClientRect();
      const index = Number(draggableEl.dataset.index);
      if (height / 2 > e.offsetY) {
        // 상단
        setDragNum(() => index);
        dragIndex.current = index;
      } else {
        // 하단
        setDragNum(() =>
          index + 1 > formik.values.contents.length
            ? formik.values.contents.length
            : index + 1
        );
        dragIndex.current =
          index + 1 > formik.values.contents.length
            ? formik.values.contents.length
            : index + 1;
      }
    } else {
      dragIndex.current = -1;
      setDragNum(() => -1);
    }
    e.preventDefault();
  }

  function handleEachItemUpdate(e: ChangeEvent, index: number) {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    formik.setFieldValue(
      "contents",
      formik.values.contents.map((item, idx) =>
        idx === index
          ? {
              item: value,
            }
          : item
      )
    );
  }

  function handleAddItem(index: number) {
    setTimeout(() => {
      const inputs = [...focusRef.current.querySelectorAll("input")];
      inputs[inputs.length - 1].focus();
    }, 50);
    formik.values.contents.splice(index + 1, 0, { item: "" });
    formik.setFieldValue("contents", formik.values.contents);
  }

  function handleRemoveItem(index: number) {
    if (formik.values.contents.length > 1) {
      formik.values.contents.splice(index, 1);
      formik.setFieldValue("contents", formik.values.contents);
      setTimeout(() => {
        const inputs = [...focusRef.current.querySelectorAll("input")];
        const num = index || inputs.length - 1;
        inputs[num > 0 ? num : 0].focus();
      }, 50);
    }
  }

  function handleKeyEvent(e: ReactKeyboardEvent) {
    const inputs = [
      ...focusRef.current.querySelectorAll("input:not([disabled])"),
    ] as HTMLInputElement[];
    const index = inputs.findIndex((input) => input === e.target);
    if (e.key === "Tab") {
      handleAddItem(index);
    } else if (
      e.key === "Backspace" &&
      (formik.values.contents[index].item === "" ||
        formik.values.contents[index].item.startsWith("data:image/"))
    ) {
      handleRemoveItem(index);
    } else if (e.key === "ArrowUp") {
      setTimeout(() => {
        const target = inputs[index - 1 < 0 ? 0 : index - 1];
        target.focus();
        target.select();
      }, 50);
    } else if (e.key === "ArrowDown") {
      setTimeout(() => {
        const target =
          inputs[inputs.length - 1 < index + 1 ? inputs.length - 1 : index + 1];
        target.focus();
        target.select();
      }, 50);
    }
  }

  function handleImagePaste(e: ClipboardEvent, index: number) {
    e.preventDefault();
    const file = e.clipboardData.files[0];
    const text = e.clipboardData.getData("text/plain");
    if (file) {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.style.position = "fixed";
      image.style.top = "999999999999999999px";
      image.style.left = "999999999999999999px";
      document.body.append(image);
      image.onload = () => {
        const canvas = document.createElement("canvas") as HTMLCanvasElement;
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.drawImage(image, 0, 0);

        const url = canvas.toDataURL(file.type, 1.0);
        image.remove();
        formik.values.contents.splice(index, 1, { item: url });
        formik.setFieldValue("contents", formik.values.contents);
      };
    } else if (text) {
      if (text.match(/[\n\r]/gm)) {
        formik.values.contents.splice(index, 1);
        const data = [];
        for (const t of text.split(/[\n\r]+/gm).filter((_) => _.trim())) {
          const trimText = t.trim();
          if (trimText.startsWith("-")) {
            const word = trimText.slice(trimText.indexOf("-") + 1);
            data.push({
              item: word.trim(),
            });
          } else if (trimText.startsWith("•")) {
            const word = trimText.slice(trimText.indexOf("•") + 1);
            data.push({
              item: word.trim(),
            });
          } else {
            data.push({
              item: trimText,
            });
          }
        }
        formik.setFieldValue("contents", [...formik.values.contents, ...data]);
      } else {
        const data = [...formik.values.contents];
        data.push({
          item: text.trim(),
        });
        formik.setFieldValue("contents", data);
      }
    }
  }

  function handleRemoveImage(index: number) {
    if (confirm("이미지를 제거하시겠습니까?")) {
      formik.values.contents.splice(index, 1, {
        item: "",
      });
      formik.setFieldValue("contents", formik.values.contents);
    }
  }

  return (
    <Stack ref={focusRef} flex={1} gap={2} id='content-panel'>
      {formik.values.contents.map(({ item }, index, o) => (
        <Fragment key={index}>
          <Stack
            draggable
            direction='row'
            alignItems={"center"}
            gap={1}
            data-index={index}
            sx={{
              ...(dragNum === index && {
                position: "relative",
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  left: 80,
                  right: 150,
                  top: -8,
                  p: 0.3,
                  borderTop: (theme) =>
                    `1px dashed ${theme.palette.text.primary}`,
                },
              }),
              ...(dragNum === index + 1 && {
                position: "relative",
                "&::after": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  left: 80,
                  right: 150,
                  bottom: -8,
                  p: 0.3,
                  borderBottom: (theme) =>
                    `1px dashed ${theme.palette.text.primary}`,
                },
              }),
            }}>
            <Stack direction='row' alignItems='center' gap={1} flex={1}>
              <Tooltip title='move' placement='left'>
                <Stack
                  sx={{
                    "&:hover": {
                      cursor: "move",
                    },
                  }}>
                  <DragIndicatorIcon />
                </Stack>
              </Tooltip>
              {item.startsWith("data:image/") ? (
                <Stack flex={1} gap={1}>
                  <TextField
                    autoComplete='off'
                    disabled
                    placeholder='내용을 작성하세요!'
                    fullWidth
                    label='항목'
                    rows={10}
                    value={item}
                    onKeyDown={handleKeyEvent}
                    onBlur={formik.handleBlur}
                    onChange={(e) => handleEachItemUpdate(e, index)}
                    onPaste={(e) => handleImagePaste(e, index)}
                  />
                  <Box
                    component='img'
                    src={item}
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      maxWidth: 300,
                    }}
                  />
                </Stack>
              ) : (
                <TextField
                  autoComplete='off'
                  placeholder='내용을 작성하세요!'
                  fullWidth
                  label='항목'
                  rows={10}
                  value={item}
                  onKeyDown={handleKeyEvent}
                  onBlur={formik.handleBlur}
                  onChange={(e) => handleEachItemUpdate(e, index)}
                  onPaste={(e) => handleImagePaste(e, index)}
                />
              )}
              <IconButton onClick={() => handleAddItem(index)}>
                <AddIcon />
              </IconButton>
              <IconButton onClick={() => handleRemoveItem(index)}>
                <RemoveIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Fragment>
      ))}
    </Stack>
  );
}

export default ContentListField;
