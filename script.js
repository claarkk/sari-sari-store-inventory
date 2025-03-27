// Admin credentials
const adminEmail = "admin";
const adminPassword = "123";
let isLoggedIn = false;

// Load inventory from localStorage or use default data
let inventory = JSON.parse(localStorage.getItem("inventory")) || {
    "Canned Foods": [
        {name: "Ligo Red", quantity: 50, price: 25, originalPrice: 15},
        {name: "Ligo Green", quantity: 50, price: 25, originalPrice: 15},
        {name: "Mega Red", quantity: 40, price: 30, originalPrice: 20},
        {name: "Mega Green", quantity: 40, price: 30, originalPrice: 20},
        {name: "Young's Town Red", quantity: 50, price: 28, originalPrice: 18},
        {name: "Young's Town Green", quantity: 50, price: 28, originalPrice: 18},
        {name: "San Marino Red", quantity: 50, price: 35, originalPrice: 25},
        {name: "San Marino Yellow", quantity: 50, price: 35, originalPrice: 25},
    ],
    "Biscuits": [
        {name: "Dowee Donut Assorted", quantity: 50, price: 10, originalPrice: 5},
        {name: "Hansel Choco", quantity: 40, price: 12, originalPrice: 6},
        {name: "Rebisco Crackers", quantity: 30, price: 18, originalPrice: 8},
        {name: "Skyflakes", quantity: 55, price: 14, originalPrice: 7},
        {name: "Fudge bar Assorted", quantity: 25, price: 22, originalPrice: 12},
        {name: "Choco Mucho", quantity: 40, price: 30, originalPrice: 15},
        {name: "Cream O", quantity: 50, price: 15, originalPrice: 8},
    ],
};

// Save inventory to localStorage
function saveInventory() {
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

// User accounts with roles
const accounts = [
    { email: "viewer", password: "viewer123", role: "viewer" },
    { email: "client", password: "client123", role: "client" },
    { email: "admin", password: "admin123", role: "admin" }
];

let currentUserRole = null;

// Add event listener for Enter key to trigger login
document.getElementById("email").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        login();
    }
});
document.getElementById("password").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        login();
    }
});

// Function to toggle sidebar visibility
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("main-content");
    sidebar.classList.toggle("collapsed");
    mainContent.classList.toggle("collapsed");
}

// Improved password eye icon functionality
function togglePassword() {
    const passwordInput = document.getElementById("password");
    const toggleIcon = document.querySelector(".toggle-password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.857-.68 1.662-1.194 2.388M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`; // Eye open icon
    } else {
        passwordInput.type = "password";
        toggleIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.05 10.05 0 011.194-2.388M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18"/></svg>`; // Eye closed icon
    }
}

function showHome() {
    if (isLoggedIn) {
        document.getElementById("home-content").style.display = "block";
        document.getElementById("dashboard-container").style.display = "none";
        document.getElementById("sidebar").style.display = "block";
        document.getElementById("about-us-content").style.display = "none";
    } else {
        alert("Please log in first.");
    }
}

function showInventory() {
    if (isLoggedIn) {
        document.getElementById("home-content").style.display = "none";
        document.getElementById("dashboard-container").style.display = "block";
        document.getElementById("about-us-content").style.display = "none";
        renderInventory();
    } else {
        alert("Please log in first.");
    }
}

// Updated login function with role-based access control
function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    const user = accounts.find(account => account.email === email && account.password === password);

    if (user) {
        isLoggedIn = true;
        currentUserRole = user.role;
        document.getElementById("login-container").style.display = "none";
        document.getElementById("sidebar").style.display = "block"; // Show sidebar after login
        showHome();
        applyRolePermissions(); // Apply role-based permissions
    } else {
        message.innerHTML = "Invalid email or password!";
        message.style.color = "red";
    }
}

