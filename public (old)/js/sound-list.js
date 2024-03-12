function render_sounds() {
  var container = document.querySelector("#sound-entries");
  var category_template = document.querySelector("#sound-entries > template");

  container.querySelectorAll("*:not(template)").forEach(function(elem) {
    elem.remove();
  });

  for ([category, sounds] of Object.entries(audioinfo)) {
    var templated = category_template.content.cloneNode(true);
    templated.querySelector(".category-title").innerHTML = category;
    
    templated.querySelector(".sound-category").setAttribute("data-category", category);
    category_elem = templated.querySelector(".sound-category");
    container.append(templated);

    sounds.forEach(function(sound) {
      var clone = category_elem.querySelector("template").content.cloneNode(true);
      clone.querySelector(".sound-name").innerHTML = sound.name;
      clone.querySelector(".sound").setAttribute("data-id", sound.id);
      clone.querySelector(".sound").setAttribute("href", sound.id);
      clone.querySelector(".sound .icon").style.backgroundImage = `url("media/${sound.id}.webp")`;
    
      category_elem.append(clone);
    });
  }

  var container = document.querySelector("#sound-search-list");
  var template = container.querySelector("template");

  container.querySelectorAll("*:not(template)").forEach(function(elem) {
    elem.remove();
  });

  for ([category, sounds] of Object.entries(audioinfo)) {
    for (var i = 0; i < sounds.length; i++) {
      if (is_sound_similar(sounds[i].id, current_search)) {
        var clone = template.content.cloneNode(true);
        clone.querySelector("img").src = `media/${sounds[i].id}.webp`;
        
        clone.querySelector("a").href = sounds[i].id;
        clone.querySelector("a").setAttribute("data-id", sounds[i].id);
        clone.querySelector("span").innerHTML = sounds[i].name;
        container.append(clone);
      }
    }
  }
}
