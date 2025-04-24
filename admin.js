
let items = JSON.parse(localStorage.getItem('inventory')) || [];
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

const editForm = document.getElementById('edit-form');
const nameInput = document.getElementById('item-name');
const availableInput = document.getElementById('available');
const borrowedInput = document.getElementById('borrowed');
const inventoryList = document.getElementById('inventory-list');

const borrowForm = document.getElementById('borrow-form');
const borrowerNameInput = document.getElementById('borrower-name');
const borrowItemInput = document.getElementById('borrow-item');
const borrowQuantityInput = document.getElementById('borrow-quantity');
const borrowStatusInput = document.getElementById('borrow-status');
const transactionList = document.getElementById('transaction-list');

function saveToLocalStorage() {
    localStorage.setItem('inventory', JSON.stringify(items));
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function renderInventory() {
    inventoryList.innerHTML = '';
    items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'admin-item';
        itemDiv.innerHTML = `
            <h3>${item.name}</h3>
            <p class="available"><strong>Available:</strong> ${item.available}</p>
            <p class="borrowed"><strong>Borrowed:</strong> ${item.borrowed}</p>
            <button onclick="editItem(${index})">Edit</button>
            <button onclick="deleteItem(${index})">Delete</button>
        `;
        inventoryList.appendChild(itemDiv);
    });
}

function renderTransactions() {
    transactionList.innerHTML = '';
    if (transactions.length === 0) {
        transactionList.innerHTML = "<p>No borrow history yet.</p>";
        return;
    }
    transactions.forEach((tran, index) => {
        const div = document.createElement('div');
        div.className = 'admin-item';
        div.innerHTML = `
            <p><strong>${tran.name}</strong> borrowed <strong>${tran.quantity}</strong> of <strong>${tran.item}</strong></p>
            <p>Status: <span class="${tran.status === 'Returned' ? 'available' : 'borrowed'}">${tran.status}</span></p><p>Date Borrowed: ${tran.dateBorrowed || 'N/A'}</p><p>Date Returned: ${tran.dateReturned || 'N/A'}</p>
            <button onclick="editTransaction(${index})">Edit</button>
            <button onclick="deleteTransaction(${index})">Delete</button>
        `;
        transactionList.appendChild(div);
    });
}

function editItem(index) {
    const item = items[index];
    nameInput.value = item.name;
    availableInput.value = item.available;
    borrowedInput.value = item.borrowed;
    editForm.setAttribute('data-edit-index', index);
}

function deleteItem(index) {
    items.splice(index, 1);
    saveToLocalStorage();
    renderInventory();
}

function editTransaction(index) {
    const tran = transactions[index];
    borrowerNameInput.value = tran.name;
    borrowItemInput.value = tran.item;
    borrowQuantityInput.value = tran.quantity;
    borrowStatusInput.value = tran.status;
    document.getElementById('date-borrowed').value = tran.dateBorrowed || '';
    document.getElementById('date-returned').value = tran.dateReturned || '';
    borrowForm.setAttribute('data-edit-index', index);
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    saveToLocalStorage();
    renderTransactions();
}

editForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const available = parseInt(availableInput.value);
    const borrowed = parseInt(borrowedInput.value);

    if (!name || isNaN(available) || isNaN(borrowed)) return;

    const editIndex = editForm.getAttribute('data-edit-index');

    if (editIndex !== null) {
        items[editIndex] = { name, available, borrowed };
        editForm.removeAttribute('data-edit-index');
    } else {
        items.push({ name, available, borrowed });
    }

    saveToLocalStorage();
    renderInventory();
    editForm.reset();
});

borrowForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const borrower = borrowerNameInput.value.trim();
    const item = borrowItemInput.value.trim();
    const quantity = parseInt(borrowQuantityInput.value);
    const status = borrowStatusInput.value;
    const dateBorrowed = document.getElementById('date-borrowed').value;
    const dateReturned = document.getElementById('date-returned').value;

    if (!borrower || !item || isNaN(quantity)) return;

    const editIndex = borrowForm.getAttribute('data-edit-index');

    if (editIndex !== null) {
        transactions[editIndex] = { name: borrower, item, quantity, status, dateBorrowed, dateReturned };
        borrowForm.removeAttribute('data-edit-index');
    } else {
        transactions.push({ name: borrower, item, quantity, status, dateBorrowed, dateReturned });
    }

    saveToLocalStorage();
    renderTransactions();
    borrowForm.reset();
});

