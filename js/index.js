window.onload = async function() {
  // resetList();
  renderListFromStorage();

  // console.log(list);

  // list = setCurrentPage(list);
  // storeList(list);
  // renderMemoList();
};

function renderList(list) {
  const memoList = document.getElementById("memoList");
  if (!Array.isArray(list)) {
    memoList.innerHTML = "";
    return;
  }
  memoList.innerHTML = "";
  list.forEach((el, index) => {
    const title = document.createElement("p");
    const link = document.createElement("a");
    title.textContent = el.title;
    title.setAttribute("id", index);
    title.setAttribute("class", "listElement");
    link.setAttribute("target", "_blank");
    link.setAttribute("href", el.link);
    link.textContent = ">";
    title.appendChild(link);
    memoList.appendChild(title);
    const listItemNodes = document.getElementsByClassName("listElement");
    const listItems = Array.prototype.slice.call(listItemNodes);
    listItems.forEach(el => {
      el.addEventListener('click',function(e){
        deleteItemFromList(this.id)
      })
    });
  });
}

function addCurrentPage() {
  chrome.tabs.getSelected(null, tab => {
    const title = tab.title;
    const url = tab.url;
    addElementToStorage({ title: title, link: url });
  });
}

function resetList() {
  chrome.storage.local.remove("memo", result => {
    renderList();
  });
}

function addElementToStorage(addElement) {
  chrome.storage.local.get(["memo"], result => {
    memoList = result.memo;
    if (!Array.isArray(memoList)) {
      memoList = [];
    }
    memoList.push(addElement);
    chrome.storage.local.set({ memo: memoList }, () => {
      renderListFromStorage();
    });
  });
}

function renderListFromStorage() {
  chrome.storage.local.get(["memo"], result => {
    renderList(result.memo);
  });
}

function deleteItemFromList(num) {
  chrome.storage.local.get(["memo"], result => {
    memoList = result.memo;
    if (!Array.isArray(memoList)) {
      memoList = [];
    }
    memoList.splice(num, 1);
    chrome.storage.local.set({ memo: memoList }, () => {
      renderListFromStorage();
    });
  });
}

// document.getElementById('addCurrentPage').addEventListener('click',()=>{
//   addCurrentPage();
//   console.log('current page is added');
// })

// document.getElementById('resetList').addEventListener('click',()=>{
//   resetList();
// })

