document.querySelectorAll("input[type='range']").forEach(function(slider) {
  slider.addEventListener("input", update_slider);
});

function update_slider() {
  document.querySelectorAll("input[type='range']").forEach(function(slider) {
    var width = slider.value / slider.max - slider.min / slider.max / 2;
    slider.style.setProperty("--slider-width", width * 100 + "%");
  });
}

update_slider();
