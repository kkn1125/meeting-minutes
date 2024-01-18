import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Box,
  Breadcrumbs,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import DarkModeButton from "../atoms/DarkModeButton";
import MenuItems from "../moleculars/MenuItems";
import Footer from "../organisms/Footer";
import { BASE } from "../../util/global";

type Crumb = {
  name: string;
  to: string;
};

const crumbTo = {
  "": "HOME",
  "meeting-minutes": "MEETING MINUTES",
  add: "WRITE",
  update: "UPDATE",
  view: "VIEW",
};

function Layout() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const locate = useLocation();
  const params = Object.fromEntries(
    new URLSearchParams(locate.search).entries()
  );
  const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>([]);

  useEffect(() => {
    const path = locate.pathname.slice(BASE.length);
    const crumbs = path.split(/\/+/g).filter((_) => _);
    const crumblist = crumbs.reduce(
      (acc, cur, index) => {
        acc.push({
          to: BASE + crumbs.slice(0, index + 1).join("/"),
          name: crumbTo[cur],
        });
        return acc;
      },
      [{ to: BASE, name: "HOME" }]
    );
    if (params.id) {
      crumblist.at(-1).to = crumblist.at(-1).to + "?id=" + params.id;
      crumblist.at(-1).name = crumblist.at(-1).name + " : " + params.id;
    }
    setBreadcrumbs(() => crumblist);
  }, [locate.pathname]);

  return (
    <Stack sx={{ height: "inherit" }}>
      <Stack
        spacing={2}
        sx={{
          mx: 5,
          my: 2,
          zIndex: 5,
        }}>
        <Stack
          direction='row'
          justifyContent={"space-between"}
          alignItems={"center"}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize='small' />}
            aria-label='breadcrumb'>
            {breadcrumbs.map(({ name, to }, index) => (
              <Typography
                component={Link}
                key={index}
                to={to}
                fontSize={(theme) =>
                  theme.typography.pxToRem(isMdUp ? 16 : 10)
                }>
                {name}
              </Typography>
            ))}
          </Breadcrumbs>
          <Stack direction='row' alignItems='center' gap={2}>
            <DarkModeButton />
            <MenuItems />
          </Stack>
        </Stack>
      </Stack>
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
        }}>
        <Paper
          component={Stack}
          elevation={5}
          sx={{
            my: 5,
            mx: "auto",
            width: {
              md: "60%",
              xs: "90%",
            },
          }}>
          <Outlet />
        </Paper>
      </Box>
      <Footer />
    </Stack>
  );
}

export default Layout;
