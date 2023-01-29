//PSP-AHX SONG Editor
let songEditor={
   
    cursor:{
        x:0,//track
        y:0,
    },

    main:function(){
        frame().clear();
        this.navbar();
        this.menu();
        this.song();
        this.instrumentPreview();
    },

    navbar:function(){
         let A=ascii().color(15);
    
        // Show SONG Title
        line(0,0,cols(),0,160,1);
        line(0,1,cols(),1,119,15);
        
        A.pos(0,0).invert().write(AHX.songTitle().toUpperCase(),1);
       
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
            
            A.pos(9,y).write(String(i).padStart(3, '0'),11);    
            
            /*
            if(pos==i){
                A.pos(9,y).write(String(i).padStart(3, '0'), 1);
            }else{
                A.pos(9,y).write(String(i).padStart(3, '0'),11);    
            }
            */
            if(!row){
                A.write(" ---:--  ---:--  ---:--  ---:-- ",11);
                continue;    
            }
            
            for(let x=0;x<4;x++){//4 tracks       

                A.invert(false);
                
                if(pos==i){
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
                    A.put(43);// PLUS
                    A.write(String(row.Transpose[x]).padStart(2, '0'));
                }else if(row.Transpose[x]<0){
                    A.put(45);// MINUS
                    A.write(String(Math.abs(row.Transpose[x])).padStart(2, '0'));
                }else{
                    //no transpose value
                    A.write(":--",11);
                }
                A.write(" ");
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
            if(i==AHX.cursor.instnum){
                A.pos(x,i+2).write(String(i).padStart(2, '0'), 1);            
            }else{
                A.pos(x,i+2).write(String(i).padStart(2, '0'));            
            }
            A.write(" "+inst.Name.toUpperCase(),12);        
        }
    },

    keydown:function(ev){

    }

}




function debug(){
    let p=cols()*26;
    for(let i=0;i<16;i++)poke(p+i,[250,i]);
}