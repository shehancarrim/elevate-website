document.addEventListener('DOMContentLoaded',()=>{
const navToggle=document.querySelector('.nav-toggle');
const mainLinks=document.querySelector('nav.main-links');
const siteNav=document.querySelector('header.site-nav');
function setNavHeight(){document.documentElement.style.setProperty('--nav-h',siteNav.offsetHeight+'px');}
setNavHeight();
window.addEventListener('resize',setNavHeight);
if(navToggle)navToggle.addEventListener('click',()=>{mainLinks.classList.toggle('open');navToggle.classList.toggle('open');});
mainLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mainLinks.classList.remove('open');navToggle.classList.remove('open');}));

document.querySelectorAll('.dropdown').forEach(dd=>{
const btn=dd.querySelector('button');
btn.addEventListener('click',(e)=>{e.stopPropagation();const isOpen=dd.classList.contains('open');document.querySelectorAll('.dropdown.open').forEach(o=>o.classList.remove('open'));if(!isOpen)dd.classList.add('open');});
});
document.addEventListener('click',()=>document.querySelectorAll('.dropdown.open').forEach(o=>o.classList.remove('open')));

document.querySelectorAll('.carousel-wrap').forEach(wrap=>{
const track=wrap.querySelector('.carousel');
const step=()=>{const s=track.firstElementChild;return s?s.getBoundingClientRect().width+18:320;};
wrap.querySelector('.prev')?.addEventListener('click',()=>track.scrollBy({left:-step(),behavior:'smooth'}));
wrap.querySelector('.next')?.addEventListener('click',()=>track.scrollBy({left:step(),behavior:'smooth'}));
});

document.querySelectorAll('form.inquiry-form').forEach(form=>{
form.addEventListener('submit',async(e)=>{
e.preventDefault();
let valid=true;
form.querySelectorAll('[required]').forEach(input=>{
const field=input.closest('.field');
let ok=input.value.trim().length>0;
if(input.type==='email'&&ok)ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
if(input.type==='tel'&&ok)ok=/^[+\d][\d\s()-]{6,}$/.test(input.value.trim());
field.classList.toggle('invalid',!ok);
if(!ok)valid=false;
});
if(!valid){form.querySelector('.field.invalid input,.field.invalid textarea')?.focus();return;}
const btn=form.querySelector('button[type="submit"]');
const errBox=form.querySelector('.form-error');
const label=btn.innerHTML;
btn.disabled=true;btn.textContent='Sending…';
if(errBox)errBox.hidden=true;
try{
const res=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
if(!res.ok)throw new Error('status '+res.status);
form.reset();
form.style.display='none';
form.nextElementSibling.classList.add('show');
}catch(err){
if(errBox)errBox.hidden=false;
btn.disabled=false;btn.innerHTML=label;
}
});
form.querySelectorAll('input,textarea').forEach(i=>i.addEventListener('input',()=>i.closest('.field').classList.remove('invalid')));
});
});
