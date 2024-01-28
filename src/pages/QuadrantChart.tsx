import { Box, Stack } from "@mui/material";
import mermaid from "mermaid";
import { useContext, useEffect, useState } from "react";
import { DocumentContext } from "../context/DocumentProdiver";
import Timestamp from "../model/timestamp";
import { useNavigate } from "react-router-dom";
import { BASE } from "../util/global";

function QuadrantChart() {
  const navigate = useNavigate();
  const docuManager = useContext(DocumentContext);
  const [content, setContent] = useState("");
  const [campaign, setCampaign] = useState([]);

  useEffect(() => {
    const todos = docuManager.todoManager.findAll();
    const list = todos.map(
      (todo) =>
        new Timestamp(todo.endTime).getTime() -
        new Timestamp(todo.startTime).getTime()
    );
    const maxTime = Math.max(...list);
    const minTime = Math.min(...list);
    const quadrants = todos.map((todo) => {
      const startTime = new Timestamp(todo.startTime);
      const endTime = new Timestamp(todo.endTime);
      const gapTime = endTime.getTime() - startTime.getTime();
      const base = maxTime - minTime;
      const result = parseFloat((gapTime / base || 0).toFixed(1));
      return {
        campaign: todo.id.split("-")[1].slice(0, 10) + ":",
        xy: `[${result > 1 ? 1 : result}, ${(todo.important + 3) / 6}]`,
        isTimeShort: result < base,
        isImportant: todo.important,
      };
    });

    setContent(
      () => `
    quadrantChart
    title 할 일 분포도
    x-axis "단기간" --> "장기간"
    y-axis "여유" --> "중요"
    quadrant-1 "지속적인 관심이 필요한 작업"
    quadrant-2 "최우선순위 작업"
    quadrant-3 "자잘한 작업"
    quadrant-4 "후순위 작업"
    
    ${quadrants.map(({ campaign, xy }) => campaign + " " + xy).join("\n")}
    `
    );
    setCampaign(quadrants);

    window.addEventListener("click", handleNavigate);
    return () => {
      window.removeEventListener("click", handleNavigate);
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (content) {
        mermaid.initialize({
          securityLevel: "loose",
          startOnLoad: false,
          theme: "dark",
          darkMode: false,
        });
        const type = mermaid.detectType(content);
        import.meta.env.DEV && console.log("type:", type);
        await mermaid.run();
        const textList = [...document.querySelectorAll("text")];
        textList.forEach((textEl) => {
          if (!textEl.textContent.match(/^[ㄱ-힣]+/g)) {
            const color = "#de35ab";
            textEl.style.cssText = "cursor: pointer";
            if (
              textEl.previousElementSibling &&
              textEl.previousElementSibling.tagName === "circle"
            ) {
              textEl.previousElementSibling.setAttribute("fill", color);
            }
            textEl.setAttribute("fill", color);
          }
        });
      }
    })();
  }, [content, campaign]);

  function handleNavigate(e: MouseEvent) {
    const todos = docuManager.todoManager.findAll();
    const target = e.target as SVGTextElement;
    if (target.tagName === "text" && !target.textContent.match(/^[ㄱ-힣]+/g)) {
      const todo = todos.find((todo) =>
        todo.id.slice(5).match(target.textContent)
      );
      if (todo) {
        navigate(`${BASE}todos/view?id=${todo.id}`);
      }
    }
  }

  const ContentBox = () => {
    return (
      <Box
        component='pre'
        className='mermaid'
        children={content.trim()}
        sx={{ flex: 1, textAlign: "center" }}
      />
    );
  };

  return (
    <Stack direction='row' justifyContent='center'>
      <ContentBox />
    </Stack>
  );
}

export default QuadrantChart;
