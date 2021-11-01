//終盤前に発動する固有を考慮して、中盤あたりから計算できるよう仕様変更する必要がある
//とりあえず第4コーナー開始から？第4コーナーが大体250m
// 250m+525m つまり最終コーナー開始から終盤開始まで108m。そこから142mで最終直線
//アオハル力の期待値を確認したい

const is_describing = false;
const actual_frame_rate = is_describing?60: 1200;
// const virtual_frame_rate = 20;
const bashin_to_meter = 2.5; //"なお現実の1馬身は約2.4mだが、ウマ娘ヘルプ・用語集曰く1バ身約2.5mらしい。(三女神像が腕を伸ばした長さ)"
const umas = [];
const initial_vel = 20 / actual_frame_rate;
const initial_acc = 0.4/actual_frame_rate/actual_frame_rate;//速度と歩調を合わせるために一回割って、frame_rateに合わせるためにもう一回割る
const initial_dest_vel = 20 / actual_frame_rate;
const spurt_dest_vel = 24 / actual_frame_rate;

const uma_counts = 1;
const race_distance = 2000;
const simulated_distance = 775;
const spurt_distance = race_distance/3;
const width = 600;


const third_corner_length = 0;
const final_corner_length = 250;
const final_corner_not_spurt_length = 108;
const final_corner_spurt_length = 142;
const accum_dist_till_final_straight = 250;
const accum_dist_till_first_spurt = 108;
const accum_dist_till_second_spurt = 441;

const PHASE = {
    MIDDLE : 0,
    FINAL_FIRST : 1,
    FINAL_SECOND : 2,
};

const PROGRESSION = {
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
	createCanvas(simulated_distance, width);

    umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));
    umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["CHIKARA"]));
    umas.push(new Mizumaru(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu"]));
    umas.push(new Taiki(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));
    umas.push(new Mayano(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));
    // for (let i = 0; i < 10; i++) {
    //     umas.push(new Mayano(Uma.counter,0, 40 + Uma.counter * 40,[],50+i*10));
    // }
    umas.push(new Oguri(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));
    umas.push(new Unsu(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));
}

function draw() {

	
	background(200);

    push();
	strokeWeight(1);
	line(final_corner_not_spurt_length, 0, final_corner_not_spurt_length, width);
	line(accum_dist_till_final_straight, 0, accum_dist_till_final_straight, width);
	line(accum_dist_till_second_spurt, 0, accum_dist_till_second_spurt, width);
	pop();

	const frequency = is_describing ? 1 : 2000;

	for (let i = 0; i < frequency; i++) {
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

function roundNum(num, digit) {
    const exp = Math.pow(10, digit);
    return Math.round(num * exp) / exp;
}