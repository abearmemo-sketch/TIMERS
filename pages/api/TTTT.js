export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") return res.status(200).end();

    try {
        const togglRes = await fetch("https://api.track.toggl.com/api/v9/me/time_entries/current", {
            headers: {
                "Authorization": `Basic ${Buffer.from(process.env.TOGGL_TOKEN + ":api_token").toString("base64")}`
            }
        });
        const data = await togglRes.json();
        return res.status(200).json({ current_timer: data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch Toggl" });
    }
}
