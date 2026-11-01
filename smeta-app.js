var works=[],mats=[];
var fmt=function(n){return Math.round(n).toLocaleString('ru-RU')+' ₽'};
var num=function(v){var n=parseFloat(String(v).replace(',','.'));return isNaN(n)?0:n};
function save(){try{localStorage.setItem('smeta',JSON.stringify({c:document.getElementById('client').value,w:works,m:mats}))}catch(e){}}
function load(){try{var d=JSON.parse(localStorage.getItem('smeta')||'null');if(d){document.getElementById('client').value=d.c||'';works=d.w||[];mats=d.m||[]}}catch(e){}
 if(!works.length)works=[{n:'Шпаклёвка стен (под обои)',q:'',p:''},{n:'Шпаклёвка стен (под покраску)',q:'',p:''},{n:'Шпаклёвка потолка',q:'',p:''}];
 if(!mats.length)mats=[{n:'Шпаклёвка (мешок)',q:'',p:''}]}
function draw(){
 var w=document.getElementById('works'),m=document.getElementById('mats');
 w.innerHTML=works.map(function(r,i){return '<div class="row"><input value="'+esc(r.n)+'" placeholder="Название работы" oninput="works['+i+'].n=this.value;save()">'+
  '<div class="grid"><div><label>Площадь, м²</label><input inputmode="decimal" value="'+esc(r.q)+'" oninput="works['+i+'].q=this.value;calc()"></div>'+
  '<div><label>Цена за м², ₽</label><input inputmode="decimal" value="'+esc(r.p)+'" oninput="works['+i+'].p=this.value;calc()"></div>'+
  '<button class="del" aria-label="Удалить" onclick="works.splice('+i+',1);draw()">✕</button></div>'+
  '<div class="sum" id="ws'+i+'"></div></div>'}).join('');
 m.innerHTML=mats.map(function(r,i){return '<div class="row"><input value="'+esc(r.n)+'" placeholder="Название материала" oninput="mats['+i+'].n=this.value;save()">'+
  '<div class="grid"><div><label>Количество</label><input inputmode="decimal" value="'+esc(r.q)+'" oninput="mats['+i+'].q=this.value;calc()"></div>'+
  '<div><label>Цена за ед., ₽</label><input inputmode="decimal" value="'+esc(r.p)+'" oninput="mats['+i+'].p=this.value;calc()"></div>'+
  '<button class="del" aria-label="Удалить" onclick="mats.splice('+i+',1);draw()">✕</button></div>'+
  '<div class="sum" id="ms'+i+'"></div></div>'}).join('');
 calc()}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}
function calc(){
 var tw=0,tm=0;
 works.forEach(function(r,i){var s=num(r.q)*num(r.p);tw+=s;var e=document.getElementById('ws'+i);if(e)e.textContent=fmt(s)});
 mats.forEach(function(r,i){var s=num(r.q)*num(r.p);tm+=s;var e=document.getElementById('ms'+i);if(e)e.textContent=fmt(s)});
 document.getElementById('tw').textContent=fmt(tw);
 document.getElementById('tm').textContent=fmt(tm);
 document.getElementById('tt').textContent=fmt(tw+tm);
 save();return [tw,tm]}
function addWork(){works.push({n:'',q:'',p:''});draw()}
function addMat(){mats.push({n:'',q:'',p:''});draw()}
var rt=null;
function resetAll(){
 var b=document.getElementById('rbtn'),msg=document.getElementById('msg');
 if(!rt){b.textContent='Точно очистить? Нажмите ещё раз';msg.textContent='';rt=setTimeout(function(){rt=null;b.textContent='Очистить'},4000);return}
 clearTimeout(rt);rt=null;b.textContent='Очистить';
 works=[];mats=[];document.getElementById('client').value='';
 try{localStorage.removeItem('smeta')}catch(e){}
 load();draw();msg.textContent='Смета очищена.'}
function doPrint(){
 var msg=document.getElementById('msg');
 msg.textContent='Если окно печати не открылось: откройте сайт в Chrome или Safari (меню ⋮ → «Открыть в браузере»), затем нажмите снова и выберите «Сохранить как PDF».';
 try{window.print()}catch(e){}}
function copyText(){
 var t=calc(),c=document.getElementById('client').value;
 var s='Смета'+(c?' — '+c:'')+'\n\nРаботы:\n';
 works.forEach(function(r){if(num(r.q)*num(r.p))s+='• '+r.n+': '+r.q+' м² × '+r.p+' ₽ = '+fmt(num(r.q)*num(r.p))+'\n'});
 s+='Итого работы: '+fmt(t[0])+'\n\nМатериалы:\n';
 mats.forEach(function(r){if(num(r.q)*num(r.p))s+='• '+r.n+': '+r.q+' × '+r.p+' ₽ = '+fmt(num(r.q)*num(r.p))+'\n'});
 s+='Итого материалы: '+fmt(t[1])+'\n\nВсего: '+fmt(t[0]+t[1]);
 var msg=document.getElementById('msg');
 var ok=function(){msg.textContent='Скопировано. Вставьте в WhatsApp или Telegram.'};
 var old=function(){try{var a=document.createElement('textarea');a.value=s;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.focus();a.select();var r=document.execCommand('copy');document.body.removeChild(a);if(r)ok();else msg.textContent='Не удалось скопировать.'}catch(e){msg.textContent='Не удалось скопировать.'}};
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(s).then(ok,old)}else{old()}}
load();draw();
