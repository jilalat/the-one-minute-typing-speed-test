let generatedParagraph = document.getElementById('generatedParagraph');
let outputtedParagraph = document.getElementById('outputtedParagraph');
let refresh = document.querySelector('.refresh');

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

const initiateTypingTest = () => {
  generatedParagraph.innerHTML = '';
  extractNecessaryParagraphsToShow();
  splitParagraphs();
  fillParagraph(
    splittedNecessaryParagraphsToShow.slice(0, MAX_CHARACTERS_SHOWN_IN_PAGE)
  );
  generatedParagraph.firstElementChild.classList.add(...ACTIVE_CLASSES);
  input.focus();
  input.value = '';
};

refresh.addEventListener('click', () => {
  necessaryParagraphsToShow = [];
  splittedNecessaryParagraphsToShow = [];
  outputtedParagraph.textContent = '';
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
    insertCharacter(typedText[typedText.length - 1], outputtedParagraph);
  } else {
    firstCharacter.classList.add('error');
  }
});
