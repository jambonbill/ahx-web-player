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
	
    //Main 
    switch(AHX.cursor.page){
        
        case 0:songEditor.main();break;
        case 1:phraseEditor.main();break;
        case 2:instrumentEditor.main(); break;
        
        default:
            //
            break;
    }
}



function midiNoteToString(n){
    if(n<0)return "---";
    let note=n%12;
    let notes=['C-','C#','D-','D#','E-','F-','F#','G-','G#','A-','A#','B-'];
    let oct=Math.floor(n/12);
    return notes[note]+oct;
}


hook(main);