let generatedParagraph = document.getElementById('generatedParagraph');
let outputtedParagraph = document.getElementById('outputtedParagraph');
let errors = document.querySelector('#errors');
let wordPerMinute = document.querySelector('#wordPerMinute');
let characterPerMinute = document.querySelector('#characterPerMinute');
let time = document.querySelector('#time');
let restart = document.querySelector('.restart');

const LIMIT_OF_GENERATED_PARAGRAPHS = 150;
const LIMIT_OF_SHOWN_PARAGRAPHS = 8;
const MAX_CHARACTERS_SHOWN_IN_PAGE = 72;
const ACTIVE_CLASSES = ['active', 'position-relative'];
const SPACE_CLASSES = [
  'space',
  'position-relative',
  'd-inline-block',
  'ps-3',
  'pe-2',
];

let collectedParagraphsFromApi = [];
let necessaryParagraphsToShow = [];
let splittedNecessaryParagraphsToShow = [];
let splittedOutputtedParagraph = [];
let timer;

fetch(`https://api.quotable.io/quotes?limit=${LIMIT_OF_GENERATED_PARAGRAPHS}`)
  .then(response => response.json())
  .then(data => {
    for (result in data.results) {
      collectedParagraphsFromApi.push(data.results[result].content);
    }
  })
  .then(() => initiateTypingTest());

const extractNecessaryParagraphsToShow = () => {
  for (i = 0; i < LIMIT_OF_SHOWN_PARAGRAPHS; i++) {
    const randomIndex = Math.floor(
      Math.random() * LIMIT_OF_GENERATED_PARAGRAPHS
    );
    necessaryParagraphsToShow.push(collectedParagraphsFromApi[randomIndex]);
  }
};

const splitParagraphs = () => {
  let paragraphsToSplit = necessaryParagraphsToShow.join(' ').split('');
  for (i = 0; i < paragraphsToSplit.length; i++) {
    splittedNecessaryParagraphsToShow.push(paragraphsToSplit[i]);
  }
};

const insertCharacter = (character, parent) => {
  const characterWrapper = document.createElement('span');
  characterWrapper.innerText = character;
  parent.appendChild(characterWrapper);
};

const fillParagraph = splittedParagraphs => {
  splittedParagraphs.forEach(character => {
    insertCharacter(character, generatedParagraph);
  });
};

const initiateParameters = () => {
  errors.textContent = 0;
  wordPerMinute.textContent = 0;
  characterPerMinute.textContent = 0;
  time.textContent = 5;
  generatedParagraph.innerHTML = '';
  input.removeAttribute('readonly');
  input.focus();
  generatedParagraph.classList.add("text-black-50")
  generatedParagraph.classList.remove("text-danger")
};

const resetParameters = () => {
  input.value = '';
  necessaryParagraphsToShow = [];
  splittedNecessaryParagraphsToShow = [];
  splittedOutputtedParagraph = [];
  outputtedParagraph.textContent = '';
};

const initiateTypingTest = () => {
  initiateParameters();
  extractNecessaryParagraphsToShow();
  splitParagraphs();
  fillParagraph(
    splittedNecessaryParagraphsToShow.slice(0, MAX_CHARACTERS_SHOWN_IN_PAGE)
  );
  generatedParagraph.firstElementChild.classList.add(...ACTIVE_CLASSES);
};

let startTimer = () => {
  timer = setInterval(ChangeTime, 1000);
};

let ChangeTime = () => {
  if (time.textContent > 0) {
    time.textContent--;
  } else {
    clearInterval(timer);
    input.setAttribute('readonly', true);
    generatedParagraph.classList.remove("text-black-50")
    generatedParagraph.classList.add("text-danger")
    generatedParagraph.firstElementChild.classList.remove(...ACTIVE_CLASSES);
  }
};

restart.addEventListener('click', () => {
  resetParameters();
  initiateTypingTest();
  clearInterval(timer);
});

input.addEventListener('blur', () => {
  input.focus();
});

input.addEventListener('keypress', e => {
  const firstCharacter = generatedParagraph.firstChild;

  if (firstCharacter.textContent === e.key) {
    splittedOutputtedParagraph.length === 0 && startTimer();
    e.key === ' '
      ? outputtedParagraph.classList.add('pe-3')
      : outputtedParagraph.classList.remove('pe-3');
    splittedNecessaryParagraphsToShow.shift();
    insertCharacter(
      splittedNecessaryParagraphsToShow[MAX_CHARACTERS_SHOWN_IN_PAGE - 1],
      generatedParagraph
    );
    splittedNecessaryParagraphsToShow.slice(
      0,
      MAX_CHARACTERS_SHOWN_IN_PAGE
    )[0] === ' '
      ? firstCharacter.nextElementSibling.classList.add(...SPACE_CLASSES)
      : firstCharacter.nextElementSibling.classList.add(...ACTIVE_CLASSES);
    firstCharacter.remove();
    splittedOutputtedParagraph.push(e.key);

    let OutputtedWords = splittedOutputtedParagraph.join('').split(' ').slice(0, -1);

    wordPerMinute.textContent = OutputtedWords.length;
    characterPerMinute.textContent = OutputtedWords.join(' ').length;
    insertCharacter(splittedOutputtedParagraph.slice(-1), outputtedParagraph);
  } else {
    firstCharacter.classList.add('error');
    errors.textContent++;
  }
});
