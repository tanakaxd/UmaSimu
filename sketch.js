
// const is_describing = true;
const is_describing = false;
const is_repetitive_recording = true;
// const is_repetitive_recording = false;
// const is_logging = true;
// const is_logging = false;
const actual_frame_rate = is_describing?60: 60;//?? 正確性のためどれだけ刻むか。60の方がゲームに忠実かも。内部的なFPSは60が限界の模様
// const virtual_frame_rate = 20;
const bashin_to_meter = 2.5; //"なお現実の1馬身は約2.4mだが、ウマ娘ヘルプ・用語集曰く1バ身約2.5mらしい。(三女神像が腕を伸ばした長さ)"

let course;
const umas = [];
const uma_counts = 1;
const width = 600;
const start_pos = 233;//中盤の始まり,1400/6
const record_ms = [];
const record_x = [];

let base_speed;
let base_accel = 0.0006;
let strategy_phase_coefficiency = 1;
let distance_proficciency_modifier = 1.05;//距離S
let initial_vel;
let initial_acc;//速度と歩調を合わせるために一回割って、frame_rateに合わせるためにもう一回割る
let mid_dest_vel;
let spurt_dest_vel;
let spurt_dest_vel_diff;


function setup() {
    course = new Hanshin1400();
    //umaのパラメータの初期化
    // During opening leg and middle leg,
    // BaseTargetSpeed=BaseSpeed*StrategyPhaseCoef
    // Worth noting that target speed is NOT affected by speed stat in opening leg and middle leg.

    // During final leg and last spurt,
    // BaseTargetSpeed=BaseSpeed*StrategyPhaseCoef+sqrt(500*SpeedStat)*DistanceProficiencyModifier*0.002[m/s]
    //NOTICE:this is in case of insufficient HP

    //     LastSpurtSpeedMax=(BaseTargetSpeedPhase2+0.01*BaseSpeed)*1.05+
    // sqrt(500*SpeedStat)*DistanceProficiencyModifier*0.002+
    // (450*GutsStat)^0.597*0.0001[m/s]


    base_speed = 20.0-(course.race_distance-2000)/1000;
    initial_vel = (base_speed * strategy_phase_coefficiency) / actual_frame_rate;
    mid_dest_vel = (base_speed * strategy_phase_coefficiency) / actual_frame_rate;
    let base_target_speed = base_speed * strategy_phase_coefficiency + Math.sqrt(500*STATS.SPEED)*distance_proficciency_modifier*0.002;
    spurt_dest_vel = ((base_target_speed+0.01*base_speed)*1.05 + Math.sqrt(500*STATS.SPEED)*distance_proficciency_modifier*0.002 + Math.pow(450*STATS.GUTS,0.597)*0.0001)/ actual_frame_rate;
    spurt_dest_vel_diff = spurt_dest_vel-mid_dest_vel;
    
    // Accel=BaseAccel*sqrt(500.0*PowerStat)*StrategyPhaseCoefficient*
    // GroundTypeProficiencyModifier*DistanceProficiencyModifier+
    // SkillModifier+StartDashModifier
    initial_acc = (base_accel*Math.sqrt(500*STATS.POWER)) / actual_frame_rate / actual_frame_rate;
    


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

    // frameRate(actual_frame_rate);//60以上にはならない模様
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
    // umas.push(new Uma(["norikae"]));//n=49226, AVE=92.371ms, MAX=210.83　ワンチャンスも同等
    // umas.push(new Uma(["NORIKAE"]));//n=230, AVE=154.051ms, MAX=390 || n=1552, AVE=159.641ms, MAX=377.5
    // umas.push(new Uma(["tobosha"]));//
    // umas.push(new Uma(["TOBOSHA"]));//
    // umas.push(new Uma(["kage"]));//MAX=127.5
    // umas.push(new Uma(["KAGE"]));//MAX=244.17
    // umas.push(new Uma(["dasshutsu"]));//
    // umas.push(new Uma(["DASSHUTSU"]));//
    // umas.push(new Uma(["professor"]));//MAX=27.5
    // umas.push(new Uma(["PROFESSOR"]));//MAX=77.5
    // umas.push(new Uma(["SPEEDSTAR"]));//
    // umas.push(new Uma(["corner"]));//
    // umas.push(new Uma(["CORNER"]));//
    // umas.push(new Uma(["hidari"]));//
    // umas.push(new Uma(["HIDARI"]));//
    // umas.push(new Uma([],[new AbilitySpurtEarlyRandom(1.2,0.2)]));//n=42625, AVE=73.82ms, MAX=160.83 切れ味
    // umas.push(new Uma([],[new AbilityAccGeneric(3,0.2,1450)]));//MAX=144.17 咲け咲け
    // umas.push(new Uma(["SAIZENRETSUEVO"]));//n=35620, AVE=65.14ms, MAX=344.17
    
    //固有スキル単体
    // umas.push(new Uma(["ERU"]));//
    // umas.push(new Uma(["MONK"]));//
    // umas.push(new Uma(["XOGURIRANDOM"]));//n=43503, AVE=174.068ms, MAX=477.5
    // umas.push(new Uma(["xoguri"]));//n=29460, AVE=110.83ms, MAX=110.83
    // umas.push(new Mizumaru([]));//
    // umas.push(new Golshi([]));//
    // umas.push(new Mac([]));//
    // umas.push(new Oguri([]));//n=10715, AVE=127.5ms, MAX=127.5
    // umas.push(new Uma(["oguri"]));//n=11323, AVE=60.83ms, MAX=60.83
    // umas.push(new Mayano([]));//

    //加速スキルの重複
    
    //スキル複合
    // umas.push(new Uma(["KAGE"]));//n=84605, AVE=244.17ms, MAX=244.17
    // umas.push(new Uma(["norikae","KAGE"]));//n=29530, AVE=303.871ms, MAX=410.83
    // umas.push(new Uma(["saizenretsu","KAGE"]));//n=19404, AVE=274.965ms, MAX=427.5
    // umas.push(new Uma(["SAIZENRETSU","KAGE"]));//n=28904, AVE=285.196ms, MAX=494.17
    // umas.push(new Uma(["SAIZENRETSUEVO","KAGE"]));//n=42118, AVE=285.602ms, MAX=494.17
    // umas.push(new Uma(["saizenretsu","KAGE","norikae"]));//n=22515, AVE=326.34ms, MAX=527.5
    // umas.push(new Uma(["SAIZENRETSU","KAGE","norikae"]));//n=28715, AVE=334.124ms, MAX=560.83
    // umas.push(new Uma(["SAIZENRETSUEVO","KAGE","norikae"]));//n=59290, AVE=334.309ms, MAX=560.83
    // umas.push(new Uma(["KAGE"],[new AbilitySpurtEarlyRandom(1.2,0.2)]));//n=34276, AVE=294.747ms, MAX=377.5
    // umas.push(new Uma(["norikae","KAGE"],[new AbilitySpurtEarlyRandom(1.2,0.2)]));//n=34710, AVE=342.668ms, MAX=510.83
    // umas.push(new Uma([],[new AbilityCmpGeneric(5,0.4,0.15,course.mid_second_random.bind(course))]));//n=33607, AVE=301.687ms, MAX=450
    // umas.push(new Uma([],[new AbilityCurSpdGeneric(3,0.15,course.accum_dist_to_first_spurt)]));//


    

    
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

	const frequency = is_describing ? 1 : 1_000_000;//恣意的な数字？pc性能に依存するならあげられるかも、2000 -> 1_000_000

	for (let i = 0; i < frequency; i++) {
		for (const uma of umas) {
			uma.update();
		}
	}
    if (record_ms.length >= SETTINGS.LOOPS) noLoop();

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