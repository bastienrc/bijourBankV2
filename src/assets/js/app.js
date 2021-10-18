console.log('Bijour Bank !')
/**
 * init foundation
 */
$(document).ready(function () {
  $(document).foundation()
})


/**
 * Fonctions
 */
function formatBank (montant) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(montant)
}

function templateOperation (operation) {
  const debitOrCredit = operation.isCredit ? 'credit' : 'debit'
  const img = operation.isCredit
    ? './assets/images/sac-dargent.png'
    : './assets/images/depenses.png'

  return `
    <div class="operation ${debitOrCredit}">
      <div class="grid-x grid-padding-x align-middle">
        <div class="cell shrink">
          <div class="picto">
            <img src="${img}" alt="Illustration pour le ${debitOrCredit}" />
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

function readAllOperations (operationsData) {
  if (operationsData.length === 0) {
    listOperations.innerHTML = '<center>Aucune opération !!!</center>'
  } else {
    listOperations.innerHTML = ''
    operationsData.forEach(op => {
      // Calcul du ratio
      const total = op.isCredit ? totalCredit(operationsData) : totalDebit(operationsData)
      op.ratio = (op.total * 100 / total).toFixed(2)
      listOperations.innerHTML += templateOperation(op)
    })
  }
}

function readAllGraph (operationsData) {
  let solde = 0
  config.data.labels = []
  config.data.datasets[0].data = []
  chart.update()
  operationsData.forEach(op => {
    const label = `${op.title} (${op.isCredit ? '+' : '-'} ${op.total})`
    solde = op.isCredit ? (solde + op.total) : (solde - op.total)
    addTemperature(label, solde)
  })
}

function createOperation (operator, title, description, total) {
  return {
    title: title,
    description: description,
    total: Number(total),
    isCredit: operator === 'credit',
    ratio: 0
  }
}

function setHeader (ops) {
  const solde = totalCredit(ops) - totalDebit(ops)
  document.getElementById('solde').innerHTML = formatBank(solde)

  const commentSolde = document.querySelector('#solde + small')
  let comments = []
  if (solde > 0) {
    comments = ['Nice !', 'Awesome !', 'Dude, tu geres !']
    commentSolde.setAttribute('class', 'good')
  } else {
    comments = ['Oh My God !', 'Bientôt la fin ...', 'C\'est la banqueroute !']
    commentSolde.setAttribute('class', 'bad')
  }
  const numComment = Math.floor(Math.random() * (comments.length))
  commentSolde.innerHTML = comments[numComment]
}

function totalCredit (operationsData) {
  const opCredit = operationsData.filter(op => op.isCredit)
  return opCredit.reduce((sum, montant) => sum + Number(montant.total), 0)
}

function totalDebit (operationsData) {
  const opDebit = operationsData.filter(op => !op.isCredit)
  return opDebit.reduce((sum, montant) => sum + Number(montant.total), 0)
}

function activeMenu (eltMenu) {
  all.removeAttribute('class', 'active')
  credit.removeAttribute('class', 'active')
  debit.removeAttribute('class', 'active')
  eltMenu.setAttribute('class', 'active')
}

function cleanSubmitForm (operationForm) {
  operationForm.operator.value = '--'
  operationForm.titre.value = ''
  operationForm.desc.value = ''
  operationForm.montant.value = null
}


/**
 * Gestion des évènements
 */

// Navbar : « Tout | Crédit | Débit »
const all = document.querySelector('.navHeader a')
all.addEventListener('click', (e) => {
  activeMenu(all)
  readAllOperations(operationsData)
})

const credit = document.querySelector('.navHeader a:nth-child(2)')
credit.addEventListener('click', (e) => {
  activeMenu(credit)
  readAllOperations(operationsData.filter(op => op.isCredit))
})

const debit = document.querySelector('.navHeader a:nth-child(3)')
debit.addEventListener('click', (e) => {
  activeMenu(debit)
  readAllOperations(operationsData.filter(op => !op.isCredit))
})

// Form new operation
const submitForm = document.querySelector('#operationForm button[type=submit]')
submitForm.setAttribute('data-close', '')
submitForm.addEventListener('click', (e) => {
  e.preventDefault()
  const operationForm = document.getElementById('operationForm')

  // TODO: Tester ces données
  const operator = operationForm.operator.value
  const titre = operationForm.titre.value
  const desc = operationForm.desc.value
  const montant = operationForm.montant.value

  const op = createOperation(operator, titre, desc, montant)
  operationsData.push(op)

  cleanSubmitForm(operationForm)
  setHeader(operationsData)
  readAllGraph(operationsData)
  readAllOperations(operationsData)
})


/**
 * Affichage de la page
 */

// Data Test
let operationsData = []

// Affichage principal
const listOperations = document.querySelector('main .grid-container')
setHeader(operationsData)
readAllOperations(operationsData)
readAllGraph(operationsData)

// Options supplémentaire
const header = document.querySelector('header')
const optionsMenu = `
  <div id="options" >
    <button id="darkmode" class="button optionsButton" title="Darkmode">D</button>
    <button id="reset" class="button optionsButton" title="Reset">0</button>
    <button id="addData" class="button optionsButton" title="Générer des données">+</button>
  </div>`
header.insertAdjacentHTML('afterbegin', optionsMenu)

const darkmode = document.getElementById('darkmode')
darkmode.addEventListener('click', (e) => {
  document.querySelector('body').toggleAttribute("dark")
})

const reset = document.getElementById('reset')
reset.addEventListener('click', (e) => {
  document.querySelector('main .grid-container').innerHTML = '<center>Aucune opération !!!</center>'
  operationsData = []
})

const addData = document.getElementById('addData')
addData.addEventListener('click', (e) => {
  operationsData = [
    {
      title: 'Rente',
      description: 'mois de septembre',
      total: 8000,
      isCredit: true,
      ratio: 0
    },
    {
      title: 'Friterie',
      description: 'mois de septembre',
      total: 500,
      isCredit: false,
      ratio: 0
    },
    {
      title: 'Vinted',
      description: 'mois de septembre',
      total: 2000,
      isCredit: true,
      ratio: 0
    }
  ]
  setHeader(operationsData)
  readAllGraph(operationsData)
  readAllOperations(operationsData)
})
