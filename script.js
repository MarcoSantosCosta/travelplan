document.addEventListener("DOMContentLoaded", () => {
    const clearButton = document.getElementById("clear-storage");
    clearButton.addEventListener("click", clearLocalStorage);
  
    let existingData = localStorage.getItem("shoppingList") ? JSON.parse(localStorage.getItem("shoppingList")) : [];
    const newData = shoppingData;
  
    const mergedData = mergeShoppingData(existingData, newData);
    localStorage.setItem("shoppingList", JSON.stringify(mergedData));
    initializeShoppingList(mergedData);
  });
  
  function mergeShoppingData(existingData, newData) {
    const existingItemsMap = new Map();
  
    existingData.forEach(section => {
      for (const items of Object.values(section)) {
        if (Array.isArray(items)) {
          items.forEach(item => existingItemsMap.set(item.itemId, item));
        } else {
          for (const subItems of Object.values(items)) {
            subItems.forEach(item => existingItemsMap.set(item.itemId, item));
          }
        }
      }
    });
  
    newData.forEach(section => {
      for (const [sectionTitle, items] of Object.entries(section)) {
        if (Array.isArray(items)) {
          items.forEach(item => {
            if (existingItemsMap.has(item.itemId)) {
              item.checked = existingItemsMap.get(item.itemId).checked;
            }
          });
        } else {
          for (const [subSectionTitle, subItems] of Object.entries(items)) {
            subItems.forEach(item => {
              if (existingItemsMap.has(item.itemId)) {
                item.checked = existingItemsMap.get(item.itemId).checked;
              }
            });
          }
        }
      }
    });
  
    return newData;
  }
  
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
  
      li.addEventListener("click", () => {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event("change"));
      });
  
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