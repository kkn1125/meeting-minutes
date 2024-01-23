import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import GetAppIcon from "@mui/icons-material/GetApp";
import GroupsIcon from "@mui/icons-material/Groups";
import InventoryIcon from "@mui/icons-material/Inventory";
import MenuIcon from "@mui/icons-material/Menu";
import SaveIcon from "@mui/icons-material/Save";
import {
  Avatar,
  IconButton,
  ListItemIcon,
  MenuList,
  Stack,
  Typography,
} from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import {
  KeyboardEvent,
  SyntheticEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { DocumentationManager } from "../../model/documentation.manager";
import { DATA_ACTION, DataDispatchContext } from "../../context/DataProvider";
import { BASE, MODE } from "../../util/global";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import { v4 } from "uuid";
import TaskIcon from "@mui/icons-material/Task";

function MenuItems() {
  const [showFile, setShowFile] = useState(false);
  const dataDispatch = useContext(DataDispatchContext);
  const docuManager = new DocumentationManager();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [kscriptLoaded, setKscriptLoaded] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  function handleUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.click();
    input.addEventListener(
      "change",
      (e) => {
        const file = input.files[0];
        if (file)
          docuManager.import("json", file, () =>
            dataDispatch({
              type: DATA_ACTION.LOAD,
            })
          );
      },
      {
        once: true,
      }
    );
    input.remove();
  }

  function handleCopyJsonToLink() {
    const jsonUrl = docuManager.jsonToUrl();
    navigator.clipboard
      .writeText(
        MODE
          ? `http://localhost:5000/download?json=${jsonUrl}`
          : `https://kkn1125.github.io/meeting-minutes/download?json=${jsonUrl}`
      )
      .then(() => {
        alert(
          "다운로드 링크가 복사되었습니다. 해당 링크로 접속하시면 백업 데이터를 다운로드 할 수 있습니다."
        );
      });
  }

  function handleCopyToClipboardAsFile() {
    setShowFile(true);
  }

  return (
    <div>
      <IconButton
        ref={anchorRef}
        id='composition-button'
        aria-controls={open ? "composition-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup='true'
        onClick={handleToggle}>
        <MenuIcon />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement='bottom-start'
        transition
        disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-start" ? "left top" : "left bottom",
            }}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id='composition-menu'
                  aria-labelledby='composition-button'
                  onKeyDown={handleListKeyDown}>
                  <MenuItem
                    onClick={(e) => {
                      handleClose(e);
                      navigate(`${BASE}meeting-minutes/add`);
                    }}>
                    <ListItemIcon>
                      <GroupsIcon fontSize='small' />
                    </ListItemIcon>
                    <Typography variant='body2' color='text.secondary'>
                      회의록 작성
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      handleClose(e);
                      navigate(`${BASE}meeting-minutes`);
                    }}>
                    <ListItemIcon>
                      <InventoryIcon fontSize='small' />
                    </ListItemIcon>
                    <Typography variant='body2' color='text.secondary'>
                      회의록 작성 목록
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      handleClose(e);
                      docuManager.saveAll();
                      alert("데이터가 저장되었습니다.");
                    }}>
                    <ListItemIcon>
                      <SaveIcon fontSize='small' />
                    </ListItemIcon>
                    <Typography variant='body2' color='text.secondary'>
                      데이터 저장하기
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      handleClose(e);
                      handleUpload();
                    }}>
                    <ListItemIcon>
                      <GetAppIcon fontSize='small' />
                    </ListItemIcon>
                    <Typography variant='body2' color='text.secondary'>
                      백업 데이터 가져오기
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      handleClose(e);
                      docuManager.export("json");
                    }}>
                    <ListItemIcon>
                      <FileUploadIcon fontSize='small' />
                    </ListItemIcon>
                    <Typography variant='body2' color='text.secondary'>
                      백업 데이터 내보내기
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      handleClose(e);
                      handleCopyJsonToLink();
                    }}>
                    <ListItemIcon>
                      <InsertLinkIcon />
                    </ListItemIcon>
                    <Typography variant='body2' color='text.secondary'>
                      링크로 내보내기
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      handleClose(e);
                      if (
                        !confirm(
                          "모든 데이터를 삭제합니다. 삭제된 데이터는 복구가 불가능합니다. 데이터를 삭제하시기 전에 백업 데이터를 받아두시기 바랍니다. "
                        )
                      )
                        return;
                      docuManager.clearAllDocuments();
                      dataDispatch({
                        type: DATA_ACTION.LOAD,
                      });
                      navigate(BASE);
                    }}>
                    <ListItemIcon>
                      <DeleteForeverIcon fontSize='small' />
                    </ListItemIcon>
                    <Typography variant='body2' color='text.secondary'>
                      데이터 초기화
                    </Typography>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}

export default MenuItems;
