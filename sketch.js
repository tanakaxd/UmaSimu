
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


const record_ms = [];
const record_x = [];


function setup() {
    let button1 = select("#stop");  
	let button2 = select("#resume");
	button1.mousePressed(stop);
	button2.mousePressed(resume);

    frameRate(actual_frame_rate);
	createCanvas(simulated_distance, width);

    //スキル単体
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));//基準。94881frame
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu"]));//233ms
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["mizumaru"]));//44ms
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["mac"]));//96ms
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["suzuka"]));//20ms
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["oguri"]));//59ms
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["rudolf"]));//31ms。ただし、加速しきっていれば62ms
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["CHIKARA"]));//AVE88ms,n=152
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["tobosha"]));//AVE137ms,n=337
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["TOBOSHA"]));//AVE227ms,n=170
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["dasshutsu"]));//44ms
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["DASSHUTSU"]));//99ms
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["professor"]));//26ms
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["PROFESSOR"]));//56ms
    umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["SPEEDSTAR"]));//AVE39ms,n=88
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["hidari"]));//44ms
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["HIDARI"]));//65ms
    
    //固有スキル単体
    // umas.push(new Oguri(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));//144ms
    // umas.push(new Rudolf(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));//128ms
    // umas.push(new Mac(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));//217ms
    // umas.push(new Mayano(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));//MAX443ms。早ければ早いほど強い。速度と加速を個別に計算して足すことはできない
    // umas.push(new Taiki(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));//292ms
    // umas.push(new Unsu(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));//382ms
    // umas.push(new Suzuka(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));//101ms
    // umas.push(new Mizumaru(Uma.counter,0, height / 8 + Uma.counter * height / 10,[]));//170ms

    //加速スキルの重複
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu"]));//233ms
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","unsu"]));//382ms
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","unsu","unsu"]));//465ms
    // umas.push(new Uma(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","unsu","unsu","unsu"]));//521ms

    

    // umas.push(new Taiki(Uma.counter,0, height / 8 + Uma.counter * height / 10,["oguri"]));//351ms
    // umas.push(new Taiki(Uma.counter,0, height / 8 + Uma.counter * height / 10,["mac"]));//378ms
    // umas.push(new Taiki(Uma.counter,0, height / 8 + Uma.counter * height / 10,["mac","unsu"]));//508ms
    // umas.push(new Taiki(Uma.counter,0, height / 8 + Uma.counter * height / 10,["mac","unsu","tobosha"]));//AVE543ms,n=1002
    // umas.push(new Taiki(Uma.counter,0, height / 8 + Uma.counter * height / 10,["mac","unsu","TOBOSHA"]));//AVE567ms,n=1047
    // umas.push(new Taiki(Uma.counter,0, height / 8 + Uma.counter * height / 10,["mac","HIDARI","HIDARI","oguri","oguri"]));//

    // umas.push(new Mizumaru(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu"]));//403ms
    // umas.push(new Mizumaru(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","mac"]));//487ms
    // umas.push(new Mizumaru(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","mac","tobosha"]));//AVE=562,n=1750
    // umas.push(new Mizumaru(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","mac","TOBOSHA"]));//AVE=605,n=1999
    // umas.push(new Mizumaru(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","mac","HIDARI","HIDARI"]));//631ms
    // umas.push(new Mizumaru(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","mac","HIDARI","HIDARI","tobosha"]));//700ms,n=186
    // umas.push(new Mizumaru(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","mac","HIDARI","HIDARI","TOBOSHA"]));//766ms,n=149
    
    
    // for (let i = 0; i < 20; i++) {
    //     umas.push(new Mayano(Uma.counter,0, 40 + Uma.counter * 40,[],i*10));//MAX443ms。早ければ早いほど強い
    // }
        
    // umas.push(new Suzuka(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu"]));//363ms
    // umas.push(new Unsu(Uma.counter,0, height / 8 + Uma.counter * height / 10,["suzuka"]));//420ms
    // umas.push(new Mizumaru(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu"]));//403ms
    // umas.push(new Unsu(Uma.counter,0, height / 8 + Uma.counter * height / 10,["TOBOSHA"]));//453ms,n=948
    // umas.push(new Suzuka(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","TOBOSHA"]));//AVE498ms,n=173
    // umas.push(new Unsu(Uma.counter,0, height / 8 + Uma.counter * height / 10,["suzuka","TOBOSHA"]));//AVE487ms,n=313
    // umas.push(new Mizumaru(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","TOBOSHA"]));//AVE536ms,n=144

    // umas.push(new Suzuka(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","TOBOSHA","mac"]));//
    // umas.push(new Unsu(Uma.counter,0, height / 8 + Uma.counter * height / 10,["suzuka","DASSHUTSU","mac"]));//
    // umas.push(new Mizumaru(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","mac","HIDARI","HIDARI"]));//631ms
    // umas.push(new Mizumaru(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","mac","HIDARI","HIDARI","tobosha"]));//700ms,n=186
    // umas.push(new Mizumaru(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","mac","HIDARI","HIDARI","TOBOSHA"]));//766ms,n=149

    // umas.push(new Mizumaru(Uma.counter,0, height / 8 + Uma.counter * height / 10,["unsu","mac"]));//
    // umas.push(new Taiki(Uma.counter,0, height / 8 + Uma.counter * height / 10,["mac"]));//

        
    
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