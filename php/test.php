<?php
require "ahx.php";

$AHX=new AHX\AHX();

//$AHX->loadSong('chopper.ahx');
//$AHX->loadSong('amanda.ahx');
$AHX->loadSong('doh.ahx');

$nfo=$AHX->debug();
print_r($nfo);

//print_r($AHX->Positions());

//print_r($AHX->Tracks()[1]);

exit('done');