/*
const btn0=document.getElementById('btn0');
const btn1=document.getElementById('btn1');
const btn2=document.getElementById('btn2');
const btn3=document.getElementById('btnPlay3');
const btn4=document.getElementById('btnPlay4');
const btnShuffle=document.getElementById('btnShuffle');
const btnPlay=document.getElementById('btnPlay');
const btnStop=document.getElementById('btnStop');
*/

//Song
const btnAddRow=document.getElementById('btnAddRow');

btn0.onclick=()=>AHX.Editor.load('ahx/Jazz_NL/06.ahx');
btn1.onclick=()=>AHX.Song.LoadSong('ahx/Doh/dreams-odyssee.ahx');

/*
btn2.onclick=function(){
    AHX.Song.LoadSong('ahx/MortimerTwang/amanda.ahx', ()=>AHX.Editor.play());
}

btn3.onclick=function(){
    AHX.Song.LoadSong('php/chopper.ahx', ()=>AHX.Editor.play());
}

btn4.onclick=function(){
    AHX.Song.LoadSong('ahx/JazzCat/rainmaking.ahx',()=>AHX.Editor.play());
}
*/

btnShuffle.onclick=()=>shuffle();

btnPlay.onclick=()=>AHX.Master.Play();

//btnStop.onclick=()=>AHX.stop();

btnNew.onclick=()=>AHX.newProject();

btnClear.onclick=()=>{
    console.log('Clear All');
    AHX.stop();
    //AHX.Song.Positions=[];
    AHX.Song.Positions.pop();
    AHX.Song.PositionNr=AHX.Song.Positions.length;//ReSet song size 'counter'
    AHX.Master.Output.Player.PosNr=0;//Set curent song pos to 0 (just in case)
    AHX.Song.Restart=0;//just in case
};

btnTracklength.onclick=()=>{
    if (AHX.Song.TrackLength<32) {
        console.error("nope","Current Tracklength:"+AHX.Song.TrackLength);
        return;
    }

    console.log("Tracklength set to 32!","Must resize trakcs");
    AHX.Song.TrackLength=32;
}

btnAddRow.onclick=()=>{
    console.log("Add Row");
    var Pos = AHXPosition();
    for(let j = 0; j < 4; j++) {
        Pos.Track.push(0);
        Pos.Transpose.push(0);
    }
    AHX.Song.Positions.push(Pos);
    AHX.Song.PositionNr=AHX.Song.Positions.length;
}

btnPopRow.onclick=()=>{
    console.log("Pop Row");
    AHX.Song.Positions.pop();
    AHX.Song.PositionNr=AHX.Song.Positions.length;
}


btnMute0.onclick=()=>AHX.Master.Output.Player.VoiceToggle(0);
btnMute1.onclick=()=>AHX.Master.Output.Player.VoiceToggle(1);
btnMute2.onclick=()=>AHX.Master.Output.Player.VoiceToggle(2);
btnMute3.onclick=()=>AHX.Master.Output.Player.VoiceToggle(3);


//Phrases
btnPhraseNew.onclick=()=>{
    //Add a New Track (phrase) to the List of Tracks
    console.log("Add New phrase");
    let Track = [];
    for(let j = 0; j < AHX.Song.TrackLength; j++) {
        let Step = AHXStep();
        Track.push(Step);
    }
    AHX.Song.Tracks.push(Track);
    AHX.Song.TrackNr=AHX.Song.Tracks.length-1;
}


//Instruments
btnInstrClear.onclick=()=>{
    console.log('btnInstrClear');
    //clear instr.
}

btnInstrAdd.onclick=()=>{
    console.log('btnInstrAdd');
    let I=AHXInstrument();
    I.Name='New';
    AHX.Song.Instruments.push(I);
    AHX.Song.InstrumentNr=AHX.Song.Instruments.length;//todo
}

btnInstrSave.onclick=()=>{
    //console.log('')
    let instnum=instrumentEditor.instnum;
    console.log(AHX.Song.Instruments[instnum]);
    let data = JSON.stringify(AHX.Song.Instruments[instnum]);
    
    //let data = AHX.Song.toString();
    saveAsJso('ahxinstr_'+instnum+'.json', data);

    function saveAsJso(fn,data){
        if(!fn)return;
        console.log(data.length + " bytes")
        let el=document.createElement('a');
        el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
        el.setAttribute('download', fn);
        el.style.display = 'none';
        document.body.appendChild(el);
        el.click();
        document.body.removeChild(el);
    }
}





btnFullScreen.onclick=()=>{
    // Get the element that we want to take into fullscreen mode
    var el = document.getElementById('screen');

    // These function will not exist in the browsers that don't support fullscreen mode yet,
    // so we'll have to check to see if they're available before calling them.

    if (el.mozRequestFullScreen) {
        // This is how to go into fullscren mode in Firefox
        // Note the "moz" prefix, which is short for Mozilla.
        el.mozRequestFullScreen();
        
    } else if (el.webkitRequestFullScreen) {
        // This is how to go into fullscreen mode in Chrome and Safari
        // Both of those browsers are based on the Webkit project, hence the same prefix.
        el.webkitRequestFullScreen();
    }
}

document.getElementById('loadFromJSON').onchange=function(evt) {
    console.log('loadFromJSON.onchange');
    evt.stopPropagation();
    evt.preventDefault();
    var file = evt.target.files[0];
    var reader = new FileReader();
    var data = false;
    reader.onload = (function(theFile) {
        return function(e) {
            data = JSON.parse(e.target.result);
            if (!data) return;
            if(AHX.Song.loadJson(data)){
                //play !
                console.log('ready to play!');
            }else{
                console.error("Error loading json");
            }
        }
    })(file);
    reader.readAsText(file);
};

document.getElementById('loadInstrument').onchange=function(evt) {
    console.clear();
    evt.stopPropagation();
    evt.preventDefault();
    var file = evt.target.files[0];
    var reader = new FileReader();
    var data = false;
    reader.onload = (function(theFile) {
        return function(e) {
            data = JSON.parse(e.target.result);
            if (!data) return;
            console.log(data);
            AHX.Song.Instruments.push(data);
            AHX.Song.InstrumentNr++;
        }
    })(file);
    reader.readAsText(file);
};

btnSave.onclick=function(){
    console.log('save as json');
    saveAsJson(AHX.Song.Name+'.ahx.json');
}


function saveAsJson(fn){
    if(!fn)return;
    var data = JSON.stringify(AHX.Song.toJson(),null);
    //let data = AHX.Song.toString();
    console.log(data.length + " bytes")
    let el=document.createElement('a');
    el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    el.setAttribute('download', fn);
    el.style.display = 'none';
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
}

async function shuffle() {

  
    AHX.Master.Stop();
    
    const response = await fetch('shuffle.php');
    const json = await response.json();
    console.log('shuffle()', json.filename); 
  
    AHX.Song = new AHXSong();
    AHX.Song.LoadSong(json.filename, function() { // asynchronously load a AHX song into memory
        //reset cursors
        AHX.Master.Output.Player.PosNr=0;
        AHX.Master.Output.Player.NoteNr=0;
        songEditor.cursor.init();
        phraseEditor.cursor.init();
        
        //AHX.play();
        //AHX.optimize();
        AHX.optimizeUnusedInstruments();
        AHX.trimSong();//delete empty end-parts

        console.log("Loaded and ready to play!", AHX.Song);
        document.getElementById('screen').focus();
        AHX.Master.Play(AHX.Song);
    });
}

//shuffle();