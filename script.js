const cards = [
    {en: "world", ru: "мир", example: "He is known the world over."},
    {en: "car", ru: "машина", example: "I always go to work by car."},
    {en: "knowledge", ru: "знания", example: "She has little knowledge of fashion."},
    {en: "sea", ru: "море", example: "The sea was perfectly calm."},
    {en: "book", ru: "книга", example: "He brought me a book."},
    {en: "homework", ru: "домашняя работа", example: "Read Chapter 11 as your homework."},
    {en: "bicycle", ru: "велосипед", example: "He wants a bicycle for his birthday."},
    {en: "money", ru: "деньги", example: "I always carry money."},
];

const flipCard = document.querySelector(".flip-card");
const cardFront = document.querySelector("#card-front h1");
const cardBack = document.querySelector("#card-back h1");
const cardExample = document.querySelector("#card-back p span");
const backButton = document.querySelector("#back");
const nextButton = document.querySelector("#next");
const testButton = document.querySelector("#exam");
const totalWord = document.querySelector("#total-word");
const currentWord = document.querySelector("#current-word");
const wordsProgress = document.querySelector("#words-progress");
const studyCardsContainer = document.querySelector(".study-cards");
const sliderCard = document.querySelector(".slider");
const studyMode = document.querySelector("#study-mode");
const shuffleButton = document.querySelector("#shuffle-words");
totalWord.textContent = cards.length;
let currentCardIndex = 1;
const shuffleWords = [...cards];

function activeCard(array) {
    const card = array[currentCardIndex - 1];
    cardFront.textContent = card.en;
    cardBack.textContent = card.ru;
    cardExample.textContent = card.example;

    backButton.disabled = currentCardIndex === 1;
    nextButton.disabled = currentCardIndex === array.length;

    currentWord.textContent = currentCardIndex;
    wordsProgress.value = (currentCardIndex) / array.length * 100;
};

flipCard.addEventListener('click', (event) => {
    event.currentTarget.classList.toggle("active")
});

nextButton.addEventListener('click', () => {
    if (currentCardIndex <= cards.length) {
        currentCardIndex++;
        activeCard(shuffleWords);
    }
});

backButton.addEventListener('click', () => {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        activeCard(shuffleWords);
    }
});

shuffleButton.addEventListener('click', () => {
    shuffleWords.sort(() => Math.random() - 0.5);
    activeCard(shuffleWords);
});

activeCard(cards);

/////////////////////
const examMode = document.querySelector("#exam-mode");
const sliderControls = document.querySelector(".slider-controls");
const examCardsContainer = document.querySelector("#exam-cards");
const examProgress = document.querySelector("#exam-progress");
const correctPercent = document.querySelector("#correct-percent");
let suitableCards = 0;
let selectedWord;
const newCards = [...cards];
let dictionary;

testButton.addEventListener('click', () => {
    startExam();
    startTimer();
});

function startExam() {
    studyMode.classList.add("hidden");
    examMode.classList.remove("hidden");
    studyCardsContainer.classList.add("hidden");

    makeDictionary();
    prepareCard();
};

function prepareCard() {
    const allWords = [];
    newCards.forEach(function(item) {
        delete item.example;
        const values = Object.values(item);
        allWords.push(...values);
    });

    const sortedWords = allWords.sort(() => Math.random() - 0.5);
    
    sortedWords.forEach((word) => {
        const examCardWord = createCards(word);
        examCardsContainer.append(examCardWord);
    });
};

function createCards(text) {
    const examCard = document.createElement("div");
    examCard.classList.add("card");
    examCard.textContent = text;

    examCard.addEventListener("click", function() {
        if (selectedWord == null) {
            selectedWord = this;
            selectedWord.classList.add("correct");
        } else {
            if (dictionary[selectedWord.textContent] === this.textContent) {
                this.classList.add("correct", "fade-out", "hidden");
                selectedWord.classList.add("fade-out", "hidden");
                console.log(this)
                selectedWord = null;
                suitableCards++;
                examProgress.value = (suitableCards / cards.length) * 100;
                correctPercent.textContent = Math.ceil(+examProgress.value) + "%";
            } else {
                this.classList.add("wrong");
                setTimeout(() => {
                    selectedWord.classList.remove("correct");
                    this.classList.remove("wrong");
                    selectedWord = null;
                }, 500)
            }
        };

        if (suitableCards === cards.length) {
            clearInterval(timerId);
            setTimeout(() => {
                alert("Экзамен пройден!")
            }, 500);
        };
    });

    return examCard;
};

function makeDictionary() {
    const pairWords = [];

    newCards.forEach((item) => {
        delete item.example;
        const values = Object.values(item);
        const reversed = Object.values(item);
        reversed.reverse();
        pairWords.push(values, reversed);
        dictionary = Object.fromEntries(pairWords);
    });
};

const timer = document.querySelector("#time");
let timerId;
let time;

function startTimer() {
    timerId = setInterval(() => {
        let [mins, seconds] = timer.textContent.split(":").map(Number);
        if (seconds > 59) {
            mins++;
            seconds = 0;
        } else {
            seconds++;
        };
    
        time = `${format(mins)}:${format(seconds)}`;
        timer.textContent = time;
    }, 1000);
};

function format(val) {
    if (val < 10) {
        return `0${val}`
    }
    return val;
};