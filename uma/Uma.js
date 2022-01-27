class Uma {
    static counter = 1;
    static top_frame = -1;

    constructor(abilities, id = Uma.counter, x = start_pos, y = height / 8 + Uma.counter * height / 10) {
        this.id = id;
		this.pos = createVector(x, y);
		this.r = 25;
		this.vel = createVector(initial_vel,0);
        this.acc = createVector(initial_acc, 0);
        this.phase = PHASE.EARLY;
        this.progression = PROGRESSION.PRE_THIRD_CORNER;
        this.isSpurt = false;
        this.dest_vel = mid_dest_vel;
        this.abilities = [];
        this.vt_every_sec = [];

        abilities.forEach(element => {
            let ability;
            switch (element) {
                case "UNSU":
                    ability = new AbilityUnsu(false);
                    break;
                case "unsu":
                    ability = new AbilityUnsu(true);
                    break;
                case "OGURI":
                    ability = new AbilityOguri(false);
                    break;
                case "oguri":
                    ability = new AbilityOguri(true);
                    break;
                case "TAIKI":
                    ability = new AbilityTaiki(false);
                    break;
                case "taiki":
                    ability = new AbilityTaiki(true);
                    break;           
                case "SUZUKA":
                    ability = new AbilitySuzuka(false);
                    break;
                case "suzuka":
                    ability = new AbilitySuzuka(true);
                    break;
                case "MAC":
                    ability = new AbilityMac(false);
                    break;
                case "mac":
                    ability = new AbilityMac(true);
                    break;
                case "RUDOLF":
                    ability = new AbilityRudolf(false);
                    break;
                case "rudolf":
                    ability = new AbilityRudolf(true);
                    break;
                case "MIZUMARU":
                    ability = new AbilityMizumaru(false);
                    break;
                case "mizumaru":
                    ability = new AbilityMizumaru(true);
                    break;
                case "GOLSHI":
                    ability = new AbilityGolshi(false);
                    break;
                case "golshi":
                    ability = new AbilityGolshi(true);
                    break;
                case "XOGURI":
                    ability = new AbilityXOguri(false);
                    break;
                case "xoguri":
                    ability = new AbilityXOguri(true);
                    break;
                case "XOGURIRANDOM":
                    ability = new AbilityXOguriRandom(false);
                    break;
                case "xogurirandom":
                    ability = new AbilityXOguriRandom(true);
                    break;
                case "TAMAMO":
                    ability = new AbilityTamamo(false);
                    break;
                case "tamamo":
                    ability = new AbilityTamamo(true);
                    break         
                case "ERU":
                    ability = new AbilityEru(false);
                    break;
                case "eru":
                    ability = new AbilityEru(true);
                    break        
                case "BONO":
                    ability = new AbilityBono(false);
                    break;
                case "bono":
                    ability = new AbilityBono(true);
                    break     
                case "EAGURU":
                    ability = new AbilityEaguru(false);
                    break;
                case "eaguru":
                    ability = new AbilityEaguru(true);
                    break                  
                case "TOBOSHA":
                    ability = new AbilityTobosha(true);
                    break;
                case "tobosha":
                    ability = new AbilityTobosha(false);
                    break;
                case "KAGE":
                    ability = new AbilityKage(true);
                    break;
                case "kage":
                    ability = new AbilityKage(false);
                    break;   
                case "tozanka":
                    ability = new AbilityTozanka(false);
                    break;                  
                case "DASSHUTSU":
                    ability = new AbilityDasshutsu(true);
                    break;
                case "dasshutsu":
                    ability = new AbilityDasshutsu(false);
                    break;
                case "PROFESSOR":
                    ability = new AbilityProfessor(true);
                    break;
                case "professor":
                    ability = new AbilityProfessor(false);
                    break;                
                case "SPEEDSTAR":
                    ability = new AbilitySpeedStar(true);
                    break;
                case "speedstar":
                    ability = new AbilitySpeedStar(false);
                    break;
                case "CORNER":
                    ability = new AbilityCorner(true);
                    break;
                case "corner":
                    ability = new AbilityCorner(false);
                    break;     
                case "CHIKARA":
                    ability = new AbilityAoharuChikara(true);
                    break;
                case "chikara":
                    ability = new AbilityAoharuChikara(false);
                    break;
                case "NORIKAE":
                    ability = new AbilityNorikae(true);
                    break;
                case "norikae":
                    ability = new AbilityNorikae(false);
                    break;                     
                case "HIDARI":
                    ability = new AbilityHidariMawari(true);
                    break;
                case "hidari":
                    ability = new AbilityHidariMawari(false);
                    break;
                default:
                    console.log("invalid skill name: " + element);
            }
            this.abilities.push(ability);
        });


        this.elapsed_frame = 0;
        this.goal_time;
        this.finished = false;

        Uma.counter++;
    }
    

    init() {
        this.pos.x = start_pos;
        this.vel.x = initial_vel;
        this.acc.x = initial_acc;
        this.phase = PHASE.EARLY;
        this.progression = PROGRESSION.PRE_THIRD_CORNER;;
        this.isSpurt = false;
        this.dest_vel = mid_dest_vel;
        this.elapsed_frame = 0;
        this.goal_time = -1;
        this.finished = false;
        this.abilities.forEach(a =>  a.init() );
    }

    update() {
        if(is_describing)this.show();
        if (this.finished) return;
        
        for (const ability of this.abilities) {
            ability.update(this);
        }

        //TODO 速度が上限突破していた時の仕様
        
        if (this.vel.x < this.dest_vel) {
            this.vel.add(this.acc);
            if (this.vel.x > this.dest_vel) {
                this.vel.x = this.dest_vel;
            }
        } else if(this.vel.x == this.dest_vel){
        } else {
            //目標速度のほうが上。例えば速度スキルが切れた場合
            this.vel.sub(initial_acc);//実際の仕様がどうなっているのかは不明だが、一律で徐々に速度を落としていくように実装
            if (this.vel.x < this.dest_vel) {
                this.vel.x = this.dest_vel;
            }
        }

        if(!is_repetitive_recording)this.record_vt_every_frame();
        
        this.pos = this.pos.add(this.vel);
        this.check_phase();
        this.check_progression();

        this.elapsed_frame++;
        this.edge();

                
    }

    check_phase() {
        this.phase = course.get_phase(this.pos.x);
        //終盤に入った時一度だけ
        if (this.phase == PHASE.FINAL_FIRST&&!this.isSpurt) {
            //単純な上書きだと速度スキルをかき消してしまう
            this.dest_vel += spurt_dest_vel_diff;
            this.isSpurt = true;
        }
    }
    

    check_progression() {
        this.progression = course.get_progression(this.pos.x);
    }

	edge() {
		if (this.pos.x >= course.race_distance) {
            this.pos.x = course.race_distance;
            this.goal_time = this.elapsed_frame / actual_frame_rate;
            this.finished = true;
            
            let bashin_diff;
            if (Uma.top_frame == -1) {
                Uma.top_frame = this.elapsed_frame;
                bashin_diff = "TOP";
            }
            else {
                const num = Math.round((this.elapsed_frame - Uma.top_frame) * mid_dest_vel*1000)/1000;
                // console.log(this.elapsed_frame - Uma.top_frame);
                // console.log(num);
                bashin_diff = num+ "m";
            }

            const diff_from_standard_ms = (course.standard_frame * (actual_frame_rate / 1200) - this.elapsed_frame) * 1000/actual_frame_rate;//1200は基準フレーム数を計測したときのフレームレート
   
            if (is_logging) {
            }
            
            if (is_repetitive_recording) {
                record_ms.push(roundNum(diff_from_standard_ms, 2));
                
                //TODO temporal
                this.abilities.forEach(a => a.record(this));
                
                this.init();
            } else {
                console.log("#"+this.id+" 基準との差:"+roundNum(diff_from_standard_ms,2)+ "ms"+" トップとの差:"+bashin_diff +" タイム:"+ Math.round(this.goal_time*1000)/1000+"秒");
                console.log(this);
                this.vt_chart();
                noLoop();
            }
		}
	}

    show() {

		fill(100, 40);
        ellipse(this.pos.x, this.pos.y, this.r, this.r);
        
		let endpointx = this.pos.x + this.acc.x * 200 * actual_frame_rate*actual_frame_rate;
		let endpointy = this.pos.y + this.acc.y * 200 * actual_frame_rate*actual_frame_rate;
        push();
        let weight = 1 + (this.vel.x - initial_vel) * 100;
		strokeWeight(weight);
        line(this.pos.x, this.pos.y, endpointx, endpointy);
        pop();
        
        push();
        fill(51);
        textSize(32);
        text(this.constructor.name, this.pos.x, this.pos.y);
        pop();

        push();
        fill(51);
        textSize(16);
        text(roundNum(this.vel.x*actual_frame_rate,3), this.pos.x, this.pos.y+this.r);
        pop();

    }

    record_vt_every_sec() {
        if (this.elapsed_frame % actual_frame_rate == 0) {
            this.vt_every_sec.push({ x: this.elapsed_frame / actual_frame_rate, y: this.vel.x*actual_frame_rate });
        }
    }

    record_vt_every_frame() {
        this.vt_every_sec.push({ x: this.elapsed_frame / actual_frame_rate, y: this.vel.x*actual_frame_rate });
    }
    
    vt_chart() {
        var ctx = $('#chart');
        var scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: '散布図データセット',
                    data: this.vt_every_sec
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
}