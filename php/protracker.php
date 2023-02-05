<?php
/**
 * AHX File manipulation
 * Converted from https://github.com/bryc/ahx-web-player/blob/master/ahx.js
 * @author : jambonbill <[<email address>]>
 */

namespace AMIGA;

use Exception;

/**
 * Read Protracker (.mod) file
 * Author: Jambonbill
 */
class Protracker{


	private $filename = ''; 
	private $filesize = 0; 
	private $title='';
	private $MK='';
	private $samples=[];
	private $nsp=0;////Number of song positions
	private $pattern_table=[];
	private $patterns=[];
	


	public function loadSong(string $filename)
	{
		if(!is_readable($filename)){
			throw new Exception("$filename Not readable", 1);
		}	
		
		$this->filename=$filename;
		$this->filesize=filesize($filename);
		$handle = fopen($filename, "r");
		
		$this->decode($handle);
		fclose($handle);


	}

	public function decode($handle)
	{
		$this->title=fread($handle,20);//(bytes 0-3)
		
		//SAMPLES
		for ($i=0;$i<32;$i++) {
			$samplename = fread($handle,22);;//Sample's name, padded with null bytes.
			$this->samples[]=$samplename;
			$sl=unpack('S',fread($handle,2))[1];//Sample length in words (1 word = 2 bytes).
			
			$a=unpack('C',fread($handle,1))[1];//Lowest four bits represent a signed nibble (-8..7) which is the finetune value for the sample. 
			
			$a=unpack('C',fread($handle,1))[1];//Volume of sample. Legal values are 0..64
			
			$a=unpack('S',fread($handle,2))[1];//Start of sample repeat offset in words.
			$sr=unpack('S',fread($handle,2))[1];//Length of sample repeat in words.
			echo "sr=$sr\n";

		}


		$nsp=unpack('C',fread($handle,1))[1];//Number of song positions
		$this->nsp=$nsp;

		$skip=unpack('C',fread($handle,1))[1];//Historically set to 127, but can be safely ignored.
		echo "skip=$skip\n";
		
		for ($i=0;$i<128;$i++) {//Pattern table: patterns to play in each song position (0..127)
          	//Each byte has a legal value of 0..63 
			$pattern=unpack('C',fread($handle,1))[1];
			$this->pattern_table[]=$pattern;
		}

		//The four letters "M.K."
		$this->MK=fread($handle,4);
	}


	public function debug(){
		$dat=[];
		$dat['filename']=$this->filename;
		$dat['title']=$this->title;
		$dat['samples']=$this->samples;
		$dat['nsp']=$this->nsp;
		$dat['pattern_table']=$this->pattern_table;
		$dat['MK']=$this->MK;
		return $dat;
	}
		
}

/*
Module Format:
# Bytes   Description
-------   -----------
20        The module's title, padded with null (\0) bytes. Original
          Protracker wrote letters only in uppercase.

(Data repeated for each sample 1-15 or 1-31)
22        Sample's name, padded with null bytes. If a name begins with a
          '#', it is assumed not to be an instrument name, and is
          probably a message.
2         Sample length in words (1 word = 2 bytes). The first word of the sample is overwritten by the tracker, so a length of 1
          still means an empty sample. See below for sample format.
1         Lowest four bits represent a signed nibble (-8..7) which is
          the finetune value for the sample. Each finetune step changes
          the note 1/8th of a semitone. Implemented by switching to a
          different table of period-values for each finetune value.
1         Volume of sample. Legal values are 0..64. Volume is the linear
          difference between sound intensities. 64 is full volume, and
          the change in decibels can be calculated with 20*log10(Vol/64)
2         Start of sample repeat offset in words. Once the sample has
          been played all of the way through, it will loop if the repeat
          length is greater than one. It repeats by jumping to this
          position in the sample and playing for the repeat length, then
          jumping back to this position, and playing for the repeat
          length, etc.
2         Length of sample repeat in words. Only loop if greater than 1.
(End of this sample's data.. each sample uses the same format and they
 are stored sequentially)
N.B. All 2 byte lengths are stored with the Hi-byte first, as is usual
     on the Amiga (big-endian format).

1         Number of song positions (ie. number of patterns played
          throughout the song). Legal values are 1..128.
1         Historically set to 127, but can be safely ignored.
          Noisetracker uses this byte to indicate restart position -
          this has been made redundant by the 'Position Jump' effect.
128       Pattern table: patterns to play in each song position (0..127)
          Each byte has a legal value of 0..63 (note the Protracker
          exception below). The highest value in this table is the
          highest pattern stored, no patterns above this value are
          stored.
(4)       The four letters "M.K." These are the initials of
          Unknown/D.O.C. who changed the format so it could handle 31
          samples (sorry.. they were not inserted by Mahoney & Kaktus).
          Startrekker puts "FLT4" or "FLT8" here to indicate the # of
          channels. If there are more than 64 patterns, Protracker will
          put "M!K!" here. You might also find: "6CHN" or "8CHN" which
          indicate 6 or 8 channels respectively. If no letters are here,
          then this is the start of the pattern data, and only 15
          samples were present.
 */