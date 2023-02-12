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
    page:0,//current Page
    
    //col:0,
    //row:0,
    //instnum:1,//Instrument(editor) number. Zero do not exist here.
    
    load:function(filename){
        AHX.Song = new AHXSong();
        AHX.Song.LoadSong('ahx/Jazz_NL/06.ahx', (e)=>console.log('ready!',e));//()=>AHX.Editor.play() 
    },

    play:function(){
        console.log("play", "(todo)");
        //this.Master.Output.pos = [0,0,0,0];
        AHX.Master.Play(AHX.Song);//start
        AHX.Master.Play();//continue
    },
    
    stop:function(){
        console.log("stop");
        AHX.Master.Stop();
    },

    pageToggle:function(){
        //console.log('pageToggle');
        this.page++;
        if(this.page>2)this.page=0;
    },
}


AHX.init = function() {
	console.log('AHX.init');
    AHX.Master = AHXMaster();
    AHX.Song = new AHXSong();
    AHX.newProject();
};


AHX.newProject=function(){
    
    console.log('newProject()');
    
    AHX.Master = AHXMaster();
    AHX.Song = new AHXSong();  
    
    AHX.Song.Name="NEW";
    
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
            {"Note":1,"Fixed":0,"Waveform":2,"FX":[0,0],"FXParam":[0,0]},
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

AHX.optimize=function(){
    console.log("optimize song (TODO)");
    // detect unused instruments
    let list=AHX.Song.Instruments;
    
    // scan through Tracks, and look for instruments
    let stats={
        Instruments:{},
        Tracks:{}
    };

    AHX.Song.Tracks.forEach(function(Steps){
        Steps.forEach(function(step){
            let ins=step.Instrument;//Instrument number
            if(!stats.Instruments[ins])stats[ins]=0;
            stats.Instruments[ins]++;    
        });
    });

    //compare with instruments
    AHX.Song.Instruments.forEach(function(ins,i){
        if (!stats.Instruments[i]) {
            console.log("Unused instrument #"+i);
            ins.Name='[UNUSED]';
            ins.Unused=true;//add a dirty property
        }
    });
    


    // detect unused patterns
    // scan through Positions
    AHX.Song.Positions.forEach(function(Songpos){
        for(let i=0;i<4;i++){
            let tn=Songpos[i];
        }
    });


    console.log(stats);
}

AHX.optimizeUnusedTracks=function(){
    //
}

AHX.optimizeUnusedInstruments=function(){
    console.log('AHX.optimizeUnusedInstruments()');
    
    // scan through Tracks, and look for instruments
    let stats={};
    AHX.Song.Tracks.forEach(function(Steps){
        Steps.forEach(function(step){
            let ins=step.Instrument;//Instrument number
            if(!stats[ins])stats[ins]=0;
            stats[ins]++;    
        });
    });

    //compare with instruments
    AHX.Song.Instruments.forEach(function(ins,i){
        if (!stats[i]) {
            console.log("Unused instrument #"+i);
            ins.Name='[UNUSED]';
            ins.Unused=true;//add a dirty property
        }
    });

    //Find the first Unused tracke
    //Realocate Instruments

    
    trimInstruments();//Delete Unused instruments at the end of the intruments-list
    
    console.log(stats);
}

function realocateInstrument(fr,to){//Swap Instruments
    
    console.log("Realocate",fr,to);

    //destructuring assignment.
    [AHX.Song.Instruments[fr],AHX.Song.Instruments[to]] = [AHX.Song.Instruments[to],AHX.Song.Instruments[fr]]

    //Fix song instruments
    AHX.Song.Tracks.forEach(function(Steps){
        Steps.forEach(function(step){
            if(step.Instruments==to){
                step.Instruments=fr;
            }
        });
    });
}


function trimInstruments(){
    //Delete Unsued Instruments starting from the end
    let deleted=0;
    while(AHX.Song.Instruments[AHX.Song.Instruments.length-1].Name=="[UNUSED]"){
        AHX.Song.Instruments.pop();//trash
        deleted++;
    }

    if (deleted>0) {
        console.log("TRIM: "+deleted+" deleted instrument(s)!");
    }
}


AHX.trimSong=function(){
    //Delete unused Parts/Positons (000) at the end of the song
    
    function trimable(){
        // Check if the last part can be erased safely        
        if(AHX.Song.Positions.length<2)return false;

        let row=AHX.Song.Positions[AHX.Song.Positions.length-1];
        if(row.Track[0]==0 && row.Track[1]==0 && row.Track[2]==0 && row.Track[3]==0){
            return true;
        }
        return false;
    }

    let deleted=0;
    while(trimable()){
        AHX.Song.Positions.pop();
        AHX.Song.PositionNr--;
        deleted++;
    }

    if (deleted) { 
       console.log(deleted+" parts deleted");
    }
    
}


// READ/WRITE song to localstorage

AHX.freeze=function(){
    console.log('freeze()');
    //Save current song to localStorage
    var data = JSON.stringify(AHX.Song.toJson(),null);
    localStorage.setItem('AHXSong',data);
}

AHX.restore=function(){
    console.log('restore()');
    let data=localStorage.getItem('AHXSong');
    if(!data)return;
    let json=JSON.parse(data);
    if(AHX.Song.loadJson(json)){
        //play !
        console.log('ready to play!');
    }else{
        console.error("Error loading json");
    }
}


AHX.restore();

window.onbeforeunload = function() {
    AHX.freeze();
    return 'You have unsaved changes!';
}