import { Box, Chip, FormHelperText, Stack, TextField } from "@mui/material";
import { FormikProps } from "formik";
import { FormEvent, KeyboardEvent, useState } from "react";
import { InitialValues } from "../../model/minutes";

type TagFieldProps = {
  name: string;
  formik: FormikProps<InitialValues>;
};

function TagField({ name, formik }: TagFieldProps) {
  const [inputValue, setInputValue] = useState("");

  function handleDelete(index: number) {
    formik.setFieldValue(
      "participants",
      formik.values.participants.filter((_, i) => i !== index)
    );
  }

  const handleKeyDownDesktop = (event: FormEvent) => {
    const native = event.nativeEvent as InputEvent;
    const value = inputValue;
    if ((native.data === "," || native.data === " ") && value) {
      event.preventDefault();
      event.stopPropagation();
      formik.setFieldValue(name, [
        ...formik.values.participants,
        { name: value.replace(/[,\s]/, "") },
      ]);
      setInputValue(() => "");
    } else {
      setInputValue(() => (event.target as HTMLInputElement).value);
    }
  };

  function handleKeyDownRemove(e: KeyboardEvent) {
    const value = inputValue;
    if (value.length === 0 && e.key === "Backspace") {
      formik.setFieldValue(name, formik.values.participants.slice(0, -1));
    }
  }

  return (
    <Stack
      flex={1}
      sx={{
        position: "relative",
      }}>
      <Box
        component={"label"}
        display='flex'
        flexWrap='wrap'
        gap={1}
        sx={{
          overflow: "auto",
          "&:hover": {
            cursor: "text",
            borderColor: "#dedede",
          },
          position: "relative",
          borderRadius: 1,
          borderColor: "#565656",
          borderWidth: 1,
          px: 3,
          py: 1.5,
          height: 56,
        }}>
        {formik.values.participants.map(({ name }, index) => (
          <Chip key={index} label={name} onDelete={() => handleDelete(index)} />
        ))}
        <TextField
          value={inputValue}
          // onChange={(e) => }
          onInput={handleKeyDownDesktop}
          onKeyDown={handleKeyDownRemove}
          placeholder='참여자 이름'
          size='small'
          margin='normal'
          onBlur={formik.handleBlur}
          sx={{
            my: "auto",
            input: {
              width: "50%",
              p: 0,
            },
            fieldset: {
              border: "none",
            },
          }}
        />
      </Box>
      {formik.touched.participants && Boolean(formik.errors.participants) && (
        <FormHelperText
          error
          sx={{
            position: "absolute",
            top: "100%",
            left: "1em",
          }}>
          {formik.errors.participants as string}
        </FormHelperText>
      )}
    </Stack>
  );
}

export default TagField;
