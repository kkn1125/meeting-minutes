import { Box, Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Stack>
      <Box
        sx={{
          p: 5,
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
          to='/meeting-minutes/add'
          variant='contained'
          color='success'>
          Write
        </Button>
        <Button
          component={Link}
          to='/meeting-minutes'
          variant='contained'
          color='success'>
          Archive
        </Button>
      </Stack>
    </Stack>
  );
}

export default Home;
