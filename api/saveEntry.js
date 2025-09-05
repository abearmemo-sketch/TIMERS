let savedEntry = {}; // 簡單暫存資料（記憶體）

export default async function handler(req, res) {
    if (req.method === "POST") {
        savedEntry = req.body;
        return res.status(200).json({ success: true });
    } else {
        return res.status(200).json(savedEntry || {});
    }
}
