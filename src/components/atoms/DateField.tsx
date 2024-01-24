import { Box, FormHelperText } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { FormikProps } from "formik";
import { InitialValues } from "../../model/minutes";

type DateFieldProps<T = any> = {
  name: string;
  formik: FormikProps<T>;
  label?: string;
};

export default function DateField<T>({
  name,
  formik,
  label = "날짜",
}: DateFieldProps<T>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          flex: 1,
          width: "100%",
          position: "relative",
        }}>
        <DateTimePicker
          name={name}
          label={label}
          value={dayjs(formik.values?.[name])}
          onChange={(date: Dayjs, { validationError }) => {
            formik.setFieldValue(name, date?.toDate() || null);
          }}
          sx={{
            width: "inherit",
          }}
        />
        {formik.touched[name] && Boolean(formik.errors[name]) && (
          <FormHelperText
            error
            sx={{
              position: "absolute",
              top: "100%",
              left: "1em",
            }}>
            {formik.errors?.[name] as string}
          </FormHelperText>
        )}
      </Box>
    </LocalizationProvider>
  );
}
