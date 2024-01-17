class Course {

    //とりあえず簡略化のため序盤は抜きで、かつ終盤に至るまでは直線のみとする

    //ある区間の長さ
    race_distance;
    simulated_distance;
    spurt_length;
    first_spurt_length ;
    second_spurt_length;
    third_corner_length;
    final_corner_length;
    last_straight_length;
    third_corner_not_spurt_length;
    third_corner_spurt_length;
    final_corner_not_spurt_length;
    final_corner_spurt_length;
    
    //ある区間の開始地点座標。スタートは0。
    accum_dist_to_early;
    accum_dist_to_middle;
    accum_dist_to_first_spurt;
    accum_dist_to_second_spurt;
    accum_dist_to_spurt;
    accum_dist_to_third_corner;
    accum_dist_to_final_corner;//最終コーナー
    accum_dist_to_spurt_corner;//終盤コーナー
    accum_dist_to_last_straight;

    first_uphill;
    first_downhill;
    
    is_final_corner(pos_x) {}

    is_last_straight(pos_x) {}

    is_early(pos_x) {}

    is_middle(pos_x) {}

    is_final(pos_x) {}

    is_final_first(pos_x) {}

    is_final_second(pos_x) {}

    get_phase(pos_x) {}

    get_progression(pos_x) { }
    
    mid_random() { }
    
    mid_first_random() { }

    mid_second_random() { }
    
    second_half_random(){}
    
    final_corner_random() { }

    first_spurt_random() { }

    first_spurt_early_random() {}

    second_spurt_random() {}

    last_straight_random() {}

    spurt_random() { }
    
    fisrt_uphill() { }
    
    first_downhill(){}

    corner_random(){}
}
