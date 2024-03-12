<!DOCTYPE html>
<html lang="en">
  <head>
    <?php include("header.php"); ?>
    <?php
      function get_page_sound() {
        global $uncategorised;
        foreach ($uncategorised as $sound) {
          if ($sound->id == $_GET["sound"])
            return $sound;
        }
        return null;
      }

      $page_sound = get_page_sound();
      if ($page_sound == null) {
        header("Location: ./");
        exit;
      }
    ?>
    <script src="js/slider.js?s=<?php echo($s); ?>" defer></script>
    <script src="js/favourite-button.js?s=<?php echo($s); ?>"></script>
    <script>
      var page_sound_name = "<?php echo($page_sound->name); ?>";
      var page_sound_id = "<?php echo($page_sound->id); ?>";

      load_sound(page_sound_id);
    </script>
    <title><?php echo($page_sound->name); ?> - Sound Effect Rocks</title>
    <meta name="og:title" property="og:title" content="SFX Rocks - <?php echo($page_sound->name); ?>">
    <meta content="https://sfx.rocks/media/<?php echo($page_sound->id); ?>.webp" property="og:image">
    <meta content="https://sfx.rocks/audio/<?php echo($page_sound->id); ?>.webm" property="og:audio">
    <meta content="https://sfx.rocks/<?php echo($page_sound->id); ?>" property="og:url">
  </head>
  <body>
    <main>
      <div id="soundfocus">
        <div id="sound-button">
          <div class="left">
            <a class="back-button" href="./">< Back</a>
            <p id="button-sound">
              <i class="fa-solid fa-circle-play" onclick="play_sound(page_sound_id); dataLayer.push({event: 'play_sound'});" style="background-image: url('media/<?php echo($page_sound->id); ?>.webp');"></i>
            </p>
          </div>
          <div id="settings" class="right">
            <h2>Settings</h2>
            <label for="sound-speed">Pitch</label>
            <input id="sound-speed" oninput="speed_update();" type="range" min="0.25" max="1.75" step="0.01" value="1.0">
            <label for="sound-earrape">Earrape mode (warning, very very loud)</label>
            <input id="sound-earrape" oninput="earrape_update();"type="checkbox">
            <label for="sound-volume">Volume</label>
            <input id="sound-volume" oninput="volume_update();" type="range" min="0" max="2" step="0.01" value="1.0">
            <button id="sound-record" onclick="play_sound(page_sound_id, true);">Record and download audio automatically</button>
            <label for="sound-favourite">Favourite</label>
            <input id="sound-favourite" oninput="favourite_update();" type="checkbox">
          </div>
        </div>
        <h2 id="sound-recommend-title">Play other sound effects</h2>
        <div id="sound-recommend">
          <?php
            $random = array_rand($uncategorised, 6);
            for ($i = 0; $i < 6; $i++) {
              $sound = $uncategorised[$random[$i]];
          ?>
            <a class="sound" href="<?php echo($sound->id); ?>">
              <div class="icon" style="background-image: url('media/<?php echo($sound->id); ?>.webp');"></div>
              <p class="button">
                <span class="sound-name"><?php echo($sound->name); ?></span>
              </p>
            </a>
          <?php
            }
          ?>
        </div>
      </div>
    </main>
    <!-- End list page -->
    <footer>
      <a href="https://slinthn.me" target="_blank">Slinthn</a>
      <a href="https://forms.gle/9EQTpanBUQ76kRXb9" target="_blank">Submit a Sound</a>
      <a href="https://forms.gle/wtizVTPqoANXK1eh8" target="_blank">Report an Issue</a>
    </footer>
  </body>
</html>
