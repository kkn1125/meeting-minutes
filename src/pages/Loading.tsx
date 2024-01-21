import { Box, CircularProgress, Stack } from "@mui/material";
import React from "react";

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
