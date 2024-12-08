import axios from 'axios';

let skins = [];

export default async function handler(req, res) {
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

    skins = mergedSkins; // Mettez en cache pour l'usage dans `getStoredSkins`
    res.status(200).json(mergedSkins);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch skins" });
  }
}
