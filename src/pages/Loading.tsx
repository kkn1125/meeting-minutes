import { CircularProgress, Stack } from "@mui/material";

function Loading() {
  return (
    <Stack
      direction='row'
      justifyContent='center'
      alignItems='center'
      sx={{
        height: "100%",
      }}>
      <CircularProgress />
    </Stack>
  );
}

export default Loading;
