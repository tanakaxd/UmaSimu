
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


    //生成スキル
    const nishino = new AbilityAccGeneric(4,0.4,course.final_corner_half.bind(course));//ニシノ本体
    const nishino_inherited = new AbilityAccGeneric(2.4,0.2,course.final_corner_half.bind(course));//ニシノ継承
    const sprint_gear = new AbilityAccGeneric(3,0.2,course.first_spurt_random.bind(course));//スプリントギア 
    const ruby_self = new AbilityCurSpdGeneric(5,0.25,course.accum_dist_to_first_spurt);//ルビー固有 
    const ruby_evo = new AbilitySpdGeneric(1.8,0.45,course.final_corner_random.bind(course));//ルビー進化 
    const conrer_acc = new AbilityAccGeneric(3,0.2,course.corner_random.bind(course));//コーナー加速 
    const somurie = new AbilityAccGeneric(3,0.4,course.corner_random.bind(course));//ソムリエ 
    const sekka = new AbilitySpurtEarlyRandom(2,0.4);//石化想定

    //スキル単体
    // umas.push(new Uma([]));//基準
    // umas.push(new Uma(["eru"]));//
    // umas.push(new Uma(["unsu"]));//MAX=200
    // umas.push(new Uma(["mizumaru"]));//
    // umas.push(new Uma(["mac"]));//
    // umas.push(new Uma(["oguri"]));//33ms
    // umas.push(new Uma(["norikae"]));//n=20148, AVE=109.039ms, MAX=166.67
    // umas.push(new Uma(["NORIKAE"]));//n=20183, AVE=202.037ms, MAX=300
    // umas.push(new Uma(["tobosha"]));//
    // umas.push(new Uma(["TOBOSHA"]));//n=20170, AVE=168.543ms, MAX=416.67
    // umas.push(new Uma(["kage"]));//
    // umas.push(new Uma(["KAGE"]));//
    // umas.push(new Uma(["dasshutsu"]));//n=20115, AVE=22.741ms, MAX=83.33
    // umas.push(new Uma(["DASSHUTSU"]));//n=20136, AVE=77.674ms, MAX=200
    // umas.push(new Uma(["professor"]));//
    // umas.push(new Uma(["PROFESSOR"]));//
    // umas.push(new Uma(["SPEEDSTAR"]));//AVE=23.895ms, MAX=150
    // umas.push(new Uma(["corner"]));//
    // umas.push(new Uma(["CORNER"]));//
    // umas.push(new Uma(["hidari"]));//
    // umas.push(new Uma(["HIDARI"]));//
    // umas.push(new Uma([],[new AbilitySpurtEarlyRandom(1.2,0.2)]));//切れ味
    // umas.push(new Uma([],[new AbilitySpurtEarlyRandom(2,0.4)]));//石化想定 AVE=215.589ms, MAX=333.33
    // umas.push(new Uma([],[new AbilityCmpGeneric(5,0.4,0.15,course.mid_second_random.bind(course))]));//コパ固有
    // umas.push(new Uma([],[new AbilityAccGeneric(3,0.2,course.first_spurt_random.bind(course))]));//スプリントギア n=20138, AVE=83.145ms, MAX=233.33
    // umas.push(new Uma([],[new AbilityCurSpdGeneric(5,0.25,course.accum_dist_to_first_spurt)]));//ルビー固有 n=20144, AVE=100ms, MAX=100
    // umas.push(new Uma([],[new AbilitySpdGeneric(1.8,0.45,course.final_corner_random.bind(course))]));//ルビー進化 n=20127, AVE=53.439ms, MAX=216.67
    // umas.push(new Uma([],[new AbilityAccGeneric(3,0.2,course.corner_random.bind(course))]));//コーナー加速 AVE=47.836ms, MAX=233.33
    // umas.push(new Uma([],[new AbilityAccGeneric(3,0.4,course.corner_random.bind(course))]));//ソムリエ n=20138, AVE=84.705ms, MAX=416.67
    // umas.push(new Uma([],[new AbilityAccGeneric(4,0.2,course.mid_random.bind(course))]));//仕掛け準備 n=20116, AVE=26.806ms, MAX=266.67
    // umas.push(new Uma([],[nishino_inherited]));//ニシノ継承 n=20144, AVE=100ms, MAX=100
    
    //本体固有スキル単体
    // umas.push(new Uma([],[nishino]));//ニシノ本体 n=20259, AVE=400ms, MAX=400
    // umas.push(new Uma(["TAIKI"]));//n=12357, AVE=450ms, MAX=450
    // umas.push(new Oguri([]));//n=13539, AVE=116.67ms, MAX=116.67
    // umas.push(new Unsu([]));//450ms
    // umas.push(new Uma(["ERU"]));//
    // umas.push(new Uma(["MONK"]));//
    // umas.push(new Uma(["XOGURIRANDOM"]));//
    // umas.push(new Mizumaru([]));//
    // umas.push(new Golshi([]));//
    // umas.push(new Mac([]));//
    // umas.push(new Mayano([]));//

    //スキル複合
    // umas.push(new Uma(["norikae"],[conrer_acc,sprint_gear]));//n=20186, AVE=208.263ms, MAX=500
    // umas.push(new Uma(["NORIKAE"],[conrer_acc,sprint_gear]));//n=20213, AVE=280.637ms, MAX=600
    // umas.push(new Uma(["norikae"],[sekka,sprint_gear]));//n=20228, AVE=319.774ms, MAX=583.33 ★★★★★
    // umas.push(new Uma(["NORIKAE"],[sekka,sprint_gear]));//n=20247, AVE=368.321ms, MAX=650
    // umas.push(new Uma(["norikae"],[sekka,conrer_acc,sprint_gear]));//AVE=342.59ms, MAX=633.33





    
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