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

const operationForm = document.getElementById('operationForm')
const submitForm = document.getElementById('submitForm')

const solde = document.getElementById('solde')
solde.innerHTML = "1 000 000 €"
const good = document.getElementsByClassName('good')[0]
good.innerHTML = "Money, money, money, ..."

// Functions
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

function affichageAllOperation (operationsData) {
  const listOperations = document.getElementById("listOperations")
  if (operationsData.length === 0) {
    listOperations.innerHTML = "<center>Aucune opération !!!</center>"
  } else {
    listOperations.innerHTML = ""
    operationsData.forEach(op => {
      listOperations.innerHTML += operationTemplate(op)
    })
  }
}

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


// Récupération de l'opération
submitForm.addEventListener('click', (e) => {
  e.preventDefault()
  const op = addOperation(
    operationForm.operator.value,
    operationForm.titre.value,
    operationForm.desc.value,
    operationForm.montant.value
  )
  operationsData.push(op)

  affichageAllOperation(operationsData)

  // Init
  operationForm.operator.value = "--"
  operationForm.titre.value = ""
  operationForm.desc.value = ""
  operationForm.montant.value = ""
})

const all = document.getElementById('all')
all.addEventListener('click', (e) => {
  affichageAllOperation(operationsData)
})

const credit = document.getElementById('credit')
credit.addEventListener('click', (e) => {
  affichageAllOperation(operationsData.filter(op => op.isCredit))
})

const debit = document.getElementById('debit')
debit.addEventListener('click', (e) => {
  console.log("trsuite")
  affichageAllOperation(operationsData.filter(op => op.isCredit))
})

affichageAllOperation(operationsData)

