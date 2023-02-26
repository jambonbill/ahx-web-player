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

/*
const pages={
    splash:0,
    song:1,
    phrase:2,
    instrument:3,
    files:4,
    help:5,//keyboard page
    config:6,//Settings: buffer size, keyboard, colors, etc
}
*/

function main(){
	//Main 
    //if(!AHX)return;
    
    switch(AHX.Editor.page){
        
        //case 0:splash.main();break;
        case 1:config.main();break;
        case 2:songEditor.main();break;
        case 3:phraseEditor.main();break;
        case 4:instrumentEditor.main(); break;
        case 5:wavetableEditor.main(); break;
        
        default:
            splash.main();
            break;
    }
    
    if(0){
        bufferPreview();
    }
    
    if(AHX.Editor.page==2){
        minimenu();
        notePreview();
    }
    
    debug();    
}


function minimenu(){
    //MINI MENU
    let A=ascii().color(15);
    let y=4;
    A.pos(1,y+0).write("POS").write(String(AHX.Master.Output.Player.PosNr).padStart(3, ' '),1);
    A.pos(1,y+1).write("LEN").write(String(AHX.Song.PositionNr-1).padStart(3, ' '));
    A.pos(1,y+2).write("RES").write(String(AHX.Song.Restart).padStart(3, ' '));
    A.pos(1,y+3).write("TRL").write(String(AHX.Song.TrackLength).padStart(3, ' '));
    A.pos(1,y+4).write(" SS").write(String(AHX.Song.SubsongNr).padStart(3, ' '));
    //A.pos(1,7).write("SSN").write(String(0).padStart(3, '0'));
    //A.pos(1,8).write("SSP").write(String(0).padStart(3, '0'));
    A.pos(1,y+8).write("SPEED:",11);
    A.pos(1,y+9).write("MUL").write(String(AHX.Song.SpeedMultiplier).padStart(3, ' '));
    A.pos(1,y+10).write("TPO").write(String(AHX.Master.Output.Player.Tempo).padStart(3, ' '));
};


function notePreview(){//realtime note preview
    let A=ascii().color(15);
    let x=1;
    let y=16;
    if(!AHX.Master.Output.Player.Voices.length)return;
    
    A.pos(1,y).write("NOTES:",11);
    y++;
    for(let i=0;i<4;i++){
        A.pos(x,y+i).write("V"+i+":",11);
        //let note=AHX.Master.Output.Player.Voices[i].InstrPeriod;
        //let note=AHX.Master.Output.Player.Voices[i].LastPeriod;//jambon Crap
        let note=AHX.Master.Output.Player.Voices[i].TrackPeriod;//this.Voices[v].TrackPeriod
        
        if (note>0) {
            A.pos(x+3,y+i).write(midiNoteToString(note-1));
        }
    }
}

function bufferPreview(){
    let mbuffer=AHX.Master.Output.MixingBuffer;
    if(!mbuffer)return;
    mbuffer.forEach(function(b,i){
        let byte=Math.abs(b);
        //let p=cols()*40;
        let x=i%16;
        let y=2+Math.floor(i/16);
        let p=72+x+y*cols();
        poke(p,[byte,11]);
    });
}


function debug(){
    //kEYBOARD
    let A=ascii();
    
    if(keyCTRL())A.pos(0,44).write("[CTRL]");
    if(keySHIFT())A.pos(6,44).write("[SHIFT]");
    if(keyALT())A.pos(13,44).write("[ALT]");
    
    //PAGE
    A.invert(1);
    A.pos(52,0).write("PAGE#").write(AHX.Editor.page);

    //color palette
    for(let i=0;i<16;i++){
        let p=cols()-22;
        poke(p+i,[250,i]);
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
document.getElementById('screen').focus();