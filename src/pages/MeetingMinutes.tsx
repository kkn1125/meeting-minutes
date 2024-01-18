import {
  Autocomplete,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
  createFilterOptions,
} from "@mui/material";
import { useFormik } from "formik";
import { MouseEvent, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import ContentListField from "../components/atoms/ContentListField";
import DateField from "../components/atoms/DateField";
import TagField from "../components/atoms/TagField";
import { DocumentationManager } from "../model/documentation.manager";
import Minutes, { InitialValues, MinutesType } from "../model/minutes";
import { format } from "../util/features";
import { Category } from "../model/documentation";
import { BASE } from "../util/global";

const docuManager = new DocumentationManager();

const initialValues: InitialValues = {
  category: "",
  title: "",
  topic: "",
  minutesDate: format(new Date(), "YYYY-MM-ddTHH:mm:ss.SSS"),
  participants: [],
  contents: [{ item: "" }],
  note: "",
};

const validationSchema = yup.object({
  category: yup
    .string()
    .required("유형 지정은 필수입니다.")
    .typeError("문자만 가능합니다."),
  title: yup
    .string()
    .required("제목을 입력해주세요.")
    .typeError("문자만 가능합니다."),
  topic: yup
    .string()
    .required("주제를 입력해주세요.")
    .typeError("문자만 가능합니다."),
  minutesDate: yup.string().required().typeError("날짜 형식만 가능합니다."),
  participants: yup
    .array(
      yup.object({
        name: yup.string(),
      })
    )
    .min(1, "참여자는 최소 1명 이상 입력해야합니다."),
  contents: yup
    .array(
      yup.object({
        item: yup.string(),
      })
    )
    .required()
    .typeError("문자만 가능합니다."),
  note: yup.string().typeError("문자만 가능합니다."),
});

const filter = createFilterOptions<Category>();

function MeetingMinutes() {
  const locate = useLocation();
  const params = Object.fromEntries(
    new URLSearchParams(locate.search).entries()
  );
  const categoryRef = useRef<HTMLInputElement>();
  const inputRef = useRef<HTMLInputElement>();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    validate(values) {
      const errors: Partial<{ [key in keyof InitialValues]: string }> = {};
      // console.log(values);
      if (values.minutesDate === null) {
        errors.minutesDate = "시간을 표시해주세요.";
      } else if (new Date(values.minutesDate).toString() === "Invalid Date") {
        errors.minutesDate = "잘못된 시간 형식입니다.";
      }
      return errors;
    },
    onSubmit: (values) => {
      const minutes = new Minutes(
        params.id ? (values as InitialValues) : (values as MinutesType)
      );

      if (params.id) {
        docuManager.update(params.id, minutes);
        navigate(`${BASE}meeting-minutes/${params.id}`);
      } else {
        docuManager.add(minutes);
        navigate(BASE);
      }
    },
  });

  const categoryOptions = useMemo(() => {
    return docuManager.documentation.categories;
  }, [formik.values.category]);

  const defaultCategory = useMemo(() => {
    return (
      formik.values.category ||
      docuManager.documentation.categories[0].inputValue
    );
  }, [formik.values.category]);

  useEffect(() => {
    if (params.id) {
      const minutes = docuManager.findOne(params.id);
      formik.setValues(minutes);
    }
  }, []);

  useEffect(() => {
    const focusEl = inputRef.current;
    if (focusEl) {
      focusEl.focus();
    }
  }, []);

  function addCategory(category: Category) {
    docuManager.documentation.addCategory(category);
  }

  function handleRemoveCategory(index: number) {
    docuManager.documentation.removeCategory(index);
  }

  return (
    <Box>
      <Typography align='center' fontWeight={700} variant='h4'>
        <Autocomplete
          options={categoryOptions}
          autoFocus
          value={
            defaultCategory
              ? {
                  caption: "",
                  inputValue: defaultCategory,
                }
              : null
          }
          getOptionLabel={(option) => {
            if (typeof option === "string") {
              return option;
            } else if (option.inputValue) {
              return option.inputValue;
            } else {
              return option.caption;
            }
          }}
          isOptionEqualToValue={(option, value) => {
            return (
              ((option as Category).inputValue || option) ===
              ((value as Category).inputValue || value)
            );
          }}
          onBlur={formik.handleBlur}
          onChange={(e, value, reason) => {
            if (reason === "clear") {
              formik.setFieldValue("category", "");
            } else {
              if (reason === "selectOption") {
                if (typeof value !== "string") {
                  if (value.caption.startsWith("Add")) {
                    addCategory(value);
                  }
                  console.log(value.inputValue);
                  formik.setFieldValue("category", value.inputValue);
                }
              } else {
                if (typeof value !== "string") {
                  formik.setFieldValue("category", value.inputValue || "");
                }
              }
            }
          }}
          filterOptions={(options: Category[], params) => {
            const filtered = filter(options, params);

            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some(
              (option) => inputValue === option.inputValue
            );
            if (inputValue !== "" && !isExisting) {
              filtered.push({
                inputValue,
                caption: `Add: "${inputValue}"`,
              });
            }

            return filtered;
          }}
          renderOption={(props, option, state, ownerState) => {
            return (
              <Stack
                component={"li"}
                direction='row'
                justifyContent='space-between !important'
                alignItems='center'
                {...props}
                key={props["data-option-index"]}>
                {typeof option === "string"
                  ? option
                  : option.caption.startsWith("Add")
                  ? option.caption
                  : option.inputValue}
                <IconButton
                  color='error'
                  size='small'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveCategory(props["data-option-index"]);
                    formik.setFieldValue("category", "");
                    const input = categoryRef.current;
                    input.value = "";
                  }}
                  sx={{ width: 30, height: 30 }}>
                  &times;
                </IconButton>
              </Stack>
            );
          }}
          renderInput={(params) => (
            <TextField
              ref={categoryRef}
              {...params}
              name='category'
              label='category'
              error={formik.touched.category && Boolean(formik.errors.category)}
              helperText={formik.touched.category && formik.errors.category}
              FormHelperTextProps={{
                sx: {
                  position: "absolute",
                  top: "100%",
                },
              }}
            />
          )}
        />
      </Typography>
      <Stack
        component={"form"}
        gap={4}
        sx={{ mt: 3 }}
        onSubmit={formik.handleSubmit}>
        <Stack flex={1} gap={4}>
          {/* title & topic */}
          <Stack direction='row' justifyContent={"space-between"} gap={3}>
            <TextField
              inputRef={inputRef}
              name='title'
              label='주제'
              variant='outlined'
              fullWidth
              value={formik.values.title}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              FormHelperTextProps={{
                sx: {
                  position: "absolute",
                  top: "100%",
                },
              }}
            />
            <TextField
              name='topic'
              label='목표'
              variant='outlined'
              fullWidth
              value={formik.values.topic}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.topic && Boolean(formik.errors.topic)}
              helperText={formik.touched.topic && formik.errors.topic}
              FormHelperTextProps={{
                sx: {
                  position: "absolute",
                  top: "100%",
                },
              }}
            />
          </Stack>

          {/* participants */}
          <Stack direction='row' justifyContent={"space-between"} gap={3}>
            <DateField name='minutesDate' formik={formik} />
            <Stack direction='row' gap={2} flex={1}>
              {/* stack tags */}
              <TagField name='participants' formik={formik} />
              {/* tags amount */}
              <TextField
                label='참여자 인원 수'
                disabled
                variant='outlined'
                fullWidth
                type='number'
                value={formik.values.participants.length}
                sx={{
                  width: 110,
                }}
                inputProps={{
                  min: 1,
                  max: 100,
                }}
              />
            </Stack>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* content & note */}
        <Stack direction='row' gap={2}>
          <ContentListField name='contents' formik={formik} />
          <TextField
            placeholder='떠오르는 아이디어를 작성하세요!'
            label='note'
            name='note'
            multiline
            rows={10}
            sx={{ flex: 0.3 }}
            value={formik.values.note}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={formik.touched.note && Boolean(formik.errors.note)}
            helperText={formik.touched.note && formik.errors.note}
            FormHelperTextProps={{
              sx: {
                position: "absolute",
                top: "100%",
              },
            }}
          />
        </Stack>

        <Box>
          <Button
            type='submit'
            className='bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg'
            sx={{
              color: "white",
              borderRadius: "100px",
            }}>
            {params.id ? "update" : "add"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

export default MeetingMinutes;
