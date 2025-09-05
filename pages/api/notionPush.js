export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") return res.status(200).end();

    if (req.method !== "POST") return res.status(405).end();

    const { start, description } = req.body;

    try {
        const notionRes = await fetch(`https://api.notion.com/v1/pages/265aa782851d80e8a6d5dde28fb9615d`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${process.env.NOTION_TOKEN}`,
                "Content-Type": "application/json",
                "Notion-Version": "2022-06-28"
            },
            body: JSON.stringify({
                properties: {
                    Task: { rich_text: [{ text: { content: description } }] },
                    "Start Date": { date: { start: start } }
                }
            })
        });

        const result = await notionRes.json();
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update Notion" });
    }
}
