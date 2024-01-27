import { Box, Stack } from "@mui/material";
import mermaid from "mermaid";
import { useContext, useEffect, useState } from "react";
import { DocumentContext } from "../context/DocumentProdiver";
import Timestamp from "../model/timestamp";

function QuadrantChart() {
  const docuManager = useContext(DocumentContext);
  const [content, setContent] = useState("");
  const [campaign, setCampaign] = useState([]);

  useEffect(() => {
    const todos = docuManager.todoManager.findAll();
    const quadrants = todos.map((todo) => {
      const startTime = new Timestamp(todo.startTime);
      const endTime = new Timestamp(todo.endTime);
      const gapTime = endTime.getTime() - startTime.getTime();
      const base = 1000 * 60 * 5;
      const result = parseFloat((gapTime / base).toFixed(1));

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
      }
    })();
  }, [content, campaign]);

  const ContentBox = () => {
    return (
      <Box component='pre' className='mermaid' children={content.trim()} />
    );
  };

  return (
    <Stack direction='row' justifyContent='center'>
      <ContentBox />
    </Stack>
  );
}

export default QuadrantChart;
