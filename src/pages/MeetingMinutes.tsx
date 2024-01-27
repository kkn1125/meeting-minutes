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
import { MouseEvent, useContext, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import ContentListField from "../components/atoms/ContentListField";
import DateField from "../components/atoms/DateField";
import TagField from "../components/atoms/TagField";
import { DocumentContext } from "../context/DocumentProdiver";
import { Category } from "../model/documentation";
import Minutes, {
  CONTENT_TYPE,
  InitialValues,
  MinutesType,
} from "../model/minutes";
import { format } from "../util/features";
import { BASE } from "../util/global";

const initialValues: InitialValues = {
  category: undefined,
  title: "",
  topic: "",
  minutesDate: format(new Date(), "YYYY-MM-ddTHH:mm:ss.SSS"),
  participants: [],
  contents: [{ item: "", type: CONTENT_TYPE.TEXT }],
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
  const docuManager = useContext(DocumentContext);
  const categoryRef = useRef<HTMLInputElement>();
  const inputRef = useRef<HTMLInputElement>();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    validate(values) {
      const errors: Partial<{ [key in keyof InitialValues]: string }> = {};
      if (values?.minutesDate === null) {
        errors.minutesDate = "시간을 표시해주세요.";
      } else if (new Date(values?.minutesDate).toString() === "Invalid Date") {
        errors.minutesDate = "잘못된 시간 형식입니다.";
      }
      return errors;
    },
    onSubmit: (values) => {
      const minutes = new Minutes(
        params.id ? (values as InitialValues) : (values as MinutesType)
      );

      if (params.id) {
        minutes.udpateTimestamp();
        docuManager.update(params.id, minutes);
        navigate(`${BASE}meeting-minutes/view?id=${params.id}`);
      } else {
        docuManager.add(minutes);
        navigate(`${BASE}meeting-minutes`);
      }
    },
  });

  const categoryOptions = useMemo(() => {
    return docuManager.documentation.categories;
  }, [formik.values?.category]);

  const defaultCategory = useMemo(() => {
    const defaultValue =
      formik.values.category ??
      docuManager.documentation.categories?.[0]?.inputValue;
    formik.setFieldValue("category", defaultValue);
    return defaultValue;
  }, [formik.values?.category]);

  useEffect(() => {
    if (params.id) {
      const minutes = docuManager.findOne(params.id);
      if (minutes) {
        formik.setValues(minutes);
      } else {
        alert("잘못된 접근입니다.");
        navigate(BASE);
      }
    } else {
      formik.setValues(initialValues);
    }
  }, [params.id]);

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

  function handleClearFormData(e: MouseEvent) {
    if (!confirm("내용을 모두 지우시겠습니까?")) return;
    formik.setValues(initialValues);
  }

  function handleCancel(e: MouseEvent) {
    navigate(-1);
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
              label='분류'
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
              value={formik.values?.title}
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
              value={formik.values?.topic}
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
          <Stack
            direction={{
              md: "row",
              xs: "column",
            }}
            justifyContent={"space-between"}
            gap={3}>
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
                value={formik.values?.participants.length}
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
        <Stack gap={3}>
          <Box sx={{ flex: 1 }}>
            <ContentListField name='contents' formik={formik} />
          </Box>
          <Divider />
          <Box sx={{ flex: 0.35 }}>
            <TextField
              placeholder='떠오르는 아이디어를 작성하세요!'
              label='메모'
              name='note'
              multiline
              fullWidth
              value={formik.values?.note}
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
          </Box>
        </Stack>

        <Stack
          direction={{ xs: "column", lg: "row" }}
          justifyContent={"space-between"}
          gap={1}>
          <Stack direction='row' gap={1}>
            <Button
              color='success'
              variant='contained'
              type='submit'
              sx={{
                flex: {
                  xs: 1,
                  md: 0,
                },
                px: 5,
                color: "white",
                borderRadius: "100px",
              }}>
              {params.id ? "update" : "add"}
            </Button>
            <Button
              color='inherit'
              variant='contained'
              type='button'
              onClick={handleCancel}
              sx={{
                flex: {
                  xs: 1,
                  md: 0,
                },
                px: 5,
                color: "white",
                borderRadius: "100px",
              }}>
              {params.id ? "cancel" : "cancel"}
            </Button>
          </Stack>
          <Stack direction='row'>
            <Button
              color='warning'
              variant='contained'
              sx={{
                color: "white",
                borderRadius: "100px",
              }}
              type='button'
              onClick={handleClearFormData}>
              {params.id ? "clear" : "clear"}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

export default MeetingMinutes;
