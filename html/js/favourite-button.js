function favourite_update() {
  var favourites = localStorage.getItem("favourites");
  if (favourites == null)
    favourites = "";
  
  var name = page_sound_id + ";";

  if (document.querySelector("#sound-favourite").checked) {
    if (!favourites.includes(name))
      favourites += name;
  } else {
    favourites = favourites.replace(name, "");
  }
  
  localStorage.setItem("favourites", favourites);
}

function update_favourte_checkbox() {
  var favourites = localStorage.getItem("favourites");
  if (favourites == null)
    favourites = "";

  document.querySelector("#sound-favourite").checked = favourites.includes(page_sound_id);
}

document.addEventListener("DOMContentLoaded", update_favourte_checkbox);
