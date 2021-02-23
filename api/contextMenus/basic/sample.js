// https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/mv2-archive/api/contextMenus/basic/

// A generic onclick callback function.
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const selectedMenu = info.menuItemId;
  switch (selectedMenu) {
    case 'radio1 id':
    case 'radio2 id':
      console.log("radio item " + info.menuItemId +
                 " was clicked (previous checked state was "  +
                  info.wasChecked + ")");
      break;
    case 'checkbox 1':
    case 'checkbox 2':
      console.log(JSON.stringify(info));
      console.log("checkbox item " + info.menuItemId +
                 " was clicked, state is now: " + info.checked +
                 "(previous state was " + info.wasChecked + ")");
      break;
    default:
      console.log(`item ${info.menuItemId} was clicked`);
      console.log(`info: ${JSON.stringify(info)}`);
      console.log(`tab: ${JSON.stringify(tab)}`);
  }
});

chrome.runtime.onInstalled.addListener(() => {
  // Create one test item for each context type.
  const contexts = ["page","selection","link","editable","image","video",
                    "audio"];
  for (let i = 0; i < contexts.length; i++) {
    const context = contexts[i];
    const title = "Test '" + context + "' menu item";
    chrome.contextMenus.create({
      "id": i.toString(),
      "title": title,
      "contexts": [context]
    });
    console.log(`'${context}' item:${i}`);
  }
  
  // Create a parent item and two children.
  const parent = "parent id";
  const child1 = "child1 id";
  const child2 = "child2 id";
  chrome.contextMenus.create({
    "id": parent,
    "title": "Test parent item"
  });
  chrome.contextMenus.create({
    "id": child1,
    "title": "Child 1",
    "parentId": parent
  });
  chrome.contextMenus.create({
    "id": child2,
    "title": "Child 2",
    "parentId": parent
  });
  console.log(`parent:${parent} child1:${child1} child2:${child2}`);
  
  const radio1 ="radio1 id";
  const radio2 ="radio2 id";
  chrome.contextMenus.create({
    "id": radio1,
    "title": "Radio 1",
    "type": "radio"
  });
  chrome.contextMenus.create({
    "id": radio2,
    "title": "Radio 2",
    "type": "radio"
  });
  console.log(`radio1:${radio1} radio2:${radio2}`);
  
  const checkbox1 = "checkbox 1";
  const checkbox2 = "checkbox 2";
  
  chrome.contextMenus.create({
    "id": checkbox1,
    "title": "Checkbox1", 
    "type": "checkbox"
  });
  chrome.contextMenus.create({
    "id": checkbox2,
    "title": "Checkbox2", 
    "type": "checkbox"
  });
  
  // Intentionally create an invalid item, to show off error checking in the
  // create callback.
  console.log("About to try creating an invalid item - an error about item 999 should show up");
  chrome.contextMenus.create({
    "title": "Oops",
    "parentId":999
  },() => {
    if (chrome.runtime.lastError) {
      console.log(`Got expected error: ${chrome.runtime.lastError.message}`);
    }
  });
  
});
