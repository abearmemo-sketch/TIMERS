export default async function handler(req, res) {
  // 只接受 POST
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { task, startDate, fetchLatest } = req.body;

    // 如果前端請求最新 Notion Start Date
    if (fetchLatest) {
      const pageId = "265aa782851d80e8a6d5dde28fb9615d";
      const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28"
        }
      });

      const data = await response.json();
      if (!response.ok) return res.status(500).json({ error: data });

      // 取 Task 與 Start Date
      const taskValue = data.properties?.["Task"]?.rich_text?.[0]?.text?.content || "";
      const startValue = data.properties?.["Start Date"]?.date?.start || "";

      return res.status(200).json({ task: taskValue, start: startValue });
    }

    // 否則是更新頁面
    if (!task || !startDate) return res.status(400).json({ error: "Missing task or startDate" });

    const updateResponse = await fetch(
      "https://api.notion.com/v1/pages/265aa782851d80e8a6d5dde28fb9615d",
      {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${process.env.NOTION_TOKEN}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28"
        },
        body: JSON.stringify({
          properties: {
            "Task": { rich_text: [{ text: { content: task } }] },
            "Start Date": { date: { start: startDate } }
          }
        })
      }
    );

    const updateData = await updateResponse.json();
    if (!updateResponse.ok) return res.status(500).json({ error: updateData });

    res.status(200).json({ success: true, data: updateData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
