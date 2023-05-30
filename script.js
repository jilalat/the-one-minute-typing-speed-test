let generatedParagraph = document.getElementById('generatedParagraph');
let outputtedParagraph = document.getElementById('outputtedParagraph');
let refresh = document.querySelector('.refresh');

const LIMIT_OF_GENERATED_PARAGRAPHS = 150;
const LIMIT_OF_SHOWN_PARAGRAPHS = 8;
const MAX_CHARACTERS_SHOWN_IN_PAGE = 150;
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
let necessaryParagraphsToShowSplitted = [];
// let splittedParagraphsToShow = [];

// const createRequest = () => {
  fetch(`https://api.quotable.io/quotes?limit=${LIMIT_OF_GENERATED_PARAGRAPHS}`)
  .then(response => response.json())
  .then(data => {
    for (result in data.results) {
      collectedParagraphsFromApi.push(data.results[result].content);
    }
  })
  // .then(() => console.log(collectedParagraphsFromApi))
  // .then(() => console.log(necessaryParagraphsToShow))
  .then(() => initiateTypingTest());
  // .then(() => initiateTypingTest());
  // };
  
  // createRequest();
  
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
        necessaryParagraphsToShowSplitted.push(paragraphsToSplit[i]);
      }
    };
    
    const insertCharacter = (character, parent) => {
      const characterWrapper = document.createElement('span');
      characterWrapper.innerText = character;
      parent.appendChild(characterWrapper);
    }
    
    const fillParagraph = splittedParagraphs => {
      splittedParagraphs.forEach(character => {
        insertCharacter(character, generatedParagraph)
      });
    };
    
    const initiateTypingTest = () => {
      generatedParagraph.innerHTML = '';
      extractNecessaryParagraphsToShow();
      splitParagraphs();
      fillParagraph(necessaryParagraphsToShowSplitted.slice(0, MAX_CHARACTERS_SHOWN_IN_PAGE));
      generatedParagraph.firstElementChild.classList.add(...ACTIVE_CLASSES);
    };
    
    refresh.addEventListener('click', () => {
      necessaryParagraphsToShow = [];
      necessaryParagraphsToShowSplitted = [];
      outputtedParagraph.textContent = '';
      initiateTypingTest();
    });

  window.addEventListener('keypress', e => {
    const firstGeneratedCharacters = document.querySelector('#generatedParagraph span');
    console.log(e.key);
      if (e.key === firstGeneratedCharacters.textContent) {
        e.key === ' ' ? outputtedParagraph.classList.add('pe-3') : outputtedParagraph.classList.remove('pe-3')
        necessaryParagraphsToShowSplitted.shift();
        insertCharacter(necessaryParagraphsToShowSplitted[MAX_CHARACTERS_SHOWN_IN_PAGE - 1], generatedParagraph)
        necessaryParagraphsToShowSplitted.slice(0, MAX_CHARACTERS_SHOWN_IN_PAGE)[0] === ' '
        ? firstGeneratedCharacters.nextElementSibling.classList.add(...SPACE_CLASSES)
        : firstGeneratedCharacters.nextElementSibling.classList.add(...ACTIVE_CLASSES);
        firstGeneratedCharacters.remove();
        insertCharacter(e.key, outputtedParagraph)
      } else {
        firstGeneratedCharacters.classList.add('error');
      }
      });