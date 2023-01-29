//PSP-AHX - Instruments
const instruments={
    
    main:function(){
        frame().clear();
        this.navbar();
        this.list();
        this.editor();
        //this.plist();
    },

    navbar:function(){        
        let A=ascii().color(11);    
        line(0,0,cols(),0,160,1);
        line(0,1,cols(),1,119,15);    
        A.pos(0,0).invert().write("INSTRUMENT #" + AHX.cursor.instnum, 1).write("/"+(AHX.Song.Instruments.length-1),15);
        //A.invert(false);
    },

    list:function(){
        //list song instrumnents on the left
        let A=ascii().color(11);
        // List instruments
        for(let i=1;i<AHX.Song.Instruments.length;i++){
            let inst=AHX.Song.Instruments[i];
            if(i==AHX.cursor.instnum){
                A.pos(0,i+1).write(String(i).padStart(2, '0'), 1);                 
            }else{
                A.pos(0,i+1).write(String(i).padStart(2, '0'));                 
            }
            A.write(inst.Name.toUpperCase(),12);        
        }
    },

    editor:function(){

        if(AHX.cursor.instnum>AHX.Song.Instruments.length-1){
            AHX.cursor.instnum=1;//reset
        }

        //main instrument editor
        let A=ascii().color(11);         
        
        //Vertical Line
        //line(15,2,15,27,66,15);
        line(30,2,30,27,66,15);
        
        let x=20;
        
        //let ins=1;//Current Instrument
        let I=AHX.Song.Instruments[AHX.cursor.instnum];
        if(!I)return;

        let E=null;//Envelope
        if(I&&I.Envelope)E=I.Envelope;
        
        //Main
        A.pos(x, 2).write("VOLUME  ").write(String(I.Volume).padStart(2, '0'), 15);//I.Volume
        A.pos(x, 3).write("WAVELEN ").write(String(I.WaveLength).padStart(2, '0'), 15);//I.WaveLength
        
        // Envelope
        if (E) {
            A.pos(x, 5).write("ATTACK ").write(String(E.aFrames).padStart(3, '0'));//E.aFrames
            A.pos(x, 6).write("VOLUME  ").write(String(E.aVolume).padStart(2, '0'));//E.aVolume
            A.pos(x, 7).write("DECAY  ").write(String(E.dFrames).padStart(3, '0'));//E.dFrames
            A.pos(x, 8).write("VOLUME ").write(String(E.dVolume).padStart(3, '0'));//E.dVolume
            A.pos(x, 9).write("SUSTAIN").write(String(E.sFrames).padStart(3, '0'));//E.sFrames
            A.pos(x,10).write("RELEASE").write(String(E.rFrames).padStart(3, '0'));//E.rFrames
            A.pos(x,11).write("VOLUME  ").write(String(E.rVolume).padStart(2, '0'));//E.rVolume
        }

        // Vibrato
        A.pos(x,13).write("DELAY  ").write(String(I.VibratoDelay).padStart(3, '0'));//I.VibratoDelay
        A.pos(x,14).write("DEPTH  ").write(String(I.VibratoDepth).padStart(3, '0'));//I.VibratoDepth
        A.pos(x,15).write("SPEED   ").write(String(I.VibratoSpeed).padStart(2, '0'));//I.VibratoSpeed
        
        // Square
        A.pos(x,17).write("LOWER  ").write(String(I.SquareLowerLimit).padStart(3, '0'));//I.SquareLowerLimit
        A.pos(x,18).write("UPPER  ").write(String(I.SquareUpperLimit).padStart(3, '0'));//I.SquareUpperLimit
        A.pos(x,19).write("S.SPD  ").write(String(I.SquareSpeed).padStart(3, '0'));//I.SquareSpeed
        
        // Filter
        A.pos(x,21).write("LOWER  ").write(String(I.FilterLowerLimit).padStart(3, '0'));//I.FilterLowerLimit
        A.pos(x,22).write("UPPER  ").write(String(I.FilterUpperLimit).padStart(3, '0'));//I.FilterUpperLimit
        A.pos(x,23).write("F.SPD  ").write(String(I.FilterSpeed).padStart(3, '0'));//I.FilterSpeed

        this.plist();
    },

    
    plist:function(){
        //Current instrument sequence/steps
        let I=AHX.Song.Instruments[AHX.cursor.instnum];
        
        if(!I)return;
        //if(!I.Plist)return;
        

        
        if(I.PList.Entries.length<1){
           return;
        } 
        
        let A=ascii().color(11); 
        
        A.pos(31,2);
        A.write("STP",1).put(66,1);
        A.write("NOT",1).put(66,1);
        A.write("X",1).put(66,1);
        A.write("FX1",1).put(66,1);
        A.write("FX2",1);
    
        for(let i=0;i<I.PList.Entries.length;i++){
            let Entry=I.PList.Entries[i];
            A.pos(31,i+3).write(String(i).padStart(3, '0'));        
            //A.write(i);       
            A.put(66,1);
            //A.write("---");     
            A.write(midiNoteToString(Entry.Note-1));
            A.put(66,1);
            A.write("-");
            A.put(66,1);        
            A.write("000");
            A.put(66,1);        
            A.write("000"); 
        }   
    },

    cursor:{
        x:0,
        y:0,
    },

    keyboard:function(ev){//keyboard events are forwarded here when displayed
        //todo
        console.log(ev);
        /*
        switch(ev){
            default:
             console.log('instr.key',ev);
        }
        */
    }
}