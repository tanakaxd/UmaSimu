
// const is_describing = true;
const is_describing = false;
const is_repetitive_recording = true;
// const is_repetitive_recording = false;
// const is_logging = true;
// const is_logging = false;
const actual_frame_rate = is_describing?60: 1200;
// const virtual_frame_rate = 20;
const bashin_to_meter = 2.5; //"なお現実の1馬身は約2.4mだが、ウマ娘ヘルプ・用語集曰く1バ身約2.5mらしい。(三女神像が腕を伸ばした長さ)"

let course;
const umas = [];
const uma_counts = 1;
const width = 600;
const start_pos = 267;
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
    course = new February();

    let button1 = select("#stop");  
    let button2 = select("#resume");
    // let vt_button = select("#vt-button");
    let xms_button = select("#xms-button");
    let ave_button = select("#average-button");
	button1.mousePressed(stop);
    button2.mousePressed(resume);
    // vt_button.mousePressed(describe_vel_chart);
    xms_button.mousePressed(describe_chart);
    ave_button.mousePressed(() => {console.log(`AVE=${average_record()}ms,n=${record_ms.length},MAX=${max(record_ms)}`)});

    frameRate(actual_frame_rate);
	createCanvas(course.race_distance, width);

    //スキル単体
    // umas.push(new Uma([]));//基準
    // umas.push(new Uma(["eru"]));//104ms
    // umas.push(new Uma(["unsu"]));//221ms
    // umas.push(new Uma(["mizumaru"]));//35ms
    // umas.push(new Uma(["mac"]));//35ms
    // umas.push(new Uma(["suzuka"]));//0ms
    // umas.push(new Uma(["oguri"]));//48ms
    // umas.push(new Uma(["rudolf"]));//0ms
    // umas.push(new Uma(["chikara"]));//n=,AVEms
    // umas.push(new Uma(["CHIKARA"]));//n=,AVEms
    // umas.push(new Uma(["norikae"]));//n=,AVE
    // umas.push(new Uma(["NORIKAE"]));//AVE=102.724ms,n=1128,MAX=335.83
    // umas.push(new Uma(["gokyaku"]));//
    // umas.push(new Uma(["GOKYAKU"]));//AVE=116.25ms,n=909,MAX=420.83
    // umas.push(new Uma(["tobosha"]));//AVE100ms,n=600
    // umas.push(new Uma(["TOBOSHA"]));//AVE=173.674ms,n=959,MAX=420.83
    // umas.push(new Uma(["kage"]));//103ms
    // umas.push(new Uma(["KAGE"]));//200ms
    // umas.push(new Uma(["dasshutsu"]));//35ms
    // umas.push(new Uma(["DASSHUTSU"]));//82ms
    // umas.push(new Uma(["professor"]));//20ms
    // umas.push(new Uma(["PROFESSOR"]));//49ms
    // umas.push(new Uma(["SPEEDSTAR"]));//AVE=46.923ms,n=425,MAX=161.67
    // umas.push(new Uma(["corner"]));//35ms
    // umas.push(new Uma(["CORNER"]));//59ms
    // umas.push(new Uma(["hidari"]));//25ms 24.83488-24.7849=0.04998
    // umas.push(new Uma(["HIDARI"]));//36ms 24.85960-24.7849=0.0747
    
    //固有スキル単体
    // umas.push(new Uma(["ERU"]));//284ms
    umas.push(new Uma(["MONK"]));//AVE=235.213ms,n=915,MAX=425
    // umas.push(new Uma(["XOGURIRANDOM"]));//中盤ランダム2：AVE=145.01ms,n=475,MAX=450.83   中盤ランダム3：AVE=148.471ms,n=895,MAX=450.83
    // umas.push(new Mizumaru([]));//138.33ms
    // umas.push(new Golshi([]));//118.33ms
    // umas.push(new Mac([]));//138.33ms
    // umas.push(new Oguri([]));//135ms
    // umas.push(new Mayano([]));//AVE=356.957ms,n=965,MAX=450.83

    //加速スキルの重複
    
    //スキル複合
    // umas.push(new Uma(["unsu","eru"]));//294.17ms
    // umas.push(new Uma(["unsu","eru","tobosha"]));//AVE=353.883ms,n=635,MAX=445


    

    
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