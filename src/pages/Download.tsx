import { Button, Stack } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE } from "../util/global";
import { useEffect } from "react";
import Loading from "./Loading";

function Download() {
  const navigate = useNavigate();
  const locate = useLocation();

  useEffect(() => {
    const params = Object.fromEntries(
      new URLSearchParams(locate.search).entries()
    );
    if (params.json) {
      const a = document.createElement("a");
      const json = decodeURIComponent(params.json);
      const blob = new Blob([json], { type: "application/json" });
      const file = new File([blob], "backup.json", {
        type: blob.type,
      });
      const href = URL.createObjectURL(file);
      a.href = href;
      a.download = "backup.json";
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
      handleHome();
    } else {
      alert("잘못된 접근입니다.");
    }
  }, []);

  function handleHome() {
    navigate(BASE);
  }

  return <Loading />;
}

export default Download;
