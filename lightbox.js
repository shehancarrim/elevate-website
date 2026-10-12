(function(){
let items=[],idx=0,ov=null,stage=null,capEl=null;

function collect(){
  const galleries=[...document.querySelectorAll('.carousel:not(.t-carousel)')];
  galleries.forEach(track=>{
    [...track.children].forEach(slide=>{
      const v=slide.querySelector('video');
      const slot=slide.querySelector('image-slot');
      const img=slide.querySelector('img');
      let it=null;
      if(v) it={type:'video',src:v.getAttribute('src'),slide};
      else if(slot) it={type:'image',src:slot.getAttribute('src'),alt:slot.getAttribute('placeholder')||'',slide};
      else if(img) it={type:'image',src:img.getAttribute('src'),alt:img.getAttribute('alt')||'',slide};
      if(!it||!it.src)return;
      it.i=items.length;items.push(it);
      slide.classList.add('lb-tile');
      const btn=document.createElement('button');
      btn.type='button';btn.className='lb-open';btn.dataset.i=it.i;
      btn.setAttribute('aria-label','View '+(it.type==='video'?'video':'image')+' full size');
      btn.innerHTML='<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M7.5 3H3v4.5M12.5 3H17v4.5M17 12.5V17h-4.5M3 12.5V17h4.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
      slide.appendChild(btn);
    });
  });
}

function build(){
  ov=document.createElement('div');
  ov.className='lb-overlay';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.hidden=true;
  ov.innerHTML='<button type="button" class="lb-close" aria-label="Close">&times;</button><button type="button" class="lb-nav lb-prev" aria-label="Previous">&#8592;</button><div class="lb-stage"></div><button type="button" class="lb-nav lb-next" aria-label="Next">&#8594;</button><div class="lb-caption"></div>';
  document.body.appendChild(ov);
  stage=ov.querySelector('.lb-stage');
  capEl=ov.querySelector('.lb-caption');
  ov.querySelector('.lb-close').addEventListener('click',close);
  ov.querySelector('.lb-prev').addEventListener('click',()=>go(-1));
  ov.querySelector('.lb-next').addEventListener('click',()=>go(1));
  ov.addEventListener('click',e=>{if(e.target===ov)close();});
}

function render(){
  const it=items[idx];
  stage.innerHTML='';
  if(it.type==='video'){
    const v=document.createElement('video');
    v.src=it.src;v.controls=true;v.autoplay=true;v.playsInline=true;v.className='lb-media';
    stage.appendChild(v);
  }else{
    const i=document.createElement('img');
    i.src=it.src;i.alt=it.alt;i.className='lb-media lb-zoomable';
    i.addEventListener('click',()=>i.classList.toggle('lb-zoomed'));
    stage.appendChild(i);
  }
  capEl.textContent=(idx+1)+' / '+items.length;
  const single=items.length<2;
  ov.querySelector('.lb-prev').hidden=single;
  ov.querySelector('.lb-next').hidden=single;
}

function open(i){
  idx=i;ov.hidden=false;
  document.body.classList.add('lb-open-body');
  render();
  ov.querySelector('.lb-close').focus();
}
function close(){
  ov.hidden=true;stage.innerHTML='';
  document.body.classList.remove('lb-open-body');
}
function go(d){
  idx=(idx+d+items.length)%items.length;
  render();
}

document.addEventListener('DOMContentLoaded',()=>{
  collect();
  if(!items.length)return;
  build();
  document.addEventListener('click',e=>{
    if(document.body.classList.contains('gallery-editing'))return;
    const btn=e.target.closest('.lb-open');
    if(btn){e.preventDefault();e.stopPropagation();open(+btn.dataset.i);return;}
    const tile=e.target.closest('.lb-tile');
    if(tile&&!e.target.closest('video')&&!e.target.closest('.ge-ui')){
      const b=tile.querySelector('.lb-open');
      if(b){e.preventDefault();open(+b.dataset.i);}
    }
  });
  document.addEventListener('keydown',e=>{
    if(ov.hidden)return;
    if(e.key==='Escape')close();
    else if(e.key==='ArrowLeft')go(-1);
    else if(e.key==='ArrowRight')go(1);
  });
  // Wheel / trackpad scroll steps through the gallery (disabled while zoomed)
  let wheelLock=0;
  ov.addEventListener('wheel',e=>{
    if(ov.hidden)return;
    if(stage.querySelector('.lb-zoomed'))return;
    e.preventDefault();
    const now=Date.now();
    if(now-wheelLock<380)return;
    const d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
    if(Math.abs(d)<12)return;
    wheelLock=now;go(d>0?1:-1);
  },{passive:false});
  // Touch swipe
  let tx=0,ty=0,swiping=false;
  ov.addEventListener('touchstart',e=>{
    if(e.touches.length!==1||stage.querySelector('.lb-zoomed'))return;
    tx=e.touches[0].clientX;ty=e.touches[0].clientY;swiping=true;
  },{passive:true});
  ov.addEventListener('touchend',e=>{
    if(!swiping)return;swiping=false;
    const t=e.changedTouches[0];
    const dx=t.clientX-tx,dy=t.clientY-ty;
    if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))go(dx<0?1:-1);
  },{passive:true});
});
})();
