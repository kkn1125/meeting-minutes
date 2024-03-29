import {
  Box,
  Button,
  FormGroup,
  FormHelperText,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { MouseEvent, useCallback, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import DateField from "../components/atoms/DateField";
import { DocumentContext } from "../context/DocumentProdiver";
import { MessageContext } from "../context/MessageProvider";
import Timestamp from "../model/timestamp";
import Todo, { TodoInitialValues, TodoType } from "../model/todo";
import { format } from "../util/features";
import { BASE } from "../util/global";

const validationSchema = yup.object({
  title: yup
    .string()
    .required("제목을 입력해주세요.")
    .typeError("문자만 가능합니다."),
  content: yup
    .string()
    .required("내용을 입력해주세요.")
    .typeError("문자만 가능합니다."),
  startTime: yup.string().required().typeError("날짜 형식만 가능합니다."),
  endTime: yup.string().required().typeError("날짜 형식만 가능합니다."),
  important: yup.number().required().typeError("숫자만 가능합니다."),
  // finished: yup.boolean(),
  // keep: yup.boolean(),
  // sequence: yup.number().typeError("숫자만 가능합니다."),
});

function TodoEditor() {
  const initialValues: TodoInitialValues = {
    title: "",
    content: "",
    startTime: format(new Date(), "YYYY-MM-ddTHH:mm:ss.SSS"),
    endTime: format(new Date(), "YYYY-MM-ddTHH:mm:ss.SSS"),
    important: 0,
  };
  const messageManager = useContext(MessageContext);
  const docuManager = useContext(DocumentContext);
  const locate = useLocation();
  const params = Object.fromEntries(
    new URLSearchParams(locate.search).entries()
  );
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    validate(values) {
      const errors: Partial<{ [key in keyof TodoInitialValues]: string }> = {};

      return errors;
    },
    onSubmit: (values) => {
      if (params.id) {
        const todo = docuManager.todoManager.findOne(params.id);
        todo.update(values as TodoType);
        const startTime = new Timestamp(todo.startTime);
        const endTime = new Timestamp(todo.endTime);
        startTime.removeSecond();
        startTime.removeMs();
        endTime.removeSecond();
        endTime.removeMs();
        todo.startTime = startTime.toString();
        todo.endTime = endTime.toString();

        messageManager.notification(todo, 1);

        const now = new Timestamp();
        if (now.isBeforeThan(startTime)) {
          todo.unnotifyStart();
        } else if (now.isAfterThan(startTime)) {
          messageManager.notification(todo, 2);
          todo.notifyStart();
        }
        if (now.isBeforeThan(endTime)) {
          todo.unnotifyEnd();
          todo.unfinish();
        } else if (now.isAfterThan(endTime)) {
          messageManager.notification(todo, 3);
          todo.notifyEnd();
          todo.finish();
        }

        docuManager.todoManager.update(params.id, todo);
        navigate(`${BASE}todos/view?id=${params.id}`);
      } else {
        const todo = new Todo(values);
        const startTime = new Timestamp(todo.startTime);
        const endTime = new Timestamp(todo.endTime);
        startTime.removeSecond();
        startTime.removeMs();
        endTime.removeSecond();
        endTime.removeMs();
        todo.startTime = startTime.toString();
        todo.endTime = endTime.toString();

        messageManager.notification(todo, 0);

        const now = new Timestamp();
        if (startTime.isBeforeThan(now) || startTime.isSameAs(now)) {
          messageManager.notification(todo, 2);
        }
        if (endTime.isBeforeThan(now) || endTime.isSameAs(now)) {
          messageManager.notification(todo, 3);
        }
        docuManager.todoManager.add(todo);
        navigate(`${BASE}todos`);
      }
    },
  });

  useEffect(() => {
    if (params.id) {
      const todo = docuManager.todoManager.findOne(params.id);
      if (todo) {
        formik.setFieldValue("title", todo.title);
        formik.setFieldValue("content", todo.content);
        formik.setFieldValue("startTime", todo.startTime);
        formik.setFieldValue("endTime", todo.endTime);
      } else {
        alert("잘못된 접근입니다.");
        navigate(BASE);
      }
    } else {
      formik.setValues(initialValues);
    }
  }, [params.id]);

  function handleClearFormData(e: MouseEvent) {
    if (!confirm("내용을 모두 지우시겠습니까?")) return;
    formik.setValues(initialValues);
  }

  function handleCancel(e: MouseEvent) {
    navigate(-1);
  }

  function handleChangeTimeToNow(type: "startTime" | "endTime"): void {
    const now = new Timestamp();
    now.removeSecond();
    now.removeMs();
    formik.setFieldValue(type, now);
  }

  const valueLabelFormat = useCallback((value: number) => {
    switch (value) {
      case 3:
        return "매우 중요";
      case 2:
        return "중요";
      case 1:
        return "다소 중요";
      case 0:
        return "보통";
      case -1:
        return "다소 여유";
      case -2:
        return "여유";
      case -3:
        return "매우 여유";
      default:
        return value;
    }
  }, []);

  return (
    <Box>
      <Stack
        component={"form"}
        gap={4}
        sx={{ mt: 3 }}
        onSubmit={formik.handleSubmit}>
        <Stack flex={1} gap={4}>
          {/* title & topic */}
          <Stack justifyContent={"space-between"} gap={3}>
            <TextField
              name='title'
              label='제목'
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
              name='content'
              label='내용'
              variant='outlined'
              fullWidth
              value={formik.values?.content}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.content && Boolean(formik.errors.content)}
              helperText={formik.touched.content && formik.errors.content}
              FormHelperTextProps={{
                sx: {
                  position: "absolute",
                  top: "100%",
                },
              }}
            />
            <FormGroup>
              <Stack spacing={1}>
                <Typography>중요도</Typography>
                <Slider
                  name='important'
                  marks
                  step={0.1}
                  max={3}
                  min={-3}
                  valueLabelDisplay='auto'
                  value={formik.values?.important}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  valueLabelFormat={valueLabelFormat}
                />
                {formik.touched.important &&
                  Boolean(formik.errors.important) && (
                    <FormHelperText
                      error
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: "1em",
                      }}>
                      {formik.errors.important as string}
                    </FormHelperText>
                  )}
              </Stack>
            </FormGroup>
            <Stack direction='row' alignItems='stretch' gap={1}>
              <DateField name='startTime' formik={formik} label='시작 시작' />
              <Button
                variant='contained'
                onClick={() => handleChangeTimeToNow("startTime")}>
                now
              </Button>
            </Stack>
            <Stack direction='row' alignItems='stretch' gap={1}>
              <DateField name='endTime' formik={formik} label='종료 시작' />
              <Button
                variant='contained'
                onClick={() => handleChangeTimeToNow("endTime")}>
                now
              </Button>
            </Stack>
          </Stack>
          <Stack direction='row' gap={1}>
            <Button
              color='success'
              type='submit'
              variant='contained'
              sx={{
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
                color: "white",
                borderRadius: "100px",
              }}>
              {params.id ? "cancel" : "cancel"}
            </Button>
            <Button
              color='warning'
              type='button'
              variant='contained'
              onClick={handleClearFormData}
              sx={{
                color: "white",
                borderRadius: "100px",
              }}>
              clear
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

export default TodoEditor;
