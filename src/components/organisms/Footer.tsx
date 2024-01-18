import { Box, Paper, Typography } from "@mui/material";

function Footer() {
  return (
    <Paper elevation={5}>
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Copyright 2024. devkimson. all rights reserved.</Typography>
      </Box>
    </Paper>
  );
}

export default Footer;
