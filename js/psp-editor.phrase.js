//PSP-AHX Phrase Editor (or Track editor)
const phraseEditor={
   
    cursor:{
        x:0,//track
        y:0,
        w:0,
        h:0,
        phrasenum:0,//Current phrase Number
        inst:1,//current instrument number
        octave:1,//current octave
        clipboard:{},
        reset:function(){//reset selection
            this.w=0;
            this.h=0;
        },
        up:function(){
            if(keySHIFT()){
                if(this.h>0)this.h--;
                return;
            }

            if(this.y>0)this.y--;
        },
 
        down:function(){
            if(keySHIFT()){
                this.h++;
                return;
            }

            if(this.y<AHX.Song.TrackLength-1){
                this.y++;
            }
        },
        right:function(){
            if(keySHIFT()){
                this.w++;
                return;
            }
            if(this.x<3)this.x++;
        },
        left:function(){
            if(keySHIFT()){
                this.w--;
                return;
            }
            if(this.x>0)this.x--;
        },
        plus:function(){
            let step=AHX.Song.Tracks[this.phrasenum][this.y];
            switch(this.x){
                case 0:step.Note++;break;
                case 1:step.Instrument++;break;
                case 2:step.FX++;break;
                case 3:step.FXParam++;break;
            }
        },
        minus:function(){
            let step=AHX.Song.Tracks[this.phrasenum][this.y];
            switch(this.x){
                case 0:if(step.Note>0)step.Note--;break;
                case 1:if(step.Instrument>0)step.Instrument--;break;
                case 2:if(step.FX>0)step.FX--;break;
                case 3:if(step.FXParam>0)step.FXParam--;break;
            }
        },
        suppr:function(){
            let step=AHX.Song.Tracks[this.phrasenum][this.y];
            switch(this.x){
                case 0:step.Note=0;break;
                case 1:step.Instrument=0;break;
                case 2:step.FX=0;break;
                case 3:step.FXParam=0;break;
            }
        },
        setNote:function(note){
            if(this.x!=0)return;
            let step=AHX.Song.Tracks[this.phrasenum][this.y];
            step.Note=(note+1)+(this.octave*12);
            step.Instrument=this.inst;
            this.y++;
        }
    },

    main:function(){
        frame().clear();
        this.navbar();
        this.menu();
        this.phrase();
        
        switch(this.cursor.x){
            case 1:this.instruments();break;
            case 2:
            case 3:
                this.commands();break;
        }
        
        this.debug();
    },

    navbar:function(){
        
        let A=ascii().color(15);        
        line(0,0,cols(),0,160,1);
        line(0,1,cols(),1,119,15);
        
        let pnum=this.cursor.phrasenum;

        A.pos(0,0).invert().write("PHRASE #"+pnum,1).write("/" + (AHX.Song.Tracks.length-1), 15);        
        A.pos(23,0).invert().write("KEYB.OCTAVE #"+this.cursor.octave,1);        
        
        //Current SONG Position 
        A.pos(74,0).write(String(AHX.Master.Output.Player.PosNr).padStart(3,'0')+".").write(AHX.Master.Output.Player.NoteNr);
    },

    menu:function(){
        //MINI MENU
        let A=ascii().color(15);
        A.pos(1,2).write("POS").write(String(AHX.Master.Output.Player.PosNr).padStart(3, ' '),1);
        A.pos(1,3).write("LEN").write(String(AHX.Song.PositionNr-1).padStart(3, ' '));
        A.pos(1,4).write("RES").write(String(AHX.Song.Restart).padStart(3, ' '));
        A.pos(1,5).write("TRL").write(String(AHX.Song.TrackLength).padStart(3, ' '));
        //kEYBOARD
        if(keySHIFT())A.pos(1,10).write("SHIFT");
        if(keyCTRL())A.pos(1,11).write("CTRL");
        if(keyALT())A.pos(1,12).write("ALT");
    },

    phrase:function(){
        let A=ascii().color(12);
        // Pattern position //
        let pnum=this.cursor.phrasenum;
        let nr=AHX.Master.Output.Player.NoteNr;
        let TRL=AHX.Song.TrackLength;
        
        for(let i=0;i<TRL;i++){//Track Length
            

            let y=i+2;
            
            A.invert(false);
            A.pos(9,y).write(String(i).padStart(3, '0'),11);//000
            
            let track=AHX.Song.Tracks[pnum];
            let step=track[i];
            let fx=step.FX.toString(16).toUpperCase();
            let fxParam=step.FXParam.toString(16).toUpperCase();
            
            if(i==AHX.Master.Output.Player.NoteNr){
                A.put(93,1);//Triangle
            }else{
                A.put(32,1);//space
            }
            
            
            
            if(this.cursor.y==i && this.cursor.x==0)A.invert(true);
            A.write(midiNoteToString(step.Note-1));//Note 
            
            A.invert(false).put(32,1);//space
            
            if(this.cursor.y==i && this.cursor.x==1)A.invert(true);
            if(step.Instrument==0){
                A.write("--");//No instrument
            }else{
                A.write(String(step.Instrument).padStart(2, '0'));//Instrument    
            }
            

            A.invert(false).put(32,1);//space
            
            //Effect
            if(this.cursor.y==i && this.cursor.x==2)A.invert(true);
            A.write(fx); //fx command 0-F 
            A.invert(false);

            if(this.cursor.y==i && this.cursor.x==3)A.invert(true);
            if(fxParam==0){
                A.write('--'); //Fx Param 00-FF            
            }else{
                A.write(String(fxParam).padStart(2, '0')); //Fx Param 00-FF            
            }
            
        
                  
        }     
    },

    commands:function(){
        // The command screen (help page)
        let cmds=["NONE",
        "PORTAMENTO UP",
        "PORTAMENTO DN",
        "TONE PORTAMENTO",
        "SET/OVERRIDE FILTER",
        "TONE PORTA + VOL SLIDE",
        "UNUSED",
        "UNUSED",
        "EXTERNAL TIMING",
        "SET SQUARE RELATION",
        "VOLUME SLIDE",
        "POSITION JUMP",
        "SET VOLUME",
        "POS.BREAK",
        "MISC.COMMANDS",
        "SET SPEED"
        ];
        
        let x=40;
        let A=ascii().color(11).pos(x,2).write("COMMANDS");
        A.pos(x, 3).write("--------------");
        for(let i=0;i<16;i++){
            A.pos(x, 4+i).write(i.toString(16).toUpperCase() + " - " + cmds[i]);    
        }
        /*
        A.pos(x, 4).write("0 - NONE");
        A.pos(x, 5).write("1 - PORTAMENTO UP");
        A.pos(x, 6).write("2 - PORTAMENTO DOWN");
        A.pos(x, 7).write("3 - TONE PORTAMENTO");
        A.pos(x, 8).write("4 - SET/OVERRIDE FILTER");
        A.pos(x, 9).write("5 - TONE PORTAMENTO + VOL SLIDE");
        A.pos(x,10).write("6 - UNUSED");
        A.pos(x,11).write("7 - UNUSED");
        A.pos(x,12).write("8 - EXTERNAL TIMING");
        A.pos(x,13).write("9 - SET SQUARE RELATION");
        A.pos(x,14).write("A - VOLUME SLIDE");
        A.pos(x,15).write("B - POSITION JUMP");
        A.pos(x,16).write("C - SET VOLUME");
        A.pos(x,17).write("D - POS.BREAK");
        A.pos(x,18).write("E - MISC.COMMANDS");
        A.pos(x,19).write("F - SET SPEED");
        */
    },

    instruments:function(){
        //Show Instruments
        let x=40;
        let A=ascii().color(11).pos(x,2).write("INSTRUMENTS");
        A.pos(x, 3).write("--------------");
        // List instruments    
        for(let i=1;i<AHX.Song.Instruments.length;i++){
            let inst=AHX.Song.Instruments[i];
            A.pos(x,i+2).write(String(i).padStart(2, '0'));            
            A.write(" "+inst.Name.toUpperCase(),12);        
        }
    },

    debug:function(){
        for(let i=0;i<16;i++){
            let p=cols()*45-16;
            poke(p+i,[250,i]);
        }
    },

    //_pressedKey={},
    keydown:function(ev){
        
        let c = ev.which;
        let note=keyCodeToMidiNote(c);
        
        if(c>=112&&c<=115){//F1-F4
            console.log("FKEY");
        }

        if(note){
            //set note
            this.cursor.setNote(note);
        }
        
        switch(c){

            case 33://pgup - Previous prhrase
                if(this.cursor.phrasenum>0)this.cursor.phrasenum--;
                break;
            
            case 34://pgdown - Next phrase
                if(this.cursor.phrasenum<AHX.Song.Tracks.length-1){
                    this.cursor.phrasenum++;
                }
                break;
            
            case 37:this.cursor.left(); break;
            case 39:
                this.cursor.right();
                break;
            
            case 38:this.cursor.up();   break;
            case 40:this.cursor.down(); break;        
            
            case 46://suppr
                this.cursor.suppr();
                break;        

            //+/-
            case 107:this.cursor.plus();break;
            case 109:this.cursor.minus();break;



            default:            
                console.log("Key:",c);
        }
    }

}


