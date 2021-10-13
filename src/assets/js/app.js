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


// Init
const operationForm = document.getElementById('operationForm')
const submitForm = document.querySelector('#operationForm button[type=submit]')
const solde = document.getElementById('solde')
const good = document.querySelector('.good')
const listOperations = document.querySelector('main .grid-container')

// Modification du DOM
submitForm.setAttribute('data-close', '')
// Functions
function operationTemplate(operation) {
  const rapportTotal = 50
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
            <small>${rapportTotal}%</small>
          </div>
        </div>
      </div>
    </div>
  `
}

function affichageAllOperation (operationsData) {
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

function setSolde(money) {
  // TODO: format et calcul à faire
  solde.innerHTML = "1 000 000.00€"

  // TODO: phrase selon le montant
  good.innerHTML = "Money, money, money, ..."
}


// Traitement
setSolde(operationsData)

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

// Navbar : « Tout | Crédit | Débit »
const all = document.querySelector('.navHeader a')
all.addEventListener('click', (e) => {
  affichageAllOperation(operationsData)
})

const credit = document.querySelector('.navHeader a:nth-child(2)')
credit.addEventListener('click', (e) => {
  affichageAllOperation(operationsData.filter(op => op.isCredit))
})

const debit = document.querySelector('.navHeader a:nth-child(3)')
debit.addEventListener('click', (e) => {
  affichageAllOperation(operationsData.filter(op => !op.isCredit))
})

affichageAllOperation(operationsData)

