const divContainer = document.querySelector("#div"),
  filtersForm = document.querySelector("#filter-form"),
  isWizard = document.querySelector("#isWizard"),
  date = document.querySelector("#date"),
  unknowDateOB = document.querySelector("#unknowDateOB"),
  filter_btn = document.querySelector("#filter");

const cache = {
  characters: [],
  cards: "",
};

let filters = {
  isWizard: "all",
  unknowDateOB: false,
  date: "",
};

isWizard.addEventListener("change", () => {
  filters = {
    ...filters,
    isWizard: isWizard.value,
  };

  console.log(filters);
});

unknowDateOB.addEventListener("change", () => {
  filters = {
    ...filters,
    unknowDateOB: unknowDateOB.checked,
  };

  console.log(filters);
});

date.addEventListener("change", () => {
  filters = {
    ...filters,
    date: date.value,
  };

  //console.log(date.split("-").reverse().join("-"))
  console.log(filters);
});

filtersForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

function getCharacters() {
  const data = fetch("http://hp-api.herokuapp.com/api/characters")
    .then((response) => response.json())
    .then((data) => data);

  return data;
}
async function loadAllCharacters() {
  cache["characters"] = await getCharacters();
  //console.log(characters);

  divContainer.innerHTML = `${cache["characters"]
    .map((c) => {
      return createCard(c);
    })
    .join("")}`;
}

function filterCharacters({ isWizard, unknowDateOB, date }) {
  let dateOfForm = null;

  if (date) dateOfForm = new Date(date.split("-"));

  divContainer.innerHTML = `${cache["characters"]
    .map((c) => {
      const cDate = new Date(c.dateOfBirth.split("-").reverse().join("-"));
      switch (isWizard) {
        case "all":
          if (dateOfForm == null) {
            return createCard(c);}
          if (unknowDateOB) {
            if (
              c.dateOfBirth == "" ||
              dateOfForm <= cDate
            ) {
              return createCard(c);
            }
          }
          if (c.dateOfBirth != "") {
            if (dateOfForm <= cDate) {
              console.log(cDate);
              return createCard(c);
            }
          }

          break;
        case "wizards":
          if (dateOfForm == null && c.wizard) {
            return createCard(c);}
          if (unknowDateOB) {
            if (
              (c.dateOfBirth == "" ||
              dateOfForm <= cDate) && c.wizard
            ) {
              return createCard(c);
            }
          }
          if (c.dateOfBirth != "") {
            if (dateOfForm <= cDate  && c.wizard) {
              return createCard(c);
            }
          }
          break;
        case "no wizards":
          if (dateOfForm == null && !c.wizard) {
            return createCard(c);}
          if (unknowDateOB) {
            if (
              (c.dateOfBirth == "" ||
              dateOfForm <= cDate) && !c.wizard
            ) {
              return createCard(c);
            }
          }
          if (c.dateOfBirth != "") {
            if (dateOfForm <= cDate  && !c.wizard) {
              return createCard(c);
            }
          }
          break;
      }
    })
    .join("")}`;
}

function createCard(character) {
  return `<div class="card">
  <div class="imgs">
    <img src="${
      character.image ? character.image : "../assets/default-img.png"
    }">
    ${
      character.alive
        ? () => {}
        : '<img src="../assets/cross.png" class="cross">'
    }
    <img src="../assets/${character.house}House.png" class="imgHouse">
  </div>
    <div id="name">
    <h1>${character.name}</h1>
  </div>
  <div>
    <h3>Species: ${character.species}</h3>
    <h3>Gender: ${character.gender}</h3>
  </div>
</div>`;
}

document.onload =()=>{ loadAllCharacters();}
filter_btn.addEventListener("click", () => {
  filterCharacters(filters);
});
