
// Get HTML Elements
const transactionForm = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");

const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expenseElement = document.getElementById("expense");
const transactionList = document.getElementById("transaction-list");

// Load saved transactions
let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];

// Add New Transaction
transactionForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;

    if (!description || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid description and amount.");
        return;
    }

    const transaction = {
        id: Date.now(),
        description: description,
        amount: amount,
        type: type,
        date: new Date().toLocaleDateString()
    };

    transactions.push(transaction);

    saveTransactions();

    displayTransactions();

    transactionForm.reset();

});

// Save Transactions in LocalStorage
function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}

// Display Transactions
function displayTransactions() {

    transactionList.innerHTML = "";

    if (transactions.length === 0) {

        transactionList.innerHTML =
            '<li class="empty-message">No transactions yet.</li>';

    }

    transactions.forEach(function(transaction) {

        const li = document.createElement("li");

        const sign = transaction.type === "income" ? "+" : "-";

        const amountColor = transaction.type === "income"
            ? "#16a34a"
            : "#dc2626";

        const info = document.createElement("div");
        info.className = "transaction-info";

        const title = document.createElement("strong");
        title.textContent = transaction.description;

        const date = document.createElement("small");
        date.textContent = transaction.date;

        info.appendChild(title);
        info.appendChild(date);

        const amountText = document.createElement("strong");
        amountText.textContent =
            `${sign}₹${transaction.amount.toFixed(2)}`;
        amountText.style.color = amountColor;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {
            deleteTransaction(transaction.id);
        });

        li.appendChild(info);
        li.appendChild(amountText);
        li.appendChild(deleteButton);

        transactionList.appendChild(li);

    });

    updateBalance();

}

// Calculate Balance
function updateBalance() {

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }

    });

    const balance = totalIncome - totalExpense;

    balanceElement.textContent = `₹${balance.toFixed(2)}`;

    incomeElement.textContent = `₹${totalIncome.toFixed(2)}`;

    expenseElement.textContent = `₹${totalExpense.toFixed(2)}`;

}

// Delete Transaction
function deleteTransaction(id) {

    transactions = transactions.filter(function(transaction) {
        return transaction.id !== id;
    });

    saveTransactions();

    displayTransactions();

}

// Load Transactions When Page Opens
displayTransactions();
