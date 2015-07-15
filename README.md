# AHX Web Player

![Screenshot](http://i.imgur.com/Ev71EW1.png) 

Many thanks go to bartman/abyss for his AHX javascript replayer. Unfortunately it hasn't been updated
and was only ever released [here](www.pouet.net/prod.php?which=58154)
and [here](http://www.pouet.net/prod.php?which=58260) back in 2011. I did a number of quick patches to allow
all AHX and AHX2 files to work.

This works on Chrome and Firefox. 


To run locally in Chrome you must use start Chrome with `--allow-file-access-from-files`
or `--disable-web-security` (check `chrome://version` to verify set flags). Alternatively, you can install it as a web app,
or run it over an http server.

In Firefox, navigate to `about:config`, and set `security.fileuri.strict_origin_policy` to `false`.


`AHX.zip` contains a collection (1000+ files) of AHX tunes from various sources, mostly modland. 
Unzip it into the /AHX/ folder to be used with the app. The song paths are stored in `dir.txt` and can be updated automatically using the included PowerShell script.
