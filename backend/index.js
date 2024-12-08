import express from 'express'
import cors from 'cors'
import {getSkins, getStoredSkins} from './routes/skin.js'
import {getQuestions} from './routes/question.js'



const app = express()
const router = express.Router()
app.use(cors())


router.get('/skins', getSkins)
router.get('/questions/:id', getQuestions)
router.get('/stored-skins', getStoredSkins);


app.use(router);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

