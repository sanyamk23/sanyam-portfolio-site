(function(){
  try{
    var rm=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
    function init(){
      var bar=document.createElement('div');bar.id='fx-progress';bar.setAttribute('aria-hidden','true');document.body.appendChild(bar);
      var tick=false;function upd(){tick=false;var h=document.documentElement.scrollHeight-innerHeight;bar.style.transform='scaleX('+(h>0?Math.min(1,scrollY/h):0)+')'}
      addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});upd();

      if('IntersectionObserver' in window&&!rm){
        var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){var el=en.target;io.unobserve(el);requestAnimationFrame(function(){el.classList.add('fx-shown')})}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
        var seen=new WeakSet();var hio=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('fx-line');hio.unobserve(en.target)}})},{threshold:.6});
        function scan(){
          document.querySelectorAll('.glass-panel,a.tool,.way,.q,.ships li,.facts>div,.guides-list>*,section.ways-section h2,h2.h1,h2.h2,h2.t-h2,h2.split-title').forEach(function(el,i){
            if(seen.has(el))return;seen.add(el);
            if(el.tagName==='H2'){hio.observe(el);return}
            var r=el.getBoundingClientRect();if(r.top<innerHeight||el.style.opacity!=='')return;
            el.style.setProperty('--fxd',((i%4)*.08)+'s');el.classList.add('fx-pre');io.observe(el);
          });
        }
        scan();var mo=new MutationObserver(function(){clearTimeout(scan.t);scan.t=setTimeout(scan,250)});mo.observe(document.body,{childList:true,subtree:true});
      }
      if(rm||!fine)return;
      var g=document.createElement('div');g.id='fx-glow';g.setAttribute('aria-hidden','true');document.body.appendChild(g);
      var x=innerWidth/2,y=innerHeight/2,tx=x,ty=y;
      addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;document.body.classList.add('fx-on')},{passive:true});
      document.addEventListener('pointerleave',function(){document.body.classList.remove('fx-on')});
      (function loop(){x+=(tx-x)*.12;y+=(ty-y)*.12;g.style.transform='translate3d('+x+'px,'+y+'px,0)';requestAnimationFrame(loop)})();
      // magnetic buttons
      document.addEventListener('pointermove',function(e){
        var el=e.target.closest&&e.target.closest('a.work,a.band-go');
        document.querySelectorAll('a.work,a.band-go').forEach(function(b){if(b!==el)b.style.transform=''});
        if(!el)return;var r=el.getBoundingClientRect();
        el.style.transform='translate('+((e.clientX-r.left-r.width/2)*.12)+'px,'+((e.clientY-r.top-r.height/2)*.2)+'px)';
      },{passive:true});

      // spotlight on panels
      document.addEventListener('pointermove',function(e){
        var c=e.target.closest&&e.target.closest('.glass-panel,a.tool,.way');if(!c)return;
        if(!c.classList.contains('fx-spot')&&getComputedStyle(c).position!=='static')c.classList.add('fx-spot');
        else if(!c.classList.contains('fx-spot')){c.classList.add('fx-spot')}
        var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px');
      },{passive:true});
      // 3d tilt on cards
      document.addEventListener('pointermove',function(e){
        var c=e.target.closest&&e.target.closest('a.post');
        document.querySelectorAll('a.post').forEach(function(p){if(p!==c)p.style.transform=''});
        if(!c)return;var r=c.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
        c.style.transform='translateY(-6px) perspective(800px) rotateX('+(-py*5)+'deg) rotateY('+(px*5)+'deg)';
      },{passive:true});
    }
    if(document.readyState==='complete')setTimeout(init,300);else addEventListener('load',function(){setTimeout(init,300)});
  }catch(e){}
})();
