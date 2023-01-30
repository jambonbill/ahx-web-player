//Jambon Experiments to make a usable AHX Editor (sort of)
var AHX={};

/* 
AHX Pages :
--------------
0 - Splash
1 - Config
2 - Main/Song
3 - Phrase
4 - Instrument - Think instrument manager !
5 - Save
6 - Load / Diskop
*/

AHX.Editor={
    page:0,
    col:0,
    row:0,

    load:function(filename){
        AHX.Song = new AHXSong();
        AHX.Song.LoadSong('ahx/Jazz_NL/06.ahx', (e)=>console.log('ready!',e));//()=>AHX.Editor.play() 
    },

    play:function(){
        console.log("play", "(todo)");
        //this.Master.Output.pos = [0,0,0,0];
        AHX.Master.Play(AHX.Song);//start
        //AHX.Master.Play();//continue
    },
    
    stop:function(){
        console.log("stop");
        AHX.Master.Stop();
    }
}

//This is 
//AHX.Nav={}
//Editor ?
//AHX.Ed={}

AHX.cursor={//this is crap
    
    page:0,// 0=>main - 1=>phrase 2=>instrument
    track:0,// 0-3
    
    pos:0,// Songpos
    patpo:0,// Pattern pos
    
    phrasenum:0,//current phrase (phrase Editor)
    instnum:1,//Instrument(editor) number. Zero do not exist here.
    
    pageToggle:function(){
        //console.log('pageToggle');
        this.page++;
        if(this.page>2)this.page=0;
    },
    
    up:function(){
        //move cursor up
        //if(AHX.Master.Output.Player.NoteNr>0)AHX.Master.Output.Player.NoteNr--;
    },
    
    down:function(){
        //move cursor down
        //if(AHX.Master.Output.Player.NoteNr<32)AHX.Master.Output.Player.NoteNr++;
    },

    left:function(){
        this.track--;
        if(this.track<0)this.track=3;
    },
    
    right:function(){
        this.track++;
        if(this.track>3)this.track=0;
    },
    
    pageUp:function(){
        //Pos--
        switch (this.page) {
            case 0://main
                if(AHX.Master.Output.Player.PosNr>0)AHX.Master.Output.Player.PosNr--;
                break;
            
            case 1://phrase
                if(this.phrasenum>0)this.phrasenum--;
                break;
            
            case 2://inst
                //if(this.instnum>0)this.instnum--;
                if(this.instnum>1)this.instnum--;//no zero
                break;
        }
    },
    pageDown:function(){
        switch (this.page) {
            
            case 0://main
                if(AHX.Master.Output.Player.PosNr<AHX.Song.Positions.length-1){
                    AHX.Master.Output.Player.PosNr++;
                }
                break;
            
            case 1:
                if(this.phrasenum<AHX.Song.Tracks.length-1)this.phrasenum++;
                break;
            
            case 2:
                if(this.instnum<AHX.Song.Instruments.length-1)this.instnum++;
                break;

        }
    }
}

AHX.init = function() {
	console.log('AHX.init');
    this.Master = AHXMaster();
    this.Song = new AHXSong();
    this.newProject();
};

AHX.newProject=function(){
    console.log('newProject()');
    AHX.Master = AHXMaster();
    AHX.Song = new AHXSong();  
    
    //Set Tempo
    AHX.Master.Output.Player.Tempo=4;//4, 5 ?
    
    //Set Multiplier
    AHX.Song.SpeedMultiplier=1;//default
    
    //Set Track Length to 16
    AHX.Song.TrackLength=16;

    //Set Restart to 0
    AHX.Song.Restart=0;
    
    //Set Song
    var Pos = AHXPosition();
    for(let j = 0; j < 4; j++) {
        Pos.Track.push(0);
        Pos.Transpose.push(0);
    }
    AHX.Song.Positions.push(Pos);
    AHX.Song.PositionNr=AHX.Song.Positions.length;

    //Set Track 0
    let Track=[];
    for(let j = 0; j < AHX.Song.TrackLength; j++) {
        var Step = AHXStep();
        Step.Note = 0;
        Step.Instrument = 0;
        Step.FX = 0;
        Step.FXParam = 0;
        Track.push(Step);
        //SBPtr += 3;
    }
    AHX.Song.Tracks.push(Track);

    //Set first instrument
    AHX.Song.Instruments.push(AHXInstrument());//First Instrument is never used

    let I=AHXInstrument();
    I.Name='New';
    I.Volume=64;
    I.WaveLength=3;
    I.SquareLowerLimit=16;
    I.SquareUpperLimit=63;
    I.SquareSpeed=4;
    I.VibratoDelay=14;
    I.VibratoDepth=2;
    
    I.Envelope.aFrames=1;
    I.Envelope.aVolume=64;

    I.Envelope.dFrames=1;
    I.Envelope.dVolume=64;

    I.Envelope.sFrames=1;
    I.Envelope.rFrames=1;
    I.Envelope.rVolume=64;
    I.PList={
        Speed:4,
        Length:2,
        Entries:[
            {"Note":1,"Fixed":0,"Waveform":2,"FX":[0,3],"FXParam":[0,32]},
            {"Note":0,"Fixed":0,"Waveform":0,"FX":[0,0],"FXParam":[0,0]}
        ]
    }
    AHX.Song.Instruments.push(I);//this one is useable
}


//Envelope":{"aFrames":1,"aVolume":64,"dFrames":1,"dVolume":64,"sFrames":1,"rFrames":1,"rVolume":64},"
//PList":{"Speed":4,"Length":2,"Entries":[]}}'



AHX.songPop=function(){
    AHX.Song.Positions.pop();
    AHX.Song.PositionNr=AHX.Song.Positions.length;   
}

AHX.songTitle=function(){
	return this.Song.Name.split('\0')[0];
}

AHX.init();	

AHX.songInfo=function(){	
    console.clear();
	console.log('songInfo()',this.Song.Instruments);
	//AHX.Song.Instruments[0].Name
    this.Song.Instruments.forEach((ins,i)=>{
        console.log(i,ins.Name,ins.Name.length);
    });
}