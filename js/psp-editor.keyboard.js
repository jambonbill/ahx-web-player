//keyboard handling

var _pressedKeys={};

var initKeyboard=function(){
	console.info('initKeyboard');	
	addEventListener("keydown", function(ev) {

	//$('body').keydown(function(ev) {

		// input fields:
		//if (["INPUT", "SELECT","TEXTAREA"].indexOf(ev.target.nodeName) !== -1) return;

		var c = ev.which;
		
		console.log(c);

		_pressedKeys[c] = true;//capture special keys
		//pressedKeys(_pressedKeys);//crappy but heh
		var SHIFT=_pressedKeys[16];
		var CTRL=_pressedKeys[17];
		var ALT =_pressedKeys[18];


		// Function keys //
		
		if(c==112){//F1
			AHX.Master.Play()
		}

		if(c==113){//F2
			AHX.Master.Play()
		}	

		if(c==116)return;//F5

		if (c==117) {//F6 - duplicate frame
			//
		}

		if(c==118){//F7 - new empty frame
			//
		}

		if (c===119) {
			console.log('F8');
		}

		if(c==120){//F9 - PNG
			//
		}

		if (c==121) {//F10 - GIF
			//
		}

		if(c==122){//F11
			//
		}

		if(c==123)return;//F12

		ev.preventDefault();

		if (c == 8) {//backspace
			//
		}

		if (c===9) {//TAB
			//note : ctrl+tab not doable
			AHX.cursor.pageToggle();
			return;
		}

		if(c==33)AHX.cursor.pageUp();
		if(c==34)AHX.cursor.pageDown();
		if(c==37)AHX.cursor.left();
		if(c==39)AHX.cursor.right();


		if (c == 46) {// delete
			return;
		}

		
		if (c==79&&(CTRL||ev.metaKey)){ // Ctrl+O
			return;
		}

		if (c==83&&(CTRL||ev.metaKey)){ // Ctrl+S
			return;
		}

		switch(c){//Other keyboard shortcuts

			case 20:// Capslock
				break;
		
			case 27://ESC
				AHX.stop()
				break;
		
			case 32:
				break;


			case 35://END
				break;
			case 36:// HOME
				break;
			case 106://*
				break;
			case 107://+
				break;
			case 109://-
				break;
			case 111:// - /
				break;
			case 188://,
				break;
			case 190://.
				break;
			

		}



		if(c>95&&c<106){//keypad numbers
			//typeChar(48+(c-96));
			return;
		}

		//console.info('keydown c=',c);

	});
}

initKeyboard();