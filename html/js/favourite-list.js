function render_favourites() {
  var favourites = localStorage.getItem("favourites");
  if (favourites == null)
    favourites = "";

  var favourite_container = document.querySelector(".sound-category.favourites");

  favourites.split(";").forEach((e) => {
    var element = document.querySelector(`*[data-id='${e}']`);
    if (element == null)
      return;

      favourite_container.appendChild(element.cloneNode(true));
  });
}

document.addEventListener("DOMContentLoaded", render_favourites);
