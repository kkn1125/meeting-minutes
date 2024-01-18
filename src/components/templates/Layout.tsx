import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Breadcrumbs, Paper, Stack } from "@mui/material";
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
  const locate = useLocation();
  const params = Object.fromEntries(
    new URLSearchParams(locate.search).entries()
  );
  const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>([]);

  useEffect(() => {
    // const crumbs = locate.pathname.split(/\b(?<=\/)|(?=\/)\b/g);
    const path = locate.pathname.slice(BASE.length - 1);
    const crumbs = path === "/" ? [""] : path.split(/\//g);
    if (crumbs.length > 1 && crumbs.at(-1) === "") {
      crumbs.pop();
    }
    const crumblist = crumbs.reduce((acc, cur) => {
      if (acc.at(-1)) {
        acc.push({
          to: [acc.at(-1).to, "/", cur].join("/").replace(/\/+/g, "/"),
          name: crumbTo[cur],
        });
      } else {
        acc.push({ to: BASE + cur, name: crumbTo[cur] });
      }
      return acc;
    }, []);
    console.log(crumblist);

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
        }}>
        <Stack
          direction='row'
          justifyContent={"space-between"}
          alignItems={"center"}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize='small' />}
            aria-label='breadcrumb'>
            {breadcrumbs.map(({ name, to }, index) => (
              <Link key={index} to={to}>
                {name}
              </Link>
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
            width: "60%",
            p: 5,
          }}>
          <Outlet />
        </Paper>
      </Box>
      <Footer />
    </Stack>
  );
}

export default Layout;
