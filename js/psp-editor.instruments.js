//PSP-AHX - Instruments
const instrumentEditor={


    instnum:1,//current Instrument
    
    setInstrument:function(n){
        this.instnum=n;//controls later
    },

    cursor:{
        x:0,
        y:0,
        up:function(){
            if(this.y>0)this.y--;
        },
        down:function(){
            this.y++;
        },
        left:function(){
            if(this.x>0)this.x--;
        },
        right:function(){
            this.x++;
        },
        plus:function(){
            //value++
            console.log('++');
        },
        minus:function(){
            //value--
            console.log('--');
        }
    },


    
    main:function(){
        frame().clear();
        this.navbar();
        this.list();
        this.editor();
        //this.plist();
        this.help();
    },

    navbar:function(){        
        let A=ascii().color(11);    
        line(0,0,cols(),0,160,1);
        line(0,1,cols(),1,119,15);
        A.pos(0,0).invert().write(AHX.songTitle().toUpperCase(),1);//TITLE
        
        //Instrument Number
        A.pos(25, 0).write("[INSTR #"+this.instnum+"]",1);

        let cur=instrumentEditor.cursor;
        A.pos(35, 0).write("X="+cur.x,1).write("/Y="+cur.y,1);


        A.pos(0,2).invert(false).write("INSTRUMENTS",15);
        
        
    },

    list:function(){
        //list song instrumnents on the left
        let A=ascii().color(11);
        // List instruments
        for(let i=1;i<45;i++){
            let inst=AHX.Song.Instruments[i];
            
            if (!inst) {
                //A.pos(0,i+1).write('--').put(66);   
                continue;
            }
            
            if(i==this.instnum){
                A.pos(0,i+2).write(String(i).padStart(2, '0'), 1);                 
            }else{
                A.pos(0,i+2).write(String(i).padStart(2, '0'));                 
            }
            
            A.put(66); 
            if(i==this.instnum){
                A.write(inst.Name.toUpperCase(),1);
            }else{
                A.write(inst.Name.toUpperCase());
            }        
        }
    },

    editor:function(){

        //fix instnum out of range
        if(this.instnum>AHX.Song.Instruments.length-1){
            this.instnum=1;//reset
        }

        //main instrument editor
        let A=ascii().color(11);         
        
        //x position
        let x=25;
        //Vertical Line
        line(x-1, 2,x-1, 44,66,15);
        line(x+10,2,x+10,44,66,15);
        
        
        
        //let ins=1;//Current Instrument
        let I=AHX.Song.Instruments[this.instnum];
        if(!I)return;

        let E=null;//Envelope
        if(I&&I.Envelope)E=I.Envelope;
        
        //Main
        A.pos(x, 2).write("GLOBAL",14);//I.Volume
        A.pos(x, 3).write("----------",11);//LINE
        A.pos(x, 4).write("VOLUME  ").write(String(I.Volume).padStart(2, '0'), 15);//I.Volume
        A.pos(x, 5).write("WAVELEN ").write(String(I.WaveLength).padStart(2, '0'), 15);//I.WaveLength
        
        // Envelope
        if (E) {
            A.pos(x, 7).write("ENVELOPE  ",14);
            A.pos(x, 8).write("----------",11);
            A.pos(x, 9).write("ATTACK ").write(String(E.aFrames).padStart(3, '0'),15);//E.aFrames
            A.pos(x,10).write("VOLUME  ").write(String(E.aVolume).padStart(2, '0'),15);//E.aVolume
            A.pos(x,11).write("DECAY  ").write(String(E.dFrames).padStart(3, '0'),15);//E.dFrames
            A.pos(x,12).write("VOLUME ").write(String(E.dVolume).padStart(3, '0'),15);//E.dVolume
            A.pos(x,13).write("SUSTAIN").write(String(E.sFrames).padStart(3, '0'),15);//E.sFrames
            A.pos(x,14).write("RELEASE").write(String(E.rFrames).padStart(3, '0'),15);//E.rFrames
            A.pos(x,15).write("VOLUME  ").write(String(E.rVolume).padStart(2, '0'),15);//E.rVolume
        }

        // Vibrato
        A.pos(x,17).write("PITCH.MOD" ,14);
        A.pos(x,18).write("----------",11);
        A.pos(x,19).write("DELAY  ").write(String(I.VibratoDelay).padStart(3, '0'),15);//I.VibratoDelay
        A.pos(x,20).write("DEPTH  ").write(String(I.VibratoDepth).padStart(3, '0'),15);//I.VibratoDepth
        A.pos(x,21).write("SPEED   ").write(String(I.VibratoSpeed).padStart(2, '0'),15);//I.VibratoSpeed
        
        // Square
        A.pos(x,23).write("SQUARE.MOD",14);
        A.pos(x,24).write("----------",11);
        A.pos(x,25).write("LOWER  ").write(String(I.SquareLowerLimit).padStart(3, '0'),15);//I.SquareLowerLimit
        A.pos(x,26).write("UPPER  ").write(String(I.SquareUpperLimit).padStart(3, '0'),15);//I.SquareUpperLimit
        A.pos(x,27).write("S.SPD  ").write(String(I.SquareSpeed).padStart(3, '0'),15);//I.SquareSpeed
        
        // Filter
        A.pos(x,29).write("FILTER    ",14);
        A.pos(x,30).write("----------",11);
        A.pos(x,31).write("LOWER  ").write(String(I.FilterLowerLimit).padStart(3, '0'),15);//I.FilterLowerLimit
        A.pos(x,32).write("UPPER  ").write(String(I.FilterUpperLimit).padStart(3, '0'),15);//I.FilterUpperLimit
        A.pos(x,33).write("F.SPD  ").write(String(I.FilterSpeed).padStart(3, '0'),15);//I.FilterSpeed

        this.plist();
    },

    
    plist:function(){
        //Current instrument sequence/steps
        let x=40;
        let I=AHX.Song.Instruments[this.instnum];
        
        if(!I)return;
        //if(!I.Plist)return;
        

        
        if(I.PList.Entries.length<1){
           return;
        } 
        
        let A=ascii().color(11); 
        
        A.pos(x,2);
        A.write("STP",1).put(66,11);
        A.write("NOTE",1).put(66);
        A.write("W",1).put(66);
        A.write("FX1",1).put(66);
        A.write("FX2",1);
        A.pos(x,3).write("---");
        A.put(91);
        A.write("----");
        A.put(91);
        A.write("-");
        A.put(91);
        A.write("---");
        A.put(91);
        A.write("---");
        
        for(let i=0;i<45;i++){
            //I.PList.Entries.length
            let Entry=I.PList.Entries[i];
            if(!Entry){
                A.pos(x,i+3).write("---")
                A.put(66);
                A.write("--- ");
                A.put(66);
                A.write("-");
                A.put(66);
                A.write("---");
                A.put(66);
                A.write("---");
                continue;
            }
            A.pos(x,i+4).write(String(i).padStart(3, '0'));        
            //A.write(i);       
            A.put(66);
            //A.write("---");     
            A.write(midiNoteToString(Entry.Note-1));
            A.put(90);//FIXED ?
            A.put(66);
            A.write(Entry.Waveform);//Waveform
            A.put(66);        
            A.write(Entry.FX[0]); //FX1
            let hex=Entry.FXParam[0].toString(16);
            A.write(String(hex).padStart(2,'0'));//PARAM
            A.put(66);        
            A.write(Entry.FX[1]); //FX2
            hex=Entry.FXParam[1].toString(16);
            A.write(String(hex).padStart(2,'0'));//PARAM
        }   
    },

    help:function(){
        let x=68;
        let y=2;
        let A=ascii().pos(x,y).color(11);
        
        //Vertical line
        line(x-1,2,x-1,44,66,12);

        //Waveforms
        A.pos(x,y+0).write("WAVEFORMS",1);
        A.pos(x,y+1).write("-----------");
        A.pos(x,y+2).write("0:HOLD WAVE");
        A.pos(x,y+3).write("1:TRIANGLE ");
        A.pos(x,y+4).write("2:SAWTOOTH ");
        A.pos(x,y+5).write("3:SQUARE   ");
        A.pos(x,y+6).write("4:WH.NOISE ");
        A.pos(x,y+7).write("*:FIXED    ");
        
        //Commands
        A.pos(x,y+10).write("COMMANDS",1);
        A.pos(x,y+11).write("-----------");
        A.pos(x,y+12).write("0:INIT.FILT");
        A.pos(x,y+13).write("1:SLIDE UP ");
        A.pos(x,y+14).write("2:SLIDE DN ");
        A.pos(x,y+15).write("3:INIT SQR ");
        A.pos(x,y+16).write("4:TOGGLEMOD");
        A.pos(x,y+17).write("5:JUMP2STEP");
        A.pos(x,y+18).write("C:VOLUME   ");
        A.pos(x,y+19).write("F:SPEED    ");
        
        //Keyboard
        A.pos(x,y+24).write("KEYBOARD",1);
        A.pos(x,y+25).write("-----------");
        A.pos(x,y+26).write("PGUP:PREV  ");
        A.pos(x,y+27).write("PGDN:NEXT  ");
        
    },


    keydown:function(ev){//keyboard events are forwarded here when displayed
        let c = ev.which;
        //console.log(ev);
        
        switch(c){
            case 33://pgup - Previous Inst
                if(this.instnum>1)this.instnum--;
                break;
            
            case 34://pgdown - Next Inst
                this.instnum++;
                break;

            case 37://Left
                if(keyALT()){
                    AHX.Editor.page=1;
                    return;
                }
                break;
            
            case 39://right                
                if(keyALT()){
                    //AHX.Editor.page=2;
                    return;
                }                
                break;

            case 38:this.cursor.up();   break;
            case 40:this.cursor.down(); break;        
            

            case 46://suppr
                this.cursor.suppr();break;        

            case 107:this.cursor.plus();break;
            case 109:this.cursor.minus();break;

            default:
             console.log('instr.key',c);
        }
        
    }
}