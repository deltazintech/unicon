function $(e){
	return document.getElementById(e);
}
HTMLElement.prototype.css=function(e,t){
	return arguments.length>1?this.style[e]=t:document.defaultView.getComputedStyle(this).getPropertyValue(e)
};
HTMLElement.prototype.textPixel=function(l){
	var c = this.canvas || (this.canvas = document.createElement("canvas"));
    var ctx = c.getContext("2d");
    ctx.font = this.css('font-size')+' '+this.css('font-family');
    return ctx.measureText(this.value.substr(0,l)).width;
};
String.prototype.count=function(s) { 
    return (this.length - this.replace(new RegExp("\\"+s,"g"), '').length) / s.length;
}
function listnod(initem,intyp) {
    this.item=initem;
    this.number=intyp;
    this.next;
    this.prev;
}
function nod(initem,intyp){
    this.item=initem;
    this.number=intyp;
    this.left;
    this.right;
    this.parent;
}

function calsci(){
	this.exp='';
	this.ans='';
	this.process = function(str){
		exp = str.toLowerCase();
		this.chkBracket();
		this.chkExponent();
		this.chkUnicon();
		this.chkConstants();
		for(var i=0;i<exp.length;i++){
			if(['0','1','2','3','4','5','6','7','8','9','.','+','-','*','/','^','(',')','e'].indexOf(exp[i])<0){throw {m:"Charecter "+exp[i]+" not supported",p:++i}}
		}
		this.chkDecimal();
		for(var i=0;i<exp.length;i++){
			if(exp[i]==")"){
                if(i+1<exp.length){
                    if(this.isNumber(exp[i+1]) || ['(','['].indexOf(exp[i+1])>-1){
                        exp=exp.substring(0,i+1) + "*" + exp.substring(i+1);
                    }
                }
            }
            else if(['(','['].indexOf(exp[i])>-1){
               if(i>0){
                    if(this.isNumber(exp[i-1]) || exp[i-1]==")"){
                        exp=exp.substring(0,i) + "*" + exp.substring(i);
                    }
                }
            }
		}
		
		for(var i=0;i<exp.count(")");i++){
			exp =this.CalcBrackets(exp);
		}
		exp=this.Calculate(this.Expression2Tree(this.Tokenize(exp)));
		return exp;
	}
	this.chkBracket = function(){
		var i=0,c1=0,c2=0;
		for(i;i<exp.length;i++){
			if(exp[i]=="("){c1++;}
			else if(exp[i]==")"){
				c1--;
				if(c1<0){break;};
			}else if(exp[i]=="["){c2++;}
			else if(exp[i]=="]"){
				c2--;
				if(c2<0){break;}
			}
		}
		if(c1!=0){throw {m:'Unterminated Bracket - ()',p:++i};} 
		if(c2!=0){throw {m:'Unterminated Bracket - []',p:++i};}
	}
	this.chkExponent = function(){
		for(var i=0;i<exp.length;i++){
			 if(exp[i]=='e'){
				 if(i==0 || !(this.isNumber(exp[i-1]) || exp[i-1]=='.')){throw {m:"Missing Number before E",p:++i};}
				 if(i==exp.length-1){throw {m:"Missing Number after E",p:++i};}
			 }
		}
	}
	this.chkUnicon = function(){
		var matches = [];
		exp.replace(/\[(.*?)\]/g, function(g0,g1){matches.push(g1);});
		if(matches.length>0){
			for(var i=0;i<matches.length;i++){
				if(matches[i].split(">").length==2){
					var fac = uac[matches[i].split(">")[0]];
					if (!fac){throw {m:"Unit " + matches[i].split(">")[0] + " not supported",p:++i};}
					var fmc = umc[matches[i].split(">")[0]];
					var tac = uac[matches[i].split(">")[1]];
					if (!tac){throw {m:"Unit " + matches[i].split(">")[1] + " not supported",p:++i};}
					var tmc = umc[matches[i].split(">")[1]];
					var uc = (1+fac*1)*fmc/tmc-tac;
					exp = exp.replace("["+matches[i]+"]","("+uc+")");
				}else{
					throw {m:"Syntax Error. Eg: [inch>mm]",p:++i};
				}
			}
		}
	}
	this.chkConstants = function(){
		 exp=this.Replace(exp,"arcsin(","["+this.arcsinAlias+"]");
		exp=this.Replace(exp,"arccos(","["+this.arccosAlias+"]");
		exp=this.Replace(exp,"arctan(","["+this.arctanAlias+"]");
		exp=this.Replace(exp,"sqrt(","["+this.sqrtAlias+"]");
		exp=this.iReplace(exp,"cbrt(", "["+this.cbrtAlias+"]");		  
		exp=this.iReplace(exp,"sinh(", "["+this.sinhAlias+"]");		  
		exp=this.iReplace(exp,"cosh(", "["+this.coshAlias+"]");		  
		exp=this.iReplace(exp,"tanh(", "["+this.tanhAlias+"]");		  
		exp=this.iReplace(exp,"log2(", "["+this.log2Alias+"]");		  
		exp=this.iReplace(exp,"abs(", "["+this.absAlias+"]");
		exp=this.iReplace(exp,"sin(", "["+this.sinAlias+"]");
		exp=this.iReplace(exp,"cos(", "["+this.cosAlias+"]");
		exp=this.iReplace(exp,"tan(", "["+this.tanAlias+"]");
		exp=this.iReplace(exp,"log(", "["+this.logAlias+"]"); 
		exp=this.iReplace(exp,"ln(", "["+this.lnAlias+"]");
		if(this.ans!=""){
			exp=this.Replace(exp,"ans", "("+this.ans+")");
			exp=this.Replace(exp,"Ans", "("+this.ans+")");
		  }
          
          exp=this.Replace(exp,"pi", "(" + Math.PI + ")");
	}
	this.chkDecimal = function(){
		for(var i=0;i<exp.length;i++){
			 if(exp[i]=='.'){
				if(exp.length==1){
                    throw {m:"&nbsp;"};
                }
                else if(i==0 && exp.length>1){
					(this.isNumber(exp[i+1])?exp="0"+exp:function(){throw {m:"Invalid decimal Number",p:++i}})            
                }
                else if(i==exp.length-1){
					(this.isNumber(exp[i-1])?exp+="0":function(){throw {m:"Invalid decimal Number",p:++i}})  
                }
                else {
					if(!this.isNumber(exp[i+1]) && this.isNumber(exp[i-1])){
                        exp=exp.substring(0,i+1) + "0" + exp.substring(i+1);
                    }
                    else if(this.isNumber(exp[i+1]) && !this.isNumber(exp[i-1])){
                        exp=exp.substring(0,i) + "0" + exp.substring(i);
                    }
                    else if(!this.isNumber(exp[i+1]) && !this.isNumber(exp[i-1])){
                        throw {m:"Invalid decimal Number",p:++i};
                    }
                }
			 }
		}
	}
	this.isNumber = function(n){
		return !!([!0, !0, !0, !0, !0, !0, !0, !0, !0, !0][n]);
	}
	//clean below code	
	    this.MinMinRemoval=function(intext) {
        var back = intext;
        var p = 0;
        var done = false;
        var prev = " ";
        this.debug+=("MINMIN:"+intext+"<br>");
		while (!done) {
            //echo "w";
            prev = " ";
            done = true;
            for (p = 0; p < back.length; p++) {
                //echo "f";
                if (back.substring(p,p+1) == "-" && prev == "-") {
                    if (p > 1) {
                        //echo "b";
                        switch (back.substring(p-2,p-1)) {
                            case "*":
                            case "+":
                            case "/":
                            case "^":
                            case "-":
                            case "E":
                                back = back.substring(0, p - 1) + back.substring(p+1);
                                break;
                            default:                                
                                continue;
                        }
                    }
                    else{
                        back = back.substring(p + 1);
                    }
                    done = false;
                    break;
                }
                else {
                    prev = back.substring(p,p+1);					
                    continue;
                }
            }
        }        
		this.Fel=back;
        this.debug+=("MINMIN:"+back+"<br>");
		return back;
    }
    this.iReplace=function(instr, find, repl){
        var u=0;
		var p=find.length;
		var t=instr.length;
        var out="";
        while(u<t){
            if(u<=t-p){
                if(instr.substring(u, u+p).toUpperCase()==find.toUpperCase()){
                    out=out + repl;u=u+p;continue;
                }
            }
            out=out + instr.charAt(u);u++;
        }
        //("|" + out + "|");
        return out;
    }
    this.Replace=function(instr, find, repl){
        var u=0;
		var p=find.length;
		var t=instr.length;
        var out="";
        while(u<t){
            if(u<=t-p){
                if(instr.substring(u, u+p)===find){
                    out=out + repl;u=u+p;continue;
                }
            }
            out=out + instr.charAt(u);u++;
        }
        //("|" + out + "|");
        return out;
    }
	this.Tokenize=function(intext){
    var start=null;
    var curr=new listnod("",false);
    var isOK=false;
    var hascomma=false;
    var hasE=false;
    var text=intext;
    this.debug+=("TOK1:"+text+"<br>");
	text = this.MinMinRemoval(intext); //fixa min min removal !!!
	this.debug+=("TOK2:"+text+"<br>");
    i=0;starti=0;
     if(text.length==0){
      throw {m:"Empty expression"};
    }
    else if(this.IsOperator(text.substring(0,1),false) || (text.substring(0,1)=="-" && text.length==1)){
      throw {m:"The expression begins with an operator",p:1};
    }
    else {
            this.debug+=("TOK3:"+text+"<br>");
			while(i<text.length){
			this.debug+=("TOK:"+i+": "+text.charAt(i)+"<br>");
                this.debug+=("(" + curr.item + ";" + curr.number + ";" + starti + ")");
                if(!(curr.number)){
                    if(this.IsDigit(text.substring(i,i+1))){
                        this.debug+=("TOK DIGIT:"+i+"<br>");
						isOK=true;
                        i++;
                        continue;
                    }
                    else if(text.substring(i,i+1)=="-"){
                        if(starti==i){
                            i++;
                            isOK=false;
                            continue;
                        }
                        else if(text.substring(i-1,i)=="E"){
                            i++;
                            isOK=false;
                            continue;
                        }
                        else if(isOK){
							this.debug+=("it's OK<br>");
                          this.OkNumber(text.substring(starti,i));

                            if(start==null){
								start=new listnod(text.substring(starti,i),true);
                                curr=start;
                            }
                            else {
                                curr.next=new listnod(text.substring(starti,i),true);
                                curr.prev=curr;
                                curr=curr.next;
                            }
                            isOK=false;
                            hascomma=false;
                            hasE=false;
                            starti=i;
                            continue;
                        }
                        else {
                            throw {m:"Failed to interpret"};
                        }
                    }
                    else if(text.substring(i,i+1)=="."){
                        if(!hascomma && !hasE){
                            i++;
                            hascomma=true;
                            isOK=false;
                            continue;
                        }
                        else if(hasE){
                            throw {m:"E must be followed by an integer",p:++i};
                        }
                        else {
                            throw {m:"Multiple decimal signs",p:++i};
                        }
                    }
                    else if(text.substring(i,i+1)=="E"){
                        if(isOK && !hasE){
                            i++;
                            hasE=true;
                            isOK=false;
                            continue;
                        }
                        else if(hasE){
                            throw {m:"Multiple E",p:++i};
                        }
                        else {
                            throw {m:"Failed to interpret"};
                        }
                    }
                    else if(this.IsOperator(text.substring(i,i+1),true)){
						if(isOK){
						}
						if(starti==i){
                            if(i==0){
                                throw {m:"The expression starts with an operator",p:++i};
                            }
                            else{
                                throw {m:"Consecutive operators",p:++i};
                            }
                        }
                        else if(text.substring(i,i+1)=="+" && text.substring(i-1,i)=="E"){
							i++;
                            isOK=false;
                            continue;
                        }
                        else if(i==text.length-1){
							throw {m:"The expression ends with an oeprator",p:++i};
                        }
                        else if(isOK){
							this.OkNumber(text.substring(starti,i));
                            if(start==null){
                                start=new listnod(text.substring(starti,i),true);
                                curr=start;
                            }
                            else {
                                curr.next=new listnod(text.substring(starti,i),true);
                                curr.prev=curr;
                                curr=curr.next;
                            }
                            isOK=false;
                            hascomma=false;
                            hasE=false;
                            //i++;
                            starti=i;
                            continue;
                        }
                        else {
							throw {m:"Failed to interpret"};
                        }
                    }
                }
                else {
                    if(this.IsOperator(text.substring(i,i+1),true)){
                         
                        if(i==text.length-1){
                           throw {m:"The expression ends with an oeprator",p:++i};
                        }
                        else {
                            curr.next=new listnod(text.substring(i, i+1),false);
                            curr.prev=curr;
                            curr=curr.next;
                            isOK=false;
                            hascomma=false;
                            hasE=false;
                        }
                        i++;
                        starti=i;
                        continue;
                    }
                }
            }
        }
        if(starti<text.length){
            if (isOK){
                this.OkNumber(text.substring(starti));
                if(start==null){
					start=new listnod(text.substring(starti),true);
                    curr=start;
                }
                else {
                    curr.next=new listnod(text.substring(starti),true);
                    curr.prev=curr;
                    curr=curr.next;
                }
                isOK=false;
                hascomma=false;
                hasE=false;
            }
            else{
                if(text.substring(text.length-1)=="E"){
                    throw {m:"E must be followed by an integer",p:text.length};
                }
				else if(text.substring(text.length-1)=="-"){
                    throw {m:"The expression ends with an operator",p:text.length};
				}					
            }
        }
       // echo start.item;
        return start;
    }

  this.Expression2Tree=function(starter){
        var current=starter;
        var start = null;
        var support1 = null;
        var support2 = null;
        var support3 = null;
        var transfer = null;
        var above = true;
        start = new nod(current.item,current.number);
        support1 = start;
        support2 = support1;
        current=current.next;
		this.debug+=("E2T1:"+"before"+"<br>");
        //echo "nu byg" . start.item . "ger vi";
        while(current!=null){
            this.debug+=(" -"+current.item+"- ");
			transfer=new nod(current.item,current.number);
            above = true;
            support3 = support2;
            if(!transfer.number){
                while (support3.parent!=null) {
                    if(!support3.parent.number){
                        if(this.Priority(transfer.item, support3.parent.item)) {
                            above = false;
                            break;
                        }
                    }
                    support3 = support3.parent;
                }
                if (above) {
                    start = transfer;
                    start.left = support3;
                    support3.parent = start;
                    support2 = start;
                } else {
                    support1 = transfer;
                    support1.left = support3;
                    support3.parent.right = support1;
                    support1.parent = support3.parent;
                    support3.parent = support1;
                    support2 = support1;
                }
            }
            else {
                support2.right = transfer;
                support2.right.parent = support2;
                support2 = support2.right;
            }
            current=current.next;
        }
       // echo start.item;
        this.debug+=("E2T2:"+start.item+"<br>");
		this.inorder(start);
		this.postorder(start);
		return start;
 }
this.postorder=function(sak){
	if(sak.left!=null){
		this.postorder(sak.left);
	}
	
	if(sak.right!=null){
		this.postorder(sak.right);
	}
	this.debug+=("POSTORDER:"+sak.item+"<br>");
}  
this.inorder=function(sak){
	if(sak.left!=null){
		this.inorder(sak.left);
	}
	this.debug+=("INORDER:"+sak.item+"<br>");
	if(sak.right!=null){
		this.inorder(sak.right);
	}
}	
   this.Priority=function(A, B) {
        var c=0; var d=0;
        switch(A){
          case "+": c=0;break;
          case "-": c=1;break;
          case "*": c=2;break;
          case "/": c=3;break;
          case "^": c=4;break;
          default: c=20;
        }
        switch(B){
          case "+": d=0;break;
          case "-": d=1;break;
          case "*": d=2;break;
          case "/": d=3;break;
          case "^": d=4;break;
          default: d=20;
        }
        return c > d;
    }

    this.Calculate=function(topp) {
        var Tal1 = 0; var Tal2 = 0;
        if (topp.left == null && topp.right == null) {
            return Number(topp.item);
        }
        if (!topp.left.number) {            
			Tal1 = this.Calculate(topp.left);
        } else {
            Tal1 = Number(topp.left.item);
        }
        if (!topp.right.number) {
            Tal2 = this.Calculate(topp.right);
        } else {
            Tal2 = Number(topp.right.item);
        }        
		return this.SubCalc(topp.item, Tal1, Tal2);
    }

    this.SubCalc=function(operator, T1, T2) {
        if (operator=="+") {
            this.OkNumber(Number(T1)+0+Number(T2));		
			return Number(T1) +0+ Number(T2);
        }
        if (operator=="-") {
            this.OkNumber(Number(T1)-Number(T2));
            return T1 - T2;
        }
        if (operator=="*") {
            this.OkNumber(Number(T1)*Number(T2));
            return Number(T1) * Number(T2);
        }
        if (operator=="/") {
            if(T2==0){
                throw {m:"Division by 0"};
            }
            this.OkNumber(Number(T1)/Number(T2));
            return Number(T1) / Number(T2);
        }
        if (operator=="^") {
            if(Number(T1)<0 && Math.floor(T2)!=T2){
                throw {m:"Negative number raised to the power of non-integer"};
            }
            this.OkNumber(Math.pow(T1, T2));
            return Math.pow(T1, T2);
        }
        return 0;
    }


  this.IsOperator=function(tecken, inklminus){
      switch(tecken){
          case "+":
          case "-":
              if(!inklminus){
                  return false;
              }
          case "*":
          case "/":
          case "^":
              return true;
          default:
              return false;
      }
  }
  this.IsDigit=function(tecken){
      switch(tecken){
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
              return true;
          default:
              return false;
      }
  }
  this.IsFuncSymbol=function(symbol){
        return (symbol=="(" || symbol=="[");
	}
  this.OkNumber=function(intal){
        debuger=0.0;
        this.debug+=("OKN:"+intal+"<br>");
		try{
            debuger = intal*1;
			this.debug+=("OKN:"+"hmm"+"<br>");
            if(!isFinite(debuger)){
                throw {m:"Overflow"};
            }
			this.debug+=("OKN:"+"efter"+"<br>");
        }
      catch(e){
          if(this.Fel.length==0){
                this.Fel="Failed to interpret";
            }
          throw e;
        }
  }
  
  this.CalcBrackets=function(intext) {
        this.debug+=("CB3:"+intext+"<br>");
		var L = -1; var R = -1; var j = 0;var func=" ";
        var tokens=null;
        var talet=0.0;var taletefter=0.0;
        var substitut = "";
        //echo "PARAM[" . intext . "]"  ;
        for (j = 0; j < intext.length; j++) {
            if (this.IsFuncSymbol(intext.substring(j,j+1))){
                L = j;
                func=intext.substring(j,j+1);
            } else if (intext.substring(j,j+1) == ")" && j > L && L > -1) {
                R = j;
                if(L+1==R){
                    if(intext.substring(L,L+1)=="("){
                       throw {m:"Empty brackets",p:++L};
                    }
                    else{
                       throw {m:"Missing argument",p:++L};
                    }
                }
				else if(intext.substring(R-1,R)=="]"){
					 throw {m:"Missing argument",p:R};
				}
				if(func=="("){
                tokens=this.Tokenize(intext.substring(L+1,R));
                talet=this.Calculate(this.Expression2Tree(tokens));
                this.OkNumber(talet);
                //echo "INTAL[" . talet . " | " . (string)(talet) . "]";
                //echo sin(talet);
                
					substitut = intext.substring(0,L) +(talet);
				}
				else if(func=="["){
					//alert("dags för funktion: "+L+"\n"+intext);
					var forward=L+2;
					while(intext.substring(forward,forward+1)!="]"){
						forward++;
					}
					//alert("dags för funktion ännu mer: "+forward);					
					tokens=this.Tokenize(intext.substring(forward+1,R));
					talet=this.Calculate(this.Expression2Tree(tokens));
					this.OkNumber(talet);					
					//alert("argument: "+talet);
					var whichfunc=Number(intext.substring(L+1,forward));
					if(whichfunc==this.sqrtAlias){
						if(talet<0.0){
							throw {m:"Square root of negative number"};
						}
						substitut = intext.substring(0,L) + (Math.sqrt(talet));
					}
					else if(whichfunc==this.cbrtAlias){
						var pre="";
						if(talet<0){
							pre="-";
						}
						substitut = intext.substring(0,L) +pre+ (Math.pow(Math.abs(talet),1.0/3.0));
					}
					else if(whichfunc==this.absAlias){
						substitut = intext.substring(0,L) + (Math.abs(talet));
					}
					else if(whichfunc==this.logAlias){
							if(talet<=0.0){
								throw {m:"log of non-positiv number"};
							}
							substitut = intext.substring(0,L) + (Math.log(talet)/Math.LN10);
					}
					else if(whichfunc==this.lnAlias){
							if(talet<=0.0){
								throw {m:"ln of non-positiv number"};
							}
							substitut = intext.substring(0,L) + (Math.log(talet));
					}
					else if(whichfunc==this.log2Alias){
							if(talet<=0.0){
								throw {m:"log2 of non-positiv number"};
							}
							substitut = intext.substring(0,L) + (Math.log(talet)/Math.log(2));
					}
					else if(whichfunc==this.sinAlias){
							if(talet*this.vinkelfaktor/Math.PI==Math.floor(talet*this.vinkelfaktor/Math.PI)){
								substitut = intext.substring(0,L) + "0";
							}
							else{
								substitut = intext.substring(0,L) + (Math.sin(talet*this.vinkelfaktor));
							}
					}
					else if(whichfunc==this.cosAlias){
							if(((talet*this.vinkelfaktor)+Math.PI/2)/Math.PI==Math.floor(((talet*this.vinkelfaktor)+Math.PI/2)/Math.PI)){
								substitut = intext.substring(0,L) + "0";
							}
							else{
								substitut = intext.substring(0,L) + (Math.cos(talet*this.vinkelfaktor));
							}					
					}
					else if(whichfunc==this.tanAlias){
							if(((talet*this.vinkelfaktor)+Math.PI/2)/Math.PI==Math.floor(((talet*this.vinkelfaktor)+Math.PI/2)/Math.PI)){
								throw {m:"Overflow"};
							}
							else if(talet*this.vinkelfaktor/Math.PI==Math.floor(talet*this.vinkelfaktor/Math.PI)){
								substitut = intext.substring(0,L) + "0";
							}
							else{
								substitut = intext.substring(0,L) + (Math.tan(talet*this.vinkelfaktor));
							}
					}
					else if(whichfunc==this.sinhAlias){
							if(Math.abs(talet)>709.7){
								throw {m:"Overflow"};
							}
							substitut = intext.substring(0,L) + (0.5*(Math.exp(talet)-Math.exp(-talet)));
					}
					else if(whichfunc==this.coshAlias){
							if(Math.abs(talet)>709.7){
								throw {m:"Overflow"};
							}
							substitut = intext.substring(0,L) + (0.5*(Math.exp(talet)+Math.exp(-talet)));
					}
					else if(whichfunc==this.tanhAlias){
							if(talet>30){
								substitut=intext.substring(0,L) + "1.0";
							}
							else if(talet<-30){
								substitut=intext.substring(0,L) + "-1.0";
							}
							else{
								substitut = intext.substring(0,L) + ((Math.exp(2.0*talet)-1.0)/(Math.exp(2.0*talet)+1.0));
							}
					}
					else if(whichfunc==this.arcsinAlias){
							if(Math.abs(talet)>1.0){
								throw {m:"Outside arcsin domain: -1 to 1"};
							}
							substitut = intext.substring(0,L) + (Math.asin(talet)/this.vinkelfaktor);
					}
					else if(whichfunc==this.arccosAlias){
							if(Math.abs(talet)>1.0){
								throw {m:"Outside arccos domain: -1 to 1"};
							}
							substitut =intext.substring(0,L) + (Math.acos(talet)/this.vinkelfaktor);
					}
					else if(whichfunc==this.arctanAlias){
							substitut=intext.substring(0,L)+(Math.atan(talet)/this.vinkelfaktor);
					}							
						
                }
                if (R + 1 < intext.length) {
                    substitut = substitut + intext.substring(R+1);
                }
                break;
            }
        }
        //echo "exp[" . substitut . "]";
        return substitut.replace("e","E");
    }
	
	this.RemoveUnnecessary=function(invalue){
        var i=0;var str=""+invalue.replace("e","E").replace("+","");				
		var decimal=str.indexOf('.');
		var E=str.indexOf('E');
		if(E==-1){
			E=str.length;
		}
		var interestingpart="";
		if(decimal!=-1){
			interestingpart=str.substring(decimal+1,E);
			while(interestingpart.charAt(interestingpart.length-1)=='0'){
				interestingpart=interestingpart.substring(0,interestingpart.length-1);
			}
			if(interestingpart==""){
				str=str.substring(0,decimal)+str.substring(E);
			}
			else{
				str=str.substring(0,decimal+1)+interestingpart+str.substring(E);
			}
		}
		return str;
    }	
    this.Fractionize=function(intal){
	   var tal2=Math.abs(intal);
       if(tal2<1E-9 || tal2>1E10){
          return "";
       }
       if(Math.floor(tal2+0.5)==tal2){
          return "";
       }
       var ret="";
       if(intal<0){
         ret="-";
       }
	   var DENOMS=[];
       var INTPART=Math.floor(tal2);
       tal2=tal2-INTPART;
       var COMPARATOR=tal2.toPrecision(7);//Math.round(tal2,-Math.ceil((Math.log(tal2)/Math.LN10))+7);
       DENOMS.push(INTPART);
       var Z=tal2;
       var N=1.0;
       var T=0.0;
       var temp=0.0;
       var i=0;
	   var FRACANS;
       while(Z>1e-16 && i<18){         
		 i++;
         N=Math.floor(1.0/Z);
         Z=1.0/Z-N;
         DENOMS.push(N);	
         if(DENOMS.length>=2){
           T=DENOMS[DENOMS.length-1];
           N=T*DENOMS[DENOMS.length-2]+1;
           if(DENOMS.length==2){
             N=1;
             temp=T;
             T=N;
             N=temp;
           }
           for(k=DENOMS.length-3;k>=1;k--){
             T=T+DENOMS[k]*N;
             temp=T;
             T=N;
             N=temp;
           }
           FRACANS=this.String2Double(Math.round(T) + "/" + Math.round(N));		   
           if(FRACANS.toPrecision(7)==COMPARATOR){
             T=T+N*INTPART;
             return ret + Math.round(T) + "/" + Math.round(N);
           }
         }
       }
       T=DENOMS[DENOMS.length-1];
       N=T*DENOMS[DENOMS.length-2]+1;
       if(DENOMS.length==2){
         N=1;
         temp=T;
         T=N;
         N=temp;
       }
	   for(k=DENOMS.length-3;k>=1;k--){
         T=T+DENOMS[k]*N;
         temp=T;
         T=N;
         N=temp;
       }
       FRACANS=this.String2Double(Math.round(T) + "/" + Math.round(N));       
       if(FRACANS.toPrecision(7)==COMPARATOR){
         T=T+N*INTPART;
         this.Fel="";
		 return ret + Math.round(T) + "/" + Math.round(N);
       }
       return "";
    } 
     
}
	

