(function(){
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
const ease=[0.16,1,0.3,1];
const cssEase='cubic-bezier(0.16,1,0.3,1)';

/* Nav scroll state */
const siteNav=document.querySelector('header.site-nav');
let lastScrolled=false;
function onScroll(){
const sc=window.scrollY>10;
if(sc!==lastScrolled){siteNav.classList.toggle('scrolled',sc);lastScrolled=sc;requestAnimationFrame(()=>{document.documentElement.style.setProperty('--nav-h',siteNav.offsetHeight+'px');});}
}
onScroll();
window.addEventListener('scroll',onScroll,{passive:true});

/* Smooth in-page anchor nav (native) */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
a.addEventListener('click',(e)=>{
const id=a.getAttribute('href');
if(id.length<2)return;
const target=document.querySelector(id);
if(!target)return;
e.preventDefault();
target.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
});
});

if(reduced)return; /* skip all decorative motion below */

/* Hero entrance */
if(window.gsap){
const hero=document.querySelector('.hero');
if(hero){
const parts=[hero.querySelector('.eyebrow'),hero.querySelector('h1'),hero.querySelector('.lead'),hero.querySelector('.hero-actions'),hero.querySelector('.hero-image')].filter(Boolean);
gsap.set(parts,{opacity:0,y:26});
gsap.set(hero.querySelector('.hero-image'),{y:0,scale:0.97});
const tl=gsap.timeline({defaults:{duration:0.9,ease:'expo.out'}});
parts.forEach((el,i)=>{
if(el.classList.contains('hero-image'))tl.to(el,{opacity:1,y:0,scale:1,duration:1.1},i*0.15);
else tl.to(el,{opacity:1,y:0},i*0.15);
});
}
}

/* Generic scroll reveal via IntersectionObserver */
const revealSelectors=['h2','.page-header h1','.lead','.service-card','.offer-box','.testimonial','.package','.step','.tag-list','.split-text > p','.split-image','.contact-info-item','form.inquiry-form','.form-success','.logo-strip image-slot'];
const groups=new Map();
revealSelectors.forEach(sel=>{
document.querySelectorAll(sel).forEach(el=>{
if(el.closest('.hero'))return;
if(el.dataset.revealSkip)return;
const parent=el.parentElement;
if(!groups.has(parent))groups.set(parent,[]);
groups.get(parent).push(el);
});
});
const io=new IntersectionObserver((entries)=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.classList.add('in-view');
io.unobserve(entry.target);
}
});
},{threshold:0.15,rootMargin:'0px 0px -60px 0px'});
groups.forEach(list=>{
list.forEach((el,i)=>{
el.classList.add('reveal');
el.style.transitionDelay=(Math.min(i,6)*70)+'ms';
io.observe(el);
});
});

/* Magnetic buttons (desktop only) */
if(fine){
document.querySelectorAll('.btn-primary,.btn-secondary').forEach(btn=>{
btn.addEventListener('mousemove',(e)=>{
const r=btn.getBoundingClientRect();
const x=(e.clientX-r.left-r.width/2)*0.18;
const y=(e.clientY-r.top-r.height/2)*0.3;
btn.style.transform=`translate(${x}px,${y}px)`;
});
btn.addEventListener('mouseleave',()=>{btn.style.transform='';});
});
}
})();
