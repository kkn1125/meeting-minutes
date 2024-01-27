import{E as _t,e as Y,s as Et,a as mt,d as gt,b as kt,F as xt,G as Rt,l as K,H as Ot,j as et,B as bt,k as Nt,I as Tt,J as At}from"./index-Pm1NN4C9.js";import{G as Mt,l as It}from"./layout-pq6TGtIf.js";import{l as wt}from"./line-04T1gc_i.js";import"./array-Nw74a44z.js";import"./path-aUcfwwLI.js";const St=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;function Dt(t){return typeof t=="string"&&St.test(t)}function vt(t){if(!Dt(t))throw TypeError("Invalid UUID");let r;const e=new Uint8Array(16);return e[0]=(r=parseInt(t.slice(0,8),16))>>>24,e[1]=r>>>16&255,e[2]=r>>>8&255,e[3]=r&255,e[4]=(r=parseInt(t.slice(9,13),16))>>>8,e[5]=r&255,e[6]=(r=parseInt(t.slice(14,18),16))>>>8,e[7]=r&255,e[8]=(r=parseInt(t.slice(19,23),16))>>>8,e[9]=r&255,e[10]=(r=parseInt(t.slice(24,36),16))/1099511627776&255,e[11]=r/4294967296&255,e[12]=r>>>24&255,e[13]=r>>>16&255,e[14]=r>>>8&255,e[15]=r&255,e}function Lt(t){t=unescape(encodeURIComponent(t));const r=[];for(let e=0;e<t.length;++e)r.push(t.charCodeAt(e));return r}const Bt="6ba7b810-9dad-11d1-80b4-00c04fd430c8",Ct="6ba7b811-9dad-11d1-80b4-00c04fd430c8";function Pt(t,r,e){function f(l,p,u,o){var h;if(typeof l=="string"&&(l=Lt(l)),typeof p=="string"&&(p=vt(p)),((h=p)===null||h===void 0?void 0:h.length)!==16)throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");let _=new Uint8Array(16+l.length);if(_.set(p),_.set(l,p.length),_=e(_),_[6]=_[6]&15|r,_[8]=_[8]&63|128,u){o=o||0;for(let m=0;m<16;++m)u[o+m]=_[m];return u}return _t(_)}try{f.name=t}catch{}return f.DNS=Bt,f.URL=Ct,f}function Yt(t,r,e,f){switch(t){case 0:return r&e^~r&f;case 1:return r^e^f;case 2:return r&e^r&f^e&f;case 3:return r^e^f}}function rt(t,r){return t<<r|t>>>32-r}function Zt(t){const r=[1518500249,1859775393,2400959708,3395469782],e=[1732584193,4023233417,2562383102,271733878,3285377520];if(typeof t=="string"){const u=unescape(encodeURIComponent(t));t=[];for(let o=0;o<u.length;++o)t.push(u.charCodeAt(o))}else Array.isArray(t)||(t=Array.prototype.slice.call(t));t.push(128);const f=t.length/4+2,l=Math.ceil(f/16),p=new Array(l);for(let u=0;u<l;++u){const o=new Uint32Array(16);for(let h=0;h<16;++h)o[h]=t[u*64+h*4]<<24|t[u*64+h*4+1]<<16|t[u*64+h*4+2]<<8|t[u*64+h*4+3];p[u]=o}p[l-1][14]=(t.length-1)*8/Math.pow(2,32),p[l-1][14]=Math.floor(p[l-1][14]),p[l-1][15]=(t.length-1)*8&4294967295;for(let u=0;u<l;++u){const o=new Uint32Array(80);for(let y=0;y<16;++y)o[y]=p[u][y];for(let y=16;y<80;++y)o[y]=rt(o[y-3]^o[y-8]^o[y-14]^o[y-16],1);let h=e[0],_=e[1],m=e[2],g=e[3],x=e[4];for(let y=0;y<80;++y){const N=Math.floor(y/20),w=rt(h,5)+Yt(N,_,m,g)+x+r[N]+o[y]>>>0;x=g,g=m,m=rt(_,30)>>>0,_=h,h=w}e[0]=e[0]+h>>>0,e[1]=e[1]+_>>>0,e[2]=e[2]+m>>>0,e[3]=e[3]+g>>>0,e[4]=e[4]+x>>>0}return[e[0]>>24&255,e[0]>>16&255,e[0]>>8&255,e[0]&255,e[1]>>24&255,e[1]>>16&255,e[1]>>8&255,e[1]&255,e[2]>>24&255,e[2]>>16&255,e[2]>>8&255,e[2]&255,e[3]>>24&255,e[3]>>16&255,e[3]>>8&255,e[3]&255,e[4]>>24&255,e[4]>>16&255,e[4]>>8&255,e[4]&255]}const Ft=Pt("v5",80,Zt);var at=function(){var t=function(M,i,n,c){for(n=n||{},c=M.length;c--;n[M[c]]=i);return n},r=[6,8,10,20,22,24,26,27,28],e=[1,10],f=[1,11],l=[1,12],p=[1,13],u=[1,14],o=[1,15],h=[1,21],_=[1,22],m=[1,23],g=[1,24],x=[1,25],y=[6,8,10,13,15,18,19,20,22,24,26,27,28,41,42,43,44,45],N=[1,34],w=[27,28,46,47],Z=[41,42,43,44,45],F=[17,34],B=[1,54],T=[1,53],A=[17,34,36,38],R={trace:function(){},yy:{},symbols_:{error:2,start:3,ER_DIAGRAM:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NEWLINE:10,entityName:11,relSpec:12,":":13,role:14,BLOCK_START:15,attributes:16,BLOCK_STOP:17,SQS:18,SQE:19,title:20,title_value:21,acc_title:22,acc_title_value:23,acc_descr:24,acc_descr_value:25,acc_descr_multiline_value:26,ALPHANUM:27,ENTITY_NAME:28,attribute:29,attributeType:30,attributeName:31,attributeKeyTypeList:32,attributeComment:33,ATTRIBUTE_WORD:34,attributeKeyType:35,COMMA:36,ATTRIBUTE_KEY:37,COMMENT:38,cardinality:39,relType:40,ZERO_OR_ONE:41,ZERO_OR_MORE:42,ONE_OR_MORE:43,ONLY_ONE:44,MD_PARENT:45,NON_IDENTIFYING:46,IDENTIFYING:47,WORD:48,$accept:0,$end:1},terminals_:{2:"error",4:"ER_DIAGRAM",6:"EOF",8:"SPACE",10:"NEWLINE",13:":",15:"BLOCK_START",17:"BLOCK_STOP",18:"SQS",19:"SQE",20:"title",21:"title_value",22:"acc_title",23:"acc_title_value",24:"acc_descr",25:"acc_descr_value",26:"acc_descr_multiline_value",27:"ALPHANUM",28:"ENTITY_NAME",34:"ATTRIBUTE_WORD",36:"COMMA",37:"ATTRIBUTE_KEY",38:"COMMENT",41:"ZERO_OR_ONE",42:"ZERO_OR_MORE",43:"ONE_OR_MORE",44:"ONLY_ONE",45:"MD_PARENT",46:"NON_IDENTIFYING",47:"IDENTIFYING",48:"WORD"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[9,5],[9,4],[9,3],[9,1],[9,7],[9,6],[9,4],[9,2],[9,2],[9,2],[9,1],[11,1],[11,1],[16,1],[16,2],[29,2],[29,3],[29,3],[29,4],[30,1],[31,1],[32,1],[32,3],[35,1],[33,1],[12,3],[39,1],[39,1],[39,1],[39,1],[39,1],[40,1],[40,1],[14,1],[14,1],[14,1]],performAction:function(i,n,c,d,E,a,z){var s=a.length-1;switch(E){case 1:break;case 2:this.$=[];break;case 3:a[s-1].push(a[s]),this.$=a[s-1];break;case 4:case 5:this.$=a[s];break;case 6:case 7:this.$=[];break;case 8:d.addEntity(a[s-4]),d.addEntity(a[s-2]),d.addRelationship(a[s-4],a[s],a[s-2],a[s-3]);break;case 9:d.addEntity(a[s-3]),d.addAttributes(a[s-3],a[s-1]);break;case 10:d.addEntity(a[s-2]);break;case 11:d.addEntity(a[s]);break;case 12:d.addEntity(a[s-6],a[s-4]),d.addAttributes(a[s-6],a[s-1]);break;case 13:d.addEntity(a[s-5],a[s-3]);break;case 14:d.addEntity(a[s-3],a[s-1]);break;case 15:case 16:this.$=a[s].trim(),d.setAccTitle(this.$);break;case 17:case 18:this.$=a[s].trim(),d.setAccDescription(this.$);break;case 19:case 43:this.$=a[s];break;case 20:case 41:case 42:this.$=a[s].replace(/"/g,"");break;case 21:case 29:this.$=[a[s]];break;case 22:a[s].push(a[s-1]),this.$=a[s];break;case 23:this.$={attributeType:a[s-1],attributeName:a[s]};break;case 24:this.$={attributeType:a[s-2],attributeName:a[s-1],attributeKeyTypeList:a[s]};break;case 25:this.$={attributeType:a[s-2],attributeName:a[s-1],attributeComment:a[s]};break;case 26:this.$={attributeType:a[s-3],attributeName:a[s-2],attributeKeyTypeList:a[s-1],attributeComment:a[s]};break;case 27:case 28:case 31:this.$=a[s];break;case 30:a[s-2].push(a[s]),this.$=a[s-2];break;case 32:this.$=a[s].replace(/"/g,"");break;case 33:this.$={cardA:a[s],relType:a[s-1],cardB:a[s-2]};break;case 34:this.$=d.Cardinality.ZERO_OR_ONE;break;case 35:this.$=d.Cardinality.ZERO_OR_MORE;break;case 36:this.$=d.Cardinality.ONE_OR_MORE;break;case 37:this.$=d.Cardinality.ONLY_ONE;break;case 38:this.$=d.Cardinality.MD_PARENT;break;case 39:this.$=d.Identification.NON_IDENTIFYING;break;case 40:this.$=d.Identification.IDENTIFYING;break}},table:[{3:1,4:[1,2]},{1:[3]},t(r,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:9,20:e,22:f,24:l,26:p,27:u,28:o},t(r,[2,7],{1:[2,1]}),t(r,[2,3]),{9:16,11:9,20:e,22:f,24:l,26:p,27:u,28:o},t(r,[2,5]),t(r,[2,6]),t(r,[2,11],{12:17,39:20,15:[1,18],18:[1,19],41:h,42:_,43:m,44:g,45:x}),{21:[1,26]},{23:[1,27]},{25:[1,28]},t(r,[2,18]),t(y,[2,19]),t(y,[2,20]),t(r,[2,4]),{11:29,27:u,28:o},{16:30,17:[1,31],29:32,30:33,34:N},{11:35,27:u,28:o},{40:36,46:[1,37],47:[1,38]},t(w,[2,34]),t(w,[2,35]),t(w,[2,36]),t(w,[2,37]),t(w,[2,38]),t(r,[2,15]),t(r,[2,16]),t(r,[2,17]),{13:[1,39]},{17:[1,40]},t(r,[2,10]),{16:41,17:[2,21],29:32,30:33,34:N},{31:42,34:[1,43]},{34:[2,27]},{19:[1,44]},{39:45,41:h,42:_,43:m,44:g,45:x},t(Z,[2,39]),t(Z,[2,40]),{14:46,27:[1,49],28:[1,48],48:[1,47]},t(r,[2,9]),{17:[2,22]},t(F,[2,23],{32:50,33:51,35:52,37:B,38:T}),t([17,34,37,38],[2,28]),t(r,[2,14],{15:[1,55]}),t([27,28],[2,33]),t(r,[2,8]),t(r,[2,41]),t(r,[2,42]),t(r,[2,43]),t(F,[2,24],{33:56,36:[1,57],38:T}),t(F,[2,25]),t(A,[2,29]),t(F,[2,32]),t(A,[2,31]),{16:58,17:[1,59],29:32,30:33,34:N},t(F,[2,26]),{35:60,37:B},{17:[1,61]},t(r,[2,13]),t(A,[2,30]),t(r,[2,12])],defaultActions:{34:[2,27],41:[2,22]},parseError:function(i,n){if(n.recoverable)this.trace(i);else{var c=new Error(i);throw c.hash=n,c}},parse:function(i){var n=this,c=[0],d=[],E=[null],a=[],z=this.table,s="",X=0,nt=0,ft=2,st=1,ut=a.slice.call(arguments,1),b=Object.create(this.lexer),U={yy:{}};for(var J in this.yy)Object.prototype.hasOwnProperty.call(this.yy,J)&&(U.yy[J]=this.yy[J]);b.setInput(i,U.yy),U.yy.lexer=b,U.yy.parser=this,typeof b.yylloc>"u"&&(b.yylloc={});var q=b.yylloc;a.push(q);var yt=b.options&&b.options.ranges;typeof U.yy.parseError=="function"?this.parseError=U.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function pt(){var P;return P=d.pop()||b.lex()||st,typeof P!="number"&&(P instanceof Array&&(d=P,P=d.pop()),P=n.symbols_[P]||P),P}for(var I,G,S,$,H={},Q,C,ot,j;;){if(G=c[c.length-1],this.defaultActions[G]?S=this.defaultActions[G]:((I===null||typeof I>"u")&&(I=pt()),S=z[G]&&z[G][I]),typeof S>"u"||!S.length||!S[0]){var tt="";j=[];for(Q in z[G])this.terminals_[Q]&&Q>ft&&j.push("'"+this.terminals_[Q]+"'");b.showPosition?tt="Parse error on line "+(X+1)+`:
`+b.showPosition()+`
Expecting `+j.join(", ")+", got '"+(this.terminals_[I]||I)+"'":tt="Parse error on line "+(X+1)+": Unexpected "+(I==st?"end of input":"'"+(this.terminals_[I]||I)+"'"),this.parseError(tt,{text:b.match,token:this.terminals_[I]||I,line:b.yylineno,loc:q,expected:j})}if(S[0]instanceof Array&&S.length>1)throw new Error("Parse Error: multiple actions possible at state: "+G+", token: "+I);switch(S[0]){case 1:c.push(I),E.push(b.yytext),a.push(b.yylloc),c.push(S[1]),I=null,nt=b.yyleng,s=b.yytext,X=b.yylineno,q=b.yylloc;break;case 2:if(C=this.productions_[S[1]][1],H.$=E[E.length-C],H._$={first_line:a[a.length-(C||1)].first_line,last_line:a[a.length-1].last_line,first_column:a[a.length-(C||1)].first_column,last_column:a[a.length-1].last_column},yt&&(H._$.range=[a[a.length-(C||1)].range[0],a[a.length-1].range[1]]),$=this.performAction.apply(H,[s,nt,X,U.yy,S[1],E,a].concat(ut)),typeof $<"u")return $;C&&(c=c.slice(0,-1*C*2),E=E.slice(0,-1*C),a=a.slice(0,-1*C)),c.push(this.productions_[S[1]][0]),E.push(H.$),a.push(H._$),ot=z[c[c.length-2]][c[c.length-1]],c.push(ot);break;case 3:return!0}}return!0}},O=function(){var M={EOF:1,parseError:function(n,c){if(this.yy.parser)this.yy.parser.parseError(n,c);else throw new Error(n)},setInput:function(i,n){return this.yy=n||this.yy||{},this._input=i,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var i=this._input[0];this.yytext+=i,this.yyleng++,this.offset++,this.match+=i,this.matched+=i;var n=i.match(/(?:\r\n?|\n).*/g);return n?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),i},unput:function(i){var n=i.length,c=i.split(/(?:\r\n?|\n)/g);this._input=i+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-n),this.offset-=n;var d=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),c.length-1&&(this.yylineno-=c.length-1);var E=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:c?(c.length===d.length?this.yylloc.first_column:0)+d[d.length-c.length].length-c[0].length:this.yylloc.first_column-n},this.options.ranges&&(this.yylloc.range=[E[0],E[0]+this.yyleng-n]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(i){this.unput(this.match.slice(i))},pastInput:function(){var i=this.matched.substr(0,this.matched.length-this.match.length);return(i.length>20?"...":"")+i.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var i=this.match;return i.length<20&&(i+=this._input.substr(0,20-i.length)),(i.substr(0,20)+(i.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var i=this.pastInput(),n=new Array(i.length+1).join("-");return i+this.upcomingInput()+`
`+n+"^"},test_match:function(i,n){var c,d,E;if(this.options.backtrack_lexer&&(E={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(E.yylloc.range=this.yylloc.range.slice(0))),d=i[0].match(/(?:\r\n?|\n).*/g),d&&(this.yylineno+=d.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:d?d[d.length-1].length-d[d.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+i[0].length},this.yytext+=i[0],this.match+=i[0],this.matches=i,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(i[0].length),this.matched+=i[0],c=this.performAction.call(this,this.yy,this,n,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),c)return c;if(this._backtrack){for(var a in E)this[a]=E[a];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var i,n,c,d;this._more||(this.yytext="",this.match="");for(var E=this._currentRules(),a=0;a<E.length;a++)if(c=this._input.match(this.rules[E[a]]),c&&(!n||c[0].length>n[0].length)){if(n=c,d=a,this.options.backtrack_lexer){if(i=this.test_match(c,E[a]),i!==!1)return i;if(this._backtrack){n=!1;continue}else return!1}else if(!this.options.flex)break}return n?(i=this.test_match(n,E[d]),i!==!1?i:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var n=this.next();return n||this.lex()},begin:function(n){this.conditionStack.push(n)},popState:function(){var n=this.conditionStack.length-1;return n>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(n){return n=this.conditionStack.length-1-Math.abs(n||0),n>=0?this.conditionStack[n]:"INITIAL"},pushState:function(n){this.begin(n)},stateStackSize:function(){return this.conditionStack.length},options:{"case-insensitive":!0},performAction:function(n,c,d,E){switch(d){case 0:return this.begin("acc_title"),22;case 1:return this.popState(),"acc_title_value";case 2:return this.begin("acc_descr"),24;case 3:return this.popState(),"acc_descr_value";case 4:this.begin("acc_descr_multiline");break;case 5:this.popState();break;case 6:return"acc_descr_multiline_value";case 7:return 10;case 8:break;case 9:return 8;case 10:return 28;case 11:return 48;case 12:return 4;case 13:return this.begin("block"),15;case 14:return 36;case 15:break;case 16:return 37;case 17:return 34;case 18:return 34;case 19:return 38;case 20:break;case 21:return this.popState(),17;case 22:return c.yytext[0];case 23:return 18;case 24:return 19;case 25:return 41;case 26:return 43;case 27:return 43;case 28:return 43;case 29:return 41;case 30:return 41;case 31:return 42;case 32:return 42;case 33:return 42;case 34:return 42;case 35:return 42;case 36:return 43;case 37:return 42;case 38:return 43;case 39:return 44;case 40:return 44;case 41:return 44;case 42:return 44;case 43:return 41;case 44:return 42;case 45:return 43;case 46:return 45;case 47:return 46;case 48:return 47;case 49:return 47;case 50:return 46;case 51:return 46;case 52:return 46;case 53:return 27;case 54:return c.yytext[0];case 55:return 6}},rules:[/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:[\s]+)/i,/^(?:"[^"%\r\n\v\b\\]+")/i,/^(?:"[^"]*")/i,/^(?:erDiagram\b)/i,/^(?:\{)/i,/^(?:,)/i,/^(?:\s+)/i,/^(?:\b((?:PK)|(?:FK)|(?:UK))\b)/i,/^(?:(.*?)[~](.*?)*[~])/i,/^(?:[\*A-Za-z_][A-Za-z0-9\-_\[\]\(\)]*)/i,/^(?:"[^"]*")/i,/^(?:[\n]+)/i,/^(?:\})/i,/^(?:.)/i,/^(?:\[)/i,/^(?:\])/i,/^(?:one or zero\b)/i,/^(?:one or more\b)/i,/^(?:one or many\b)/i,/^(?:1\+)/i,/^(?:\|o\b)/i,/^(?:zero or one\b)/i,/^(?:zero or more\b)/i,/^(?:zero or many\b)/i,/^(?:0\+)/i,/^(?:\}o\b)/i,/^(?:many\(0\))/i,/^(?:many\(1\))/i,/^(?:many\b)/i,/^(?:\}\|)/i,/^(?:one\b)/i,/^(?:only one\b)/i,/^(?:1\b)/i,/^(?:\|\|)/i,/^(?:o\|)/i,/^(?:o\{)/i,/^(?:\|\{)/i,/^(?:\s*u\b)/i,/^(?:\.\.)/i,/^(?:--)/i,/^(?:to\b)/i,/^(?:optionally to\b)/i,/^(?:\.-)/i,/^(?:-\.)/i,/^(?:[A-Za-z_][A-Za-z0-9\-_]*)/i,/^(?:.)/i,/^(?:$)/i],conditions:{acc_descr_multiline:{rules:[5,6],inclusive:!1},acc_descr:{rules:[3],inclusive:!1},acc_title:{rules:[1],inclusive:!1},block:{rules:[14,15,16,17,18,19,20,21,22],inclusive:!1},INITIAL:{rules:[0,2,4,7,8,9,10,11,12,13,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55],inclusive:!0}}};return M}();R.lexer=O;function D(){this.yy={}}return D.prototype=R,R.Parser=D,new D}();at.parser=at;const Wt=at;let W={},it=[];const Ut={ZERO_OR_ONE:"ZERO_OR_ONE",ZERO_OR_MORE:"ZERO_OR_MORE",ONE_OR_MORE:"ONE_OR_MORE",ONLY_ONE:"ONLY_ONE",MD_PARENT:"MD_PARENT"},Gt={NON_IDENTIFYING:"NON_IDENTIFYING",IDENTIFYING:"IDENTIFYING"},ht=function(t,r=void 0){return W[t]===void 0?(W[t]={attributes:[],alias:r},K.info("Added new entity :",t)):W[t]&&!W[t].alias&&r&&(W[t].alias=r,K.info(`Add alias '${r}' to entity '${t}'`)),W[t]},Ht=()=>W,zt=function(t,r){let e=ht(t),f;for(f=r.length-1;f>=0;f--)e.attributes.push(r[f]),K.debug("Added attribute ",r[f].attributeName)},Kt=function(t,r,e,f){let l={entityA:t,roleA:r,entityB:e,relSpec:f};it.push(l),K.debug("Added new relationship :",l)},Vt=()=>it,Xt=function(){W={},it=[],Ot()},Qt={Cardinality:Ut,Identification:Gt,getConfig:()=>Y().er,addEntity:ht,addAttributes:zt,getEntities:Ht,addRelationship:Kt,getRelationships:Vt,clear:Xt,setAccTitle:Et,getAccTitle:mt,setAccDescription:gt,getAccDescription:kt,setDiagramTitle:xt,getDiagramTitle:Rt},v={ONLY_ONE_START:"ONLY_ONE_START",ONLY_ONE_END:"ONLY_ONE_END",ZERO_OR_ONE_START:"ZERO_OR_ONE_START",ZERO_OR_ONE_END:"ZERO_OR_ONE_END",ONE_OR_MORE_START:"ONE_OR_MORE_START",ONE_OR_MORE_END:"ONE_OR_MORE_END",ZERO_OR_MORE_START:"ZERO_OR_MORE_START",ZERO_OR_MORE_END:"ZERO_OR_MORE_END",MD_PARENT_END:"MD_PARENT_END",MD_PARENT_START:"MD_PARENT_START"},jt=function(t,r){let e;t.append("defs").append("marker").attr("id",v.MD_PARENT_START).attr("refX",0).attr("refY",7).attr("markerWidth",190).attr("markerHeight",240).attr("orient","auto").append("path").attr("d","M 18,7 L9,13 L1,7 L9,1 Z"),t.append("defs").append("marker").attr("id",v.MD_PARENT_END).attr("refX",19).attr("refY",7).attr("markerWidth",20).attr("markerHeight",28).attr("orient","auto").append("path").attr("d","M 18,7 L9,13 L1,7 L9,1 Z"),t.append("defs").append("marker").attr("id",v.ONLY_ONE_START).attr("refX",0).attr("refY",9).attr("markerWidth",18).attr("markerHeight",18).attr("orient","auto").append("path").attr("stroke",r.stroke).attr("fill","none").attr("d","M9,0 L9,18 M15,0 L15,18"),t.append("defs").append("marker").attr("id",v.ONLY_ONE_END).attr("refX",18).attr("refY",9).attr("markerWidth",18).attr("markerHeight",18).attr("orient","auto").append("path").attr("stroke",r.stroke).attr("fill","none").attr("d","M3,0 L3,18 M9,0 L9,18"),e=t.append("defs").append("marker").attr("id",v.ZERO_OR_ONE_START).attr("refX",0).attr("refY",9).attr("markerWidth",30).attr("markerHeight",18).attr("orient","auto"),e.append("circle").attr("stroke",r.stroke).attr("fill","white").attr("cx",21).attr("cy",9).attr("r",6),e.append("path").attr("stroke",r.stroke).attr("fill","none").attr("d","M9,0 L9,18"),e=t.append("defs").append("marker").attr("id",v.ZERO_OR_ONE_END).attr("refX",30).attr("refY",9).attr("markerWidth",30).attr("markerHeight",18).attr("orient","auto"),e.append("circle").attr("stroke",r.stroke).attr("fill","white").attr("cx",9).attr("cy",9).attr("r",6),e.append("path").attr("stroke",r.stroke).attr("fill","none").attr("d","M21,0 L21,18"),t.append("defs").append("marker").attr("id",v.ONE_OR_MORE_START).attr("refX",18).attr("refY",18).attr("markerWidth",45).attr("markerHeight",36).attr("orient","auto").append("path").attr("stroke",r.stroke).attr("fill","none").attr("d","M0,18 Q 18,0 36,18 Q 18,36 0,18 M42,9 L42,27"),t.append("defs").append("marker").attr("id",v.ONE_OR_MORE_END).attr("refX",27).attr("refY",18).attr("markerWidth",45).attr("markerHeight",36).attr("orient","auto").append("path").attr("stroke",r.stroke).attr("fill","none").attr("d","M3,9 L3,27 M9,18 Q27,0 45,18 Q27,36 9,18"),e=t.append("defs").append("marker").attr("id",v.ZERO_OR_MORE_START).attr("refX",18).attr("refY",18).attr("markerWidth",57).attr("markerHeight",36).attr("orient","auto"),e.append("circle").attr("stroke",r.stroke).attr("fill","white").attr("cx",48).attr("cy",18).attr("r",6),e.append("path").attr("stroke",r.stroke).attr("fill","none").attr("d","M0,18 Q18,0 36,18 Q18,36 0,18"),e=t.append("defs").append("marker").attr("id",v.ZERO_OR_MORE_END).attr("refX",39).attr("refY",18).attr("markerWidth",57).attr("markerHeight",36).attr("orient","auto"),e.append("circle").attr("stroke",r.stroke).attr("fill","white").attr("cx",9).attr("cy",18).attr("r",6),e.append("path").attr("stroke",r.stroke).attr("fill","none").attr("d","M21,18 Q39,0 57,18 Q39,36 21,18")},L={ERMarkers:v,insertMarkers:jt},Jt=/[^\dA-Za-z](\W)*/g;let k={},V=new Map;const qt=function(t){const r=Object.keys(t);for(const e of r)k[e]=t[e]},$t=(t,r,e)=>{const f=k.entityPadding/3,l=k.entityPadding/3,p=k.fontSize*.85,u=r.node().getBBox(),o=[];let h=!1,_=!1,m=0,g=0,x=0,y=0,N=u.height+f*2,w=1;e.forEach(T=>{T.attributeKeyTypeList!==void 0&&T.attributeKeyTypeList.length>0&&(h=!0),T.attributeComment!==void 0&&(_=!0)}),e.forEach(T=>{const A=`${r.node().id}-attr-${w}`;let R=0;const O=At(T.attributeType),D=t.append("text").classed("er entityLabel",!0).attr("id",`${A}-type`).attr("x",0).attr("y",0).style("dominant-baseline","middle").style("text-anchor","left").style("font-family",Y().fontFamily).style("font-size",p+"px").text(O),M=t.append("text").classed("er entityLabel",!0).attr("id",`${A}-name`).attr("x",0).attr("y",0).style("dominant-baseline","middle").style("text-anchor","left").style("font-family",Y().fontFamily).style("font-size",p+"px").text(T.attributeName),i={};i.tn=D,i.nn=M;const n=D.node().getBBox(),c=M.node().getBBox();if(m=Math.max(m,n.width),g=Math.max(g,c.width),R=Math.max(n.height,c.height),h){const d=T.attributeKeyTypeList!==void 0?T.attributeKeyTypeList.join(","):"",E=t.append("text").classed("er entityLabel",!0).attr("id",`${A}-key`).attr("x",0).attr("y",0).style("dominant-baseline","middle").style("text-anchor","left").style("font-family",Y().fontFamily).style("font-size",p+"px").text(d);i.kn=E;const a=E.node().getBBox();x=Math.max(x,a.width),R=Math.max(R,a.height)}if(_){const d=t.append("text").classed("er entityLabel",!0).attr("id",`${A}-comment`).attr("x",0).attr("y",0).style("dominant-baseline","middle").style("text-anchor","left").style("font-family",Y().fontFamily).style("font-size",p+"px").text(T.attributeComment||"");i.cn=d;const E=d.node().getBBox();y=Math.max(y,E.width),R=Math.max(R,E.height)}i.height=R,o.push(i),N+=R+f*2,w+=1});let Z=4;h&&(Z+=2),_&&(Z+=2);const F=m+g+x+y,B={width:Math.max(k.minEntityWidth,Math.max(u.width+k.entityPadding*2,F+l*Z)),height:e.length>0?N:Math.max(k.minEntityHeight,u.height+k.entityPadding*2)};if(e.length>0){const T=Math.max(0,(B.width-F-l*Z)/(Z/2));r.attr("transform","translate("+B.width/2+","+(f+u.height/2)+")");let A=u.height+f*2,R="attributeBoxOdd";o.forEach(O=>{const D=A+f+O.height/2;O.tn.attr("transform","translate("+l+","+D+")");const M=t.insert("rect","#"+O.tn.node().id).classed(`er ${R}`,!0).attr("x",0).attr("y",A).attr("width",m+l*2+T).attr("height",O.height+f*2),i=parseFloat(M.attr("x"))+parseFloat(M.attr("width"));O.nn.attr("transform","translate("+(i+l)+","+D+")");const n=t.insert("rect","#"+O.nn.node().id).classed(`er ${R}`,!0).attr("x",i).attr("y",A).attr("width",g+l*2+T).attr("height",O.height+f*2);let c=parseFloat(n.attr("x"))+parseFloat(n.attr("width"));if(h){O.kn.attr("transform","translate("+(c+l)+","+D+")");const d=t.insert("rect","#"+O.kn.node().id).classed(`er ${R}`,!0).attr("x",c).attr("y",A).attr("width",x+l*2+T).attr("height",O.height+f*2);c=parseFloat(d.attr("x"))+parseFloat(d.attr("width"))}_&&(O.cn.attr("transform","translate("+(c+l)+","+D+")"),t.insert("rect","#"+O.cn.node().id).classed(`er ${R}`,"true").attr("x",c).attr("y",A).attr("width",y+l*2+T).attr("height",O.height+f*2)),A+=O.height+f*2,R=R==="attributeBoxOdd"?"attributeBoxEven":"attributeBoxOdd"})}else B.height=Math.max(k.minEntityHeight,N),r.attr("transform","translate("+B.width/2+","+B.height/2+")");return B},te=function(t,r,e){const f=Object.keys(r);let l;return f.forEach(function(p){const u=se(p,"entity");V.set(p,u);const o=t.append("g").attr("id",u);l=l===void 0?u:l;const h="text-"+u,_=o.append("text").classed("er entityLabel",!0).attr("id",h).attr("x",0).attr("y",0).style("dominant-baseline","middle").style("text-anchor","middle").style("font-family",Y().fontFamily).style("font-size",k.fontSize+"px").text(r[p].alias??p),{width:m,height:g}=$t(o,_,r[p].attributes),y=o.insert("rect","#"+h).classed("er entityBox",!0).attr("x",0).attr("y",0).attr("width",m).attr("height",g).node().getBBox();e.setNode(u,{width:y.width,height:y.height,shape:"rect",id:u})}),l},ee=function(t,r){r.nodes().forEach(function(e){e!==void 0&&r.node(e)!==void 0&&t.select("#"+e).attr("transform","translate("+(r.node(e).x-r.node(e).width/2)+","+(r.node(e).y-r.node(e).height/2)+" )")})},dt=function(t){return(t.entityA+t.roleA+t.entityB).replace(/\s/g,"")},re=function(t,r){return t.forEach(function(e){r.setEdge(V.get(e.entityA),V.get(e.entityB),{relationship:e},dt(e))}),t};let lt=0;const ae=function(t,r,e,f,l){lt++;const p=e.edge(V.get(r.entityA),V.get(r.entityB),dt(r)),u=wt().x(function(N){return N.x}).y(function(N){return N.y}).curve(Tt),o=t.insert("path","#"+f).classed("er relationshipLine",!0).attr("d",u(p.points)).style("stroke",k.stroke).style("fill","none");r.relSpec.relType===l.db.Identification.NON_IDENTIFYING&&o.attr("stroke-dasharray","8,8");let h="";switch(k.arrowMarkerAbsolute&&(h=window.location.protocol+"//"+window.location.host+window.location.pathname+window.location.search,h=h.replace(/\(/g,"\\("),h=h.replace(/\)/g,"\\)")),r.relSpec.cardA){case l.db.Cardinality.ZERO_OR_ONE:o.attr("marker-end","url("+h+"#"+L.ERMarkers.ZERO_OR_ONE_END+")");break;case l.db.Cardinality.ZERO_OR_MORE:o.attr("marker-end","url("+h+"#"+L.ERMarkers.ZERO_OR_MORE_END+")");break;case l.db.Cardinality.ONE_OR_MORE:o.attr("marker-end","url("+h+"#"+L.ERMarkers.ONE_OR_MORE_END+")");break;case l.db.Cardinality.ONLY_ONE:o.attr("marker-end","url("+h+"#"+L.ERMarkers.ONLY_ONE_END+")");break;case l.db.Cardinality.MD_PARENT:o.attr("marker-end","url("+h+"#"+L.ERMarkers.MD_PARENT_END+")");break}switch(r.relSpec.cardB){case l.db.Cardinality.ZERO_OR_ONE:o.attr("marker-start","url("+h+"#"+L.ERMarkers.ZERO_OR_ONE_START+")");break;case l.db.Cardinality.ZERO_OR_MORE:o.attr("marker-start","url("+h+"#"+L.ERMarkers.ZERO_OR_MORE_START+")");break;case l.db.Cardinality.ONE_OR_MORE:o.attr("marker-start","url("+h+"#"+L.ERMarkers.ONE_OR_MORE_START+")");break;case l.db.Cardinality.ONLY_ONE:o.attr("marker-start","url("+h+"#"+L.ERMarkers.ONLY_ONE_START+")");break;case l.db.Cardinality.MD_PARENT:o.attr("marker-start","url("+h+"#"+L.ERMarkers.MD_PARENT_START+")");break}const _=o.node().getTotalLength(),m=o.node().getPointAtLength(_*.5),g="rel"+lt,y=t.append("text").classed("er relationshipLabel",!0).attr("id",g).attr("x",m.x).attr("y",m.y).style("text-anchor","middle").style("dominant-baseline","middle").style("font-family",Y().fontFamily).style("font-size",k.fontSize+"px").text(r.roleA).node().getBBox();t.insert("rect","#"+g).classed("er relationshipLabelBox",!0).attr("x",m.x-y.width/2).attr("y",m.y-y.height/2).attr("width",y.width).attr("height",y.height)},ie=function(t,r,e,f){k=Y().er,K.info("Drawing ER diagram");const l=Y().securityLevel;let p;l==="sandbox"&&(p=et("#i"+r));const o=(l==="sandbox"?et(p.nodes()[0].contentDocument.body):et("body")).select(`[id='${r}']`);L.insertMarkers(o,k);let h;h=new Mt({multigraph:!0,directed:!0,compound:!1}).setGraph({rankdir:k.layoutDirection,marginx:20,marginy:20,nodesep:100,edgesep:100,ranksep:100}).setDefaultEdgeLabel(function(){return{}});const _=te(o,f.db.getEntities(),h),m=re(f.db.getRelationships(),h);It(h),ee(o,h),m.forEach(function(w){ae(o,w,h,_,f)});const g=k.diagramPadding;bt.insertTitle(o,"entityTitleText",k.titleTopMargin,f.db.getDiagramTitle());const x=o.node().getBBox(),y=x.width+g*2,N=x.height+g*2;Nt(o,N,y,k.useMaxWidth),o.attr("viewBox",`${x.x-g} ${x.y-g} ${y} ${N}`)},ne="28e9f9db-3c8d-5aa5-9faf-44286ae5937c";function se(t="",r=""){const e=t.replace(Jt,"");return`${ct(r)}${ct(e)}${Ft(t,ne)}`}function ct(t=""){return t.length>0?`${t}-`:""}const oe={setConf:qt,draw:ie},le=t=>`
  .entityBox {
    fill: ${t.mainBkg};
    stroke: ${t.nodeBorder};
  }

  .attributeBoxOdd {
    fill: ${t.attributeBackgroundColorOdd};
    stroke: ${t.nodeBorder};
  }

  .attributeBoxEven {
    fill:  ${t.attributeBackgroundColorEven};
    stroke: ${t.nodeBorder};
  }

  .relationshipLabelBox {
    fill: ${t.tertiaryColor};
    opacity: 0.7;
    background-color: ${t.tertiaryColor};
      rect {
        opacity: 0.5;
      }
  }

    .relationshipLine {
      stroke: ${t.lineColor};
    }

  .entityTitleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${t.textColor};
  }    
  #MD_PARENT_START {
    fill: #f5f5f5 !important;
    stroke: ${t.lineColor} !important;
    stroke-width: 1;
  }
  #MD_PARENT_END {
    fill: #f5f5f5 !important;
    stroke: ${t.lineColor} !important;
    stroke-width: 1;
  }
  
`,ce=le,pe={parser:Wt,db:Qt,renderer:oe,styles:ce};export{pe as diagram};
