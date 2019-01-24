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
    // ************createDOM like this *********
    // <div id="1" class="listElement">
    //   <a class="listElement-info" target="_blank" href="http://icooon-mono.com/">
    //     <p class="listElemt-info-title">アイコン素材ダウンロードサイト「icooon-mono」 | 商用利用可能なアイコン素材が無料(フリー)ダウンロードできるサイト | 6000個以上のアイコン素材を無料でダウンロードできるサイト ICOOON MONO</p>
    //     <p class="listElement-info-link">http://icooon-mono.com/</p>
    //   </a>
    //   <div class="listElement-remove"></div>
    // </div>
    const listElement = document.createElement("div");
    const listElementInfo = document.createElement("a");
    const listElementInfoTitle = document.createElement("p");
    const listElementInfoLink = document.createElement("p");
    const listElementRemove = document.createElement("div");
    const title = document.createElement("p");
    const link = document.createElement("a");
    listElement.setAttribute("class", "listElement");
    listElementInfo.setAttribute("class", "listElement-info");
    listElementInfo.setAttribute("target", "_blank");
    listElementInfo.setAttribute("href", el.link);
    listElementInfoTitle.textContent = el.title;
    listElementInfoTitle.setAttribute("class", "listElement-info-title");
    listElementInfoLink.textContent = el.link;
    listElementInfoLink.setAttribute("class", "listElement-info-link");
    listElementRemove.setAttribute("class", "listElement-remove");
    listElementRemove.setAttribute("id", index);
    listElementRemove.textContent = '☓';
    listElementInfo.appendChild(listElementInfoTitle);
    listElementInfo.appendChild(listElementInfoLink);
    listElement.appendChild(listElementInfo);
    listElement.appendChild(listElementRemove);
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

