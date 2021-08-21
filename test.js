// ["ID","スキル名","取得pt(コツ0)","査定値","持続時間補正値","補正値"]
//　査定効率、チムレスコア効率、効果量効率（速度スキルのみ）

const table = [];

window.onload = () => {

    // document.getElementById("body").appendChild(document.createElement("table"));
    
    
    // console.log(fetch("skill_effectiveness.json"));

    loadData("skill_effectiveness.json");

    const promises = [];
    promises.push(loadData("skill_effectiveness.json"));
    promises.push(loadData("skill_pt_hint.json"));

    Promise.all(promises)
        .then((results) => {
            console.log(results[0]);
            results[0].forEach((record) => {
                const entry = {};
                Object.keys(record).forEach((col) => {
                    entry[col] = record[col];
                });
                table.push(entry);
            });
            console.log(results[1]);

            results[1].forEach((record) => {
                for (const row of table) {

                    if (row["ID"]==record["ID"]) {
                        Object.keys(record).forEach((col) => {
                            row[col] = record[col];
                        });
                        // break;
                    }
                }
            });
        })
        .then(() => {
            console.log(table);
            // table.forEach(() => {
            //     createP();
            // });
            makeTable(table, "body",["ID","スキル名","取得pt(コツ0)","査定値","持続時間補正値","補正値"]);
        })
        .catch(err => { console.log(err) });



    // const httpObj = new XMLHttpRequest();
    // httpObj.open("get", "skill_effectiveness.json", true);
    // httpObj.onload = function () {
    //     var myData = JSON.parse(this.responseText);
    //     var txt = "";
    //     console.log(myData);
    //     console.log(myData[0]["スキル名"]);
    //     // for (var i=0; i<myData.length; i++){

    //     // }
    // }
    // httpObj.send();

    // const httpObj2 = new XMLHttpRequest();
    // httpObj2.open("get", "skill_pt_hint.json", true);
    // httpObj2.onload = function () {
    //     var myData = JSON.parse(this.responseText);
    //     var txt = "";
    //     console.log(myData);
    //     console.log(myData[0]["ID"]);
    //     // for (var i=0; i<myData.length; i++){

    //     // }
    // }
    // httpObj2.send();

}

async function loadData(url) {

    let response = await fetch(url);
    let json = await response.json();
    return json;
    // console.log(json[0]["スキル名"]);

    //     const httpObj = new XMLHttpRequest();
    // httpObj.open("get", "skill_effectiveness.json", true);
    // httpObj.onload = function () {
    //     var myData = JSON.parse(this.responseText);
    //     var txt = "";
    //     console.log(myData);
    //     console.log(myData[0]["スキル名"]);
    //     // for (var i=0; i<myData.length; i++){

    //     // }
    // }
    // httpObj.send();
}

// 表の動的作成
function makeTable(table_data, tableId, cols_name){
    const rows = [];
    const table_dom = document.createElement("table");

    //header
    rows.push(table_dom.insertRow(-1));
    cols_name.forEach((name) => {
        const cell = rows[0].insertCell(-1);
        cell.appendChild(document.createTextNode(name));
        cell.style.backgroundColor = "#bbb"; 
    });

    //必要列の抽出
    const retreived_table = [];
    table_data.forEach((record) => {
        const row = {};
        cols_name.forEach((key) => {
            row[key] = record[key];
        });
        retreived_table.push(row);
    });

    for(i = 0; i < retreived_table.length; i++){
        rows.push(table_dom.insertRow(-1));  // 行の追加

        Object.keys(retreived_table[i]).forEach((key) => {
            const cell = rows[i+1].insertCell(-1);
            cell.appendChild(document.createTextNode(retreived_table[i][key]));
            cell.style.backgroundColor = "#ddd"; // ヘッダ行以外
        });
    }

    // retreived_table.forEach((record) => {
    //     rows.push(table_dom.insertRow(-1));  // 行の追加

    //     Object.keys(record).forEach((key) => {
    //         const cell = rows[i].insertCell(-1);
    //         cell.appendChild(document.createTextNode(record[key]));
    //         if(i==0){
    //             cell.style.backgroundColor = "#bbb"; // ヘッダ行
    //         }else{
    //             cell.style.backgroundColor = "#ddd"; // ヘッダ行以外
    //         }
    //     });
    // });





    // for(i = 0; i < table_data.length; i++){
    //     rows.push(table_dom.insertRow(-1));  // 行の追加
    //     Object.keys(table_data[i]).forEach


    //     for (j = 0; j < table_data[i]; j++){
    //         if(table_data[i][j])
    //         const cell = rows[i].insertCell(-1);
    //         cell.appendChild(document.createTextNode(table_data[i][j]));
    //         // 背景色の設定
    //         if(i==0){
    //             cell.style.backgroundColor = "#bbb"; // ヘッダ行
    //         }else{
    //             cell.style.backgroundColor = "#ddd"; // ヘッダ行以外
    //         }
    //     }
    // }

    // 指定したdiv要素に表を加える
    document.getElementById(tableId).appendChild(table_dom);
}