document.addEventListener("DOMContentLoaded", () => {
  const clearButton = document.getElementById("clear-storage");
  clearButton.addEventListener("click", clearLocalStorage);

  if (localStorage.getItem("shoppingList")) {
      initializeShoppingList(JSON.parse(localStorage.getItem("shoppingList")));
  } else {
      localStorage.setItem("shoppingList", JSON.stringify(shoppingData));
      initializeShoppingList(shoppingData);
  }
});

function initializeShoppingList(data) {
  const container = document.getElementById("shopping-list");
  container.innerHTML = "";
  data.forEach(section => {
      for (const [sectionTitle, items] of Object.entries(section)) {
          const sectionHeader = document.createElement("h2");
          sectionHeader.className = "section-title";
          sectionHeader.textContent = sectionTitle;
          container.appendChild(sectionHeader);

          if (Array.isArray(items)) {
              const itemList = createItemList(items);
              container.appendChild(itemList);
          } else {
              for (const [subSectionTitle, subItems] of Object.entries(items)) {
                  const subSectionHeader = document.createElement("h3");
                  subSectionHeader.textContent = subSectionTitle;
                  container.appendChild(subSectionHeader);

                  const itemList = createItemList(subItems);
                  container.appendChild(itemList);
              }
          }
      }
  });
}

function createItemList(items) {
  const ul = document.createElement("ul");
  items.forEach(item => {
      const li = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item.checked;
      checkbox.addEventListener("change", () => toggleItemStatus(item.itemId, checkbox.checked, li));

      li.appendChild(checkbox);
      li.appendChild(document.createTextNode(item.name));
      li.classList.toggle("checked", checkbox.checked);
      ul.appendChild(li);
  });
  return ul;
}

function toggleItemStatus(itemId, isChecked, listItem) {
  const data = JSON.parse(localStorage.getItem("shoppingList"));
  data.forEach(section => {
      for (const items of Object.values(section)) {
          if (Array.isArray(items)) {
              const item = items.find(i => i.itemId === itemId);
              if (item) item.checked = isChecked;
          } else {
              for (const subItems of Object.values(items)) {
                  const item = subItems.find(i => i.itemId === itemId);
                  if (item) item.checked = isChecked;
              }
          }
      }
  });
  localStorage.setItem("shoppingList", JSON.stringify(data));
  listItem.classList.toggle("checked", isChecked);
}

function clearLocalStorage() {
  localStorage.removeItem("shoppingList");
  location.reload();
}