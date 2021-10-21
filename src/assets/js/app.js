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

function templateOperation (operation, id) {
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
        <div class="cell small-1 text-right">
          <div>
            <button value="${id}" onClick="deleteOperation(this)">X</button>
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
    let id = 0
    operationsData.forEach(op => {
      // Calcul du ratio
      const total = op.isCredit ? totalCredit(operationsData) : totalDebit(operationsData)
      op.ratio = (op.total * 100 / total).toFixed(2)
      listOperations.innerHTML += templateOperation(op, id)
      id++
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

function deleteOperation(id) {
  operationsData.splice(parseInt(id.value),1)
  console.log(id.value)
  localStorage.setItem('datas', JSON.stringify(operationsData))
  setHeader(operationsData)
  readAllGraph(operationsData)
  readAllOperations(operationsData)
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
const operationForm = document.forms[0]
operationForm.setAttribute('method', 'POST')
const submitForm = document.querySelector('#operationForm button[type=submit]')
document.getElementById("operator").insertAdjacentHTML('beforebegin', '<p id="msgSecu"></p>')

submitForm.addEventListener('click', (e) => {
  if (document.getElementById("operator").value == "--") {
    e.preventDefault()
    const message = 'Veuillez choisir entre le débit et le crédit !!!'
    document.getElementById("msgSecu").innerText = message
    document.getElementById("operator").focus()
  } else if (operationForm.titre.value != '' && operationForm.montant.value != '') {
    e.preventDefault()
    const op = createOperation(
      operationForm.operator.value,
      operationForm.titre.value,
      operationForm.desc.value,
      operationForm.montant.value
    )
    operationsData.push(op)
    localStorage.setItem('datas', JSON.stringify(operationsData))

    // Ferme la modale du form
    document.querySelector('.reveal-overlay').style.display = 'none'
    document.querySelector('html').className = ''
    
    // Nettoyage et rechargement des différents éléments
    cleanSubmitForm(operationForm)
    setHeader(operationsData)
    readAllGraph(operationsData)
    readAllOperations(operationsData)
  }
})


/**
 * Affichage de la page
 */

// Data Test
let operationsData = []
if (localStorage.getItem('datas')) {
  operationsData = JSON.parse(localStorage.getItem('datas'))
}

if (localStorage.getItem('darkmode')) {
  if (JSON.parse(localStorage.getItem('darkmode'))) {
    document.querySelector('body').setAttribute("dark", '')
  } else {
    document.querySelector('body').removeAttribute("dark")
  }
}


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
  const darkmodeToggle = document.querySelector('body').toggleAttribute("dark")
  localStorage.setItem('darkmode', JSON.stringify(darkmodeToggle))
})

const reset = document.getElementById('reset')
reset.addEventListener('click', (e) => {
  operationsData = []
  document.querySelector('main .grid-container').innerHTML = '<center>Aucune opération !!!</center>'
  localStorage.clear()
  setHeader(operationsData)
  readAllGraph(operationsData)
})

const addData = document.getElementById('addData')
addData.addEventListener('click', (e) => {
  operationsData = [
    {
      id: 1577833200,
      title: 'Rente',
      description: 'mois de septembre',
      total: 8000,
      isCredit: true,
      ratio: 0
    },
    {
      id: 1577919600,
      title: 'Friterie',
      description: 'mois de septembre',
      total: 500,
      isCredit: false,
      ratio: 0
    },
    {
      id: 1578006000,
      title: 'Vinted',
      description: 'mois de septembre',
      total: 2000,
      isCredit: true,
      ratio: 0
    }
  ]
  localStorage.setItem('datas', JSON.stringify(operationsData))
  setHeader(operationsData)
  readAllGraph(operationsData)
  readAllOperations(operationsData)
})
