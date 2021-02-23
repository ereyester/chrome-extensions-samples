// https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/mv2-archive/api/contextMenus/event_page/

// A generic onclick callback function.
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId == "radio1" || info.menuItemId == "radio2") {
    console.log(`radio item ${info.menuItemId} was clicked (previous checked state was ${info.wasChecked})`);
  } else if (info.menuItemId == "checkbox1" || info.menuItemId == "checkbox2") {
    console.log(JSON.stringify(info));
    console.log(`checkbox item ${info.menuItemId}` + 
                ` was clicked, state is now: ${info.checked}` +
                ` (previous state was ${info.wasChecked})`);
  } else {
    console.log(`item ${info.menuItemId} was clicked`);
    console.log(`info: ${JSON.stringify(info)}`);
    console.log(`tab: ${JSON.stringify(tab)}`);
  }
});

// Set up context menu tree at install time.
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
  chrome.contextMenus.create({"title": "Test parent item", "id": "parent"});
  chrome.contextMenus.create(
      {"title": "Child 1", "parentId": "parent", "id": "child1"});
  chrome.contextMenus.create(
      {"title": "Child 2", "parentId": "parent", "id": "child2"});
  console.log("parent child1 child2");
  
  // Create some radio items.
  chrome.contextMenus.create({"title": "Radio 1", "type": "radio",
                              "id": "radio1"});
  chrome.contextMenus.create({"title": "Radio 2", "type": "radio",
                              "id": "radio2"});
  console.log("radio1 radio2");
  
  // Create some checkbox items.
  chrome.contextMenus.create(
      {"title": "Checkbox1", "type": "checkbox", "id": "checkbox1"});
  chrome.contextMenus.create(
      {"title": "Checkbox2", "type": "checkbox", "id": "checkbox2"});
  console.log("checkbox1 checkbox2");
  
  // Intentionally create an invalid item, to show off error checking in the
  // create callback.
  console.log("About to try creating an invalid item - an error about " +
      "duplicate item child1 should show up");
  chrome.contextMenus.create({"title": "Oops", "id": "child1"},() => {
    if (chrome.runtime.lastError) {
      console.log(`Got expected error: ${chrome.runtime.lastError.message}`);
    }
  });
  
});
