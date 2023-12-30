
// const is_describing = true;
const is_describing = false;
// const is_repetitive_recording = true;
const is_repetitive_recording = false;
// const is_logging = true;
// const is_logging = false;
const actual_frame_rate = is_describing?60: 1200;
// const virtual_frame_rate = 20;
const bashin_to_meter = 2.5; //"なお現実の1馬身は約2.4mだが、ウマ娘ヘルプ・用語集曰く1バ身約2.5mらしい。(三女神像が腕を伸ばした長さ)"

let course;
const umas = [];
const uma_counts = 1;
const width = 600;
const start_pos = 233;//中盤の始まり,1400/6
const record_ms = [];
const record_x = [];

//先行距離S絶好調前提 12/12/12/4/12
const initial_vel = 20.25 / actual_frame_rate;
const initial_acc = 0.455 / actual_frame_rate / actual_frame_rate;//速度と歩調を合わせるために一回割って、frame_rateに合わせるためにもう一回割る
const mid_dest_vel = 20.25 / actual_frame_rate;
const spurt_dest_vel = 24.78 / actual_frame_rate;
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
    course = new Hanshin1400();

    let button1 = select("#stop");  
    let button2 = select("#resume");
    // let vt_button = select("#vt-button");
    let xms_button = select("#xms-button");
    let ave_button = select("#average-button");
	button1.mousePressed(stop);
    button2.mousePressed(resume);
    // vt_button.mousePressed(describe_vel_chart);
    xms_button.mousePressed(describe_chart);
    ave_button.mousePressed(() => {console.log(`n=${record_ms.length}, AVE=${average_record()}ms, MAX=${max(record_ms)}`)});

    frameRate(actual_frame_rate);
	createCanvas(course.race_distance, width);

    //スキル単体
    umas.push(new Uma([]));//基準
    // umas.push(new Uma(["eru"]));//
    // umas.push(new Uma(["unsu"]));//
    // umas.push(new Uma(["mizumaru"]));//
    // umas.push(new Uma(["mac"]));//
    // umas.push(new Uma(["suzuka"]));//
    // umas.push(new Uma(["oguri"]));//
    // umas.push(new Uma(["rudolf"]));//
    // umas.push(new Uma(["chikara"]));//
    // umas.push(new Uma(["CHIKARA"]));//
    // umas.push(new Uma(["norikae"]));//
    // umas.push(new Uma(["NORIKAE"]));//n=316, AVE=186.226ms, MAX=307.5
    // umas.push(new Uma(["gokyaku"]));//
    // umas.push(new Uma(["GOKYAKU"]));//
    // umas.push(new Uma(["tobosha"]));//
    // umas.push(new Uma(["TOBOSHA"]));//n=365, AVE=182.806ms, MAX=407.5
    // umas.push(new Uma(["kage"]));//
    // umas.push(new Uma(["KAGE"]));//
    // umas.push(new Uma(["dasshutsu"]));//
    // umas.push(new Uma(["DASSHUTSU"]));//
    // umas.push(new Uma(["professor"]));//
    // umas.push(new Uma(["PROFESSOR"]));//
    // umas.push(new Uma(["SPEEDSTAR"]));//
    // umas.push(new Uma(["corner"]));//
    // umas.push(new Uma(["CORNER"]));//
    // umas.push(new Uma(["hidari"]));//
    // umas.push(new Uma(["HIDARI"]));//
    
    //固有スキル単体
    // umas.push(new Uma(["ERU"]));//
    // umas.push(new Uma(["MONK"]));//
    // umas.push(new Uma(["XOGURIRANDOM"]));//
    // umas.push(new Mizumaru([]));//
    // umas.push(new Golshi([]));//
    // umas.push(new Mac([]));//
    // umas.push(new Oguri([]));//
    // umas.push(new Mayano([]));//

    //加速スキルの重複
    
    //スキル複合
    // umas.push(new Uma(["unsu","eru"]));//
    // umas.push(new Uma(["unsu","eru","tobosha"]));//


    

    
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

function getRandomPos(start, end) {
    const length = end - start;
    return start + Math.random()*length;
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
                label: '効果量とスキル発動位置の関係',
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

// function describe_vel_chart() {
//     //データセット作成
//     const dataSet = [];
//     for (let i = 0; i < record_x.length; i++) {
//         dataSet.push({ x: record_x[i], y: record_ms[i] });
//     }


//     var ctx = $('#chart');
//     var scatterChart = new Chart(ctx, {
//         type: 'scatter',
//         data: {
//             datasets: [{
//                 label: '散布図データセット',
//                 data: dataSet
//             }]
//         },
//         options: {
//             scales: {
//                 xAxes: [{
//                     type: 'linear',
//                     position: 'bottom'
//                 }]
//             }
//         }
//     });
// }