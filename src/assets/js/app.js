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
    total: 8000,
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
function formatBank(montant) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(montant)
}

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
          <div class="montantOperation">
            <p class="count">${operation.total}</p>
            <small ${operation.isCredit ? "data-credit" : "data-debit"}>0%</small>
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
  ratioMontant()
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
  solde.innerHTML = formatBank(2789898.43)

  // TODO: phrase selon le montant
  good.innerHTML = "Money, money, money, ..."
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
