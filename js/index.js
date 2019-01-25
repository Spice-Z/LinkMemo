window.onload = async function() {
  renderListFromStorage();
};

function renderList(list) {
  const memoList = document.getElementById("memoList");
  if (!Array.isArray(list)) {
    memoList.innerHTML = "";
    return;
  }
  memoList.innerHTML = "";
  list.forEach((el, index) => {
    const listElement = document.createElement("div");
    listElement.setAttribute("class", "listElement");
    listElement.innerHTML = `
      <a class="listElement-info" target="_blank" href="` + el.link + `">
        <p class="listElemt-info-title">` + el.title + `</p>
        <p class="listElement-info-link">` + el.link + `</p>
      </a>
      <div id="` + index + `" class="listElement-remove">☓</div>
    `
    memoList.appendChild(listElement);
    const listItemNodes = document.getElementsByClassName("listElement-remove");
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
    memoList.unshift(addElement);
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

