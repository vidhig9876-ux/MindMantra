/* MindMantra - simple vanilla JavaScript. Each function does one small job. */
var ICON={home:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
pulse:'<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/>',
vent:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
mood:'<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>'};
function icon(n){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+ICON[n]+'</svg>';}
function $(s){return document.querySelector(s);}

/* Logo: 6 lotus petals + centre dot, drawn with a loop */
function drawLogo(){var p='',c=['#C4B8E8','#A8C9B2','#90C8F0'];
 for(var i=0;i<6;i++){p+='<ellipse cx="0" cy="-14" rx="6" ry="11" fill="'+c[i%3]+'" opacity=".75" transform="rotate('+(i*60)+')"/>';}
 var svg='<svg viewBox="-24 -24 48 48">'+p+'<circle r="7" fill="#8F80D0"/><circle r="3" fill="#fff"/></svg>';
 document.querySelectorAll('.logo').forEach(function(e){e.innerHTML=svg;});}

/* Bottom navigation, same on every standard page */
function buildNav(){var n=$('#nav');if(!n)return;n.className='nav';var pg=document.body.dataset.page;
 var items=[['home.html','home','Home','home'],['campus-pulse.html','pulse','Pulse','pulse'],['emergency-sos.html','','','sos'],['voice-vent.html','vent','Vent','vent'],['mood-screen.html','mood','Check-in','mood']];
 n.innerHTML=items.map(function(i){
  if(i[3]==='sos')return '<a class="sos" href="'+i[0]+'">Feeling Overwhelmed?<br>Tap Here</a>';
  return '<a href="'+i[0]+'" class="'+(pg===i[3]?'on':'')+'">'+icon(i[1])+i[2]+'</a>';}).join('');}

/* Dashboard: tiny wins with sparkle + greenhouse demo toggle */
function initHome(){var wins=document.querySelectorAll('.win');if(!wins.length)return;
 wins.forEach(function(w){w.onclick=function(){w.classList.toggle('done');if(w.classList.contains('done'))sparkle(w);count();};});
 function count(){$('#wcount').textContent=document.querySelectorAll('.win.done').length+' of '+wins.length;}
 function sparkle(el){for(var i=0;i<7;i++){var s=document.createElement('span');s.className='spark';s.textContent='\u2726';
  var a=i/7*6.28;s.style.setProperty('--dx',Math.cos(a)*46+'px');s.style.setProperty('--dy',Math.sin(a)*46+'px');el.appendChild(s);setTimeout(function(x){x.remove();},900,s);}}
 document.querySelectorAll('.seg button').forEach(function(b){b.onclick=function(){
  document.querySelectorAll('.seg button').forEach(function(x){x.classList.remove('on');});b.classList.add('on');
  var w=b.dataset.s==='wilt';$('#terr').classList.toggle('wilt',w);
  $('#ghText').textContent=w?'Your plant is resting a little. A tiny check-in is all it needs.':'Your plant is blooming. Every check-in helps it grow gently.';};});
 count();}

/* Check-in: tap/drag gradient map + six options */
var MOODS=[['full','My mind feels too full','Racing thoughts, hard to switch off','Try a 2-minute breathing reset to make some space.','emergency-sos.html','Open calm space'],
['restless','I feel restless','Uneasy, can\'t settle','Let the body settle first: try a grounding exercise.','emergency-sos.html','Ground me'],
['exhausted','I\'m emotionally exhausted','Drained and empty','Rest without guilt. One small win is enough today.','home.html','See tiny wins'],
['wrong','Something feels wrong','Can\'t name it','You don\'t have to name it. Speaking it out can help.','voice-vent.html','Open Voice Vent'],
['peace','I just need a little peace','Craving calm and quiet','Take a quiet minute. Nothing to fix right now.','emergency-sos.html','Quiet minute'],
['release','I want to let something out','Something is building up','Say it out loud. Nothing is saved or judged.','voice-vent.html','Open Voice Vent']];
function initMood(){var map=$('#map');if(!map)return;var pos={x:.35,y:.4},pick='';
 function word(){var x=pos.x,y=pos.y;if(Math.abs(x-.5)<.15&&Math.abs(y-.5)<.15)return['Somewhere in between','peace'];
  if(y<.5)return x<.5?['Peaceful','peace']:['Focused','full'];return x<.5?['Low and heavy','exhausted']:['Overwhelmed','restless'];}
 function move(e){var r=map.getBoundingClientRect();pos.x=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width));pos.y=Math.min(1,Math.max(0,(e.clientY-r.top)/r.height));
  $('#cur').style.left=pos.x*100+'%';$('#cur').style.top=pos.y*100+'%';$('#word').textContent=word()[0];}
 var down=false;map.onpointerdown=function(e){down=true;move(e);};map.onpointermove=function(e){if(down)move(e);};window.onpointerup=function(){down=false;};
 $('#moods').innerHTML=MOODS.map(function(m){return '<button class="opt" data-k="'+m[0]+'">'+m[1]+'<small>'+m[2]+'</small></button>';}).join('');
 document.querySelectorAll('.opt').forEach(function(b){b.onclick=function(){document.querySelectorAll('.opt').forEach(function(x){x.classList.remove('sel');});b.classList.add('sel');pick=b.dataset.k;};});
 $('#save').onclick=function(){var k=pick||word()[1],m=MOODS.filter(function(x){return x[0]===k;})[0],r=$('#result');
  r.hidden=false;r.innerHTML='<div class="label">A gentle suggestion</div><h3>'+m[1]+'</h3><p style="margin:6px 0 12px">'+m[3]+'</p><a class="btn" href="'+m[4]+'">'+m[5]+'</a>';r.scrollIntoView({behavior:'smooth',block:'center'});};}

