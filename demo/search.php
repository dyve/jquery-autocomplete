<?php

include 'data.php';

$results = array();

$q = '';
if (isset($_GET['q'])) {
    $q = strtolower($_GET['q']);
}
$output = 'autocomplete';
if (isset($_GET['output'])) {
    $output = strtolower($_GET['output']);
}

if ($q) {
    foreach ($data as $key => $value) {
        if (strpos(strtolower($key), $q) !== false) {
            $results[] = array($key, $value);
        }
    }
}

if ($output === 'json') {
    echo json_encode($results);
} else {
    echo autocomplete_format($results);
}

function autocomplete_format($results) {
    foreach ($results as $result) {
        echo $result[0] . '|' . $result[1] . "\n";
    }
}