renderInventory();
renderTransactions();


// Auto-fill today's date in the "date-borrowed" field
document.addEventListener("DOMContentLoaded", () => {
    const today = new Date().toISOString().split("T")[0];
    const dateBorrowedInput = document.getElementById("date-borrowed");
    if (dateBorrowedInput && !dateBorrowedInput.value) {
        dateBorrowedInput.value = today;
    }
});


// Auto-fill return date when status is set to "Returned"
document.getElementById("borrow-status").addEventListener("change", function () {
    const returnDate = document.getElementById("date-returned");
    if (this.value === "Returned" && !returnDate.value) {
        const today = new Date().toISOString().split("T")[0];
        returnDate.value = today;
    }
});


let officeResources = JSON.parse(localStorage.getItem('officeResources')) || [];

const officeForm = document.getElementById('office-form');
const officeNameInput = document.getElementById('office-item-name');
const officeQtyInput = document.getElementById('office-quantity');
const officeList = document.getElementById('office-list');

function renderOfficeResources() {
    officeList.innerHTML = '';
    officeResources.forEach((resource, index) => {
        const div = document.createElement('div');
        div.className = 'admin-item';
        div.innerHTML = `
            <h3>${resource.name}</h3>
            <p class="available"><strong>Quantity:</strong> ${resource.quantity}</p>
            <button onclick="editOfficeResource(${index})">Edit</button>
            <button onclick="deleteOfficeResource(${index})">Delete</button>
        `;
        officeList.appendChild(div);
    });
}

function editOfficeResource(index) {
    const resource = officeResources[index];
    officeNameInput.value = resource.name;
    officeQtyInput.value = resource.quantity;
    officeForm.setAttribute('data-edit-index', index);
}

function deleteOfficeResource(index) {
    officeResources.splice(index, 1);
    localStorage.setItem('officeResources', JSON.stringify(officeResources));
    renderOfficeResources();
}

officeForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = officeNameInput.value.trim();
    const quantity = parseInt(officeQtyInput.value);
    if (!name || isNaN(quantity)) return;

    const editIndex = officeForm.getAttribute('data-edit-index');
    if (editIndex !== null) {
        officeResources[editIndex] = { name, quantity };
        officeForm.removeAttribute('data-edit-index');
    } else {
        officeResources.push({ name, quantity });
    }

    localStorage.setItem('officeResources', JSON.stringify(officeResources));
    renderOfficeResources();
    officeForm.reset();
});

renderOfficeResources();



function filterAndRender() {
  const search = document.getElementById('search-input')?.value.toLowerCase() || '';
  const filter = document.getElementById('filter-select')?.value || 'all';

  inventoryList.querySelectorAll('.item').forEach(e => e.remove());
  officeList.querySelectorAll('.item').forEach(e => e.remove());

  if (filter === 'all' || filter === 'stockroom') {
    items
      .filter(item => item.name.toLowerCase().includes(search))
      .forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
          <h3>${item.name}</h3>
          <p class="available"><strong>Available:</strong> ${item.available}</p>
          <p class="borrowed"><strong>Borrowed:</strong> ${item.borrowed}</p>
        `;
        inventoryList.appendChild(div);
      });
  }

  if (filter === 'all' || filter === 'office') {
    officeResources
      .filter(resource => resource.name.toLowerCase().includes(search))
      .forEach(resource => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
          <h3>${resource.name}</h3>
          <p class="available"><strong>Quantity:</strong> ${resource.quantity}</p>
        `;
        officeList.appendChild(div);
      });
  }
}

// Attach listeners
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('search-input')?.addEventListener('input', filterAndRender);
  document.getElementById('filter-select')?.addEventListener('change', filterAndRender);
});
