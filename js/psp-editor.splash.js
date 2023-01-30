//PSP-AHX Splash screen
const splash={
   
    cursor:{
        x:0,//track
        y:0,
        w:0,//extend selection
        h:0,//extend selection

        up:function(){
            if(this.y>0)this.y--
        },
        down:function(){
            if(this.y<AHX.Song.PositionNr-1){
                this.y++;
            }
        },
        left:function(){
            if(this.x>0)this.x--;
        },
        right:function(){
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
    
    
    main:function(){
        frame().clear();
        this.navbar();
        this.logo();
        debug();
    },

    navbar:function(){
         let A=ascii().color(15);
    
        // Show SONG Title
        line(0,0,cols(),0,160,1);
        line(0,1,cols(),1,119,15);
        
        A.pos(0,0).invert().write("PHX",1);//PETSCII Highest Xperience
       
        //Current SONG Position 
        //A.pos(74,0).write(String(AHX.Master.Output.Player.PosNr).padStart(3,'0')+".").write(AHX.Master.Output.Player.NoteNr);

    },

   

    logo:function(){
        
        let A=ascii().color(15);
            
        
    },

    
    
    _pressedKeys:{},
    
    keydown:function(ev){
        let c = ev.which;
        
        this._pressedKeys[c] = true;//capture special keys
        let SHIFT=this._pressedKeys[16];
        let CTRL=this._pressedKeys[17];
        let ALT =this._pressedKeys[18];
        
        switch (c) {
          
            default:
                console.log("key",c);
                break;
        }      
        
    },

    keyup:function(ev){
        //todo release pressed keys
    }

}
