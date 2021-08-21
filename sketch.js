const is_describing = false;
const actual_frame_rate = is_describing?60: 1200;
// const virtual_frame_rate = 20;
const bashin_to_meter = 2.5; //"なお現実の1馬身は約2.4mだが、ウマ娘ヘルプ・用語集曰く1バ身約2.5mらしい。(三女神像が腕を伸ばした長さ)"
const umas = [];
const initial_vel = 20 / actual_frame_rate;
const initial_acc = 0.4/actual_frame_rate/actual_frame_rate;//速度と歩調を合わせるために一回割って、frame_rateに合わせるためにもう一回割る
const initial_dest_vel = 24 / actual_frame_rate;

const uma_counts = 1;
const spurt_distance = 733;
const width = 400;


const third_corner_length = spurt_distance * 0.127;
const final_corner_length = spurt_distance * 0.381;

const PHASE = {
    THIRD_CORNER : 0,
    FINAL_CORNER : 1,
    LAST_STRAIGHT : 2,
};



function setup() {
    let button1 = select("#stop");  
	let button2 = select("#resume");
	button1.mousePressed(stop);
	button2.mousePressed(resume);

    frameRate(actual_frame_rate);
	createCanvas(spurt_distance, width);

    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));
    umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["UNSU"]));
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["UNSU","taiki"]));
    umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu"]));
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","taiki"]));
    umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["TAIKI"]));
    umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["TAIKI","unsu"]));
    umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["TAIKI","unsu","taiki"]));
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["OGURI"]));
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["TAIKI","oguri"]));
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["TAIKI","taiki"]));
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["TAIKI","oguri","oguri"]));
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["TAIKI","oguri","taiki"]));
	// umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["TAIKI","taiki","taiki"]));
	// umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["OGURI","oguri","oguri"]));
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["OGURI","oguri","taiki"]));
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["OGURI","taiki","taiki"]));
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["OGURI","taiki"]));
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["OGURI","oguri"]));
    // umas.push(new Unsu(Uma.counter,0, height / 8 + Uma.counter * height / 10));
    // umas.push(new Mizumaru(Uma.counter,0, height / 8 + Uma.counter * height / 10));
    // umas.push(new Oguri(Uma.counter,0, height / 8 + Uma.counter * height / 10));
    // umas.push(new Taiki(Uma.counter,0, height / 8 + Uma.counter * height / 10));
}

function draw() {

	
	background(200);

    push();
	strokeWeight(1);
	line(third_corner_length, 0, third_corner_length, width);
	line(third_corner_length+final_corner_length, 0, third_corner_length+final_corner_length, width);
	pop();

	loop = is_describing ? 1 : 2000;

	for (let i = 0; i < loop; i++) {
		for (const uma of umas) {
			uma.update();
		}
	}

}

function mousePressed() {
	let p = createVector(mouseX, mouseY);
	for (let uma of umas) {
		let d = p5.Vector.dist(p, uma.pos);
		if (d < uma.r) {
			console.log(uma);
		}
	}
}

function stop() {
	noLoop();
}

function resume() {
	loop();
}