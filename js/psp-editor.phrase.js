//PSP-AHX Phrase Editor (or Track editor)
const phraseEditor={

    phraseNumber:0,//current track    
    instrument:0,//current instr.
    command:0,  //current command
    octave:2,   //current octave
            
    init:function(){
        this.phraseNumber=0;//current track    
        this.instrument=0;//current instr.
        this.command=0;  //current command
        this.octave=2;
        this.cursor.init();
    },

    setPhrase:function(n){
        this.phraseNumber=n;
    },

    setInstrument:function(n){
        this.instrument=n;
    },

    setCommand:function(n){
        this.command=n;
    },

    cursor:{
        x:0,//track
        y:0,
        w:0,
        h:0,
        //phrasenum:0,//Current phrase Number
        //inst:1,//current instrument number
        clipboard:{},
        init:function(){
            console.log('cursor.init');
            this.x=0;
            this.y=0;
            this.w=0;
            this.h=0;
        },
        reset:function(){//reset selection
            this.w=0;
            this.h=0;
        },
        up:function(){
            if(keySHIFT()){
                if(this.h>0)this.h--;
                return;
            }
            this.reset();
            if(this.y>0)this.y--;
        },
 
        down:function(){
            if(keySHIFT()){
                this.h++;
                return;
            }
            this.reset();
            if(this.y<AHX.Song.TrackLength-1){
                this.y++;
            }
        },

        right:function(){
            if(keySHIFT()){
                this.w++;
                return;
            }
            this.reset();
            if(this.x<3)this.x++;
        },
        left:function(){
            if(keySHIFT()){
                this.w--;
                return;
            }
            this.reset();
            if(this.x>0)this.x--;
        },
        selectAll(){
            //CTRL+A
            this.x=0;
            this.y=0;
            this.w=3;
            this.h=AHX.Song.TrackLength-1;
        },
        copy(){
            console.log("cursor.copy",this);
        },
        plus:function(n){
            if(!n)n=1;
            this.coords().forEach((c)=>{
                let step=AHX.Song.Tracks[phraseEditor.phraseNumber][c.y];
                switch(c.x){
                    case 0:step.Note+=n;break;
                    case 1:
                        step.Instrument+=n;
                        phraseEditor.setInstrument(step.Instrument);
                        break;
                    case 2:step.FX+=n;break;
                    case 3:step.FXParam+=n;break;
                }    
            });
            
        },
        minus:function(n){
            if(!n)n=1;
            this.coords().forEach((c)=>{
                let step=AHX.Song.Tracks[phraseEditor.phraseNumber][c.y];
                switch(c.x){
                    case 0:if(step.Note>0)step.Note-=n;break;
                    case 1:
                        if(step.Instrument>0){
                            step.Instrument-=n;
                            phraseEditor.setInstrument(step.Instrument);
                        }
                        break;
                    case 2:if(step.FX>0)step.FX-=n;break;
                    case 3:if(step.FXParam>0)step.FXParam-=n;break;
                }
            });
        },

        suppr:function(){
            console.log('suppr');   
            this.coords().forEach((c)=>{
                //console.log("x="+x,"y="+y);
                let step=AHX.Song.Tracks[phraseEditor.phraseNumber][c.y];
                switch(c.x){
                    case 0:step.Note=0;break;
                    case 1:step.Instrument=0;break;
                    case 2:step.FX=0;break;
                    case 3:step.FXParam=0;break;
                }
            });
        },
        setNote:function(note){
            if(this.x!=0)return;
            let step=AHX.Song.Tracks[phraseEditor.phraseNumber][this.y];
            let newnote=(note+1)+(phraseEditor.octave*12);
            if (!isNaN(newnote)) {
                step.Note=newnote;
                step.Instrument=phraseEditor.instrument;
                if(this.y<AHX.Song.TrackLength-1)this.y++;
            }
        },
        setValue:function(val){
            console.log('setValue()',val);
            let step=AHX.Song.Tracks[phraseEditor.phraseNumber][this.y];
            switch(this.x){
                case 1:
                    step.Instrument=val;
                    phraseEditor.setInstrument(val);
                    break;
                case 2:
                    step.FX=val;
                    break;
                case 3:
                    step.FXParam=val;
                    break;

            }
        },
        backspace:function(){
            let step=AHX.Song.Tracks[phraseEditor.phraseNumber][this.y];
            step.Note=0;
            step.Instrument=0;
            if(this.y>0)this.y--;  
        },
        hit:function(x,y){
            if(x >= this.x && x <= this.x+this.w && y >= this.y && y <=this.y+this.h){
                return true;
            }
            return false;
        },
        coords:function(){
            let list=[];
            for(let y=this.y;y<=this.y+this.h;y++){
                for(let x=this.x;x<=this.x+this.w;x++){
                    list.push({'x':x,'y':y});
                }
            }
            return list;
        }
    },

    main:function(){
        frame().clear();
        this.navbar();
        this.phrase();
        
        switch(this.cursor.x){
            case 0://note
                break;

            case 1:
                this.instruments();break;
            
            case 2://command
            case 3://command value
                phraseEditor.setInstrument(1);
                this.commands();break;
        }
        
    },

    navbar:function(){//top navbar
        
        let A=ascii().color(15);        
        line(0,0,cols(),0,160,1);
        line(0,1,cols(),1,119,15);       
        A.pos(0,0).invert().write(AHX.songTitle().toUpperCase(),1);//TITLE
        A.invert(false);        
        A.pos(0,2).write("PHRASE:",1);        
        A.pos(0,3).write(" #"+this.phraseNumber,1).write("/" + (AHX.Song.Tracks.length-1), 15);        
        
        //A.pos(23,0).write("KEYB.OCTAVE #"+this.cursor.octave,1);        
        //Current SONG Position 
        A.pos(74,0).write(String(AHX.Master.Output.Player.PosNr).padStart(3,'0')+".").write(AHX.Master.Output.Player.NoteNr);
    },

   

    phrase:function(){
        let A=ascii().color(12);
        // Pattern position //
        let pnum=this.phraseNumber;
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
            
            //if(this.cursor.y==i && this.cursor.x==0)A.invert(true);
            A.invert(this.cursor.hit(0,i));
            A.write(midiNoteToString(step.Note-1));//Note  [0]
            
            A.invert(false).put(32,1);//space
            
            //if(this.cursor.y==i && this.cursor.x==1)A.invert(true);
            A.invert(this.cursor.hit(1,i));
            if(step.Instrument==0){
                A.write("--",11);//No instrument - [1]
            }else if(step.Instrument>AHX.Song.InstrumentNr+1){
                A.write(String(step.Instrument).padStart(2, '0'),2);//Instrumentnot found
            }else{
                A.write(String(step.Instrument).padStart(2, '0'));//Instrument    
            }
            

            A.invert(false).put(32,1);//space
            
            //Effect
            //if(this.cursor.y==i && this.cursor.x==2)A.invert(true);
            A.invert(this.cursor.hit(2,i));
            if(fx==0){
                A.write('-',11);
            }else{
                A.write(fx,14); //fx command 0-F - [2]
            }
            A.invert(false);

            //if(this.cursor.y==i && this.cursor.x==3)A.invert(true);
            A.invert(this.cursor.hit(3,i));
            if(fxParam==0){
                A.write('--',11); //Fx Param 00-FF     - [3]       
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
            A.pos(x, 4+i).write(i.toString(16).toUpperCase(),1).write(" " + cmds[i]);    
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
            if(i==phraseEditor.instrument){
                color=1;
            }else{
                color=12;
            }
            A.pos(x,i+2).write(String(i).padStart(2, '0'),color);            
            A.write(" "+inst.Name.toUpperCase(),color);        
        }
    },



    _pressedKey:{},
    
    keydown:function(ev){
        
        let c = ev.which;       
        
        if(c>=112&&c<=115){//F1-F4
            console.log("FKEY");
        }

        if(keyCTRL()){
            switch(c){
                
                case 37://Left
                    this.cursor.minus(1); 
                    break;
            
                case 39:                
                    this.cursor.plus(1);
                    break;
            
                case 38:
                    this.cursor.plus(10);
                    break;
                
                case 40:
                    this.cursor.minus(10);
                    break;   


                case 65://A                
                    this.cursor.selectAll();
                    break;

                case 67://C              
                    console.log("CTRL+C");
                    this.cursor.copy();
                    break;  


            }
            return;
        }
        
        switch(c){

            case 8://backspace
                //set to 0 and go back one step (TODO)
                this.cursor.backspace();
                break;

            case 13://return
                AHX.Editor.play();
                break;

            case 33://pgup - Previous phrase
                if(this.phraseNumber>0){
                    this.phraseNumber--;
                }
                break;
            
            case 34://pgdown - Next phrase
                if(this.phraseNumber<AHX.Song.Tracks.length-1){
                    this.phraseNumber++;
                }
                break;
            
            case 37://Left
                if(keyALT()){
                    AHX.Editor.gotoPage(2);
                    return;
                }
                this.cursor.left(); 
                break;
            
            case 39:
                
                if(keyALT()){
                    //forward instrument number
                    AHX.Editor.gotoPage(4);
                    return;
                }
                
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
                
                let note=keyCodeToMidiNote(c);
                this.cursor.setNote(note);
                
                let val=keyCodeToNumber(c);
                if(val>=0){
                    this.cursor.setValue(val);
                }
                console.log("Key:",c);
        }
    }
}


function keyCodeToNumber(c){//Keyboard number input
    switch (c){
        case 49://1
        case 97://1 - Keypad
            return 1;break;
        case 50:
        case 98:
            return 2;break;
        case 51:
        case 99:
            return 3;break;
        case 52:
        case 100:
            return 4;break;

        case 53:
        case 101:
            return 5;break;
        case 54:
        case 102:
            return 6;break;
        case 55:
        case 103:
            return 7;break;
        case 56:
        case 104:
            return 8;break;
        case 57:
        case 105:
            return 9;break;

        case 65://a
        case 66://b
        case 67://c
        case 68://d
        case 69://e
        case 70://f
            /* a-f */
            return c-65+10;
            break;
    }
    return -1;
}
