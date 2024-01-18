import { Box, Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { BASE } from "../util/global";

function Home() {
  return (
    <Stack
      alignItems={{
        xs: "center",
        md: "flex-start",
      }}>
      <Box
        sx={{
          p: 5,
          textAlign: {
            xs: "center",
            md: "inherit",
          },
        }}>
        <Typography variant='h3'>Meeting Minutes</Typography>
      </Box>
      <Stack
        direction='row'
        gap={2}
        sx={{
          p: 5,
        }}>
        <Button
          component={Link}
          to={BASE + "meeting-minutes/add"}
          variant='contained'
          color='success'>
          Write
        </Button>
        <Button
          component={Link}
          to={BASE + "meeting-minutes"}
          variant='contained'
          color='success'>
          Archive
        </Button>
      </Stack>
    </Stack>
  );
}

export default Home;
