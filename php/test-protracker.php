<?php
require "protracker.php";

$PT=new AMIGA\Protracker();

//Pick a random mod
$files=glob("../mod/*.mod");
//shuffle($files);

//LOAD
$PT->loadSong($files[1]);

print_r($PT->debug());

//$dat=$PT->pattern(0);
//print_r($dat[0]);
//echo $PT->patternText(0);
exit('done');
