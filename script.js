
function getBorrowedCount(itemName) {
  return (transactions || []).filter(tran =>
    tran.item === itemName && tran.status === "Borrowed"
  ).reduce((sum, tran) => sum + Number(tran.quantity || 0), 0);
}

const items = JSON.parse(localStorage.getItem('inventory')) || [];
const officeResources = JSON.parse(localStorage.getItem('officeResources')) || [];
const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function displayItems() {
    const stockroomContainer = document.getElementById('items-container');
    const officeContainer = document.getElementById('office-container');
    stockroomContainer.innerHTML = '';
    officeContainer.innerHTML = '';

    items.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('item');
        div.innerHTML = `
            ${item.image ? `<img src="${item.image}" class="item-image" alt="Item Image"/>` : ""}
            <h3>${item.name}</h3>
            <p><strong>Available:</strong> ${item.available || item.quantity || 0}</p>
            <p class="borrowed"><strong>Borrowed:</strong> ${getBorrowedCount(item.name)}</p>
        `;
        stockroomContainer.appendChild(div);
    });

    officeResources.forEach(resource => {
        const div = document.createElement('div');
        div.classList.add('item');
        div.innerHTML = `
            <h3>${resource.name}</h3>
            <p><strong>Quantity:</strong> ${resource.quantity}</p>
        `;
        officeContainer.appendChild(div);
    });
}

function getInitials(name) {
  return name.split(" ").map(n => n[0]).join(". ") + ".";
}

function displayTransactions() {
    const container = document.getElementById('transaction-container');
    container.innerHTML = '';

    if (transactions.length === 0) {
        container.innerHTML = "<p style='text-align:center;'>No borrow history available.</p>";
        return;
    }

    transactions.forEach(tran => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            <p><strong>${getInitials(tran.name)}</strong> borrowed <strong>${tran.quantity}</strong> of <strong>${tran.item}</strong></p>
            <p>Status: <span class="${tran.status === 'Returned' ? 'available' : 'borrowed'}">${tran.status}</span></p>
            <p>Date Borrowed: ${tran.dateBorrowed || 'N/A'}</p>
            <p>Date Returned: ${tran.dateReturned || 'N/A'}</p>
        `;
        container.appendChild(div);
    });
}

window.onload = function () {
    displayItems();
    displayTransactions();
};
