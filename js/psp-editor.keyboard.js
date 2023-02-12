//keyboard handling

const kmap=[];// Qwerty Keyboard mapping

// QWERTY //
kmap[90]='0';// Z - Octave 1
kmap[83]=1;// S
kmap[88]=2;// X
kmap[68]=3;// D
kmap[67]=4;// C
kmap[86]=5;// V
kmap[71]=6;// G
kmap[66]=7;// B
kmap[72]=8;// H
kmap[78]=9;// N
kmap[74]=10;// J
kmap[77]=11;// M
kmap[188]=12;// <
kmap[190]=14;// <
kmap[81]=12;// Q - Octave 2
kmap[50]=13;// 2 - Octave 2
kmap[87]=14;// W - Octave 2
kmap[51]=15;// 3 - Octave 2
kmap[69]=16;// E - Octave 2
kmap[82]=17;// R - Octave 2
kmap[53]=18;// 5 - Octave 2
kmap[84]=19;// T - Octave 2
kmap[54]=20;// 6 - Octave 2
kmap[89]=21;// Y - Octave 2
kmap[55]=22;// 7 - Octave 2
kmap[85]=23;// U - Octave 2
kmap[73]=24;// I - Octave 3
kmap[57]=25;// 9 - Octave 3
kmap[79]=26;// O - Octave 3
kmap[48]=27;// 0 - Octave 3
kmap[80]=28;// P - Octave 3
kmap[219]=29;//
kmap[221]=31;//

window.keyCodeToMidiNote=function(keyCode){
    let n=kmap[keyCode];
    if (n) return +n;
}



var initKeyboard=function(){
	//console.info('initKeyboard');	

	let _pressedKeys={};
	
	window.keyPressed=function(code){
		return _pressedKeys[code];
	}

	
	window.keySHIFT=function(){
		return _pressedKeys[16];
	}

	window.keyCTRL=function(){
		return _pressedKeys[17];
	}

	window.keyALT=function(){
		return _pressedKeys[18];
	}

	addEventListener("keydown", function(ev) {		

		let c = ev.which;
		
		//console.log("Key",c,ev.);

		_pressedKeys[c] = true;//capture special keys
		//pressedKeys(_pressedKeys);//crappy but heh
		//let SHIFT=_pressedKeys[16];
		//let CTRL=_pressedKeys[17];
		//let ALT =_pressedKeys[18];

		
		if (c===9) {//TAB (is bad!)
			//note : ctrl+tab not doable
			//AHX.Editor.pageToggle();
			return;
		}	
		
		/*
		if(c>112&&c<123){// F KEYS
			console.log("Fkey");
			ev.preventDefault();//doesnt prevent much
			return;
		}
		*/
		
		/*
		if(c==13) {//RETURN
			AHX.Editor.play();
		}
		*/
	
		if(c==27) {//ESC
			AHX.Editor.stop()
		}

		if (keyALT()) {
			//move around pages
			ev.preventDefault();
		}
		
		//console.log(c);
		//Forward keys to the current page
		switch(AHX.Editor.page){			
			case 0:songEditor.keydown(ev);	break;
			case 1:phraseEditor.keydown(ev);break;
			case 2:instrumentEditor.keydown(ev);break;
		}		

	});

	addEventListener("keyup",function(ev){
		let c = ev.which;
		_pressedKeys[c]=false;
	});

	window.onblur=function(){
		console.log("blured!");
		_pressedKeys={};//release all keys
	}
}



initKeyboard();