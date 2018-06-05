function $(e){
	return document.getElementById(e);
}
function init(){
	$("exp1").focus();	
}
function run(id){
	try{
		var exp=$("exp"+id).value;
		exp = exp.replace(/ans1/g,$("ans1").textContent.replace("Ans1 = ",""));
		exp = exp.replace(/ans2/g,$("ans2").textContent.replace("Ans2 = ",""));
		exp = exp.replace(/ans3/g,$("ans3").textContent.replace("Ans3 = ",""));
		exp = exp.replace(/ans4/g,$("ans4").textContent.replace("Ans4 = ",""));
		exp = exp.replace(/ans5/g,$("ans5").textContent.replace("Ans5 = ",""));
		document.title="Calsci \u00A9 Karthik Narayana";//console.log(exp);
		var matches = [];
		exp.replace(/\[(.*?)\]/g, function(g0,g1){matches.push(g1);});
		if(matches.length>0){
			for(var i=0;i<matches.length;i++){	
				if(matches[i].split(">").length==2){
					var fmc = umc[matches[i].split(">")[0]];
					if (!fmc){throw {message:"Unit " + matches[i].split(">")[0] + " not supported"};}
					var tmc = umc[matches[i].split(">")[1]];
					if (!tmc){throw {message:"Unit " + matches[i].split(">")[1] + " not supported"};}
					var uc = fmc/tmc;
					exp = exp.replace("["+matches[i]+"]","*("+uc+")");
				}else{
					throw {message:"Syntax Error. Eg: [in>mm]"};
				}
			}
		}
		var val=eval(exp);
		$("ans"+id).innerHTML="Ans"+id+" = "+ val || '&nbsp;';
		$("ans"+id).style.color="#060";
	}catch(e){
		$("ans"+id).innerHTML="Error: "+ e.message || '&nbsp;';
		$("ans"+id).style.color="#c00";
	}
}
var umc={// "{your unit}":"{value in default unit}",
	//length default: m(meters)
	"m":"1", //Meter
	"cm":"0.01",//Centimeter
	"mm":"0.001",//Millimeter
	"in":"0.0254",//Inch
	"mi":"1609.34",//Mile
	"ft":"0.3048",//Foot
	//flow default: kg/sec
	"kg/sec":"1",
	"kg/hr":"0.000277777777778",
	"tonm/day":"0.0115740740741",
	//null
	"null":"0"
};