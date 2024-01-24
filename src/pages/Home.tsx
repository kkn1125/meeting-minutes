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
          to={BASE + "meeting-minutes"}
          variant='contained'
          color='success'>
          documentation
        </Button>
        <Button
          component={Link}
          to={BASE + "todos"}
          variant='contained'
          color='success'>
          todo
        </Button>
        <Button
          component={Link}
          to={BASE + "chart?view=weekly"}
          variant='contained'
          color='success'>
          Weekly Chart
        </Button>
      </Stack>
    </Stack>
  );
}

export default Home;
