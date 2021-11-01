class Uma {
    static counter = 1;
    static top_frame = -1;
    static standard_frame = 40831;

    constructor(id, x, y,abilities) {
        this.id = id;
		this.pos = createVector(x, y);
		this.r = 25;
		this.vel = createVector(initial_vel,0);
        this.acc = createVector(initial_acc, 0);
        this.phase = PHASE.MIDDLE;
        this.progression = PROGRESSION.FINAL_CORNER
        this.isSpurt = false;
        this.dest_vel = initial_dest_vel;
        this.abilities = [];

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
                case "CHIKARA":
                    ability = new AbilityAoharuChikara(true);
                    break;
                case "chikara":
                    ability = new AbilityAoharuChikara(false);
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

    update() {
        if(is_describing)this.show();
        if (this.finished) return;
        
        for (const ability of this.abilities) {
            ability.update(this);
        }
        
        this.vel = this.vel.add(this.acc);
        if (this.vel.x > this.dest_vel) {
            this.vel.x = this.dest_vel;
        }
        
        this.pos = this.pos.add(this.vel);
        this.check_phase();
        this.check_progression();
        
        this.elapsed_frame++;
        this.edge();
                
    }

    check_phase() {
        if (this.pos.x < accum_dist_till_first_spurt) {
            this.phase = PHASE.MIDDLE;
        } else if (this.pos.x >= accum_dist_till_first_spurt && this.pos.x < accum_dist_till_second_spurt) {
            this.phase = PHASE.FINAL_FIRST;
            if (!this.isSpurt) {
                this.dest_vel = spurt_dest_vel;
            }
            this.isSpurt = true;
        } else {
            this.phase = PHASE.FINAL_SECOND;
        }
    }
    

    check_progression() {
        if (this.pos.x < 0) {
            this.progression = PROGRESSION.THIRD_CORNER;
        } else if (this.pos.x >= 0 && this.pos.x < final_corner_length) {
            this.progression = PROGRESSION.FINAL_CORNER;
        } else {
            this.progression = PROGRESSION.LAST_STRAIGHT;
        }
    }

	edge() {
		if (this.pos.x >= simulated_distance) {
            this.pos.x = simulated_distance;
            this.goal_time = this.elapsed_frame / actual_frame_rate;
            this.finished = true;
            // noLoop();
            let bashin_diff;
            if (Uma.top_frame == -1) {
                Uma.top_frame = this.elapsed_frame;
                bashin_diff = "TOP";
            }
            else {
                const num = Math.round((this.elapsed_frame - Uma.top_frame) * initial_dest_vel*1000)/1000;
                // console.log(this.elapsed_frame - Uma.top_frame);
                // console.log(num);
                bashin_diff = num+ "m";
            }

            const diff_from_standard = (Uma.standard_frame * (actual_frame_rate / 1200) - this.elapsed_frame) * 1000/actual_frame_rate;//1200は基準フレーム数を計測したときのフレームレート
   
            console.log("#"+this.id+" 基準との差:"+roundNum(diff_from_standard,2)+ "ms"+" トップとの差:"+bashin_diff +" タイム:"+ Math.round(this.goal_time*1000)/1000+"秒");
            console.log(this);
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

	}
}