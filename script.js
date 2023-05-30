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

const resetParameters = () => {
  input.value = '';
  errors.textContent = 0;
  wordPerMinute.textContent = 0;
  characterPerMinute.textContent = 0;
  time.textContent = 60;
  necessaryParagraphsToShow = [];
  splittedNecessaryParagraphsToShow = [];
  splittedOutputtedParagraph = [];
  outputtedParagraph.textContent = '';
};

const initiateTypingTest = () => {
  generatedParagraph.innerHTML = '';
  extractNecessaryParagraphsToShow();
  splitParagraphs();
  fillParagraph(
    splittedNecessaryParagraphsToShow.slice(0, MAX_CHARACTERS_SHOWN_IN_PAGE)
  );
  generatedParagraph.firstElementChild.classList.add(...ACTIVE_CLASSES);
  input.focus();
};

restart.addEventListener('click', () => {
  resetParameters();
  initiateTypingTest();
});

input.addEventListener('blur', () => {
  input.focus();
});

input.addEventListener('input', e => {
  const firstCharacter = generatedParagraph.firstChild;
  let typedText = e.target.value;

  if (firstCharacter.textContent === typedText[typedText.length - 1]) {
    typedText[typedText.length - 1] === ' '
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
    splittedOutputtedParagraph.push(typedText[typedText.length - 1]);
    let ooo = splittedOutputtedParagraph.join('').split(' ').slice(0, -1);
    wordPerMinute.textContent = ooo.length;
    characterPerMinute.textContent = ooo.join(' ').length;
    insertCharacter(splittedOutputtedParagraph.slice(-1), outputtedParagraph);
  } else {
    firstCharacter.classList.add('error');
    errors.textContent++;
  }
});
