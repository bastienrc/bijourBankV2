console.log("Bijour Bank !")
/**
 * init foundation
 */
$(document).ready(function () {
  $(document).foundation()
})


/**
 * Fonctions
 */
function formatBank(montant) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(montant)
}

function operationTemplate(operation) {
  const imgC = "./assets/images/sac-dargent.png"
  const imgD = "./assets/images/depenses.png"
  return `
    <div class="operation ${operation.isCredit ? "credit" : "debit"}">
      <div class="grid-x grid-padding-x align-middle">
        <div class="cell shrink">
          <div class="picto">
            <img src="${operation.isCredit ? imgC : imgD}" alt="Illustration pour le ${operation.isCredit ? "Credit" : "Debit"}" />
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
            <p class="count">${formatBank(operation.total)}</p>
            <small>${operation.ratio}%</small>
          </div>
        </div>
      </div>
    </div>
  `
}

function affichageOperations (operationsData) {
  if (operationsData.length === 0) {
    listOperations.innerHTML = "<center>Aucune opération !!!</center>"
  } else {
    listOperations.innerHTML = ""
    operationsData.forEach(op => {
      listOperations.innerHTML += operationTemplate(op)
    })
  }
}

function newOperation (operator, title, description, total) {
  return {
    title: title,
    description: description,
    total: total,
    isCredit: operator === 'credit' ? true : false // TODO: Trouver meilleur syntaxe
  }
}

function setSolde() {
  // TODO: calcul à faire
  document
    .getElementById('solde')
    .innerHTML = formatBank(2789898.43)
}

function setGood() {
  // TODO: phrase selon le montant
  document
    .querySelector('.good')
    .innerHTML = "Money, money, money, ..."
}

function totalCredit(operationsData) {
  const opCredit = operationsData.filter(op => op.isCredit)
  return opCredit.reduce((sum, montant) => sum + Number(montant.total), 0)
}

function totalDebit(operationsData) {
  const opDebit = operationsData.filter(op => !op.isCredit)
  return opDebit.reduce((sum, montant) => sum + Number(montant.total), 0)
}

function ratioMontant() {
  const total = totalCredit(operationsData)
  const montantOpList = document.getElementsByClassName('montantOperation')
  for (let i = 0; i < montantOpList.length; i++) {
    const montant = montantOpList[i].childNodes[1].innerText
    let ratio = montantOpList[i].childNodes[3]
    console.log(`${montant} * 100 / ${total} = ` + montant * 100 / total)
    ratio.innerText = montant * 100 / total + '%'
  }
}


/**
 * Gestion des évènements
 */

// Navbar : « Tout | Crédit | Débit »
const all = document.querySelector('.navHeader a')
all.addEventListener('click', (e) => {
  affichageOperations(operationsData)
})

const credit = document.querySelector('.navHeader a:nth-child(2)')
credit.addEventListener('click', (e) => {
  affichageOperations(operationsData.filter(op => op.isCredit))
})

const debit = document.querySelector('.navHeader a:nth-child(3)')
debit.addEventListener('click', (e) => {
  affichageOperations(operationsData.filter(op => !op.isCredit))
})


// Form new operation
const submitForm = document.querySelector('#operationForm button[type=submit]')
submitForm.setAttribute('data-close', '')
submitForm.addEventListener('click', (e) => {
  e.preventDefault()
  const operationForm = document.getElementById('operationForm')

  const op = newOperation(
    operationForm.operator.value,
    operationForm.titre.value,
    operationForm.desc.value,
    operationForm.montant.value
  )
  operationsData.push(op)

  affichageOperations(operationsData)

  // Init
  operationForm.operator.value = "--"
  operationForm.titre.value = ""
  operationForm.desc.value = ""
  operationForm.montant.value = ""
})


/**
 * Affichage de la page
 */

// Data Test
const operationsData = [
  {
    title: "Rente",
    description: "mois de septembre",
    total: 8000,
    isCredit: true,
    ratio: 0
  },
  {
    title: "Friterie",
    description: "mois de septembre",
    total: 500,
    isCredit: false,
    ratio: 0
  },
  {
    title: "Vinted",
    description: "mois de septembre",
    total: 2000,
    isCredit: true,
    ratio: 0
  }
]


const listOperations = document.querySelector('main .grid-container')


setSolde()


setGood()

// Affichage des operationts
affichageOperations(operationsData)