var C=new calsci();
function init(){
	$("expression").focus();	
}
function run(){
	try{
		$("result").innerHTML="= "+C.process($("expression").value) || '&nbsp;';
		$("errpos").css('margin-left','-99');
		$("result").style.color="#060";
	}catch(e){
		console.log(e);
		$("result").innerHTML=e.m || e.message;
		$("errpos").css('margin-left',(e.p?$("expression").textPixel(e.p):'-99'));
		$("result").style.color="#c00";
	}
}
var uac={k:"0",c:"273.15",r:"0",f:"459.67","dyne/cm2":"0","n/m2":"0",pa:"0",kpa:"0",mpa:"0",pag:"101325",kpag:"101.325",mpag:"0.101325",mbar:"0",bar:"0",mbarg:"1013.25",barg:"1.01325","in hg":"0","mm hg":"0","mm hg@0c":"0","in hg@60f":"0","in hg@32f":"0","in hgg":"29.9212598425","mm hgg":"760",torr:"0","kg/cm2":"0","kg/cm2g":"1.03323",ata:"0",ate:"1.03323",atm:"0",psia:"0",psig:"14.6959",psi:"0",psf:"0","in h2o":"0","in h2og":"407.18445","mm h2o":"0","mm h2og":"9.79698","cm h2o":"0","ft h2o":"0","ft h2og":"33.932106","in h2o@60f":"0","in h2o@39.2f":"0","cm h2o@4c":"0",sec:"0",min:"0",hr:"0",day:"0",wk:"0",mon:"0",yr:"0",ang:"0",mmic:"0",mic:"0",mm:"0",cm:"0",dm:"0",m:"0",km:"0",in:"0",ft:"0",yd:"0",mi:"0",ang2:"0",mmic2:"0",mic2:"0",mm2:"0",cm2:"0",dm2:"0",m2:"0",km2:"0",in2:"0",ft2:"0",yd2:"0",mi2:"0",hect:"0",acre:"0",ang3:"0",mmic3:"0",mic3:"0",mm3:"0",cm3:"0",dm3:"0",m3:"0",km3:"0",in3:"0",ft3:"0",yd3:"0",mi3:"0",liter:"0",gal:"0",igal:"0",bbl:"0",mbbl:"0",kl:"0",mft3:"0",mgal:"0",mmft3:"0",mmgal:"0",g:"0",kg:"0",tonm:"0",oz:"0",lb:"0",klb:"0",ton:"0",tonl:"0",ktonm:"0","g-mol":"0","kg-mol":"0","tonm-mol":"0","oz-mol":"0","lb-mol":"0","ton-mol":"0","tonl-mol":"0","ktonm-mol":"0",nm3:"0",scf:"0.0011952452",j:"0",kj:"0",mj:"0",cal:"0",kcal:"0","g-cm":"0","kg-m":"0","ft-lb":"0",btu:"0",chu:"0",pcu:"0","kw-hr":"0",w:"0",kw:"0",mw:"0",va:"0",kva:"0",mva:"0",var:"0",kvar:"0",mvar:"0",hp:"0",h:"0",mh:"0",muh:"0",f:"0",mf:"0",muf:"0","x 10^6 j":"0","x 10^6 kj":"0","x 10^6 mj":"0","x 10^6 cal":"0","x 10^6 kcal":"0","x 10^6 gcm":"0","x 10^6 kgm":"0","x 10^6 ftlb":"0","x 10^6 btu":"0","x 10^6 chu":"0","x 10^6 pcu":"0","x 10^6 kwh":"0","x 10^6 w":"0","x 10^6 kw":"0","x 10^6 mw":"0","x 10^6 va":"0","x 10^6 var":"0","x 10^6 hp":"0",cp:"0",pois:"0","pa-sec":"0","kg/m-sec":"0","kg/m-min":"0","kg/m-hr":"0","kg/m-day":"0","lb/ft-sec":"0","lb/ft-min":"0","lb/ft-hr":"0","lb/ft-day":"0","lb-sec/ft2":"0","w/m-k":"0","w/m-c":"0","kw/m-k":"0","kw/m-c":"0","cal/sec-cm-c":"0","cal/hr-m-c":"0","kcal/hr-m-c":"0","btu/hr-ft-f":"0","g/cm":"0","dyne/cm":"0","n/m":"0","pdl/in":"0","w/m2-k":"0","w/m2-c":"0","kw/m2-k":"0","cal/sec-cm2-c":"0","kcal/hr-m2-c":"0","kcal/hr-m2-k":"0","kj/hr-m2-k":"0","btu/hr-ft2-f":"0","w/k":"0","kw/k":"0","kcal/hr-k":"0","kj/hr-k":"0","btu/hr-f":"0","m2-k/w":"0","m2-k/kw":"0","hr-m2-c/kcal":"0","hr-m2-k/kj":"0","hr-ft2-f/btu":"0",api:"0",spgr:"0",deb:"0","coul-m":"0",eu:"0",cst:"0",st:"0","in2/sec":"0","m2/sec":"0","k-v":"0","j/g-k":"0","j/kg-k":"0","kj/g-k":"0","kj/kg-k":"0","mj/g-k":"0","mj/kg-k":"0","cal/g-k":"0","cal/kg-k":"0","kcal/g-k":"0","kcal/kg-k":"0","btu/lb-f":"0","btu/lb-c":"0","btu/lb-k":"0","chu/g-f":"0","chu/kg-f":"0","chu/lb-f":"0","pcu/g-f":"0","pcu/kg-f":"0","pcu/lb-f":"0","j/g-c":"0","j/kg-c":"0","kj/g-c":"0","kj/kg-c":"0","cal/g-c":"0","cal/kg-c":"0","kcal/g-c":"0","kcal/kg-c":"0","n-m":"0","lb-ft":"0",fraction:"0","p.u.":"0",percent:"0",ppm:"0",ppb:"0",usd:"0",inr:"0",eur:"0",chf:"0",rps:"0",rpm:"0",rph:"0",rpd:"0","rad/sec":"0",revolution:"0",degree:"0",radian:"0",v:"0",kv:"0",amp:"0",kamp:"0",ohm:"0",kohm:"0",cv:"0","gpm/sqrt(psi-spgr)":"0","(kg/sec)/sqrt(pa-kg/m3)":"0","(kg/sec)/sqrt(kpa-kg/m3)":"0","(lb/sec)/sqrt(inh2o-lb/ft3)":"0","(lb/sec)/sqrt(psi-lb/ft3)":"0","(lb/hr)/sqrt(psi-lb/ft3)":"0"},umc={k:"1.8",c:"1.8",r:"1",f:"1","dyne/cm2":"0.1","n/m2":"1",pa:"1",kpa:"1000",mpa:"1000000",pag:"1",kpag:"1000",mpag:"1000000",mbar:"100",bar:"100000",mbarg:"100",barg:"100000","in hg":"3386.39","mm hg":"133.322368421","mm hg@0c":"133.323","in hg@60f":"3377","in hg@32f":"3386.41","in hgg":"3386.39","mm hgg":"133.322368421",torr:"133.322368421","kg/cm2":"98066.5","kg/cm2g":"98066.5",ata:"98066.5",ate:"98066.5",atm:"101325",psia:"6894.76",psig:"6894.76",psi:"6894.76",psf:"47.8803","in h2o":"248.843","in h2og":"248.843","mm h2o":"9.79698","mm h2og":"","cm h2o":"97.9698","ft h2o":"2986.11","ft h2og":"2986.11","in h2o@60f":"248.8","in h2o@39.2f":"249.082","cm h2o@4c":"98.0642",sec:"1",min:"60",hr:"3600",day:"86400",wk:"604800",mon:"2592000",yr:"31557600",ang:"0.00000001",mmic:"0.0000001",mic:"0.0001",mm:"0.1",cm:"1",dm:"10",m:"100",km:"100000",in:"2.54",ft:"30.48",yd:"91.44",mi:"160934",ang2:"0.0000000000000001",mmic2:"0.00000000000001",mic2:"0.00000001",mm2:"0.01",cm2:"1",dm2:"100",m2:"10000",km2:"10000000000",in2:"6.4516",ft2:"929.03",yd2:"8361.27",mi2:"25899900000",hect:"100000000",acre:"40468600",ang3:"1e-24",mmic3:"1e-21",mic3:"0.000000000001",mm3:"0.001",cm3:"1",dm3:"1000",m3:"1000000",km3:"1000000000000000",in3:"16.3871",ft3:"28316.9",yd3:"764555",mi3:"4154190000000000",liter:"1000",gal:"3785.41",igal:"4546.09",bbl:"158987",mbbl:"158987000",kl:"1000000",mft3:"28316900",mgal:"3785410",mmft3:"28316900000",mmgal:"3785410000",g:"0.001",kg:"1",tonm:"1000",oz:"0.0283495",lb:"0.453592",klb:"453.592",ton:"907.185",tonl:"1016.05",ktonm:"1000000","g-mol":"0.001","kg-mol":"1","tonm-mol":"1000","oz-mol":"0.0283495","lb-mol":"0.453592","ton-mol":"907.185","tonl-mol":"1016.05","ktonm-mol":"1000000",nm3:"0.044615423",scf:"",j:"1",kj:"1000",mj:"1000000",cal:"4.1868",kcal:"4186.8","g-cm":"0.0000980665","kg-m":"9.80665","ft-lb":"1.35582",btu:"1055.06",chu:"1899.1",pcu:"1899.1","kw-hr":"3600000",w:"1",kw:"1000",mw:"1000000",va:"1",kva:"1000",mva:"1000000",var:"1",kvar:"1000",mvar:"1000000",hp:"745.697",h:"1",mh:"0.001",muh:"0.000001",f:"1",mf:"0.001",muf:"0.000001","x 10^6 j":"1000000","x 10^6 kj":"1000000000","x 10^6 mj":"1000000000000","x 10^6 cal":"4186800","x 10^6 kcal":"4186800000","x 10^6 gcm":"98.0665","x 10^6 kgm":"9806650","x 10^6 ftlb":"1355820","x 10^6 btu":"1055060000","x 10^6 chu":"1899100000","x 10^6 pcu":"1899100000","x 10^6 kwh":"3600000000000","x 10^6 w":"1000000","x 10^6 kw":"1000000000","x 10^6 mw":"1000000000000","x 10^6 va":"1000000","x 10^6 var":"1000000","x 10^6 hp":"745697000",cp:"1",pois:"100","pa-sec":"1000","kg/m-sec":"1000","kg/m-min":"16.6667","kg/m-hr":"0.277778","kg/m-day":"0.0115741","lb/ft-sec":"1488.16","lb/ft-min":"24.8027","lb/ft-hr":"0.413379","lb/ft-day":"0.0172242","lb-sec/ft2":"47880.1","w/m-k":"1","w/m-c":"1","kw/m-k":"1000","kw/m-c":"1000","cal/sec-cm-c":"418.68","cal/hr-m-c":"0.001163","kcal/hr-m-c":"1.163","btu/hr-ft-f":"1.73074","g/cm":"1","dyne/cm":"0.00101972","n/m":"1.01972","pdl/in":"5.55043","w/m2-k":"1","w/m2-c":"1","kw/m2-k":"1000","cal/sec-cm2-c":"41868","kcal/hr-m2-c":"1.163","kcal/hr-m2-k":"1.163","kj/hr-m2-k":"0.277778","btu/hr-ft2-f":"5.67826","w/k":"1","kw/k":"1000","kcal/hr-k":"1.163","kj/hr-k":"0.277778","btu/hr-f":"0.527527","m2-k/w":"1","m2-k/kw":"0.001","hr-m2-c/kcal":"0.859845","hr-m2-k/kj":"3.6","hr-ft2-f/btu":"0.17611",api:"1",spgr:"0.000999014",deb:"1","coul-m":"2.99792e+29",eu:"1000000000000000000",cst:"1",st:"100","in2/sec":"645.16","m2/sec":"1000000","k-v":"0.0000277669618","j/g-k":"1","j/kg-k":"0.001","kj/g-k":"1000","kj/kg-k":"1","mj/g-k":"1000000","mj/kg-k":"1000","cal/g-k":"4.1868","cal/kg-k":"0.0041868","kcal/g-k":"4186.8","kcal/kg-k":"4.1868","btu/lb-f":"4.1868","btu/lb-c":"2.32601","btu/lb-k":"2.32601","chu/g-f":"3418.38","chu/kg-f":"3.41838","chu/lb-f":"7.53624","pcu/g-f":"3418.38","pcu/kg-f":"3.41838","pcu/lb-f":"7.53624","j/g-c":"1","j/kg-c":"0.001","kj/g-c":"1000","kj/kg-c":"1","cal/g-c":"4.1868","cal/kg-c":"0.0041868","kcal/g-c":"4186.8","kcal/kg-c":"4.1868","n-m":"1","lb-ft":"1.35581",fraction:"1","p.u.":"1",percent:"0.01",ppm:"0.000001",ppb:"0.000000001",usd:"67.95",inr:"1",eur:"71.52",chf:"66.76",rps:"1",rpm:"0.0166666666667",rph:"0.000277777777778",rpd:"0.0000115740740741","rad/sec":"0.1591549431",revolution:"1",degree:"0.002777777778",radian:"0.1591549431",v:"1",kv:"1000",amp:"1",kamp:"1000",ohm:"1",kohm:"1000",cv:"0.0000240152927537","gpm/sqrt(psi-spgr)":"0.0000240152927537","(kg/sec)/sqrt(pa-kg/m3)":"1","(kg/sec)/sqrt(kpa-kg/m3)":"0.0316227766017","(lb/sec)/sqrt(inh2o-lb/ft3)":"0.00718443851618","(lb/sec)/sqrt(psi-lb/ft3)":"0.00136488471428","(lb/hr)/sqrt(psi-lb/ft3)":"0.000000379134642857"};


