<?php
header('Content-Type: application/json');

if ( ! function_exists('glob_recursive'))
{
    // Does not support flag GLOB_BRACE
    
    function glob_recursive($pattern, $flags = 0)
    {
        $files = glob($pattern, $flags);
        
        foreach (glob(dirname($pattern).'/*', GLOB_ONLYDIR|GLOB_NOSORT) as $dir)
        {
            $files = array_merge($files, glob_recursive($dir.'/'.basename($pattern), $flags));
        }
        
        return $files;
    }
}

$files=glob_recursive("ahx/*.ahx");
shuffle($files);
$dat=[];
$dat['filename']=$files[0];

//log to /tmp
//error_log($dat['filename'], 3,"/tmp/ahx.log");
//error_log("You messed up!", 3, "/tmp/my-errors.log");

echo json_encode($dat);