import { getStoredSkins } from './skin.js';

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

const getQuestions = async (req, res) => {
  try {
    const currentDate = new Date().toDateString(); // Obtenir la date en cours
    if (dailyQuestions.date !== currentDate) {
      // Si la date a changé, régénérer les questions
      dailyQuestions.date = currentDate;
      dailyQuestions.questions = await generateDailyQuestions();
    }
    
    res.json(dailyQuestions.questions);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

export { getQuestions };
