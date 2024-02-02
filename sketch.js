
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
    const nishino_inherited = new AbilityAccGeneric(2.4,0.2,course.final_corner_half.bind(course),200);//ニシノ継承
    const sprint_gear = new AbilityAccGeneric(3,0.2,course.first_spurt_random.bind(course),160);//スプリントギア 
    const sprint_turbo = new AbilityAccGeneric(3,0.4,course.first_spurt_random.bind(course),320);//スプリントターボ
    const ruby_unique = new AbilityCurSpdGeneric(5,0.25,course.accum_dist_to_first_spurt);//ルビー固有 
    const ruby_evo = new AbilitySpdGeneric(1.8,0.45,course.final_corner_random.bind(course),380);//ルビー進化 
    const conrer_acc = new AbilityAccGeneric(3,0.2,course.corner_random.bind(course),180);//コーナー加速 
    const somurie = new AbilityAccGeneric(3,0.4,course.corner_random.bind(course),360);//ソムリエ 
    // const sekka = new AbilitySpurtEarlyRandom(2,0.4);//石化想定
    const sekka = new AbilityAccGeneric(2.0,0.4,course.first_spurt_early_random.bind(course),360);//石化想定
    const chokkakkou = new AbilityAccGeneric(3,0.2,()=>{return Math.random()*(1195-600)+600},120);//直滑降
    const chokkakkou_rare = new AbilityAccGeneric(3,0.3,()=>{return Math.random()*(1195-600)+600},240);//決意の直滑降
    const chokkakkou_evo = new AbilityAccGeneric(4,0.3,()=>{return Math.random()*(1195-600)+600},240);//決意の直滑降ニシノ
    const zengosaku = new AbilityAccGeneric(3,0.2,course.mid_second_half_random.bind(course),160);//善後策
    const shikake_junbi = new AbilityAccGeneric(4,0.2,course.mid_random.bind(course),140);//仕掛け準備
    const tsumeyori = new AbilityCmpGeneric(3,0.15,0.05,course.first_spurt_random.bind(course),160);//詰め寄り6位 ~ 9位
    const summer_dober_unique = new AbilitySpdGeneric(5.0,0.35,course.race_distance*0.6);//夏ドーベル固有
    const summer_dober_unique_inherited = new AbilitySpdGeneric(3.0,0.15,course.race_distance*0.6,200);//夏ドーベル固有継承
    const osorenu_kokoro = new AbilityCmpGeneric(2.4,0.15,0.05,course.second_half_random.bind(course),180);//恐れぬ心
    const daitanfuteki_evo = new AbilityCmpGeneric(4,0.35,0.1,course.second_half_random.bind(course),360);//大胆不敵夏ドベ
    const sueashi = new AbilitySpdGeneric(2.4,0.15,course.second_spurt_early_random.bind(course),170);//末脚
    const zenshin_zenrei = new AbilitySpdGeneric(2.4,0.35,course.second_spurt_early_random.bind(course),340);//全身全霊
    const shinzui_tai = new AbilitySpdGeneric(3,0.25,course.second_spurt_random.bind(course),150);//真髄体
    const bakuchi_uchi_nakayama = new AbilitySpdGeneric(1.8,0.55,course.second_half_random.bind(course),240);

    //スキル単体
    // umas.push(new Uma([]));//基準
    // umas.push(new Uma(["eru"]));//
    // umas.push(new Uma(["unsu"]));//MAX=200
    // umas.push(new Uma(["mizumaru"]));//
    // umas.push(new Uma(["mac"]));//
    // umas.push(new Uma(["oguri"]));//33ms
    // umas.push(new Uma(["norikae"]));//n=20148, AVE=109.262ms, MAX=166.67, CP=0.61
    // umas.push(new Uma(["NORIKAE"]));//n=20183, AVE=202.424ms, MAX=300, CP=0.56
    // umas.push(new Uma(["tobosha"]));//
    // umas.push(new Uma(["TOBOSHA"]));//n=20171, AVE=168.874ms, MAX=416.67, CP=0.47
    // umas.push(new Uma(["kage"]));//
    // umas.push(new Uma(["KAGE"]));//
    // umas.push(new Uma(["dasshutsu"]));//n=20115, AVE=22.741ms, MAX=83.33
    // umas.push(new Uma(["DASSHUTSU"]));//n=20136, AVE=77.674ms, MAX=200
    // umas.push(new Uma(["professor"]));//n=20113, AVE=18.902ms, MAX=83.33
    // umas.push(new Uma(["PROFESSOR"]));//n=20126, AVE=51.766ms, MAX=183.33, CP=0.14
    // umas.push(new Uma(["SPEEDSTAR"]));//AVE=23.895ms, MAX=150
    // umas.push(new Uma(["corner"]));//n=20114, AVE=20.888ms, MAX=83.33
    // umas.push(new Uma(["CORNER"]));//n=20125, AVE=50.456ms, MAX=133.33
    // umas.push(new Uma(["hidari"]));//
    // umas.push(new Uma(["HIDARI"]));//
    // umas.push(new Uma([],[new AbilitySpurtEarlyRandom(1.2,0.2)]));//切れ味
    // umas.push(new Uma([],[new AbilityCmpGeneric(5,0.4,0.15,course.mid_second_random.bind(course))]));//コパ固有

    // umas.push(new Uma([],[sprint_gear]));//スプリントギア n=20138, AVE=82.823ms, MAX=233.33, CP=0.52
    // umas.push(new Uma([],[sprint_turbo]));//スプリントターボ n=20160, AVE=141.567ms, MAX=416.67, CP=0.44
    // umas.push(new Uma([],[sekka]));//石化想定 n=20188, AVE=215.068ms, MAX=333.33, CP=0.6
    // umas.push(new Uma([],[nishino_inherited]));//ニシノ継承 n=20144, AVE=100ms, MAX=100, CP=0.5
    // umas.push(new Uma([],[chokkakkou]));//直滑降 n=20126, AVE=51.521ms, MAX=233.33, CP=0.43
    // umas.push(new Uma([],[chokkakkou_rare]));//直滑降レア n=20134, AVE=72.896ms, MAX=333.33, CP=0.3
    // umas.push(new Uma([],[chokkakkou_evo]));//直滑降ニシノ進化 n=20141, AVE=90.51ms, MAX=366.67, CP=0.38
    // umas.push(new Uma([],[zengosaku]));//善後策 n=20118, AVE=31.734ms, MAX=233.33, CP=0.2
    // umas.push(new Uma([],[shikake_junbi]));//仕掛け準備 n=20116, AVE=26.528ms, MAX=266.67, CP=0.19
    // umas.push(new Uma([],[conrer_acc]));//コーナー加速 n=20124, AVE=46.642ms, MAX=233.33, CP=0.26
    // umas.push(new Uma([],[somurie]));//ソムリエ n=20138, AVE=84.713ms, MAX=416.67, CP=0.24
    // umas.push(new Uma([],[tsumeyori]));//詰め寄り n=20117, AVE=27.182ms, MAX=66.67, CP=0.17
    // umas.push(new Uma([],[summer_dober_unique_inherited]));//夏ドベ継承
    // umas.push(new Uma([],[osorenu_kokoro]));//恐れぬ心 n=20115, AVE=24.004ms, MAX=100, CP=0.13
    // umas.push(new Uma([],[daitanfuteki_evo]));//大胆不敵夏ドベ n=20142, AVE=94.513ms, MAX=266.67, CP=0.26
    // umas.push(new Uma([],[sueashi]));//末脚 n=20113, AVE=16.67ms, MAX=16.67, CP=0.1
    // umas.push(new Uma([],[zenshin_zenrei]));//全身全霊 n=20119, AVE=33.33ms, MAX=33.33, CP=0.1
    // umas.push(new Uma([],[shinzui_tai]));//真髄体 n=20116, AVE=24.414ms, MAX=33.33, CP=0.16
    // umas.push(new Uma([],[ruby_unique]));//ルビー固有 n=20144, AVE=100ms, MAX=100
    // umas.push(new Uma([],[ruby_evo]));//ルビー進化 n=20126, AVE=53.12ms, MAX=216.67, CP=0.14
    // umas.push(new Uma([],[bakuchi_uchi_nakayama]));//ナカヤマ博打うち進化 n=20122, AVE=42.293ms, MAX=250, CP=0.18

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
    // umas.push(new Uma([],[summer_dober_unique]));//夏ドーベル固有　n=20182, AVE=200ms, MAX=200, CP=NaN


    //スキル複合
    umas.push(new Uma(["norikae"],[conrer_acc,sprint_gear]));//n=20186, AVE=209.298ms, MAX=500, CP=0.4
    // umas.push(new Uma(["NORIKAE"],[conrer_acc,sprint_gear]));//n=20213, AVE=280.057ms, MAX=583.33, CP=0.4
    // umas.push(new Uma(["norikae"],[sekka,sprint_gear]));//n=20228, AVE=320.088ms, MAX=583.33, CP=0.46 ★★★★★
    // umas.push(new Uma(["NORIKAE"],[sekka,sprint_gear]));//n=20246, AVE=365.927ms, MAX=650, CP=0.42
    // umas.push(new Uma(["norikae"],[sekka,conrer_acc,sprint_gear]));//n=20237, AVE=343.711ms, MAX=633.33, CP=0.39

    // umas.push(new Uma([],[nishino]));//ニシノ本体 n=20259, AVE=400ms, MAX=400
    // umas.push(new Uma(["norikae"],[nishino]));//n=20282, AVE=458.969ms, MAX=516.67
    // umas.push(new Uma(["NORIKAE"],[nishino]));//n=20298, AVE=501.502ms, MAX=600
    // umas.push(new Uma(["norikae"],[nishino,chokkakkou]));//n=20289, AVE=478.754ms, MAX=616.67 ★★★★★
    // umas.push(new Uma(["norikae"],[nishino,chokkakkou_evo]));//n=20296, AVE=494.748ms, MAX=650
    // umas.push(new Uma(["norikae"],[nishino,sprint_gear]));//n=20291, AVE=483.115ms, MAX=616.67
    // umas.push(new Uma(["norikae"],[nishino,sprint_gear,conrer_acc]));//n=20298, AVE=500.971ms, MAX=683.33
    // umas.push(new Uma(["norikae"],[nishino,sprint_turbo,conrer_acc]));//n=20303, AVE=513.632ms, MAX=716.67
    // umas.push(new Uma(["norikae"],[nishino,sprint_turbo,somurie]));//n=20307, AVE=525.199ms, MAX=766.67






    
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