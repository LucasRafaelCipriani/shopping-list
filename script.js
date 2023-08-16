// Elements declaration
const enterItemInput = document.getElementById('item-input');
const filterItemsInput = document.getElementById('filter');
const addItemForm = document.getElementById('item-form');
const addItemBtn = document.querySelector('#item-form .form-control .btn');
const itemList = document.getElementById('item-list');
const clearAllBtn = document.getElementById('clear');
let editMode = false;
let selectedItem = null;

// Extra Functions
const displayEmptyListMsg = () => {
  const message = document.createElement('p');
  message.classList.add('empty-message');
  message.innerText = 'There are no items in this list';

  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  localStorage.setItem('items', JSON.stringify([]));

  itemList.style.display = 'none';
  clearAllBtn.style.display = 'none';
  filterItemsInput.style.display = 'none';

  if (!document.querySelector('.empty-message')) {
    document.querySelector('.container').insertBefore(message, itemList);
  }
};

const createNewItem = (itemName) => {
  const item = document.createElement('li');
  const button = document.createElement('button');
  const icon = document.createElement('i');
  const text = document.createTextNode(itemName);

  icon.className = 'fa-solid fa-xmark';
  button.className = 'remove-item btn-link text-red';

  button.appendChild(icon);
  item.appendChild(text);
  item.appendChild(button);

  if (document.querySelector('.empty-message')) {
    document.querySelector('.empty-message').remove();
    itemList.style.display = 'flex';
  }

  itemList.appendChild(item);
};

const updateItem = (newItemName) => {
  itemList.querySelectorAll('li').forEach((item) => {
    if (item.textContent === selectedItem) {
      item.innerHTML = '';
      const button = document.createElement('button');
      const icon = document.createElement('i');
      const text = document.createTextNode(newItemName);

      icon.className = 'fa-solid fa-xmark';
      button.className = 'remove-item btn-link text-red';

      button.appendChild(icon);
      item.appendChild(text);
      item.appendChild(button);
    }
  });
};

// Event Listeners
// Disable Button If No Value On Input
enterItemInput.addEventListener('input', (event) => {
  if (event.target.value !== '') {
    addItemBtn.removeAttribute('disabled');
  } else {
    addItemBtn.setAttribute('disabled', true);
  }
});

// Filter Items
filterItemsInput.addEventListener('input', (event) => {
  const filterValue = event.currentTarget.value.toLowerCase();
  itemList.querySelectorAll('li').forEach((item) => {
    if (!item.textContent.toLowerCase().includes(filterValue)) {
      item.style.display = 'none';
    } else {
      item.style.display = 'flex';
    }
  });

  const hasNoResults = Array.from(itemList.querySelectorAll('li')).every(
    (item) => item.style.display === 'none'
  );

  if (hasNoResults) {
    const message = document.createElement('p');
    message.classList.add('empty-message');
    message.innerText = 'There are no items in this list';

    if (!document.querySelector('.empty-message')) {
      document.querySelector('.container').insertBefore(message, itemList);
    }
  } else {
    if (document.querySelector('.empty-message')) {
      document.querySelector('.empty-message').remove();
    }
  }
});

// Add/Update New Item
addItemForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (enterItemInput.value !== '') {
    if (editMode) {
      const hasDuplicates = Array.from(itemList.querySelectorAll('li')).some(
        (item) => item.textContent === enterItemInput.value
      );

      if (hasDuplicates) {
        alert('You already have an item with this name');
      } else {
        updateItem(enterItemInput.value);

        if (localStorage.getItem('items') !== null) {
          const items = JSON.parse(localStorage.getItem('items'));
          const newItems = items.map((item) => {
            if (item === selectedItem) {
              item = enterItemInput.value;
            }

            return item;
          });
          localStorage.setItem('items', JSON.stringify(newItems));
        }

        editMode = false;
        addItemBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Add Item`;
        enterItemInput.value = '';
        selectedItem = null;
        addItemBtn.setAttribute('disabled', true);
      }
    } else {
      const hasDuplicates = Array.from(itemList.querySelectorAll('li')).some(
        (item) => item.textContent === enterItemInput.value
      );

      if (hasDuplicates) {
        alert('You already have an item with this name');
      } else {
        createNewItem(enterItemInput.value);

        if (localStorage.getItem('items') !== null) {
          const items = JSON.parse(localStorage.getItem('items'));
          items.push(enterItemInput.value);
          localStorage.setItem('items', JSON.stringify(items));
        }

        enterItemInput.value = '';
        addItemBtn.setAttribute('disabled', true);
        clearAllBtn.style.display = 'block';
        filterItemsInput.style.display = 'inline-block';
      }
    }
  } else {
    alert('Please add an item');
  }
});

// Remove Item
itemList.addEventListener('click', (event) => {
  const parent = event.target.parentElement;
  if (parent && parent.classList.contains('remove-item')) {
    const value = parent.parentElement.textContent;
    parent.parentElement.remove();

    if (localStorage.getItem('items') !== null) {
      const items = JSON.parse(localStorage.getItem('items'));
      const index = items.findIndex((item) => item === value);
      items.splice(index, 1);
      localStorage.setItem('items', JSON.stringify(items));
    }
  }

  if (itemList.childElementCount === 0) {
    displayEmptyListMsg();
  }

  editMode = false;
  addItemBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Add Item`;
  enterItemInput.value = '';
  selectedItem = null;
  addItemBtn.setAttribute('disabled', true);
});

// Select Item
itemList.addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    editMode = true;
    selectedItem = event.target.textContent;
    enterItemInput.value = event.target.textContent;
    addItemBtn.innerHTML = `<i class="fa-solid fa-pencil"></i> Update Item`;
    addItemBtn.removeAttribute('disabled');
  }
});

// Remove All Items
clearAllBtn.addEventListener('click', displayEmptyListMsg);

// Populate Items
window.addEventListener('DOMContentLoaded', () => {
  let items;

  if (localStorage.getItem('items') === null) {
    localStorage.setItem('items', JSON.stringify([]));
  } else {
    items = JSON.parse(localStorage.getItem('items'));
  }

  if (items.length > 0) {
    items.forEach((item) => {
      createNewItem(item);
    });
  } else {
    displayEmptyListMsg();
  }
});