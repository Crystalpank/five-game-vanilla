<?php
// foreach($arWords as $word){
//     $str = mb_strtolower($word);
//     file_put_contents(__DIR__ . '/words_2.txt', $str . " ", FILE_APPEND);
// }

$data = json_decode(file_get_contents('php://input'));

if (isset($data)){
    $str = file_get_contents('words.txt');
    $arWords = explode(" ", $str);
    switch($data->param){
        case "getWord":
            $word = $arWords[random_int(0, count($arWords) - 1)];
            echo json_encode($word);
            break;
        case "validateWord":
            if (in_array($data->word, $arWords)){
                echo json_encode(array("status" => true));
            }else{
                echo json_encode(array("status" => false));
            }
            break;
    }
    // $log = date('Y-m-d H:i:s') . ' ' . print_r($data, true);
    // file_put_contents(__DIR__ . '/log.txt', $log . PHP_EOL, FILE_APPEND);
}
