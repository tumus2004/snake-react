<?php
session_start();
$data = json_decode(file_get_contents("php://input"), true);
if(isset($data['newScore']) and isset($data['name'])){
    echo("Setting new score ". $data['name'] . " " . $data['newScore']);
    $content = file_get_contents('./highscores.txt');
    $scores = json_decode($content, true);
    $position = "none";
    if ($data['newScore'] >= $scores["third"][1]) { $position = "third"; }
    if ($data['newScore'] >= $scores["second"][1]) { $position = "second"; }
    if ($data['newScore'] >= $scores["first"][1]) { $position = "first"; }
    if ($position === "none") { return; }
    if ($position === "first") {
        echo("new first place score");
        $scores["third"] = $scores["second"];
        $scores["second"] = $scores["first"];
        $scores["first"] = array($data['name'], $_POST['newScore']);
    } elseif ($position === "second") {
        echo("new second place score");
        $scores["third"] = $scores["second"];
        $scores["second"] = array($data['name'], $data['newScore']);
    } elseif ($position === "third") {
        echo("new third place score");
        $scores["third"] = array($data['name'], $data['newScore']);
    }
    $scoreJson = json_encode($scores);
    file_put_contents('./highscores.txt', $scoreJson);
    echo("Updated scores!");
} elseif (isset($_POST['defaultScores'])) {
    $defaultScores = array(
        "first" => array("Tim", 250),
        "second" => array("nobody", 0),
        "third" => array("nobody", 0)
    );
    $scoreJson = json_encode($defaultScores);
    file_put_contents('./highscores.txt', $scoreJson);
    echo("Defaulted the scores!");
} else { 
    $content = file_get_contents('./highscores.txt');
    $scores = json_decode($content);
    echo("<script>window.highScores = {");
    foreach ($scores as $key => $value) {
        echo($key . ":{name:'" . $value[0] . "',score:" . $value[1] . "},");
    }
    echo("}</script>");
}
