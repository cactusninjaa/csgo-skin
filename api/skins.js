import axios from 'axios'

let skins = [];

export const getSkins = async (req, res) => {
    try {
        const [frResponse, enResponse] = await Promise.all([
            axios.get("https://bymykel.github.io/CSGO-API/api/fr/skins.json"),
            axios.get("https://bymykel.github.io/CSGO-API/api/en/skins.json")
        ]);

        const frSkins = frResponse.data;
        const enSkins = enResponse.data;

        const mergedSkins = frSkins.map(frSkin => {
            const enSkin = enSkins.find(en => en.id === frSkin.id);
            return {
                id: frSkin.id,
                name_fr: frSkin.name,
                name_en: enSkin ? enSkin.name : null,
                image: frSkin.image
            };
        });

        res.json(mergedSkins);

        skins = mergedSkins;
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch skins" });
    }
};

export const getStoredSkins = async () => {
    if (!skins.length) {
        return Promise.reject({ error: "No skins available" });
    }
    return Promise.resolve(skins);
};
