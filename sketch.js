
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
const start_pos = 266;//中盤の始まり1600/6。branch毎に書き換え必要
const record_ms = [];
const record_x = [];

let base_speed;
let base_accel = 0.0006;
let strategy_phase_coefficiency = 1;//脚質ごとにラストスパートの係数が違う。1は追い込みの値
let distance_proficciency_modifier = 1.05;//距離S
let initial_vel;
let initial_acc;//速度と歩調を合わせるために一回割って、frame_rateに合わせるためにもう一回割る
let mid_dest_vel;
let spurt_dest_vel;
let spurt_dest_vel_diff;


function setup() {
    course = new Hanshin1600();
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
    const nishino_unique = new AbilityAccGeneric(4,0.4,course.accum_dist_to_spurt_corner,0);//ニシノ本体
    const nishino_inherited = new AbilityAccGeneric(2.4,0.2,course.accum_dist_to_spurt_corner,200);//ニシノ継承
    const sprint_gear = new AbilityAccGeneric(3,0.2,course.first_spurt_random.bind(course),160);//スプリントギア 
    const sprint_turbo = new AbilityAccGeneric(3,0.4,course.first_spurt_random.bind(course),320);//スプリントターボ
    const ruby_unique = new AbilityCurSpdGeneric(5,0.25,course.accum_dist_to_first_spurt,0);//ルビー固有 
    const ifudodo_ruby = new AbilitySpdGeneric(1.8,0.45,course.final_corner_random.bind(course),380);//威風堂々ルビー進化 
    const conrer_acc = new AbilityAccGeneric(3,0.2,course.corner_random.bind(course),180);//コーナー加速 
    const somurie = new AbilityAccGeneric(3,0.4,course.corner_random.bind(course),360);//ソムリエ 
    const sekka = new AbilityAccGeneric(2.0,0.4,course.first_spurt_early_random.bind(course),360);//石化想定
    const chokkakkou = new AbilityAccGeneric(3,0.2,()=>{return Math.random()*(1195-600)+600},120);//直滑降
    const chokkakkou_rare = new AbilityAccGeneric(3,0.3,()=>{return Math.random()*(1195-600)+600},240);//決意の直滑降
    const chokkakkou_nishino = new AbilityAccGeneric(4,0.3,()=>{return Math.random()*(1195-600)+600},240);//決意の直滑降ニシノ
    const zengosaku = new AbilityAccGeneric(3,0.2,course.mid_second_half_random.bind(course),160);//善後策
    const shikake_junbi = new AbilityAccGeneric(4,0.2,course.mid_random.bind(course),140);//仕掛け準備
    const tsumeyori = new AbilityCmpGeneric(3,0.15,0.05,course.first_spurt_random.bind(course),160);//詰め寄り6位 ~ 9位
    const summer_dober_unique = new AbilitySpdGeneric(5.0,0.35,course.race_distance*0.6,0);//夏ドーベル固有
    const summer_dober_unique_inherited = new AbilitySpdGeneric(3.0,0.15,course.race_distance*0.6,200);//夏ドーベル固有継承
    const osorenu_kokoro = new AbilityCmpGeneric(2.4,0.15,0.05,course.second_half_random.bind(course),180);//恐れぬ心
    const daitanfuteki_summer_dober = new AbilityCmpGeneric(4,0.35,0.1,course.second_half_random.bind(course),360);//大胆不敵夏ドベ
    const sueashi = new AbilitySpdGeneric(2.4,0.15,course.second_spurt_early_random.bind(course),170);//末脚
    const zenshin_zenrei = new AbilitySpdGeneric(2.4,0.35,course.second_spurt_early_random.bind(course),340);//全身全霊
    const zenshin_zenrei_evo = new AbilitySpdGeneric(2.4,0.45,course.second_spurt_early_random.bind(course),340);//全身全霊進化
    const shinzui_tai = new AbilitySpdGeneric(3,0.25,course.second_spurt_random.bind(course),150);//真髄体
    const bakuchi_uchi_nakayama = new AbilitySpdGeneric(1.8,0.55,course.second_half_random.bind(course),240);//博打うちナカヤマ進化
    // const kireaji = new AbilitySpurtEarlyRandom(1.2,0.2);//切れ味
    const kopa_unique = new AbilityCmpGeneric(5,0.4,0.15,course.mid_second_random.bind(course),0);//コパ固有
    const xoguri_unique_gekou = new AbilityCmpGeneric(5,0.25,0.3,course.first_downhill,0);//クリ小栗本体固有下校発動
    const high_voltage = new AbilityAccGeneric(1.8,0.4,course.first_spurt_early_random.bind(course),320);
    const ikuno_unique = new AbilitySpdGeneric(6.0,0.25,course.accum_dist_to_second_spurt,0);//イクノ固有
    const full_throttle = new AbilitySpdGeneric(2.4,0.25,course.mid_random.bind(course),160);//フルスロットル
    const yuo_maishin = new AbilitySpdGeneric(2.4,0.45,course.mid_random.bind(course),320);//勇往邁進
    const yuo_maishin_ikuno = new AbilitySpdGeneric(2.4,0.55,course.race_distance/2,320);//勇往邁進イクノ進化

    //スキル単体
    // umas.push(new Uma([]));//基準
    // umas.push(new Uma(["eru"]))//n=20190, AVE=100ms, MAX=100, CP=-1
    // umas.push(new Uma(["unsu"]))//n=20235, AVE=233.33ms, MAX=233.33, CP=-1
    // umas.push(new Uma(["mizumaru"]))//
    // umas.push(new Uma(["mac"]))//
    // umas.push(new Uma(["oguri"]))//n=20174, AVE=50ms, MAX=50, CP=-1
    // umas.push(new Uma(["norikae"]))//n=20199, AVE=127.027ms, MAX=200, CP=0.71
    // umas.push(new Uma(["NORIKAE"]))//n=20230, AVE=220.466ms, MAX=366.67, CP=0.61
    // umas.push(new Uma(["tobosha"]))//n=20186, AVE=87.489ms, MAX=266.67, CP=0.49
    // umas.push(new Uma(["TOBOSHA"]))//n=20209, AVE=154.863ms, MAX=466.67, CP=0.43
    // umas.push(new Uma(["kage"]))//n=20196, AVE=116.67ms, MAX=116.67, CP=0.65
    // umas.push(new Uma(["KAGE"]))//n=20229, AVE=216.67ms, MAX=216.67, CP=0.6
    // umas.push(new Uma(["dasshutsu"]))//n=20175, AVE=53.956ms, MAX=100, CP=0.3
    // umas.push(new Uma(["DASSHUTSU"]))//n=20189, AVE=94.935ms, MAX=216.67, CP=0.26
    // umas.push(new Uma(["professor"]))//n=20169, AVE=35.577ms, MAX=100, CP=0.2
    // umas.push(new Uma(["PROFESSOR"]))//n=20181, AVE=72.419ms, MAX=200, CP=0.2
    // umas.push(new Uma(["SPEEDSTAR"]))//
    // umas.push(new Uma(["corner"]))//
    // umas.push(new Uma(["CORNER"]))//
    // umas.push(new Uma(["hidari"]))//
    // umas.push(new Uma(["HIDARI"]))//
    
    // umas.push(new Uma([],[sprint_gear]))//
    // umas.push(new Uma([],[sprint_turbo]))//
    // umas.push(new Uma([],[sekka]))//
    // umas.push(new Uma([],[nishino_inherited]))//n=20235, AVE=233.33ms, MAX=233.33, CP=1.17
    // umas.push(new Uma([],[chokkakkou]))//n=20178, AVE=61.693ms, MAX=266.67, CP=0.51
    // umas.push(new Uma([],[chokkakkou_rare]))//n=20186, AVE=84.973ms, MAX=383.33, CP=0.35
    // umas.push(new Uma([],[chokkakkou_nishino]))//n=20193, AVE=106.604ms, MAX=400, CP=0.44
    // umas.push(new Uma([],[zengosaku]))//
    // umas.push(new Uma([],[shikake_junbi]))//
    // umas.push(new Uma([],[conrer_acc]))//n=20172, AVE=44.05ms, MAX=266.67, CP=0.24
    // umas.push(new Uma([],[somurie]))//n=20183, AVE=77.201ms, MAX=466.67, CP=0.21
    // umas.push(new Uma([],[tsumeyori]))//
    // umas.push(new Uma([],[summer_dober_unique]))//n=20235, AVE=233.33ms, MAX=233.33, CP=NaN
    // umas.push(new Uma([],[summer_dober_unique_inherited]))//n=20174, AVE=50ms, MAX=50, CP=0.25
    // umas.push(new Uma([],[osorenu_kokoro]))//
    // umas.push(new Uma([],[daitanfuteki_summer_dober]))//
    // umas.push(new Uma([],[sueashi]))//
    // umas.push(new Uma([],[zenshin_zenrei]))//n=20174, AVE=50ms, MAX=50, CP=0.15
    // umas.push(new Uma([],[zenshin_zenrei_evo]))//n=20179, AVE=66.67ms, MAX=66.67, CP=0.2
    // umas.push(new Uma([],[shinzui_tai]))//
    // umas.push(new Uma([],[ruby_unique]))//
    // umas.push(new Uma([],[ifudodo_ruby]))//
    // umas.push(new Uma([],[bakuchi_uchi_nakayama]))//
    // umas.push(new Uma([],[kireaji]))//
    // umas.push(new Uma([],[kopa_unique]))//
    // umas.push(new Uma([],[full_throttle]))//n=20176, AVE=57.416ms, MAX=150, CP=0.36
    // umas.push(new Uma([],[yuo_maishin]))//n=20189, AVE=95.848ms, MAX=250, CP=0.3
    // umas.push(new Uma([],[yuo_maishin_ikuno]))//n=20190, AVE=100ms, MAX=100, CP=0.31
    
    //本体固有スキル単体
    // umas.push(new Uma([],[ikuno_unique]))//n=20190, AVE=100ms, MAX=100, CP=-1
    // umas.push(new Uma([],[nishino_unique]))//n=20043, AVE=483.33ms, MAX=483.33
    // umas.push(new Uma(["TAIKI"]))//n=20005, AVE=366.67ms, MAX=366.67
    // umas.push(new Uma([],[summer_dober_unique]))//
    // umas.push(new Oguri([]))//n=20202, AVE=133.33ms, MAX=133.33, CP=-1
    // umas.push(new Unsu([]))//
    // umas.push(new Uma(["ERU"]))//n=20240, AVE=250ms, MAX=250, CP=-1
    // umas.push(new Uma([],[xoguri_unique_gekou]))//n=20016, AVE=400ms, MAX=400, CP=NaN
    // umas.push(new Uma(["XOGURI"]))//
    // umas.push(new Uma(["XOGURIRANDOM"]))//
    // umas.push(new Mizumaru([]))//
    // umas.push(new Golshi([]))//
    // umas.push(new Mac([]))//
    // umas.push(new Mayano([]))//


    //スキル複合
    // umas.push(new Uma(["norikae"],[conrer_acc,sprint_gear]))//
    // umas.push(new Uma(["NORIKAE"],[conrer_acc,sprint_gear]))//
    // umas.push(new Uma(["norikae"],[sekka,sprint_gear]))//
    // umas.push(new Uma(["NORIKAE"],[sekka,sprint_gear]))//
    // umas.push(new Uma(["norikae"],[sekka,conrer_acc,sprint_gear]))//

    // umas.push(new Uma([],[nishino_unique]))//
    // umas.push(new Uma(["norikae"],[nishino_unique]))//
    // umas.push(new Uma(["NORIKAE"],[nishino_unique]))//
    // umas.push(new Uma(["norikae"],[nishino_unique,chokkakkou]))//
    // umas.push(new Uma(["norikae"],[nishino_unique,chokkakkou_nishino]))//
    // umas.push(new Uma(["NORIKAE"],[nishino_unique,chokkakkou_nishino]))//
    // umas.push(new Uma(["norikae"],[high_voltage]))//n=20254, AVE=292.954ms, MAX=500, CP=0.59
    // umas.push(new Uma(["norikae"],[high_voltage,chokkakkou]))//n=20264, AVE=321.615ms, MAX=616.67, CP=0.52
    // umas.push(new Uma(["norikae"],[high_voltage,nishino_inherited]))//n=20028, AVE=435.265ms, MAX=633.33, CP=0.62
    // umas.push(new Uma(["norikae"],[high_voltage,nishino_inherited,chokkakkou]))//n=20035, AVE=457.405ms, MAX=700, CP=0.56 ★★★★★
    // umas.push(new Uma(["norikae"],[nishino_unique,sprint_gear]))//
    // umas.push(new Uma(["norikae"],[nishino_unique,sprint_gear,conrer_acc]))//
    // umas.push(new Uma(["norikae"],[nishino_unique,sprint_turbo,conrer_acc]))//
    // umas.push(new Uma(["norikae"],[nishino_unique,sprint_turbo,somurie]))//






    
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

    if (record_ms.length >= SETTINGS.LOOPS) {
        noLoop();
        umas.forEach(uma=>uma.log());
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

//TO O 一人ひとりにデータを保持させる手もある。そっちの方が自然だし拡張性がある
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