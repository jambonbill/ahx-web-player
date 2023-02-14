<?php
require "protracker.php";

$PT=new AMIGA\Protracker();

//Pick a random mod
$files=glob("/tmp/mod/*.mod");
//shuffle($files);

foreach ($files as $file) {
	$PT->loadSong($file);
	$dat=$PT->debug();
	print_r($dat);
	//exit;
}


echo "done\n";