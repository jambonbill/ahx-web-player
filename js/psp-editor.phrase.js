

function phraseEditor(){
    
    frame().clear();
    //Instrument Editor
    let A=ascii().color(11);
    
    line(0,0,48,0,160,1);
    line(0,1,48,1,119,15);
    
    let pnum=AHX.cursor.phrasenum;

    A.pos(0,0).invert().write("PHRASE #"+pnum,1).write("/" + AHX.Song.Tracks.length, 15);
    A.invert(false);

    // Pattern position //
    let nr=AHX.Master.Output.Player.NoteNr;
    let TRL=AHX.Song.TrackLength;
    
    for(let i=0;i<TRL;i++){//Track Length
        
        let color=null;
        let y=i+2;
        A.pos(9,y).write(String(i).padStart(3, '0'),11);
        
        if(nr==i)color=1;

        let track=AHX.Song.Tracks[pnum];
        let step=track[i];
    
        
        let fx=step.FX.toString(16).toUpperCase();
        let fxParam=step.FXParam.toString(16).toUpperCase();
        A.put(32,1);//space
        A.write(midiNoteToString(step.Note-1),color);//Note 
        A.put(32,1);//space
        if(step.Instrument||step.FX||step.fxParam){
            A.write(String(step.Instrument).padStart(2, '0'),color);//Instrument 
            A.put(32,1);//space
            A.write(fx,color); //fx 0-F 
            A.put(32,1);//space
            A.write(String(fxParam).padStart(2, '0'),color); //Fx Param 00-FF        
        }else{
            A.write("-- - --",11);
        }  
    }     
}