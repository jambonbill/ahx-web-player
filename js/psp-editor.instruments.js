

function instrumentList()
{

}

function instrumentEditor(){
    
    frame().clear();
    //Instrument Editor
    let A=ascii().color(11);
    
    line(0,0,48,0,160,1);
    line(0,1,48,1,119,15);
    
    A.pos(0,0).invert().write("INSTRUMENT #01",1);
    A.invert(false);

    // List instruments
    for(let i=1;i<AHX.Song.Instruments.length;i++){
    	let inst=AHX.Song.Instruments[i];
		A.pos(0,i+1).write(String(i).padStart(2, '0'));    	
		A.write(inst.Name.toUpperCase(),12);    	
    }

    //Vertical Line
    //line(15,2,15,27,66,15);
    line(30,2,30,27,66,15);

    //let ins=1;//Current Instrument
    let inst=AHX.Song.Instruments[1];
    let x=20;
    A.pos(x, 2).write("VOLUME  ").write("00",15);
    A.pos(x, 3).write("WAVELEN ").write("00",15);
    
    A.pos(x, 5).write("ATTACK ").write("000");
    A.pos(x, 6).write("VOLUME  ").write("00");
    A.pos(x, 7).write("DECAY  ").write("000");
    A.pos(x, 8).write("VOLUME ").write("000");
    A.pos(x, 9).write("SUSTAIN").write("000");
    A.pos(x,10).write("RELEASE").write("000");
    A.pos(x,11).write("VOLUME  ").write("00");
    
    A.pos(x,13).write("DELAY  ").write("000");
    A.pos(x,14).write("DEPTH  ").write("000");
    A.pos(x,15).write("SPEED   ").write("00");

    A.pos(x,17).write("LOWER  ").write("000");
    A.pos(x,18).write("UPPER  ").write("000");
    A.pos(x,19).write("S.SPD  ").write("000");

	A.pos(x,21).write("LOWER  ").write("000");
    A.pos(x,22).write("UPPER  ").write("000");
    A.pos(x,23).write("F.SPD  ").write("000");
    
    // Steps /////////////////////
    
	A.pos(31,2);
	A.write("STP",1).put(66,1);
	A.write("NOT",1).put(66,1);
	A.write("X",1).put(66,1);
	A.write("FX1",1).put(66,1);
	A.write("FX2",1);
	
	for(let i=0;i<25;i++){
		A.pos(31,i+3).write(String(i).padStart(3, '0'));    	
		//A.write(i);    	
		A.put(66,1);
		A.write("---");    	
		A.put(66,1);
		A.write("-");
		A.put(66,1);    	
		A.write("000");
		A.put(66,1);    	
		A.write("000");	
    }
        
}