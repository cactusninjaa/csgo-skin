
<script>
import { Info } from 'lucide-vue-next';

export default {
  data() {
    return {
      skins: null,
      questions: null, // Liste des questions
      currentIndex: 0, // Index de la question actuelle
      userInput: '', // Réponse de l'utilisateur
      score: [],
      showModal: false, // Contrôle l'affichage du modal
      modalData: {}, // Données à afficher dans le modal
      showInfoModal: false, // Contrôle l'affichage de la popup info
    };
  },
  mounted() {
    // Fetch skins
    fetch('https://csgo-skin.onrender.com/skins')
      .then(response => response.json())
      .then(data => {
        this.skins = data;
      })
      .catch(error => console.error('Error fetching skins:', error));

    // Fetch specific question
    fetch('https://csgo-skin.onrender.com/questions/5')
      .then(response => response.json())
      .then(data => {
        this.questions = data;
      })
      .catch(error => console.error('Error fetching question:', error));
    },
    methods: {
      restartQuiz() {
        window.location.reload();
    },
      openInfoModal() {
        this.showInfoModal = true; // Ouvre la popup
      },
      closeInfoModal() {
        this.showInfoModal = false; // Ferme la popup
      },
      checkAnswer() {
        const correctAnswerFr = this.removeWeaponPrefix(this.questions[this.currentIndex].name_fr);
        const correctAnswerEn = this.removeWeaponPrefix(this.questions[this.currentIndex].name_en);
        const userAnswer = this.userInput.trim().toLowerCase();
        const isCorrect = userAnswer === correctAnswerFr.toLowerCase() || userAnswer === correctAnswerEn.toLowerCase();

        if (!isCorrect) {
          // Si faux, afficher la popup
          this.showModal = true;
          this.modalData = this.questions[this.currentIndex];
        }

        this.score.push(isCorrect);
        this.currentIndex++;
        this.userInput = '';
      },
      skipQuestion() {
        // Ajoute une réponse fausse au score et ouvre le modal
        this.showModal = true;
        this.modalData = this.questions[this.currentIndex];
        this.score.push(false);
        this.currentIndex++;
        this.userInput = '';
      },
      closeModal() {
        this.showModal = false;
      },
      removeWeaponPrefix(name) {
        return name.split(' | ')[1] || name;
  },

  },
};
</script>

<template>
  <div id="app" class="flex flex-col items-center justify-center min-h-screen p-2 sm:p-4">

    <!-- Affichage du score -->
    <div v-if="questions && currentIndex < questions.length" class="text-center">
      <!-- Indicateur de score -->
      <div class="text-center mb-6 flex justify-between items-center px-2 sm:px-4">
        <div></div>
        <div class="inline-flex space-x-1 sm:space-x-2">
          <span
            v-for="(status, index) in Array(questions.length).fill(null)"
            :key="index"
            class="text-xl sm:text-2xl"
          >
            {{ score[index] !== undefined ? (score[index] ? '✔️' : '❌') : '⬜' }}
          </span>
        </div>
        <button @click="openInfoModal" class="cursor-pointer text-xl sm:text-lg">
          ℹ️
        </button>
      </div>

      <!-- Carte principale avec l'image et le formulaire -->
      <div class="bg-white p-4 sm:p-6 rounded-lg shadow-md max-w-[90%] sm:max-w-md mx-auto">
        <Info class="w-5 h-5 sm:w-6 sm:h-6" />

        <img
          :src="questions[currentIndex].image"
          alt="Skin image"
          class="object-cover rounded-md mb-4 w-full max-h-[250px] sm:max-h-[300px]"
        />
        <input
          v-model="userInput"
          @keydown.enter="checkAnswer"
          autofocus
          placeholder="Entrez le nom du skin"
          class="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
        />
        <div class="flex space-x-2 sm:space-x-4">
          <button
            @click="skipQuestion"
            class="flex-1 bg-gray-500 text-white px-3 py-1 rounded-md transition hover:bg-gray-600 text-sm sm:text-base"
          >
            Passer
          </button>
          <button
            @click="checkAnswer"
            :disabled="!userInput.trim()"
            class="flex-1 bg-blue-500 text-white px-3 py-1 rounded-md transition hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Valider
          </button>
        </div>
      </div>
      
    </div>
    
    <!-- Fin du quiz -->
    <div v-else class="text-center px-4 sm:px-8 py-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-4">
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Partie terminée !</h2>
      <p class="text-lg sm:text-xl text-gray-600 mb-4">
        Votre score : <span class="font-semibold text-blue-600">{{ score.filter(Boolean).length }} / {{ score.length }}</span>
      </p>
      <button
        @click="restartQuiz"
        class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-200"
      >
        Recommencer
      </button>
    </div>


    <!-- Modal Info -->
    <div v-if="showInfoModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black px-4 sm:px-0">
      <div class="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h3 class="text-base sm:text-lg font-semibold mb-2">À propos</h3>
        <p class="mb-2">Crée par <strong>@cactus</strong></p>
        <h3 class="text-base sm:text-lg font-semibold mb-2">Règles</h3>
        <p class="mb-4 text-sm text-center">
          Vous deviner le nom du skin affiché<br>
          Les noms anglais et français sont acceptés.<br>          
          Ne mettez pas le nom de l'arme.<br/>
        </p>
        <button
          @click="closeInfoModal"
          class="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition text-sm sm:text-base"
        >
          Fermer
        </button>
      </div>
    </div>
    
    <!-- Modal Réponse correcte -->
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black px-4 sm:px-0"
      v-if="showModal"
    >
      <div class="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h3 class="text-base sm:text-lg font-semibold mb-2">Réponse correcte</h3>
        <p class="mb-2 text-sm sm:text-base">
          <strong>Français :</strong> {{ modalData.name_fr }}<br />
          <strong>Anglais :</strong> {{ modalData.name_en }}
        </p>
        <button
          @click="closeModal"
          class="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition text-sm sm:text-base"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>
