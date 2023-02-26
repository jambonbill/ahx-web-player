//PSP-AHX - Instrument Wavetable
const wavetableEditor={


   
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
        this.instrumentList();
        //this.editor();
        this.wavetable();
        this.help();
    },

    navbar:function(){        
        let A=ascii().color(11);    
        line(0,0,cols(),0,160,1);
        line(0,1,cols(),1,119,15);
        A.pos(0,0).invert().write(AHX.songTitle().toUpperCase(),1);//TITLE
        
       

        A.pos(30,0).write("WAVETABLE",1);
        
        
    },

    instrumentList:function(){
        //list song instrumnents on the left
        let A=ascii().color(11);
        // List instruments
        for(let i=1;i<45;i++){
            let inst=AHX.Song.Instruments[i];
            
            if (!inst) {
                //A.pos(0,i+1).write('--').put(66);   
                continue;
            }
            
            if(i==instrumentEditor.instnum){
                A.pos(0,i+2).write(String(i).padStart(2, '0'), 1);                 
            }else{
                A.pos(0,i+2).write(String(i).padStart(2, '0'));                 
            }
            
            A.put(66); 
            if(i==instrumentEditor.instnum){
                A.write(inst.Name.toUpperCase(),1);
            }else{
                A.write(inst.Name.toUpperCase());
            }        
        }
    },
    

    
    wavetable:function(){
        //Current instrument sequence/steps
        let x=40;
        let I=AHX.Song.Instruments[instrumentEditor.instnum];
        
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
                A.color(11);
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
            A.write(midiNoteToString(Entry.Note-1),12);
            A.put(90);//FIXED ?
            A.put(66);
            A.write(Entry.Waveform,12);//Waveform
            A.put(66);        
            A.write(Entry.FX[0],12); //FX1
            let hex=Entry.FXParam[0].toString(16).toUpperCase();
            A.write(String(hex).padStart(2,'0'),12);//PARAM
            A.put(66);        
            A.write(Entry.FX[1],12); //FX2
            hex=Entry.FXParam[1].toString(16).toUpperCase();
            A.write(String(hex).padStart(2,'0'),12);//PARAM
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
    },


    keydown:function(ev){//keyboard events are forwarded here when displayed
        let c = ev.which;
        //console.log(ev);
        
        switch(c){
           

            case 37://Left
                if(keyALT()){
                    AHX.Editor.gotoPage(4);
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