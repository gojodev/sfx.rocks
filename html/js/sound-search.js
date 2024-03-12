var current_search = "";

document.querySelector("#sound-search").addEventListener("click", function(event) {
  event.stopPropagation();
});

document.addEventListener("click", function() {
  document.querySelector("#sound-search-list").classList.add("destroyed");
});

function update_menu() {
  var elements = [];
  var show_categories = [];

  document.querySelectorAll(".sound-category > .sound").forEach(function(element) {
    var id = element.href;

    if (is_sound_similar(id, current_search)) {
      elements.push(element);
      var title = element.parentElement.parentElement.querySelector(".category-title");
      if (show_categories.indexOf(title) == -1)
        show_categories.push(title);
    } else
      element.style.display = "none";
  });
  
  elements.forEach(function(element) {
    element.style.display = "block";
  });

  document.querySelectorAll(".category-title").forEach(function(e) {
    if (show_categories.indexOf(e) == -1)
      e.style.display = "none";
    else
      e.style.display = "block";
  });
}

function update_search_menu() {
  if (current_search == "")
    document.querySelector("#sound-search-list").classList.add("destroyed");
  else
    document.querySelector("#sound-search-list").classList.remove("destroyed");

  document.querySelectorAll("#sound-search-list > a").forEach(function(element) {
    var id = element.getAttribute("href");
    if (is_sound_similar(id, current_search))
      element.classList.remove("destroyed");
    else {
      element.classList.add("destroyed");
    }
  });
}

function search_update(value) {
  current_search = value.toLowerCase();
  update_menu();
}

function search_list_update(value) {
  current_search = value.toLowerCase();
  update_search_menu();
}
