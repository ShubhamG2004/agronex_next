export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const formData = new FormData();
        formData.append("file", req.body.file);

        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Error connecting to Flask backend" });
    }
}
