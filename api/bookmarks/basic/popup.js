// https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/mv2-archive/api/bookmarks/basic


// Search the bookmarks when entering the search keyword.
//https://www.javadrive.jp/javascript/event/index24.html
let search = document.getElementById("search");
let bookmarks = document.getElementById('bookmarks');

//https://developer.mozilla.org/ja/docs/Web/API/HTMLElement/input_event
search.addEventListener("input", inputChange);

//https://techacademy.jp/magazine/33194
//https://techacademy.jp/magazine/21069
function inputChange(){
  bookmarks.innerHTML = '';
  dumpBookmarks(search.value);
}

// Traverse the bookmark tree, and print the folder and nodes.
// https://www.sejuku.net/blog/49970
function dumpBookmarks(query) {
  var bookmarkTreeNodes = chrome.bookmarks.getTree(
    (bookmarkTreeNodes) => {
      bookmarks.appendChild(dumpTreeNodes(bookmarkTreeNodes, query));
    });
}

function dumpTreeNodes(bookmarkNodes, query) {
  let list = document.createElement("ul");
  var i;
  for (i = 0; i < bookmarkNodes.length; i++) {
    list.appendChild(dumpNode(bookmarkNodes[i], query)[0]);
  }
  return list;
}

function dumpNode(bookmarkNode, query) {
  if (bookmarkNode.title) {
    if (query && !bookmarkNode.children) {
      if (String(bookmarkNode.title).indexOf(query) == -1) {
        return $(document.createElement("span"));
      }
    }
    
    var anchor = document.createElement("a");
    //anchor.setAttribute("href", bookmarkNode.url);
    anchor.href = bookmarkNode.url;
    anchor.textContent = bookmarkNode.title;
    
    // When clicking on a bookmark in the extension, a new tab is fired with
    // the bookmark url.
    //https://www.willstyle.co.jp/blog/1025/
    anchor.addEventListener('click', () => {
      chrome.tabs.create({url: bookmarkNode.url});
    });
    
    var span = $('<span>');
    var options = bookmarkNode.children ?
      $('<span>[<a href="#" id="addlink">Add</a>]</span>') :
      $('<span>[<a id="editlink" href="#">Edit</a> <a id="deletelink" ' +
        'href="#">Delete</a>]</span>');
    var edit = bookmarkNode.children ? $('<table><tr><td>Name</td><td>' +
      '<input id="title"></td></tr><tr><td>URL</td><td><input id="url">' +
      '</td></tr></table>') : $('<input>');
    
    
    // Show add and edit links when hover over.
        span.hover(function() {
        span.append(options);
        $('#deletelink').click(function() {
          $('#deletedialog').empty();
          $('#deletedialog').dialog({
                 autoOpen: false,
                 title: 'Confirm Deletion',
                 resizable: false,
                 height: 140,
                 modal: true,
                 overlay: {
                   backgroundColor: '#000',
                   opacity: 0.5
                 },
                 buttons: {
                   'Yes, Delete It!': function() {
                      chrome.bookmarks.remove(String(bookmarkNode.id));
                      span.parent().remove();
                      $(this).dialog('destroy');
                    },
                    Cancel: function() {
                      $(this).dialog('destroy');
                    }
                 }
               });
          $('#deletedialog').dialog('open');
        });
        $('#addlink').click(function() {
          $('#adddialog').empty().append(edit).dialog({autoOpen: false,
            closeOnEscape: true, title: 'Add New Bookmark', modal: true,
            buttons: {
            'Add' : function() {
               chrome.bookmarks.create({parentId: bookmarkNode.id,
                 title: $('#title').val(), url: $('#url').val()});
               $('#bookmarks').empty();
               $(this).dialog('destroy');
               window.dumpBookmarks();
             },
            'Cancel': function() {
               $(this).dialog('destroy');
            }
          }}).dialog('open');
        });
        $('#editlink').click(function() {
         edit.val($(anchor).text());
         $('#editdialog').empty().append(edit).dialog({autoOpen: false,
           closeOnEscape: true, title: 'Edit Title', modal: true,
           show: 'slide', buttons: {
              'Save': function() {
                 chrome.bookmarks.update(String(bookmarkNode.id), {
                   title: edit.val()
                 });
                 $(anchor).text(edit.val());
                 options.show();
                 $(this).dialog('destroy');
              },
             'Cancel': function() {
                 $(this).dialog('destroy');
             }
         }}).dialog('open');
        });
        options.fadeIn();
      },
      // unhover
      function() {
        options.remove();
      }).append($(anchor));
  }
  var li = $(bookmarkNode.title ? '<li>' : '<div>').append(span);
  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    li.append(dumpTreeNodes(bookmarkNode.children, query));
  }
  return li;
}

document.addEventListener('DOMContentLoaded', function () {
  dumpBookmarks();
});
