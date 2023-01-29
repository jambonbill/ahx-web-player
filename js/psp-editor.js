PSPinit({screen:document.getElementById('screen')});
setFps(60);
resize(48,27);//FHD-able
resize(80,45);//FHD-able

let c=new Uint8Array(8);
    c[0]=0b00010000;
    c[1]=0b00011000;
    c[2]=0b00011100;
    c[3]=0b00011110;
    c[4]=0b00011100;
    c[5]=0b00011000;
    c[6]=0b00010000;
    c[7]=0b00000000;    
    charset().chr(93,c);//Arrow

function main(){

	frame().clear();
	let A=ascii().color(15);
    
    /*
	//Show SONG Title
	line(0,0,48,0,160,1);
    line(0,1,48,1,119,15);
    
    A.pos(0,0).invert().write(AHX.songTitle().toUpperCase(),1);
	//A.pos(44,0).write("AHX.",1);
    
    //Current SONG Position 
    A.pos(42,0).write(String(AHX.Master.Output.Player.PosNr).padStart(3,'0')+".").write(AHX.Master.Output.Player.NoteNr);
    */
    
    //navbar();
    //instrumentPreview();
    //debug();
    
    //let max= AHX.Song.PositionNr-1;
	//let current=AHX.Master.Output.Player.PosNr;
	
    //Main 
    switch(AHX.cursor.page){
        
        case 0:
            songEditor.main();
            break;

        case 1:
            phraseEditor.main();
            break;

        case 2:
            //nstrumentEditor();
            instrumentEditor.main();
            break;
        
        default:
            //
            break;
    }
    //debug();
	//WebAHX.Master.Output.Player.NoteNr = 0;//pattern position (set to 0)
    //WebAHX.Master.Output.Player.PosNr = x;//(set to x)
}

function displaySong(){//show the main sequences (not the pattern)
    
    let A=ascii().color(15);
    
    //read AHX.Song.Positions[n]
    //read {Track:[4], Transpose[4]}
    //like "020|016-00 018-00 007-00 005-00"
    //like "021|016-00 018-00 007-00 005-00"
    //like "022|016-00 018-00 007-00 005-00"
    //like "023|016-00 018-00 007-00 005-00"
    //like "024|016-00 018-00 007-00 005-00"
    let pos=AHX.Master.Output.Player.PosNr;
    
    //draw a line at PosNr "if playing"
    line(8, pos+2,48,pos+2,64, 2);//play position

    for(let i=0;i<rows()-2;i++){
        let prow=pos+i;//row preview
        let row=AHX.Song.Positions[i];
        
        let y=i+2;
        
        A.invert(false);
        
        if(prow<0||!row){
        //    A.pos(13,y).write("-------  ",11);
          //  A.write("-------  ",11);
            //A.write("-------  ",11);
            //A.write("-------",11);
            continue;
        }       
        

        //if(i==10)A.color(1);else A.color(15);
        
        if(pos==i){
            A.pos(9,y).write(String(i).padStart(3, '0'), 1);
        }else{
            A.pos(9,y).write(String(i).padStart(3, '0'),11);    
        }
        
        
        //A.put(32);// space
        
        for(let x=0;x<4;x++){
            /*
            if(x==AHX.cursor.track){
                A.put(66,1);// space
            }else{
                A.put(32);// space
            }
            */
            A.invert(false);
            A.put(32);// space

            //Invert Cursor Position (Pos/x)
            if(pos==prow&&x==AHX.cursor.track){
                A.invert(true);
            }else{

            }

            A.write(String(row.Track[x]).padStart(3, '0'));   
            
            
            if(row.Transpose[x]>0){
                //A.put(32);// Space
                A.put(43);// PLUS
                A.write(String(row.Transpose[x]).padStart(2, '0'));
            }else if(row.Transpose[x]<0){
                //A.put(32);// Space
                A.put(45);// MINUS
                A.write(String(Math.abs(row.Transpose[x])).padStart(2, '0'));
            }else{
                //no transpose value
                A.write(":--",11);
            }
            A.write(" ");
        }
    }
}

function displayInstr(){//show instrument preview
    let A=ascii().color(15);
    A.pos(0,10).write("INSTR.");
    AHX.Song.Instruments.forEach((ins,i)=>{
        if(i==0)return;
        A.pos(0,11+i).write(String(i).padStart(2, '0'),11);
        A.write(ins.Name.toUpperCase(), 12);
    });
}

function midiNoteToString(n){
    if(n<0)return "---";
    let note=n%12;
    let notes=['C-','C#','D-','D#','E-','F-','F#','G-','G#','A-','A#','B-'];
    let oct=Math.floor(n/12);
    return notes[note]+oct;
}

/*
function displayPatterns()
{
    let A=ascii().color(15);
    let pos=AHX.Master.Output.Player.PosNr;    
    let row=AHX.Song.Positions[pos];
    if(!row)return;
    //Show pattern number
    A.pos(12,10)
    for(let x=0;x<4;x++){
        if(x==AHX.cursor.track){
            A.put(233,1);//Triangle. show Current Track
        }else{
            A.write(" ");
        }
        A.write(String(row.Track[x]).padStart(3, '0'),1); 
        A.write("     ");
         
    }

    // Pattern position //
    let nr=AHX.Master.Output.Player.NoteNr;
    
    for(let i=0;i<16;i++){
        let color=null;
        let y=i+11;
        A.pos(9,y).write(String(i).padStart(3, '0'),11);
        
        if(nr==i)color=1;
        //A.write(" ");
        for(let x=0;x<4;x++){
            let tracknumber=row.Track[x];
            let track=AHX.Song.Tracks[tracknumber];
            let step=track[i];
            if(x==AHX.cursor.track){
                A.put(66,1);
            }else{
                A.write(" ");//Current Track ?
            }
            let fx=step.FX.toString(16).toUpperCase();
            let fxParam=step.FXParam.toString(16).toUpperCase();
            
            A.write(midiNoteToString(step.Note-1),color);//Note 
                
            if(step.Instrument||step.FX||step.fxParam){
                A.write(String(step.Instrument).padStart(2, '0'),color);//Instrument 
                A.write(fx,color); //fx 0-F 
                A.write(String(fxParam).padStart(2, '0'),color); //Fx Param 00-FF        
            }else{
                A.write("-----",11);
            }
        }
    }
}
*/



hook(main);