import { Box, Button, Stack, TextField } from "@mui/material";
import React, { MouseEvent, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE } from "../util/global";
import { format } from "../util/features";
import Todo, { TodoInitialValues, TodoType } from "../model/todo";
import DateField from "../components/atoms/DateField";
import { docuManager } from "../model/documentation.manager";
import Timestamp from "../model/timestamp";

const initialValues: TodoInitialValues = {
  title: "",
  content: "",
  startTime: format(new Date(), "YYYY-MM-ddTHH:mm:ss.SSS"),
  endTime: format(new Date(), "YYYY-MM-ddTHH:mm:ss.SSS"),
};

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
  // finished: yup.boolean(),
  // keep: yup.boolean(),
  // sequence: yup.number().typeError("숫자만 가능합니다."),
});

function TodoEditor() {
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
        const todo = new Todo(values as TodoType);
        const startTime = new Timestamp(todo.startTime);
        const endTime = new Timestamp(todo.endTime);
        startTime.removeSecond();
        startTime.removeMs();
        endTime.removeSecond();
        endTime.removeMs();
        todo.startTime = startTime.toString();
        todo.endTime = endTime.toString();
        const now = new Timestamp();
        if (now.isAfterThan(endTime)) {
          todo.unfinish();
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

  return (
    <Box
      sx={{
        m: 5,
      }}>
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
