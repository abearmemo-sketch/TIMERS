export default async function handler(req, res) {
  if (req.method !== "POST") 
    return res.status(405).json({ error: "Method not allowed" });

  const { task, startDate } = req.body;

  try {
    // 將收到的 startDate 轉成台灣時間 (UTC+8) 的 ISO 字串
    const date = new Date(startDate);
    const tzOffset = 8 * 60; // 台灣時區 +8 小時
    const localDate = new Date(date.getTime() + tzOffset * 60 * 1000);
    const localISO = localDate.toISOString().slice(0, 19); // 去掉毫秒與 Z

    const response = await fetch(
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
            "Start Date": { date: { start: localISO } }
          }
        })
      }
    );

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data });

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
