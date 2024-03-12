<?php
  $s = filemtime("index.php");
?>

<?php
  // TODO: own file?
  $sounds_json = json_decode(file_get_contents("sounds.json"));

  $uncategorised = [];
  $categories = [];
  foreach ($sounds_json as $sound) {
    if (!array_key_exists($sound->category, $categories))
      $categories[$sound->category] = [];
    
    array_push($categories[$sound->category], $sound);
    array_push($uncategorised, $sound);
  }

  ksort($categories);

  function sort_alpha_title($a, $b) {
    return strnatcmp($a->name, $b->name);
  }
  
  usort($uncategorised, "sort_alpha_title");
  foreach ($categories as &$category) {
    usort($category, "sort_alpha_title");
    unset($category);
  }
?>


<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<link rel="icon" href="icon.png">
<link rel="stylesheet" href="css/home.css?s=<?php echo($s); ?>">
<link rel="stylesheet" href="css/sounds.css?s=<?php echo($s); ?>">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Tilt+Warp" rel="stylesheet">

<script src="https://kit.fontawesome.com/5c83e19319.js" crossorigin="anonymous"></script>
<script src="js/sound-list.js?s=<?php echo($s); ?>"></script>
<script src="js/sound-button.js?s=<?php echo($s); ?>"></script>

<link rel="canonical" href="https://sfx.rocks/">

<meta name="og:description" property="og:description " content="Sound effect repository. View and play all of your favourite sound effects here! Add effects to the audio too!">
<meta name="description" content="Sound effect repository. View and play all of your favourite sound effects here! Add effects to the audio too!">
<meta name="language" content="English">
<meta name="revisit-after" content="1 days">