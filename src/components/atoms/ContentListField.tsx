import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Avatar, Box, IconButton, Stack, TextField } from "@mui/material";
import { FormikProps } from "formik";
import { ChangeEvent, ClipboardEvent, KeyboardEvent, useRef } from "react";
import { InitialValues } from "../../model/minutes";

type ContentListFieldProps = {
  name: string;
  formik: FormikProps<InitialValues>;
};

function ContentListField({ name, formik }: ContentListFieldProps) {
  const focusRef = useRef<HTMLInputElement>(null);

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
      setTimeout(() => {
        const inputs = [...focusRef.current.querySelectorAll("input")];
        const num = inputs.length - 1;
        inputs[num > 0 ? num : 0].focus();
      }, 50);
      formik.values.contents.splice(index, 1);
      formik.setFieldValue("contents", formik.values.contents);
    }
  }

  function handleKeyEvent(e: KeyboardEvent) {
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
    <Stack ref={focusRef} flex={1} gap={2}>
      {formik.values.contents.map(({ item }, index) => (
        <Stack key={index} direction='row' alignItems={"center"} gap={1}>
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
      ))}
    </Stack>
  );
}

export default ContentListField;
