export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { task, startDate } = req.body;

  try {
    // 將時間轉成本地 ISO 字串，去掉 Z
    const date = new Date(startDate);
    const tzOffset = date.getTimezoneOffset() * 60000; // 毫秒
    const localISO = new Date(date - tzOffset).toISOString().slice(0, -1);

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
            "Start Date": { date: { start: localISO } } // <-- 改這裡
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
