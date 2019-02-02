window.onload = function() {
  initializeList();
};

const removeListener = function(event) {
  this.parentNode.remove();
  removeItemFromList(this.id);
};

function removeItemFromList(num) {
  chrome.storage.local.get(["memo"], result => {
    memoList = result.memo;
    if (!Array.isArray(memoList)) {
      memoList = [];
    }
    memoList.splice(num, 1);
    chrome.storage.local.set({ memo: memoList }, () => {
      setRemoveEvents();
    });
  });
}

function setRemoveEvents() {
  const listRemoveDOMs = document.getElementsByClassName("listElement-remove");
  listRemoves = Array.prototype.slice.call(listRemoveDOMs);
  listRemoves.forEach((el, index) => {
    el.id = index;
    el.removeEventListener("click", removeListener);
    el.addEventListener("click", removeListener);
  });
}

function initializeList() {
  chrome.storage.local.get(["memo"], result => {
    const memoList = document.getElementById("memoList");
    memoList.innerHTML = "";
    if (!Array.isArray(result.memo)) {
      return;
    }
    result.memo.forEach((el, index) => {
      const listElement = createListElement(el.title, el.link, index);
      memoList.appendChild(listElement);
      setRemoveEvents();
    });
  });
}

function addCurrentPage() {
  chrome.tabs.getSelected(null, tab => {
    addToList({ title: tab.title, link: tab.url });
  });
}

function addToList(addElement) {
  chrome.storage.local.get(["memo"], result => {
    memoListData = result.memo;
    if (!Array.isArray(memoListData)) {
      memoListData = [];
    }
    memoListData.push(addElement);
    chrome.storage.local.set({ memo: memoListData }, () => {
      const newElement = createListElement(
        addElement.title,
        addElement.link,
        memoListData.length - 1
      );
      let memoListDOM = document.getElementById("memoList");
      memoListDOM.appendChild(newElement);
      setRemoveEvents();
    });
  });
}

function resetList() {
  chrome.storage.local.remove("memo", result => {
    document.getElementById("memoList").innerHTML = "";
  });
}

function createListElement(title, link, index) {
  const listElement = document.createElement("div");
  listElement.setAttribute("class", "listElement");
  listElement.innerHTML =
    `
    <a class="listElement-info" target="_blank" href="` +
    link +
    `">
      <p class="listElemt-info-title">` +
    title +
    `</p>
      <p class="listElement-info-link">` +
    link +
    `</p>
    </a>
    <div id="` +
    index +
    `" class="listElement-remove">☓</div>
  `;
  return listElement;
}
