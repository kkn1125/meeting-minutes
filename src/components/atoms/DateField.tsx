import { Box, FormHelperText } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { FormikProps } from "formik";
import { InitialValues } from "../../model/minutes";

type DateFieldProps = {
  name: string;
  formik: FormikProps<InitialValues>;
};

export default function DateField({ name, formik }: DateFieldProps) {
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
          label='date'
          value={dayjs(formik.values.minutesDate)}
          onChange={(date: Dayjs, { validationError }) => {
            formik.setFieldValue(name, date?.toDate() || null);
          }}
          sx={{
            width: "inherit",
          }}
        />
        {formik.touched.minutesDate && Boolean(formik.errors.minutesDate) && (
          <FormHelperText
            error
            sx={{
              position: "absolute",
              top: "100%",
              left: "1em",
            }}>
            {formik.errors.minutesDate as string}
          </FormHelperText>
        )}
      </Box>
    </LocalizationProvider>
  );
}
