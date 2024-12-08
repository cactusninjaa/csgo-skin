import { getStoredSkins } from '../../utils/skinsService';
let skins = [];

export const getStoredSkins = async () => {
  if (!skins.length) {
    throw new Error('No skins available');
  }
  return skins;
};

export const setSkins = async (newSkins) => {
  skins = newSkins;
};
let dailyQuestions = {
  date: null,
  questions: []
};

const generateDailyQuestions = async () => {
  const skins = await getStoredSkins();
  const results = [];
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * skins.length);
    results.push(skins[randomIndex]);
  }
  return results;
};

export default async function handler(req, res) {
  try {
    const currentDate = new Date().toDateString();

    if (dailyQuestions.date !== currentDate) {
      dailyQuestions.date = currentDate;
      dailyQuestions.questions = await generateDailyQuestions();
    }

    res.status(200).json(dailyQuestions.questions);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
}