/* Voice Vent (demonstration only: no audio is captured or stored) */
function initVent(){var mic=$('#mic');if(!mic)return;var w=$('#wave'),on=false,t1,t2;
 for(var i=0;i<17;i++)w.appendChild(document.createElement('i'));var bars=w.children;
 mic.onclick=function(){on=!on;mic.classList.toggle('rec',on);
  if(on){document.body.classList.remove('dawn');$('#status').textContent='Listening (demo)... speak freely';
   t1=setInterval(function(){for(var i=0;i<bars.length;i++)bars[i].style.height=(6+Math.random()*34)+'px';},130);
   t2=setInterval(function(){var p=document.createElement('span');p.className='pt';var s=3+Math.random()*5;
    p.style.cssText='width:'+s+'px;height:'+s+'px;left:'+(40+Math.random()*20)+'%';$('#field').appendChild(p);setTimeout(function(){p.remove();},3000);},140);}
  else{clearInterval(t1);clearInterval(t2);for(var j=0;j<bars.length;j++)bars[j].style.height='6px';
   document.body.classList.add('dawn');$('#status').textContent='You have been heard by the universe.';$('#after').hidden=false;}};}

/* Campus Pulse: demo dots + breathing caption */
function initPulse(){var m=$('#pmap');if(!m)return;var seed=7;function rnd(){seed=(seed*9301+49297)%233280;return seed/233280;}
 for(var i=0;i<30;i++){var d=document.createElement('span');d.className='pd'+(i%6===0?' c':'');d.style.left=(8+rnd()*84)+'%';d.style.top=(8+rnd()*84)+'%';d.style.animationDelay=rnd()*2+'s';m.appendChild(d);}
 var inh=true;setInterval(function(){inh=!inh;$('#bt').textContent=inh?'Breathe in...':'Breathe out...';},4000);}

/* SOS: one button -> random grounding exercise */
function initSos(){var b=$('#calm');if(!b)return;var st=$('#stage'),timers=[];
 var note='<p class="tiny">A calming tool, not emergency care. If you feel unsafe, contact your campus counsellor or local emergency services (India: Tele-MANAS 14416).</p>';
 function end(){timers.forEach(clearInterval);timers=[];}
 function menu(){return '<p class="tiny"><button id="again">another exercise</button> <a href="home.html">leave calm mode</a></p>'+note;}
 var ex=[function(){st.innerHTML='<div class="track"><i class="orb"></i></div><p>Follow the soft light with your eyes. Breathe in as it rises, out as it falls.</p>'+menu();},
 function(){var s=['Name 5 things you can see','Notice 4 things you can touch','Listen for 3 sounds','Find 2 things you can smell','Notice 1 thing you can taste'],i=0;
  function show(){st.innerHTML='<div class="step">'+s[i]+'</div><p>Take your time. Tap nothing. Just notice.</p>'+menu();$('#again').onclick=start;}
  show();timers.push(setInterval(function(){i=(i+1)%5;show();},7000));},
 function(){st.innerHTML='<div class="hap"></div><p>Feel the slow pulse (your phone may vibrate). Breathe with it.</p>'+menu();
  timers.push(setInterval(function(){if(navigator.vibrate)navigator.vibrate([150,90,150]);},3000));}];
 function start(){end();ex[Math.floor(Math.random()*ex.length)]();var a=$('#again');if(a)a.onclick=start;}
 b.onclick=start;}

document.addEventListener('DOMContentLoaded',function(){drawLogo();buildNav();initHome();initMood();initVent();initPulse();initSos();});
