//PSP-AHX SONG Editor
const songEditor={
    
    init:function(){
        this.cursor.init();
    },

    cursor:{
        x:0,//track
        y:0,
        w:0,//extend selection
        h:0,//extend selection
        songScroll:0,

        init:function(){
            this.x=0;
            this.y=0;
            this.w=0;
            this.h=0;
        },
        reset:function(){
            //reset selection
            if(this.y>AHX.Song.PositionNr-1){
                this.x=0;
                this.y=0;
            }
            this.w=0;
            this.h=0;            
            this.setTrack();
        },
        selectAll:function(){
            this.x=0;
            this.y=0;
            this.w=4;
            this.h=AHX.Song.PositionNr-1;
        },
        setTrack:function(){//read cursor coords, and set the current Track number 
            //AHX.Song.Positions[this.y].Track[x];
            phraseEditor.setPhrase(AHX.Song.Positions[this.y].Track[this.x]);
        },
        up:function(){
            if(keySHIFT()){
                if(this.h>0)this.h--;
                return;
            }
            if(this.y>0){
                this.y--;
                this.reset();
            }
        },
        
        down:function(){
            if(keySHIFT()){
                this.h++;
                return;
            }
            if(this.y<AHX.Song.PositionNr-1){
                this.y++;
                this.reset();
            }
            if(this.y>42){
                this.songScroll++;
            }
        },
        left:function(){
            if(keySHIFT()){
                if(this.w>0)this.w--;
                return;
            }
            
            if(this.x>0){
                this.x--;                
            }
            this.reset();
        },
        
        right:function(){
            if(keySHIFT()){
                this.w++;
                return;
            }
            
            if(this.x<3)this.x++;
            if(this.x>3)this.x=0;//unnecessary
            this.reset();
        },
        
        plus:function(n){//increment value
            if(!n)n=1;
            this.coords().forEach(c=>{
                let track=AHX.Song.Positions[c.y].Track[c.x];
                if(track<AHX.Song.TrackNr){
                    AHX.Song.Positions[c.y].Track[c.x]+=n;
                }else{
                    console.log("Must create new track #"+AHX.Song.TrackNr);
                }
            });
        },
        
        minus:function(n){
            if(!n)n=1;
            let tn=AHX.Song.Positions[this.y].Track[this.x];
            if (tn>0) {
                AHX.Song.Positions[this.y].Track[this.x]-=n;
                if(AHX.Song.Positions[this.y].Track[this.x]<0)AHX.Song.Positions[this.y].Track[this.x]=0;
            }            
        },
        cut:function(){
            this.copy();
        },
        copy:function(){
            //todo
            console.log('copy selection');
            this.coords().forEach((coord)=>{
                //read value at coord
                //
            });
            //send to clipboard
        },
        paste:function(){
            //todo
        },
        suppr:function(){
            console.log(this.coords());
            this.coords().forEach(c=>{
                AHX.Song.Positions[c.y].Track[c.x]=0;    
                AHX.Song.Positions[c.y].Transpose[c.x]=0;    
            });
            
        },
        hit:function(x,y){// hit test (colision)
            if(x >= this.x && x <= this.x+this.w && y >= this.y && y <=this.y+this.h){
                return true;
            }
            return false;
        },
        coords:function(){//return list of selection x/y coordinates
            let list=[];
            for(let y=this.y;y<=this.y+this.h;y++){
                for(let x=this.x;x<=this.x+this.w;x++){
                    list.push({'x':x,'y':y});
                }
            }
            return list;
        }
    },
    
    clipboard:{
        //todo
    },

    main:function(){
        frame().clear();        
        this.navbar();
        this.song();
        //this.instrumentPreview();        
        //debug();
    },

    navbar:function(){
        let A=ascii().color(15);
        // Show SONG Title
        line(0,0,cols(),0,160,1);
        line(0,1,cols(),1,119,15);
        
        A.pos(0,0).invert().write(AHX.songTitle().toUpperCase(),1);//TITLE
        A.pos(0,2).invert(false).write("SONG:",1);
       
        //MUTED//
        /*
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
        */ 
        //Current SONG Position 
        A.invert(true);
        A.pos(74,0).write(String(AHX.Master.Output.Player.PosNr).padStart(3,'0')+".").write(AHX.Master.Output.Player.NoteNr);

    },


    song:function(){/*display song sequence */
        
        let A=ascii().color(15);            
        let pos=AHX.Master.Output.Player.PosNr;
        let max=AHX.Song.TrackNr;
       
        for(let i=0;i<AHX.Song.Positions.length;i++){

            let prow=pos+i;//row preview
            let row=AHX.Song.Positions[i];
            let y=i+2;
            
            A.invert(false);            
            
            if(prow<0)continue;//?            
            
            if(row){
                A.pos(9,y).write(String(i).padStart(3, '0'),11);    
            }else{
                A.pos(9,y).write('   ',11);
            }

            
            if(!row){
                continue;    
            }
            
            //let playing=AHX.Master.Playing();//marche pas bien, todo
            
            for(let x=0;x<4;x++){//4 tracks
                
                let mute=false;
                //!AHX.Master.Output.Player.Voices[x].TrackOn;
                
                if(pos==i){
                    let on=false;
                    if(AHX.Master.Output.Player.Voices[x]&&AHX.Master.Output.Player.Voices[x].TrackOn){
                        on=true;
                    }
                    if(on){
                        A.put(93,1);// PIXEL Arrow show song position
                    }else{
                        A.put(93,11);//Muted
                    }
                }else{
                    A.put(32);// space
                }

                if(this.cursor.hit(x,i)){
                    A.invert(true);   
                }

                let hex=row.Track[x].toString(16).toUpperCase();
                if(row.Track[x]==0){//000
                    A.write(String(hex).padStart(2, '0'),11);                       
                }else if(row.Track[x]>AHX.Song.TrackNr){//out of range
                    A.write(String(hex).padStart(2, '0'),2);//RED   
                }else{
                    A.write(String(hex).padStart(2, '0'));                       
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

                A.invert(false);//unselect
            }
        }
    },

    
    instrumentPreview:function(){/* need graphical improvement */    
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
    

    

    keydown:function(ev){
        let c = ev.which;
        console.log('keydown');
        

        if(keyCTRL()){
            switch(c){
                
                case 37:
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
            


                case 46://Ctrl+Suppr
                    console.log('delete row #'+this.cursor.y);
                    AHX.Song.Positions.splice(this.cursor.y, 1);
                    //Adjust Song length
                    AHX.Song.PositionNr=AHX.Song.Positions.length;//is it correct ?
                    //make sure cursor is visible
                    if(this.cursor.y>=AHX.Song.PositionNr)this.cursor.y=AHX.Song.PositionNr-1;
                    break;
                
                case 65://Ctrl+A - SelectAll
                    this.cursor.selectAll();
                    //ex.preventDefault();
                    break;

                case 67://Ctrl+C
                    this.cursor.copy();
                    break;

                case 68://D - Duplicate row
                    console.log('duplicate row #'+this.cursor.y);
                    let row=AHX.Song.Positions[this.cursor.y];
                    //let identity = (x) => x;
                    //console.log(row.map(identity));
                    AHX.Song.Positions.splice(this.cursor.y, 0, JSON.parse(JSON.stringify(row)));//deep clone
                    
                    //Adjust Song length
                    AHX.Song.PositionNr=AHX.Song.Positions.length;//correct

                    
                    ev.preventDefault();
                    break;

                case 86://Ctrl+V
                    this.cursor.paste();
                    break;

                case 97:
                case 98:
                case 99:
                case 100:
                    console.log("MUTE#",c-97);
                    break;

            }
            return;
        }

        switch (c) {
            
            case 13:
                //Play at Cursor Position
                console.log('Play at cursor pos');
                AHX.Editor.play();
                AHX.Master.Output.Player.PosNr=this.cursor.y;
                break;

            case 33://pgup
                if (this.cursor.songScroll>0) {
                    this.cursor.songScroll--;
                }
                break;
            
            case 34://pgdn
                this.cursor.songScroll++;
                break;

            case 37:
                if(keyALT()){
                    AHX.Editor.gotoPage(1);
                    return;
                }
                this.cursor.left(); break;
            case 39:
                if(keyALT()){
                    AHX.Editor.gotoPage(3);
                    return;
                }
                this.cursor.right();
                break;            
            
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
        
    }
}


function debug(){
    let p=64+cols()*44;
    for(let i=0;i<16;i++)poke(p+i,[250,i]);
}