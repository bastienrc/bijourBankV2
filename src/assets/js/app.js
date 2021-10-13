console.log("Bijour Bank !")
/**
 * init foundation
 */
$(document).ready(function () {
  $(document).foundation()
})

// Data Test
const operationsData = [
  {
    img: "./assets/images/sac-dargent.png",
    alt: "credit",
    title: "Rente",
    description: "mois de septembre",
    total: 2879,
    isCredit: true
  },
  {
    img: "./assets/images/depenses.png",
    alt: "depense",
    title: "Friterie",
    description: "mois de septembre",
    total: 500,
    isCredit: false
  },
  {
    img: "./assets/images/sac-dargent.png",
    alt: "credit",
    title: "Vinted",
    description: "mois de septembre",
    total: 2000,
    isCredit: true
  }
]


// Récupération de l'opération
function addOperation (operator, title, description, total) {
  return {
    img: "./assets/images/sac-dargent.png",
    alt: "credit",
    title: title,
    description: description,
    total: total,
    isCredit: operator === 'credit' ? true : false
  }
}

const url = new URL(window.location.href)
const operator = url.searchParams.get("operator")
const title = url.searchParams.get("titre")
const description = url.searchParams.get("desc")
const total = url.searchParams.get("montant")

operationsData.push(addOperation(operator, title, description, total))


// Affichage des opérations
const listOperations = document.getElementById("listOperations")
function operationTemplate(operation) {
  return `
    <div class="operation ${operation.isCredit ? "credit" : "debit"}">
      <div class="grid-x grid-padding-x align-middle">
        <div class="cell shrink">
          <div class="picto">
            <img src="${operation.img}" alt="${operation.alt}" />
          </div>
        </div>
        <div class="cell auto">
          <div>
            <h2>${operation.title}</h2>
            <small>${operation.description}</small>
          </div>
        </div>
        <div class="cell small-3 text-right">
          <div>
            <p class="count">${operation.total}</p>
            <small>800%</small>
          </div>
        </div>
      </div>
    </div>
  `
}

listOperations.innerHTML = ""
operationsData.forEach(op => {
  listOperations.innerHTML += operationTemplate(op)
});
