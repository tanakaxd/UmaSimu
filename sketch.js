
const is_describing = false;
const is_recording = true;
const is_logging = false;
const actual_frame_rate = is_describing?60: 1200;
// const virtual_frame_rate = 20;
const bashin_to_meter = 2.5; //"なお現実の1馬身は約2.4mだが、ウマ娘ヘルプ・用語集曰く1バ身約2.5mらしい。(三女神像が腕を伸ばした長さ)"

let course;
const umas = [];
const uma_counts = 1;
const width = 600;
const start_pos = 200;
const record_ms = [];
const record_x = [];

//先行距離S絶好調前提 12/12/12/4/12
const initial_vel = 20.64 / actual_frame_rate;
const initial_acc = 0.463/actual_frame_rate/actual_frame_rate;//速度と歩調を合わせるために一回割って、frame_rateに合わせるためにもう一回割る
const mid_dest_vel = 20.64 / actual_frame_rate;
const spurt_dest_vel = 24.91 / actual_frame_rate;
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
    course = new Takamatsu();

    let button1 = select("#stop");  
	let button2 = select("#resume");
	button1.mousePressed(stop);
	button2.mousePressed(resume);

    frameRate(actual_frame_rate);
	createCanvas(course.race_distance, width);

    //スキル単体
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,[]));//基準
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["unsu"]));//0ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["mizumaru"]));//29ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["mac"]));//29ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["suzuka"]));//0ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["oguri"]));//33ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["rudolf"]));//0ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["chikara"]));//n=1576,AVE76ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["CHIKARA"]));//n=1047,AVE129ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["tobosha"]));//ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["TOBOSHA"]));//ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["kage"]));//77ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["KAGE"]));//146ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["dasshutsu"]));//29ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["DASSHUTSU"]));//58ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["professor"]));//18ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["PROFESSOR"]));//34ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["SPEEDSTAR"]));//ms    
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["corner"]));//29ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["CORNER"]));//44ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["hidari"]));//20ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["HIDARI"]));//28ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["tozanka"]));//126ms
    
    //固有スキル単体
    // umas.push(new Mizumaru(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,[]));//99ms
    // umas.push(new Golshi(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,[]));//88ms
    // umas.push(new Mac(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,[]));//99ms
    // umas.push(new Oguri(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,[]));//96ms
    
    //加速スキルの重複
    
    //スキル複合
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["tozanka","kage"]));//186ms
    // umas.push(new Uma(Uma.counter,start_pos, height / 8 + Uma.counter * height / 10,["HIDARI","KAGE"]));//173ms

    
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
        dataSet.push({ x: record_x[i], y: record_ms[i] });
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