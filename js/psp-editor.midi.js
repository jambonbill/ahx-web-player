//PSP-AHX MIDI(IN) Page
const editorMIDI={
   
    cursor:{
        x:0,//track
        y:0,
        w:0,//extend selection
        h:0,//extend selection

        up:function(){
            //
        },
        down:function(){
        },
        left:function(){
            //
        },
        right:function(){
            //
        },
        plus:function(){
            //
        },
        minus:function(){
            //            
        },
        suppr:function(){
            //
        }
    },
    

    main:function(){
        frame().clear();
        this.navbar();
        this.menu();
        //debug();
    },

    navbar:function(){
         let A=ascii().color(15);
    
        // Show SONG Title
        line(0,0,cols(),0,160,1);
        line(0,1,cols(),1,119,15);
        
        A.pos(0,0).invert().write(AHX.songTitle().toUpperCase(),1);
       
        //Current SONG Position 
        A.pos(74,0).write("MIDI IN");

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
        
    },


    keydown:function(ev){
        let c = ev.which;
        
        this._pressedKeys[c] = true;//capture special keys
        let SHIFT=this._pressedKeys[16];
        let CTRL=this._pressedKeys[17];
        let ALT =this._pressedKeys[18];
        
        switch (c) {
            case 37:this.cursor.left(); break;
            case 39:this.cursor.right();break;            
            case 38:this.cursor.up();   break;
            case 40:this.cursor.down(); break;        
            case 46:this.cursor.suppr();break;//suppr
            case 107:this.cursor.plus();break;// +
            case 109:this.cursor.minus();break;// -
            
            default:
                console.log("key",c);
                break;
        }      
        
    },

    keyup:function(ev){
        //todo release pressed keys
    }
}