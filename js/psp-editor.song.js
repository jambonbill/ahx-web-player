//PSP-AHX SONG Editor
const songEditor={
   
    cursor:{
        x:0,//track
        y:0,
        w:0,//extend selection
        h:0,//extend selection

        reset:function(){
            //reset selection
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
            if(this.y<AHX.Song.PositionNr-1){
                this.y++;
            }
        },
        left:function(){
            if(keySHIFT()){
                if(this.w>0)this.w--;
                return;
            }
            if(this.x>0)this.x--;
        },
        
        right:function(){
            if(keySHIFT()){
                this.w++;
                return;
            }
            this.x++;
            if(this.x>3)this.x=0;
        },
        
        plus:function(){
            let tn=AHX.Song.Positions[this.y].Track[this.x];
            AHX.Song.Positions[this.y].Track[this.x]++;
        },
        
        minus:function(){
            let tn=AHX.Song.Positions[this.y].Track[this.x];
            if (tn>0) {
                AHX.Song.Positions[this.y].Track[this.x]--;    
            }            
        },
        
        suppr:function(){
            AHX.Song.Positions[this.y].Track[this.x]=0;
        }
    },
    
    clipboard:{
        //todo
    },

    main:function(){
        frame().clear();
        this.navbar();
        this.menu();
        this.song();
        this.instrumentPreview();
        debug();
    },

    navbar:function(){
         let A=ascii().color(15);
    
        // Show SONG Title
        line(0,0,cols(),0,160,1);
        line(0,1,cols(),1,119,15);
        
        A.pos(0,0).invert().write(AHX.songTitle().toUpperCase(),1);
       
        //MUTED//
        A.pos(13,0);
        for(let i=0;i<4;i++){
            if(!AHX.Master.Output.Player.Voices[i])continue;
            let on=AHX.Master.Output.Player.Voices[i].TrackOn;
            if(!on){
                A.write("[MUTE] ",1);
            }else{
                A.write("       ",1);
            }
        }
        //AHX.Master.Output.Player.VoiceToggle(0)
        
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
        A.pos(1,6).write(" SS").write(String(AHX.Song.SubsongNr).padStart(3, ' '));
        //A.pos(1,7).write("SSN").write(String(0).padStart(3, '0'));
        //A.pos(1,8).write("SSP").write(String(0).padStart(3, '0'));
        A.pos(1,8).write("SPEED:",11);
        A.pos(1,9).write("MUL").write(String(AHX.Song.SpeedMultiplier).padStart(3, ' '));
        A.pos(1,10).write("TPO").write(String(AHX.Master.Output.Player.Tempo).padStart(3, ' '));

        //kEYBOARD
        if(keySHIFT())A.pos(1,12).write("SHIFT");
        if(keyCTRL())A.pos(1,13).write("CTRL");
        if(keyALT())A.pos(1,14).write("ALT");
        
    },

    song:function(){
        
        let A=ascii().color(15);
            
        let pos=AHX.Master.Output.Player.PosNr;
        
        //draw a line at PosNr "if playing"
        //line(8, pos+2,48,pos+2,64, 2);//play position

        for(let i=0;i<rows()-2;i++){
            
            let prow=pos+i;//row preview
            let row=AHX.Song.Positions[i];
            let y=i+2;
            
            A.invert(false);            
            
            if(prow<0)continue;//?            
            
            if(row){
                A.pos(9,y).write(String(i).padStart(3, '0'),11);    
            }else{
                A.pos(9,y).write('---',11);
            }

            
            if(!row){
                A.write(" ---:-- ---:-- ---:-- ---:--",11);
                continue;    
            }
            
            for(let x=0;x<4;x++){//4 tracks       

                A.invert(false);
                
                let mute=false;
                //!AHX.Master.Output.Player.Voices[x].TrackOn;
                
                if(pos==i&&!mute){
                    A.put(93,1);// PIXEL Arrow show song position
                }else{
                    A.put(32);// space
                }

                //Invert Cursor Position (Pos/x)
                if(i==this.cursor.y && x==this.cursor.x){
                    A.invert(true);
                }

                if(row.Track[x]==0){//000
                    A.write(String(row.Track[x]).padStart(3, '0'),11);                       
                }else{
                    A.write(String(row.Track[x]).padStart(3, '0'));                       
                }
                
                
                if(row.Transpose[x]>0){
                    A.put(43,7);// PLUS
                    A.write(String(row.Transpose[x]).padStart(2, '0'));
                }else if(row.Transpose[x]<0){
                    A.put(45,7);// MINUS
                    A.write(String(Math.abs(row.Transpose[x])).padStart(2, '0'));
                }else{
                    //no transpose value
                    A.write(":--",11);
                }
                //A.write(" ");
            }
        }
    },

    instrumentPreview:function(){    
        let A=ascii();
        let x=50;
        A.pos(x,2).write("-- INSTRUMENTS --------------");        
        // List instruments    
        for(let i=1;i<AHX.Song.Instruments.length;i++){
            let inst=AHX.Song.Instruments[i];
            if(i==AHX.Editor.instnum){
                A.pos(x,i+2).write(String(i).padStart(2, '0'), 1);            
            }else{
                A.pos(x,i+2).write(String(i).padStart(2, '0'));            
            }
            A.write(" "+inst.Name.toUpperCase(),12);        
        }
    },
    
    _pressedKeys:{},
    
    keydown:function(ev){
        let c = ev.which;
        
        this._pressedKeys[c] = true;//capture special keys
        let SHIFT=this._pressedKeys[16];
        let CTRL=this._pressedKeys[17];
        let ALT =this._pressedKeys[18];
        
        switch (c) {
            
            case 13:
                //Play at Cursor Position
                console.log('Play at cursor pos');
                AHX.Editor.play();
                AHX.Master.Output.Player.PosNr=this.cursor.y;
                break;

            case 37:this.cursor.left(); break;
            case 39:this.cursor.right();break;
            
            case 38:this.cursor.up();   break;
            case 40:this.cursor.down(); break;        
            
            case 46://suppr
                this.cursor.suppr();break;        

            //+/-
            case 107:this.cursor.plus();break;
            case 109:this.cursor.minus();break;
            
            default:
                console.log("key",c);
                break;
        }      
        
    },

    keyup:function(ev){
        //todo release pressed keys
    }

}




function debug(){
    let p=64+cols()*44;
    for(let i=0;i<16;i++)poke(p+i,[250,i]);
}