<?php
require "protracker.php";

$PT=new AMIGA\Protracker();

//Pick a random mod
$files=glob("../mod/*.mod");
shuffle($files);

//LOAD
$PT->loadSong($files[0]);

$debug=$PT->debug();
print_r($debug);




exit('done');


/*
{
    "Name": "doh - dreamdealers",
    "Volume": 64,
    "WaveLength": 2,
    "Envelope": {
        "aFrames": 1,
        "aVolume": 64,
        "dFrames": 1,
        "dVolume": 64,
        "sFrames": 1,
        "rFrames": 2,
        "rVolume": 0
    },
    "FilterLowerLimit": 1,
    "FilterUpperLimit": 31,
    "FilterSpeed": 4,
    "SquareLowerLimit": 32,
    "SquareUpperLimit": 63,
    "SquareSpeed": 1,
    "VibratoDelay": 0,
    "VibratoDepth": 0,
    "VibratoSpeed": 0,
    "HardCutRelease": 0,
    "HardCutReleaseFrames": 0,
    "PList": {
        "Speed": 1,
        "Length": 5,
        "Entries": [
            {
                "Note": 49,
                "Fixed": 1,
                "Waveform": 4,
                "FX": [
                    0,
                    6
                ],
                "FXParam": [
                    0,
                    18
                ]
            },
            {
                "Note": 13,
                "Fixed": 0,
                "Waveform": 1,
                "FX": [
                    0,
                    6
                ],
                "FXParam": [
                    44,
                    64
                ]
            },
            {
                "Note": 0,
                "Fixed": 0,
                "Waveform": 0,
                "FX": [
                    0,
                    6
                ],
                "FXParam": [
                    0,
                    37
                ]
            },
            {
                "Note": 0,
                "Fixed": 0,
                "Waveform": 0,
                "FX": [
                    0,
                    6
                ],
                "FXParam": [
                    0,
                    20
                ]
            },
            {
                "Note": 0,
                "Fixed": 0,
                "Waveform": 0,
                "FX": [
                    0,
                    0
                ],
                "FXParam": [
                    0,
                    0
                ]
            }
        ]
    }
}
 */