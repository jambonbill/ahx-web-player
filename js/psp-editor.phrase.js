


function phraseEditor(){
    
    frame().clear();
    //Instrument Editor
    let A=ascii().color(12);
    
    line(0,0,cols(),0,160,1);
    line(0,1,cols(),1,119,15);
    
    let pnum=AHX.cursor.phrasenum;

    A.pos(0,0).invert().write("PHRASE #"+pnum,1).write("/" + (AHX.Song.Tracks.length-1), 15);
    
    //Current SONG Position 
    A.pos(42,0).write(String(AHX.Master.Output.Player.PosNr).padStart(3,'0')+".").write(AHX.Master.Output.Player.NoteNr);


    A.invert(false);

    //MINI MENU
    A.pos(1,2).write("POS").write(String(AHX.Master.Output.Player.PosNr).padStart(3, ' '),1);
    A.pos(1,3).write("LEN").write(String(AHX.Song.PositionNr-1).padStart(3, ' '));
    A.pos(1,4).write("RES").write(String(AHX.Song.Restart).padStart(3, ' '));
    A.pos(1,5).write("TRL").write(String(AHX.Song.TrackLength).padStart(3, ' '));
    
    // Pattern position //
    let nr=AHX.Master.Output.Player.NoteNr;
    let TRL=AHX.Song.TrackLength;
    
    for(let i=0;i<TRL;i++){//Track Length
        
        let color=null;
        let y=i+2;
        
        if (nr==i) {
            //highlight current row
            A.pos(9,y).write(String(i).padStart(3, '0'), 1);
        }else{
            A.pos(9,y).write(String(i).padStart(3, '0'),11);
        }
        
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
            
            //Effect
            A.write(fx,color); //fx 0-F 
            //A.put(32,1);//space
            A.write(String(fxParam).padStart(2, '0'),color); //Fx Param 00-FF        
        }else{
            A.write("-- ---",11);
        }  
    }     
}