// Apply permissions based on the user's role
function applyRolePermissions() {
    if (currentUserRole === "viewer") {
        // Hide add/edit-related buttons for Viewer
        document.querySelectorAll(".add-item-button, .add-category-button, .delete-category-btn, .delete-item-btn").forEach(button => {
            button.style.display = "none";
        });

        // Disable editing for Viewer
        document.querySelectorAll("[contenteditable]").forEach(element => {
            element.setAttribute("contenteditable", "false");
        });

        // Disable About Us editing
        document.getElementById("about-us-content").style.pointerEvents = "none";
    } else if (currentUserRole === "client") {
        // Hide delete category buttons for Client
        document.querySelectorAll(".delete-category-btn").forEach(button => {
            button.style.display = "none";
        });

        // Disable About Us editing for Client
        document.getElementById("about-us-content").style.pointerEvents = "none";
    } else if (currentUserRole === "admin") {
        // Admin has full access, no restrictions
        document.getElementById("about-us-content").style.pointerEvents = "auto";
    }
}

function renderInventory() {
    let inventoryContainer = document.getElementById("inventory-container");
    inventoryContainer.innerHTML = "";

    const categorySelect = document.getElementById("category");
    categorySelect.innerHTML = '';

    let totalProfit = 0;
    let totalQuantity = 0;

    Object.keys(inventory).forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.innerText = category;
        categorySelect.appendChild(option);

        let categoryTitle = document.createElement("div");
        categoryTitle.classList.add("category-title");
        categoryTitle.innerText = category;

        let deleteCategoryBtn = document.createElement("span");
        deleteCategoryBtn.classList.add("delete-category-btn");
        deleteCategoryBtn.innerText = "X";
        deleteCategoryBtn.onclick = () => deleteCategory(category);
        categoryTitle.appendChild(deleteCategoryBtn);

        inventoryContainer.appendChild(categoryTitle);

        let table = document.createElement("table");
        table.classList.add("inventory-table");

        let thead = document.createElement("thead");
        thead.innerHTML = `
            <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Original Price</th>
                <th>Profit</th>
            </tr>
        `;
        table.appendChild(thead);

        let tbody = document.createElement("tbody");
        let bestSellerIndex = 0;
        let maxQuantity = 0;
        let categoryTotalQuantity = 0;
        let categoryTotalProfit = 0;

        inventory[category].forEach((item, index) => {
            if (item.quantity > maxQuantity) {
                maxQuantity = item.quantity;
                bestSellerIndex = index;
            }
        });

        inventory[category].forEach((item, index) => {
            let row = document.createElement("tr");

            // Check if stock is low (less than 10)
            if (item.quantity < 10) {
                row.classList.add("low-stock");
            }

            let profit = item.price - item.originalPrice;
            totalProfit += profit * item.quantity;
            totalQuantity += item.quantity;
            categoryTotalProfit += profit * item.quantity;
            categoryTotalQuantity += item.quantity;

            row.innerHTML = `
                <td>${item.name}</td>
                <td contenteditable="true" onkeydown="handleKeyPress(event, '${category}', ${index}, 'quantity', this)">${item.quantity}</td>
                <td contenteditable="true" onkeydown="handleKeyPress(event, '${category}', ${index}, 'price', this)">₱${item.price.toFixed(2)}</td>
                <td contenteditable="true" onkeydown="handleKeyPress(event, '${category}', ${index}, 'originalPrice', this)">₱${item.originalPrice.toFixed(2)}</td>
                <td>₱${(profit).toFixed(2)}<span class="delete-item-btn" onclick="deleteItem('${category}', ${index})">X</span></td>
            `;

            if (index === bestSellerIndex) {
                row.classList.add("best-seller");
            }

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        inventoryContainer.appendChild(table);

        let categorySummaryDiv = document.createElement("div");
        categorySummaryDiv.classList.add("category-summary");
        categorySummaryDiv.innerText = `Total Quantity: ${categoryTotalQuantity} | Total Profit: ₱${categoryTotalProfit.toFixed(2)}`;
        inventoryContainer.appendChild(categorySummaryDiv);
    });

    let totalSummaryDiv = document.createElement("div");
    totalSummaryDiv.classList.add("total-summary");
    totalSummaryDiv.innerText = `Total Quantity: ${totalQuantity} | Total Profit: ₱${totalProfit.toFixed(2)}`;
    inventoryContainer.appendChild(totalSummaryDiv);
}

// Function to handle Enter key press and update the inventory
function handleKeyPress(event, category, index, field, element) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevents new line in contentEditable field
        updateInventory(category, index, field, element.innerText);
        element.blur(); // Removes focus from the input field
    }
}

