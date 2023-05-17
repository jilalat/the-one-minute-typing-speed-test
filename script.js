let paragraph = document.getElementById("paragraph");
let input = document.getElementById("input");
let refresh = document.querySelector(".refresh");

const LIMIT_OF_GENERATED_PARAGRAPHS = 120;
const LIMIT_OF_SHOWN_PARAGRAPHS = 3;
const REFILL_PARAGRAPH_BUTTONS = [refresh];

let paragraphList = [];
// let typedText = [];

fetch(`https://api.quotable.io/quotes?limit=${LIMIT_OF_GENERATED_PARAGRAPHS}`)
  .then((response) => response.json())
  .then((data) => {
    for (i in data.results) {
      paragraphList.push(data.results[i].content);
    }
  })
  .then(() => {
    initiateTypingTest(paragraphList);
  });

const generateNecessaryParagraphs = (paragraphs) => {
  let paragraph = [];
  for (i = 0; i < LIMIT_OF_SHOWN_PARAGRAPHS; i++) {
    const randomIndex = Math.floor(
      Math.random() * LIMIT_OF_GENERATED_PARAGRAPHS
    );
    paragraph.push(paragraphs[randomIndex]);
  }
  return paragraph;
};

const fillParagraph = (paragraphs) => {
  let splittedParagraphsToShow = generateNecessaryParagraphs(paragraphs)
    .join(" ")
    .split("");

  console.log(splittedParagraphsToShow);
  paragraph.innerHTML = "";
  splittedParagraphsToShow.forEach((character) => {
    const characterWrapper = document.createElement("span");
    characterWrapper.innerText = character;
    paragraph.appendChild(characterWrapper);
  });
};
const initiateTypingTest = (paragraphList) => {
  input.focus();
  fillParagraph(paragraphList);
  paragraph.firstElementChild.classList.add("active");
  input.value = "";
};

REFILL_PARAGRAPH_BUTTONS.forEach((item) => {
  item.addEventListener("click", () => {
    initiateTypingTest(paragraphList);
    // input.focus();
  });
});

input.addEventListener("input", (e) => {
  const characters = document.querySelectorAll("#paragraph span");
  let typedText = e.target.value.split("");
  if (
    characters[typedText.length - 1].textContent ===
    typedText[typedText.length - 1]
  ) {
    characters[typedText.length - 1].classList.remove("active");
    characters[typedText.length - 1].classList.add("correct");
    characters[typedText.length - 1].classList.remove("error");
    characters[typedText.length].classList.add("active");
  } else {
    characters[typedText.length - 1].classList.remove("active");
    characters[typedText.length - 1].classList.add("error");
    characters[typedText.length - 1].classList.remove("correct");
    characters[typedText.length].classList.add("active");
  }
  console.log(typedText);
});

window.addEventListener("keydown", () => {
  input.focus();
});
