import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { IconButton, Stack, TextField } from "@mui/material";
import { FormikProps } from "formik";
import { ChangeEvent, KeyboardEvent, useRef } from "react";
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
      inputs[index + 1].focus();
    }, 10);
    formik.values.contents.splice(index + 1, 0, { item: "" });
    formik.setFieldValue("contents", formik.values.contents);
  }

  function handleRemoveItem(index: number) {
    if (formik.values.contents.length > 1) {
      setTimeout(() => {
        const inputs = [...focusRef.current.querySelectorAll("input")];
        inputs[index - 1 < 0 ? 0 : index - 1].focus();
      }, 10);
      formik.values.contents.splice(index, 1);
      formik.setFieldValue("contents", formik.values.contents);
    }
  }

  function handleKeyEvent(e: KeyboardEvent, index: number) {
    if (e.key === "Tab") {
      handleAddItem(index);
    } else if (
      e.key === "Backspace" &&
      formik.values.contents[index].item === ""
    ) {
      handleRemoveItem(index);
    } else if (e.key === "ArrowUp") {
      setTimeout(() => {
        const inputs = [...focusRef.current.querySelectorAll("input")];
        const target = inputs[index - 1 < 0 ? 0 : index - 1];
        target.focus();
        target.select();
      }, 10);
    } else if (e.key === "ArrowDown") {
      setTimeout(() => {
        const inputs = [...focusRef.current.querySelectorAll("input")];
        const target =
          inputs[inputs.length - 1 < index + 1 ? inputs.length - 1 : index + 1];
        target.focus();
        target.select();
      }, 10);
    }
  }

  return (
    <Stack ref={focusRef} flex={1} gap={1}>
      {formik.values.contents.map(({ item }, index) => (
        <Stack key={index} direction='row' alignItems={"center"} gap={1}>
          <TextField
            placeholder='회의록을 작성하세요!'
            fullWidth
            label='item'
            rows={10}
            value={item}
            onKeyDown={(e) => handleKeyEvent(e, index)}
            onBlur={formik.handleBlur}
            onChange={(e) => handleEachItemUpdate(e, index)}
          />
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