// Function to update inventory when value is changed
function updateInventory(category, index, field, value) {
    if (currentUserRole === "viewer") {
        alert("You do not have permission to edit.");
        renderInventory();
        return;
    }

    if (!isNaN(value) && value.trim() !== "") {
        inventory[category][index][field] = parseFloat(value);
        saveInventory(); // Save changes to localStorage
        renderInventory(); // Refresh table to update profit calculations
    } else {
        alert("Please enter a valid number.");
        renderInventory();
    }
}

// Add Item
function addItem() {
    if (currentUserRole === "viewer") {
        alert("You do not have permission to add items.");
        return;
    }

    const category = document.getElementById("category").value;
    const name = document.getElementById("new-item-name").value;
    const quantity = document.getElementById("new-item-quantity").value;
    const price = document.getElementById("new-item-price").value;
    const originalPrice = document.getElementById("new-item-original-price").value;

    if (name && quantity && price && originalPrice) {
        inventory[category].push({
            name: name,
            quantity: parseInt(quantity),
            price: parseFloat(price),
            originalPrice: parseFloat(originalPrice)
        });
        saveInventory(); // Save changes to localStorage
        renderInventory();
    } else {
        alert("Please fill all fields.");
    }
}

// Add Category
function addCategory() {
    if (currentUserRole === "viewer") {
        alert("You do not have permission to add categories.");
        return;
    }

    const categoryName = document.getElementById("new-category-name").value;
    if (categoryName) {
        inventory[categoryName] = [];
        saveInventory(); // Save changes to localStorage
        renderInventory();
    } else {
        alert("Please enter a category name.");
    }
}

// Delete Category
function deleteCategory(category) {
    if (currentUserRole !== "admin") {
        alert("Only admins can delete categories.");
        return;
    }

    if (confirm(`Are you sure you want to delete the category "${category}"?`)) {
        delete inventory[category];
        saveInventory(); // Save changes to localStorage
        renderInventory();
    }
}

// Function to delete an item
function deleteItem(category, index) {
    if (currentUserRole === "viewer") {
        alert("You do not have permission to delete items.");
        return;
    }

    if (confirm("Are you sure you want to delete this item?")) {
        inventory[category].splice(index, 1);
        saveInventory(); // Save changes to localStorage
        renderInventory();
    }
}

// Search for an item
function searchItem() {
    const searchValue = document.getElementById("search-item").value.toLowerCase();

    Object.keys(inventory).forEach(category => {
        inventory[category].forEach(item => {
            const rows = document.querySelectorAll(".inventory-table tr");
            rows.forEach(row => {
                if (row.innerText.toLowerCase().includes(searchValue)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    });
}

function showAboutUs() {
    if (isLoggedIn) {
        document.getElementById("home-content").style.display = "none";
        document.getElementById("dashboard-container").style.display = "none";
        document.getElementById("about-us-content").style.display = "block";
    } else {
        alert("Please log in first.");
    }
}

// Updated logout function to reset role
function logout() {
    if (confirm("Are you sure you want to log out?")) {
        isLoggedIn = false;
        currentUserRole = null;
        document.getElementById("login-container").style.display = "block";
        document.getElementById("sidebar").style.display = "none";
        document.getElementById("home-content").style.display = "none";
        document.getElementById("dashboard-container").style.display = "none";
        document.getElementById("about-us-content").style.display = "none";
    }
}

// Function to update About Us content (Admin only)
function updateAboutUs() {
    if (currentUserRole !== "admin") {
        alert("You do not have permission to edit About Us.");
        return;
    }

    const aboutTitle = document.querySelector(".about-title").innerText;
    const aboutDescription = document.querySelector(".about-description").innerText;

    // Save updated About Us content to localStorage
    localStorage.setItem("aboutTitle", aboutTitle);
    localStorage.setItem("aboutDescription", aboutDescription);
    alert("About Us updated successfully!");
}

// Load About Us content from localStorage
function loadAboutUs() {
    const aboutTitle = localStorage.getItem("aboutTitle");
    const aboutDescription = localStorage.getItem("aboutDescription");

    if (aboutTitle) {
        document.querySelector(".about-title").innerText = aboutTitle;
    }
    if (aboutDescription) {
        document.querySelector(".about-description").innerText = aboutDescription;
    }
}

// Call loadAboutUs on page load
document.addEventListener("DOMContentLoaded", loadAboutUs);

