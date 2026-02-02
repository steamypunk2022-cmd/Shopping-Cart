
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list'); //ul list
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;
// const itemFilter = document.querySelector('.form-input-filter')
// const addItemButton = document.querySelector('.btn-add');
// let items = document.querySelectorAll('#item-list li');

// let deleteButtons = document.querySelectorAll('.btn-link');
// const clearBtn = document.querySelector('.btn-clear'); 
// const newDiv = document.createElement("div");
// <button class="remove-item btn-link text-red">
//             <i class="fa-solid fa-xmark"></i>
//           </button>
// 2. Add some content or attributes
// newDiv.textContent = "Hello, I'm a new div!";
// newDiv.className = "my-class"; // Add a class
// newDiv.id = "unique-id";       // Add
// function checkUI() {  // remove filter and clear if emptylist
// // { itemList=document.getElementById('item-list'); 
// //   items = document.querySelectorAll('#item-list li');
// //   deleteButtons = document.querySelectorAll('.btn-link');
//   if(items.length===0)
//   {
//     itemFilter.style.display='none';
//     clearBtn.style.display='none';

//   }
//   else{
//     itemFilter.style.display='block';
//     clearBtn.style.display='block';
//   }
// }
function getItemsFromStorage() // return empty array or filled array 
{ 
  let itemsFromStorage;
  if(localStorage.getItem('items') === null)
  {
    itemsFromStorage = [];
  }
  else{
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
  // const items = JSON.parse(localStorage.getItem('items'));
  // for (let i = 0; i < items.length; i++) {
  //   addItemToDOM(items[i]);
  // }
}
function addItemToStorage(item) 
{ 
  let itemsFromStorage = getItemsFromStorage(); // return empty array or filled array 
  if(localStorage.getItem('items') === null)
  {
    itemsFromStorage = [];
  }
  else{
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  itemsFromStorage.push(item);
  localStorage.setItem('items',JSON.stringify(itemsFromStorage));
}
function removeItemFromStorage(item)
{
  let itemsFromStorage = getItemsFromStorage();

  // FIlter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !==item);

  // Re-set to localstorage
  localStorage.setItem('items',JSON.stringify(itemsFromStorage));
}


function displayItems()
{
  const itemsFromStorage = getItemsFromStorage(); 
  itemsFromStorage.forEach(item => addItemToDOM(item));
  checkUI();
}
// function clearLocalStorage()
// {
  
//   localStorage.setItem('items',JSON.stringify([]));
// }
function createButton(classes)
  {
   const button =  document.createElement("button");
   button.className = classes;
   const icon = createIcon('fa-solid fa-xmark');
   button.appendChild(icon);
   return button;
  }
  function createIcon(classes){ //no strict = function order dont matter
    const icon = document.createElement("i");
    icon.className=classes;
    return icon;
  }
function addItemToDOM(item)
{
  const li= document.createElement("li");
  li.appendChild(document.createTextNode(item));
  const button = createButton('remove-item btn-link text-red');
  
  li.appendChild(button);
  //Add UI to DOM
  itemList.appendChild(li);//itemlist auto updated in append/remove
  
 
}
function onAddItemSubmit(e)
{ e.preventDefault();
  const newItem = itemInput.value;
  if(newItem==='')
  {
    alert('Please add an item');
    return;
  }
  if(isEditMode) // Remove item from DOM and storage then create new one instead of editing directly
  {
    const itemToEdit = document.querySelector('.edit-mode')
                         
        removeItemFromStorage(itemToEdit.firstChild.textContent);
        itemToEdit.classList.remove('.edit-mode');
        removeItem(itemToEdit);  
         
        
        
    
  }
  else{
    if(checkIfItemExists(newItem)){
      alert('That item already exists!');
      return;
    }
  }
  if(checkIfItemExists(newItem)){return;} // No duplicate items 
  // Create item DOM element
  addItemToDOM(newItem); 

  // Add item to local storage
  addItemToStorage(newItem);

  checkUI();  
  itemInput.value='';
  
  
}
  
  
   
    
    // console.log(Array.from(itemList).length); // 0
    // console.log(items.length);                //0
    //checkUI();                  //update itemlist and items
  

function removeItem(item)
{
  
   if(confirm('Are you sure?')){
    item.remove();

    // Remove item from storage
    removeItemFromStorage(item.firstChild.textContent);
    checkUI();
    // const li= e.target.parentElement.parentElement;
    // removeItemFromStorage();(li.firstChild.textContent);
    // li.remove();//itemlist autoupdated in append/remove
    
    
    
  }
}
  


function clearItems()
{
  while(itemList.firstChild)
  {
    itemList.removeChild(itemList.firstChild);
    
  }
  checkUI();

  // Clear from localstorage
  localStorage.removeItem('items'); 
}
function filterItems(e)
{ const items = itemList.querySelectorAll('li');
  //make ul an array to forEach cuz ul is retarted without functions
  const text = e.target.value.toLowerCase();
  items.forEach(item => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text)!==-1)//The expression itemName.indexOf(text) in JavaScript is used to find the position (index) of the first occurrence of a substring (text) within a string (itemName).-1 if the substring is not found
       {
      item.style.display = 'flex';
       }
       else {
      item.style.display = 'none';
      
    }
})
}
function onClickItem(e) // This is called handler it executes unique function depends on what we click
{ console.log(e.target);
  if(e.target.parentElement.classList.contains('remove-item'))
  {
    removeItem(e.target.parentElement.parentElement);
    checkUI();
  }
  else {
    setItemToEdit(e.target);
  }
}
function checkIfItemExists(item)
{
  const itemsFromStorage= getItemsFromStorage();
  return itemsFromStorage.includes(item);
}
function setItemToEdit(item) //set edit styles
{
  isEditMode=true;

  // remove previous grey elements so that we dont have multiple greys
  itemList.querySelectorAll('li').forEach((i)=>i.classList.remove('edit-mode'));
  
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#228b22'; 
  itemInput.value = item.textContent;
}
function checkUI() //hide filter and clear if necessary 
{ const items = itemList.querySelectorAll('li');
  //make ul an array to use built in function cuz ul is retarted without functions
    //itemList is an ul no built in length function for it
    //so convert to items array :)
  
  if(items.length===0)//similar code: const length = itemList.getElementsByTagName("li").length;
  //if(length===0)
  {
    itemFilter.style.display='none';
    clearBtn.style.display='none';
  }
  else{
    itemFilter.style.display='block';
    clearBtn.style.display='block';
  }
  isEditMode=false;
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item'; 
  formBtn.style.backgroundColor = 'rgb(239, 239, 239)';
}
// itemFilter.addEventListener('input', function(event) {
//   const filter = event.target.value.toLowerCase();
// // console.log(filter);

//   items.forEach(item => {
//     const text = item.textContent.toLowerCase();
//     if (text.includes(filter)) {
//       item.style.display = '';
//       console.log('visible');
      
//     } else {
//       item.style.display = 'none';
//       console.log('invisible');
//     }
//   });
// });
 


// Initialize app
function init()
{
// Event Listeners
itemForm.addEventListener('submit',onAddItemSubmit);
itemList.addEventListener('click',onClickItem);
clearBtn.addEventListener('click',clearItems);  
itemFilter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItems);


checkUI();
}

init();
