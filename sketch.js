//終盤前に発動する固有を考慮して、中盤あたりから計算できるよう仕様変更する必要がある
//とりあえず第4コーナー開始から？第4コーナーが大体250m
// 250m+525m つまり最終コーナー開始から終盤開始まで108m。そこから142mで最終直線
//アオハル力の期待値を確認したい

const is_describing = false;
const is_recording = true;
const actual_frame_rate = is_describing?60: 1200;
// const virtual_frame_rate = 20;
const bashin_to_meter = 2.5; //"なお現実の1馬身は約2.4mだが、ウマ娘ヘルプ・用語集曰く1バ身約2.5mらしい。(三女神像が腕を伸ばした長さ)"
const umas = [];

//先行前提
const initial_vel = 19.79 / actual_frame_rate;
const initial_acc = 0.455/actual_frame_rate/actual_frame_rate;//速度と歩調を合わせるために一回割って、frame_rateに合わせるためにもう一回割る
const mid_dest_vel = 19.79 / actual_frame_rate;
const spurt_dest_vel = 24.02 / actual_frame_rate;
const spurt_dest_vel_diff = (24.02-19.79) / actual_frame_rate;

const uma_counts = 1;
const race_distance = 2000;
const simulated_distance = 775+891;//1666.序盤は除外
const spurt_distance = race_distance/3;
const width = 600;

const pre_third_corner_length = 641;
const third_corner_length = 250;
const final_corner_length = 250;
const last_straight_length = 525;
const final_corner_not_spurt_length = 108;
const final_corner_spurt_length = 142;
const first_spurt_length = 333;
const second_spurt_length = 333;
const accum_dist_till_final_corner = pre_third_corner_length+third_corner_length;//序盤は除外.=1666-250-525
const accum_dist_till_first_spurt = accum_dist_till_final_corner+final_corner_not_spurt_length;
const accum_dist_till_second_spurt = accum_dist_till_first_spurt+first_spurt_length;
const accum_dist_till_final_straight = accum_dist_till_final_corner+final_corner_length;

const PHASE = {
    EARLY : 0,
    MIDDLE : 1,
    FINAL_FIRST : 2,
    FINAL_SECOND : 3,
};

const PROGRESSION = {
    THIRD_CORNER : 0,
    FINAL_CORNER : 1,
    LAST_STRAIGHT : 2,
};


const record = [];


function setup() {
    let button1 = select("#stop");  
	let button2 = select("#resume");
	button1.mousePressed(stop);
	button2.mousePressed(resume);

    frameRate(actual_frame_rate);
	createCanvas(simulated_distance, width);

    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));//基準。94881frame
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["mac"]));//96ms
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["suzuka"]));//20ms
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["oguri"]));//59ms
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["CHIKARA"]));//AVE88ms,n=152
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["TOBOSHA"]));//AVE227ms,n=170
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["DASSHUTSU"]));//99ms
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["SPEEDSTAR"]));//AVE39ms,n=88

    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu"]));//233ms
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","unsu"]));//382ms
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","unsu","unsu"]));//465ms
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","unsu","unsu","unsu"]));//521ms

    // umas.push(new Oguri(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));//144ms
    // umas.push(new Mac(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));//217ms
    // umas.push(new Mayano(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));//MAX443ms。早ければ早いほど強い
    // umas.push(new Taiki(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));//292ms
    // umas.push(new Unsu(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));//382ms
    // umas.push(new Suzuka(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));//101ms
    // umas.push(new Mizumaru(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));//170ms
    
    // umas.push(new Taiki(Uma.counter,0, height / 8 + Uma.counter * height / 10,["oguri"]));//351ms
    // umas.push(new Taiki(Uma.counter,0, height / 8 + Uma.counter * height / 10,["mac"]));//378ms
    
    
    // for (let i = 0; i < 20; i++) {
    //     umas.push(new Mayano(Uma.counter,0, 40 + Uma.counter * 40,[],i*10));//MAX443ms。早ければ早いほど強い
    // }
        
    // umas.push(new Suzuka(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));
    // umas.push(new Suzuka(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu"]));//363ms
    // umas.push(new Unsu(Uma.counter,0, height / 8 + Uma.counter * height / 10,["suzuka"]));//420ms
    // umas.push(new Mizumaru(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu"]));//403ms
    // umas.push(new Suzuka(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","TOBOSHA"]));//AVE498ms,n=173
    // umas.push(new Unsu(Uma.counter,0, height / 8 + Uma.counter * height / 10,["suzuka","TOBOSHA"]));//AVE487ms,n=313
    umas.push(new Mizumaru(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","TOBOSHA"]));//AVE536ms,n=144

    // umas.push(new Suzuka(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","TOBOSHA","mac"]));//
    // umas.push(new Unsu(Uma.counter,0, height / 8 + Uma.counter * height / 10,["suzuka","DASSHUTSU","mac"]));//
    // umas.push(new Mizumaru(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","DASSHUTSU","mac"]));//
        
    
}

function draw() {

	
	background(200);

    push();
	strokeWeight(1);
    textSize(32);
    line(pre_third_corner_length, 0, pre_third_corner_length, width);
    text("第3コーナー", pre_third_corner_length, 30);
    line(accum_dist_till_final_corner, 0, accum_dist_till_final_corner, width);
    text("最終コーナー", accum_dist_till_final_corner, 30);
	line(accum_dist_till_first_spurt, 0, accum_dist_till_first_spurt, width);
    text("終盤前半", accum_dist_till_first_spurt, 30);
	line(accum_dist_till_final_straight, 0, accum_dist_till_final_straight, width);
    text("最終直線", accum_dist_till_final_straight, 30);
	line(accum_dist_till_second_spurt, 0, accum_dist_till_second_spurt, width);
    text("終盤後半", accum_dist_till_second_spurt, 30);
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

function final_corner_random() {
	return Math.random() * final_corner_length + accum_dist_till_final_corner;
}

function average_record() {
	const sum = record.reduce((s, e) => s + e, 0);
	return roundNum(sum / record.length, 3);
}