import {getStoredSkins} from './skins.js'

export const getQuestions = async (req, res) => {
    try {
        const skins = await getStoredSkins();

        const id = parseInt(req.params.id); 
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: "Invalid ID provided" });
        }
        if (skins.length === 0) {
            return res.status(404).json({ error: "No skins available" });
        }
        const results = []; 
        for (let i = 1; i <= id; i++) {
            const randomIndex = Math.floor(Math.random() * skins.length);
            results.push(skins[randomIndex]); 
        }
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
}