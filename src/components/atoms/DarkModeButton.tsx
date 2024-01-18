import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { IconButton } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "../../context/DarkModeProvider";

function DarkModeButton() {
  const toggleTheme = useContext(ColorModeContext);
  function toggleMode() {
    toggleTheme.toggleColorMode();
  }
  return (
    <IconButton size='small' onClick={toggleMode}>
      {toggleTheme.mode() === "light" ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
}

export default DarkModeButton;
