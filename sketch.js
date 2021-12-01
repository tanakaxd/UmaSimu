
const is_describing = false;
const is_recording = false;
const actual_frame_rate = is_describing?60: 1200;
// const virtual_frame_rate = 20;
const bashin_to_meter = 2.5; //"なお現実の1馬身は約2.4mだが、ウマ娘ヘルプ・用語集曰く1バ身約2.5mらしい。(三女神像が腕を伸ばした長さ)"

let course;
const umas = [];
const uma_counts = 1;
const width = 600;
const start_pos = 417;
// const start_pos = 1600;
const record_ms = [];
const record_x = [];

//先行距離S絶好調前提 12/12/12/4/12
const initial_vel = 19.35 / actual_frame_rate;
const initial_acc = 0.474/actual_frame_rate/actual_frame_rate;//速度と歩調を合わせるために一回割って、frame_rateに合わせるためにもう一回割る
const mid_dest_vel = 19.35 / actual_frame_rate;
const spurt_dest_vel = 23.81 / actual_frame_rate;
const spurt_dest_vel_diff = spurt_dest_vel-mid_dest_vel;

const PHASE = {
    EARLY : 0,
    MIDDLE : 1,
    FINAL_FIRST : 2,
    FINAL_SECOND : 3,
};

const PROGRESSION = {
    PRE_THIRD_CORNER : 0,
    THIRD_CORNER : 1,
    FINAL_CORNER : 2,
    LAST_STRAIGHT : 3,
};

function setup() {
    course = new Arima();

    let button1 = select("#stop");  
	let button2 = select("#resume");
	button1.mousePressed(stop);
	button2.mousePressed(resume);

    frameRate(actual_frame_rate);
	createCanvas(course.race_distance, width);

    //スキル単体
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,[]));//基準
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["unsu"]));//175ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["mizumaru"]));//56ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["mac"]));//46ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["suzuka"]));//46ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["oguri"]));//75ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["rudolf"]));//75ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["CHIKARA"]));//ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["tobosha"]));//ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["TOBOSHA"]));//ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["kage"]));//147ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["KAGE"]));//277ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["dasshutsu"]));//56ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["DASSHUTSU"]));//129ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["professor"]));//33ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["PROFESSOR"]));//75ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["SPEEDSTAR"]));//ms    
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["corner"]));//56ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["CORNER"]));//93ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["hidari"]));//55ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["HIDARI"]));//83ms
    
    //固有スキル単体
    // umas.push(new Unsu(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,[]));//271ms
    // umas.push(new Rudolf(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,[]));//225ms
    // umas.push(new Mizumaru(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,[]));//219ms
    // umas.push(new Golshi(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,[]));//190ms
    // umas.push(new Mac(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,[]));//178ms
    // umas.push(new Suzuka(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,[]));//178ms
    // umas.push(new Oguri(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,[]));//147ms
    
    //加速スキルの重複
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["unsu"]));//259ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["unsu","unsu"]));//403ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["unsu","unsu","unsu"]));//492ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["unsu","unsu","unsu","unsu"]));//553ms
    
    //スキル複合
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["kage","unsu"]));//283ms。ゴルシにアナボ積む価値はアリ
    // umas.push(new Mizumaru(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["unsu"]));//ms
    umas.push(new Golshi(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["kage"]));//338ms
    umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["KAGE"]));//277ms

    
}

function draw() {

	
	background(200);

    push();
	strokeWeight(1);
    textSize(32);
	line(course.accum_dist_to_first_spurt, 0, course.accum_dist_to_first_spurt, width);
    text("終盤前半", course.accum_dist_to_first_spurt, 30);
	line(course.accum_dist_to_second_spurt, 0, course.accum_dist_to_second_spurt, width);
    text("終盤後半", course.accum_dist_to_second_spurt, 30);
    line(course.accum_dist_to_third_corner, 0, course.accum_dist_to_third_corner, width);
    text("第3コーナー", course.accum_dist_to_third_corner, 30);
    line(course.accum_dist_to_final_corner, 0, course.accum_dist_to_final_corner, width);
    text("最終コーナー", course.accum_dist_to_final_corner, 30);
	line(course.accum_dist_to_last_straight, 0, course.accum_dist_to_last_straight, width);
    text("最終直線", course.accum_dist_to_last_straight, 30);
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

function average_record() {
	const sum = record_ms.reduce((s, e) => s + e, 0);
	return roundNum(sum / record_ms.length, 3);
}

function describe_chart() {
    //データセット作成
    const dataSet = [];
    for (let i = 0; i < record_x.length; i++) {
        dataSet.push({ x: record_x[i]+333, y: record_ms[i] });
    }


    var ctx = $('#chart');
    var scatterChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
            label: '散布図データセット',
            data: dataSet
        }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom'
            }]
        }
    }
});
}