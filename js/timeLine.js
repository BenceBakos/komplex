(function () {
	let tlTexts = [...document.getElementsByClassName('tl-text')];
	let main = document.querySelector('main');

	function scrollToInit() {
		tlTexts.forEach(tlText => {
			tlText.addEventListener('click', function (e) {
				e.preventDefault();

				document.querySelector(this.getAttribute('href')).scrollIntoView({
					behavior: 'smooth'
				});

				location.hash = this.getAttribute('href');
			});
		});
	}

	let interv = 10;

	function changeColorInit() {
		let setColor = (color) => document.body.style.backgroundColor = color;
		//set starter color
		setColor('rgba(' + tlTexts[0].getAttribute('data-color') + ',0.2)')

		let getPos = () => window.pageYOffset || main.scrollTop;

		let range = main.scrollHeight - main.clientHeight;
		let currentPos = getPos();

		let colorsN = tlTexts.length;
		let breakCols = tlTexts.map(color => color.getAttribute('data-color').split(','));
		function generateColors() {
			let colorArr = [];
			//get colors
			let closerByOne = (what, to) => (what > to) ? --what : ++what;
			//last RGB
			let lastR = breakCols[0][0],
			lastG = breakCols[0][1],
			lastB = breakCols[0][2];
			for (let i = 0; i < colorsN - 1; i++) {
				//next RGB
				let nextR = breakCols[i + 1][0],
				nextG = breakCols[i + 1][1],
				nextB = breakCols[i + 1][2];
				//increacce last to next
				while (lastR != nextR || lastG != nextG || lastB != nextB) {
					colorArr.push({
						max: 0,
						min: 0,
						color: `rgba(${lastR},${lastG},${lastB},0.2)`
					});
					if (Math.abs(lastR - nextR) != 0) {
						lastR = closerByOne(lastR, nextR);
					}

					if (Math.abs(lastG - nextG) != 0) {
						lastG = closerByOne(lastG, nextG);
					}

					if (Math.abs(lastB - nextB) != 0) {
						lastB = closerByOne(lastB, nextB);
					}
				}
			}

			//get intervalls ---> min,max
			let wall = 0;
			let roomSize = range / colorArr.length;
			for (let i = 0; i < colorArr.length; i++) {
				colorArr[i].min = wall;
				colorArr[i].max = wall + roomSize;
				wall += roomSize + 1;
			}

			return colorArr;
		}

		let colors = generateColors();
		function getColorForPos(pos) {
			let resCol = '';
			return colors.find(colObj => pos <= colObj.max && pos >= colObj.min);
		}
		setInterval(function () {
			if (currentPos != getPos()) {
				let newPos = getPos();
				currentPos = newPos;
				try {
					setColor(getColorForPos(newPos).color);
				} catch (e) {
					//cconsole.log(e);
				}
			}
		}, interv);

	}
	//----------------INIT---------------
	scrollToInit();
	changeColorInit();
}
	());
