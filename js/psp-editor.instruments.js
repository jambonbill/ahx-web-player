//PSP-AHX - Instruments Editor

const itms=[];
//itms.push(["NAME","key",yposition]);

// GLOBAL
itms.push(["VOLUME","I.Volume",4]);
itms.push(["WAVELEN","I.WaveLength",5]);
// Envelope
itms.push(["ATTACK","E.aFrames",9]);
itms.push(["VOLUME","E.aVolume",10]);
itms.push(["DECAY","E.dFrames",11]);
itms.push(["VOLUME","E.dVolume",12]);
itms.push(["SUSTAIN","E.sFrames",13]);
itms.push(["RELEASE","E.rFrames",14]);
itms.push(["VOLUME","E.rVolume",15]);

// Vibrato/Pitch.modulation
itms.push(["DELAY","I.VibratoDelay",19]);
itms.push(["DEPTH","I.VibratoDepth",20]);
itms.push(["SPEED","I.VibratoSpeed",21]);

// Square Modulation
itms.push(["LOWER","I.SquareLowerLimit",25]);
itms.push(["UPPER","I.SquareUpperLimit",26]);
itms.push(["S.SPD","I.SquareSpeed",27]);
//A.pos(x,25).write("LOWER  ").write(String(I.SquareLowerLimit).padStart(3, '0'),15);//I.SquareLowerLimit
//A.pos(x,26).write("UPPER  ").write(String(I.SquareUpperLimit).padStart(3, '0'),15);//I.SquareUpperLimit
//A.pos(x,27).write("S.SPD  ").write(String(I.SquareSpeed).padStart(3, '0'),15);//I.SquareSpeed

// Filter
itms.push(["LOWER","I.FilterLowerLimit",31]);
itms.push(["UPPER","I.FilterUpperLimit",32]);
itms.push(["F.SPD","I.FilterSpeed",33]);
//A.pos(x,31).write("LOWER  ").write(String(I.FilterLowerLimit).padStart(3, '0'),15);//I.FilterLowerLimit
//A.pos(x,32).write("UPPER  ").write(String(I.FilterUpperLimit).padStart(3, '0'),15);//I.FilterUpperLimit
//A.pos(x,33).write("F.SPD  ").write(String(I.FilterSpeed).padStart(3, '0'),15);//I.FilterSpeed


const instrumentEditor={

    instnum:1,//current Instrument
    
    init:function(){
        this.instnum=1;
        this.cursor.init();
    },

    setInstrument:function(n){//set current inst number
        this.instnum=n;//todo controls later
    },

    cursor:{
        x:0,
        y:0,
        init:function(){
            this.x=0;
            this.y=0;
        },
        up:function(){
            if(this.y>0)this.y--;
        },
        down:function(){
            if(this.y<17)this.y++;
        },
        left:function(){
            if(this.x>0)this.x--;
        },
        right:function(){
            this.x++;
        },
        plus:function(){
            //value++
            let itm=itms[this.y];
            console.log('++',itm[0]);
            instrumentEditor.setValue(this.y,1);
        },
        minus:function(){
            //value--
            let itm=itms[this.y];
            console.log('--',itm[0]);
            instrumentEditor.setValue(this.y,-1);
        }
    },
    
    main:function(){
        frame().clear();
        this.navbar();
        this.list();
        this.editor();
        this.wavetable();
        //this.help();
    },

    navbar:function(){        
        let A=ascii().color(11);    
        line(0,0,cols(),0,160,1);
        line(0,1,cols(),1,119,15);
        A.pos(0,0).invert().write(AHX.songTitle().toUpperCase(),1);//TITLE
        
        //Instrument Number
        A.pos(25, 0).write("[INSTR #"+this.instnum+"]",1);

        let cur=instrumentEditor.cursor;
        A.pos(35, 0).write("X"+cur.x,1).write("/Y"+cur.y,1);


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
    /*
    editor:function(){//old version

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
    */
    
    editor:function(){
        
        //main instrument editor
        let A=ascii().color(12);         
        
        //x position
        let x1=25;
        let x2=35;

        //GROUPS
        A.pos(x1, 2).write("GLOBAL",14);
        A.pos(x1, 7).write("ENVELOPE  ",14);
        A.pos(x1,17).write("PITCH.MOD" ,14);
        A.pos(x1,23).write("SQUARE.MOD",14);
        A.pos(x1,29).write("FILTER    ",14);

        let I=AHX.Song.Instruments[this.instnum];
        if(!I)return;
        let E=null;//Envelope
        if(I&&I.Envelope)E=I.Envelope;


        itms.forEach(function(itm,i){
            let selected=false;
            if(i==instrumentEditor.cursor.y)selected=1;
            // Property name
            A.pos(x1,itm[2]).write(itm[0],selected);
            
            A.invert(i==instrumentEditor.cursor.y);
            
            // Value
            let val=eval(itm[1]);
            A.pos(x2,itm[2]).write(val,1);

            A.invert(false);
        });
    },

    setValue:function(y,amount){
        let I=AHX.Song.Instruments[this.instnum];
        if(!I)return;
        let E=null;//Envelope
        if(I&&I.Envelope)E=I.Envelope;
        
        // Value
        let itm=itms[y];
        let val=eval(itm[1]);
        //val+=amount;//add amount
        eval(itm[1] + "+="+amount);//ca marche mais c'est crade. il faudrait aussi observer les limites
        //x+=amount;//add amount
    },

    
    wavetable:function(){//wavetable
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
        A.write("STP").put(66,11);
        A.write("NOTE").put(66);
        A.write("W").put(66);
        A.write("FX1").put(66);
        A.write("FX2");
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
            let hex=Entry.FXParam[0].toString(16).toUpperCase();
            A.write(String(hex).padStart(2,'0'));//PARAM
            A.put(66);        
            A.write(Entry.FX[1]); //FX2
            hex=Entry.FXParam[1].toString(16).toUpperCase();
            A.write(String(hex).padStart(2,'0'));//PARAM
        }   
    },

    help:function(){
        let x=68;
        let y=2;
        let A=ascii().pos(x,y).color(11);
        
        //Vertical line
        line(x-1,2,x-1,44,66,12);
        
        //Keyboard
        A.pos(x,y+0).write("KEYBOARD",1);
        A.pos(x,y+1).write("-----------");
        A.pos(x,y+2).write("PGUP:PREV  ");
        A.pos(x,y+3).write("PGDN:NEXT  ");
        A.pos(x,y+4).write("F2  :NEW INST");
        
    },

    keydown:function(ev){//keyboard events are forwarded here when displayed
        let c = ev.which;
        //console.log(ev);
        if(keyCTRL()){
            console.log("CTRL+",c);
            ev.preventDefault();
            return;
        }


        switch(c){
            case 33://pgup - Previous Inst
                if(this.instnum>1)this.instnum--;
                break;
            
            case 34://pgdown - Next Inst
                if(this.instnum<AHX.Song.Instruments.length-1)this.instnum++;
                break;

            case 37://Left
                if(keyALT()){
                    AHX.Editor.gotoPage(3);
                    return;
                }
                break;
            
            case 39://right                
                if(keyALT()){
                    AHX.Editor.gotoPage(5);
                    return;
                }                
                break;

            case 38:this.cursor.up();   break;
            case 40:this.cursor.down(); break;        
            

            case 46://suppr
                this.cursor.suppr();break;        

            case 107:this.cursor.plus();break;
            case 109:this.cursor.minus();break;

            case 113://F2
                //new instrument
                AHX.newInstrument();
                break; 

            default:
             console.log('instr.key',c);
        }
        
    }
}