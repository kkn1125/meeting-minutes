import { Box, Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { BASE } from "../util/global";

function Home() {
  return (
    <Stack
      alignItems={{
        xs: "center",
        lg: "flex-start",
      }}>
      <Box
        sx={{
          flex: 1,
          p: 5,
          textAlign: {
            xs: "center",
            lg: "inherit",
          },
        }}>
        <Typography variant='h3'>Meeting Minutes</Typography>
      </Box>
      <Stack
        direction={{ xs: "column", lg: "row" }}
        gap={2}
        flex={1}
        sx={{
          width: "100%",
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
