
// const is_describing = true;
const is_describing = false;
const is_repetitive_recording = true;
// const is_repetitive_recording = false;
// const is_logging = true;
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
    // let vt_button = select("#vt-button");
    let xms_button = select("#xms-button");
    let ave_button = select("#average-button");
	button1.mousePressed(stop);
    button2.mousePressed(resume);
    // vt_button.mousePressed(describe_vel_chart);
    xms_button.mousePressed(describe_chart);
    ave_button.mousePressed(() => {console.log(average_record())});

    frameRate(actual_frame_rate);
	createCanvas(course.race_distance, width);

    //スキル単体
    // umas.push(new Uma([]));//基準
    // umas.push(new Uma(["eru"]));//101ms
    // umas.push(new Uma(["unsu"]));//0ms
    // umas.push(new Uma(["mizumaru"]));//26ms
    // umas.push(new Uma(["mac"]));//26ms
    // umas.push(new Uma(["suzuka"]));//0ms
    // umas.push(new Uma(["oguri"]));//33ms
    // umas.push(new Uma(["rudolf"]));//0ms
    // umas.push(new Uma(["chikara"]));//n=331,AVE47ms
    // umas.push(new Uma(["CHIKARA"]));//n=2100,AVE82ms
    // umas.push(new Uma(["norikae"]));//n=,AVE
    // umas.push(new Uma(["NORIKAE"]));//n=2500,AVE101ms,MAX250ms
    // umas.push(new Uma(["tobosha"]));//AVE34ms,n=543
    // umas.push(new Uma(["TOBOSHA"]));//AVE58ms,n=3000
    // umas.push(new Uma(["kage"]));//77ms
    // umas.push(new Uma(["KAGE"]));//146ms
    // umas.push(new Uma(["dasshutsu"]));//26ms
    // umas.push(new Uma(["DASSHUTSU"]));//60ms
    // umas.push(new Uma(["professor"]));//15ms
    // umas.push(new Uma(["PROFESSOR"]));//36ms
    // umas.push(new Uma(["SPEEDSTAR"]));//AVE41ms,n=830,MAX145ms,MIN6ms    
    // umas.push(new Uma(["corner"]));//26ms
    // umas.push(new Uma(["CORNER"]));//43ms
    // umas.push(new Uma(["hidari"]));//20ms
    // umas.push(new Uma(["HIDARI"]));//28ms
    // umas.push(new Uma(["tozanka"]));//126ms
    
    //固有スキル単体
    // umas.push(new Uma(["ERU"]));//317ms
    // umas.push(new Uma(["EAGURU"]));//AVE135ms,n=750,MAX220
    // umas.push(new Uma(["XOGURIRANDOM"]));//AVE119ms,n=1000,MAX375ms。中盤ランダムを2から増やしても大差なし
    // umas.push(new Uma(["BONO"]));//AVE118ms,n=1084,60%地点が最大で317ms
    // umas.push(new Mizumaru([]));//101ms
    // umas.push(new Golshi([]));//88ms
    // umas.push(new Mac([]));//99ms
    // umas.push(new Oguri([]));//100ms
    
    //加速スキルの重複
    
    //スキル複合
    // umas.push(new Uma(["tozanka","kage"]));//186ms
    // umas.push(new Uma(["HIDARI","KAGE"]));//173ms
    // umas.push(new Uma(["ERU","tozanka"]));//357ms
    // umas.push(new Uma(["eru","eru"]));//195ms
    // umas.push(new Uma(["eru","eru","tozanka"]));//274ms
    // umas.push(new Uma(["eru","tozanka"]));//205ms
    // umas.push(new Uma(["eru","tozanka","norikae"]));//AVE233ms,n=2600,MAX300ms
    // umas.push(new Uma(["eru","eru","tozanka","chikara"]));//AVE291ms,n=2000
    umas.push(new Uma(["eru","eru","tozanka","norikae"]));//AVE296ms,n=1064
    // umas.push(new Uma(["eru","eru","tozanka","CHIKARA"]));//AVE307ms,n=1131
    // umas.push(new Uma(["eru","eru","tozanka","chikara","norikae"]));//AVE310ms,n=620
    // umas.push(new Uma(["eru","eru","tozanka","CHIKARA","norikae"]));//AVE323ms,n=1064,MAX436ms
    // umas.push(new Uma(["eru","eru","CHIKARA","norikae"]));//AVE271ms,n=1000,MAX410
    // umas.push(new Uma(["OGURI","tozanka"]));//225ms
    // umas.push(new Uma(["OGURI","NORIKAE"]));//AVE211ms,n=2000,MAX361ms
    // umas.push(new Uma(["OGURI","tozanka","NORIKAE"]));//AVE298ms,n=1000,MAX430ms
    // umas.push(new Uma(["EAGURU","tozanka","NORIKAE"]));//AVE298ms,n=2000,MAX489ms
    // umas.push(new Uma(["MIZUMARU","eru","eru","tozanka"]));//375ms。理想的バクシン

    

    
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