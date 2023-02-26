// PSP-AHX Config/Tool screen

const config={
   
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
        this.params();
    },

    navbar:function(){
        let A=ascii().color(15);
        line(0,0,cols(),0,160,1);
        line(0,1,cols(),1,119,15); 
        A.pos(0,0).invert().write(AHX.songTitle().toUpperCase(), 1);//TITLE
    },


    params:function(){
        let A=ascii().color(15);
        A.pos(0,2).write("CONFIG PAGE", 1);
        
        A.pos(1,4).write("NAME  : ").write(AHX.songTitle().toUpperCase(),1);
        //
        A.pos(1,6).write("TRKLEN: ").write(AHX.Song.TrackLength,1);
        //
        A.pos(1,8).write("MULTI : ").write(AHX.Song.SpeedMultiplier,1);
        //A.pos(1,7).write("TEMPO:").write();//BPM depend on song
        
    },
   


    
    keydown:function(ev){
        let c = ev.which;
           
        switch (c) {

            case 37://left
                break;
                
            case 39://right
                if(keyALT()){
                    AHX.Editor.gotoPage(2);
                    return;
                }
                //this.cursor.right();
                break;            
            
            case 38:
                //this.cursor.up();
                break;
            
            case 40:
                //this.cursor.down();
                break; 
          
            default:
                console.log("key",c);
                break;
        }      
        
    }
}
