
document.getElementById("edit-form")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("item-name").value;
  const available = parseInt(document.getElementById("available").value, 10);
  const imageInput = document.getElementById("item-image-file");

  let items = JSON.parse(localStorage.getItem("inventory") || "[]");

  const existingIndex = items.findIndex(i => i.name === name);
  const updateData = (image = "") => {
    const item = { name, available, image };
    if (existingIndex > -1) items[existingIndex] = item;
    else items.push(item);
    localStorage.setItem("inventory", JSON.stringify(items));
    displayItems();
    this.reset();
  };

  if (imageInput && imageInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = e => updateData(e.target.result);
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    const currentImage = existingIndex > -1 ? items[existingIndex].image : "";
    updateData(currentImage);
  }
});

document.getElementById("edit-office-form")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("office-name").value;
  const quantity = parseInt(document.getElementById("office-quantity").value, 10);

  let office = JSON.parse(localStorage.getItem("officeResources") || "[]");
  const existingIndex = office.findIndex(i => i.name === name);
  const item = { name, quantity };

  if (existingIndex > -1) office[existingIndex] = item;
  else office.push(item);

  localStorage.setItem("officeResources", JSON.stringify(office));
  displayItems();
  this.reset();
});

function displayItems() {
  const stockroomContainer = document.getElementById('items-container');
  const officeContainer = document.getElementById('office-container');
  stockroomContainer.innerHTML = '';
  officeContainer.innerHTML = '';

  const items = JSON.parse(localStorage.getItem("inventory") || "[]");
  const office = JSON.parse(localStorage.getItem("officeResources") || "[]");

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = \`
      \${item.image ? `<img src="\${item.image}" class="item-image" alt="Item Image"/>` : ""}
      <h3>\${item.name}</h3>
      <p class="available"><strong>Available:</strong> \${item.available}</p>
    \`;
    stockroomContainer.appendChild(div);
  });

  office.forEach(resource => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = \`
      <h3>\${resource.name}</h3>
      <p class="available"><strong>Quantity:</strong> \${resource.quantity}</p>
    \`;
    officeContainer.appendChild(div);
  });
}

window.onload = () => displayItems();
