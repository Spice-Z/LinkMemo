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
    console.log(list);
    if (!Array.isArray(list) ) {
      memoList.innerHTML = '';
      return
    }
    console.log('render will ');
    memoList.innerHTML = '';
    list.forEach((el, index) => {
      console.log(el);
      const title = document.createElement("p");
      const link = document.createElement("a");
      title.textContent = el.title;
      link.setAttribute("target", "_blank");
      link.setAttribute("href", el.link);
      link.setAttribute("id", index);
      link.textContent = ">";
      title.appendChild(link);
      memoList.appendChild(title);
    });
}

function addCurrentPage() {
    chrome.tabs.getSelected(null, (tab) => {
    const title = tab.title;
    const url = tab.url;
    console.log('current info is');
    console.log(title);
    console.log(url);
    addElementToStorage({'title':title,'link':url});
  });
}

function resetList() {
  chrome.storage.local.remove('memo',result => {
    console.log(result);
    console.log('remove is done');
    renderList();
  })
}

function addElementToStorage(addElement) {
  console.log('addelement');
  console.log(addElement);
  chrome.storage.local.get(["memo"], result => {
    console.log(memoList);
    memoList = result.memo;
    if(!Array.isArray(memoList)){
      memoList = [];
    }
    memoList.push(addElement);
    console.log('newlist');
    console.log(memoList);
    chrome.storage.local.set({ memo: memoList }, () => {
      console.log("Value is set to " + memoList);
      renderListFromStorage();
    });
  })
}

function updateList(addElement) {
  // chrome.storage.local.set({ memo: memoList }, () => {
  //   console.log("Value is set to " + sample);
  // });
  chrome.storage.local.get(["memo"], result => {
    memoList = result.memo;
    return memoList
  }).then(memoList =>{
    memoList.push(addElement)
    chrome.storage.local.set({ memo: memoList }, () => {
      console.log("Value is set to " + memoLtis);
    });
  })
}

function renderListFromStorage() {
  chrome.storage.local.get(["memo"], result => {
    console.log('取得データ↓');
    console.log(result.memo);
    renderList(result.memo)
  })
}

document.getElementById('addCurrentPage').addEventListener('click',()=>{
  addCurrentPage();
  console.log('current page is added');
})

document.getElementById('resetList').addEventListener('click',()=>{
  resetList();
})