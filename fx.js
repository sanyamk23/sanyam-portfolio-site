(function(){
  try{
    var rm=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;

    function extra(){
      try{
        // palette switcher
        var pals=[['ocean','#6cc4ff'],['aurora','#7be0b0'],['sunset','#ffa26b'],['violet','#b69cff']];
        var box=document.createElement('div');box.id='fx-pal';box.setAttribute('role','group');box.setAttribute('aria-label','Accent colour');
        box.innerHTML='<span>accent</span>';
        function apply(n){pals.forEach(function(p){document.body.classList.remove('fx-pal-'+p[0])});if(n!=='ocean')document.body.classList.add('fx-pal-'+n);
          box.querySelectorAll('button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.n===n))});try{localStorage.setItem('fx-pal',n)}catch(e){}}
        pals.forEach(function(p){var b=document.createElement('button');b.type='button';b.dataset.n=p[0];b.title=p[0];b.setAttribute('aria-label',p[0]+' accent');b.style.background=p[1];b.onclick=function(){apply(p[0])};box.appendChild(b)});
        document.body.appendChild(box);var s='ocean';try{s=localStorage.getItem('fx-pal')||'ocean'}catch(e){}apply(s);
        // page wipe
        var w=document.createElement('div');w.id='fx-wipe';w.setAttribute('aria-hidden','true');document.body.appendChild(w);
        document.addEventListener('click',function(e){
          var a=e.target.closest&&e.target.closest('a[href]');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||a.target)return;
          var u;try{u=new URL(a.href)}catch(x){return}
          if(u.origin!==location.origin||u.pathname===location.pathname||/\.(pdf|png|jpg|webp|svg|xml|txt)$/.test(u.pathname))return;
          w.className='in';var p0=location.pathname,n=0;
          var iv=setInterval(function(){n++;if(location.pathname!==p0||n>16){clearInterval(iv);w.className='out';setTimeout(function(){w.className='';w.style.transition='none';w.offsetHeight;w.style.transition=''},420)}},60);
        },true);
        // hero chips
        var hero=document.querySelector('.hero');
        if(hero&&!rm&&innerWidth>900){
          var wrap=document.createElement('div');wrap.className='fx-chips';wrap.setAttribute('aria-hidden','true');
          var chips=[['FastAPI',8,22],['AWS',84,18],['Terraform',6,62],['RAG',90,56],['Kubernetes',74,80],['Redis',16,84],['Google ADK',46,12]];
          chips.forEach(function(c,i){var d=document.createElement('span');d.className='fx-chip';d.textContent=c[0];d.style.left=c[1]+'%';d.style.top=c[2]+'%';d.style.setProperty('--d',(6+i%3*1.5)+'s');d.style.setProperty('--dl',(-i*.9)+'s');d.dataset.k=(i%3+1)*6;wrap.appendChild(d)});
          hero.appendChild(wrap);
          if(fine)hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;wrap.querySelectorAll('.fx-chip').forEach(function(c){var k=+c.dataset.k;c.style.transform='translate('+(px*k*-2)+'px,'+(py*k*-2)+'px)'})},{passive:true});
        }
      }catch(e){}
    }

    function palette(){
      try{
        var items=[['Home','/','page'],['Projects','/solaris','page'],['The Vault','/vault','page'],['Tools','/tools','page'],['About','/about','page'],['Work with me','/consult','page'],['Contact','/contact','page'],
          ['Voice agents: latency and cost','/vault/voice-agent-latency-and-cost','article'],['Build a RAG agent','/vault/build-a-rag-agent-that-answers-from-your-data','article'],['Test an LLM feature','/vault/evaluate-an-llm-feature-before-you-ship','article'],['LLM features on FastAPI','/vault/ship-llm-features-on-a-fastapi-backend','article'],
          ['GitHub','https://github.com/sanyamk23','external'],['LinkedIn','https://www.linkedin.com/in/sanyamkumat/','external']];
        var o=document.createElement('div');o.id='fx-cmd';o.setAttribute('role','dialog');o.setAttribute('aria-label','Quick navigation');
        o.innerHTML='<div class="box"><input type="text" placeholder="Jump to…  (esc to close)" aria-label="Search pages" autocomplete="off"><ul></ul></div>';
        document.body.appendChild(o);var inp=o.querySelector('input'),ul=o.querySelector('ul'),sel=0,cur=items;
        function draw(){ul.innerHTML='';cur.forEach(function(it,i){var li=document.createElement('li');li.className=i===sel?'sel':'';li.innerHTML='<span></span><small></small>';li.firstChild.textContent=it[0];li.lastChild.textContent=it[2];li.onclick=function(){go(it)};li.onmousemove=function(){sel=i;[].forEach.call(ul.children,function(c,j){c.className=j===i?'sel':''})};ul.appendChild(li)})}
        function go(it){close();if(it[2]==='external')window.open(it[1],'_blank','noopener');else location.href=it[1]}
        function open(){o.classList.add('open');inp.value='';cur=items;sel=0;draw();setTimeout(function(){inp.focus()},30)}
        function close(){o.classList.remove('open')}
        inp.oninput=function(){var q=inp.value.toLowerCase();cur=items.filter(function(i){return i[0].toLowerCase().indexOf(q)>-1});sel=0;draw()};
        o.addEventListener('click',function(e){if(e.target===o)close()});
        addEventListener('keydown',function(e){
          if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();o.classList.contains('open')?close():open();return}
          if(!o.classList.contains('open'))return;
          if(e.key==='Escape')close();
          else if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(cur.length-1,sel+1);draw()}
          else if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(0,sel-1);draw()}
          else if(e.key==='Enter'&&cur[sel]){go(cur[sel])}
        });
        var h=document.createElement('button');h.id='fx-hint';h.type='button';h.textContent=/Mac/.test(navigator.platform)?'⌘K  jump to':'Ctrl K  jump to';h.onclick=open;document.body.appendChild(h);
        var tp=document.createElement('button');tp.id='fx-top';tp.type='button';tp.setAttribute('aria-label','Back to top');tp.innerHTML='<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13V3M3 7l5-5 5 5"/></svg>';
        tp.onclick=function(){scrollTo({top:0,behavior:rm?'auto':'smooth'})};document.body.appendChild(tp);
        addEventListener('scroll',function(){tp.classList.toggle('show',scrollY>700)},{passive:true});
      }catch(e){}
    }
    function init(){
      extra();palette();
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

;(function(){try{
  function addFooter(){var n=document.querySelector('.end-nav');if(!n||n.querySelector('a[href="/contact"]'))return;var a=n.querySelector('a[href="/consult"]');if(!a)return;var c=a.cloneNode(true);c.setAttribute('href','/contact');var s=c.querySelector('span');if(s)s.textContent='contact';else c.textContent='contact';c.setAttribute('aria-label','Contact');n.insertBefore(c,a)}
  window.addEventListener('load',function(){setTimeout(addFooter,1200)});
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.ct-copy');if(!b)return;var v=b.getAttribute('data-copy');var done=function(){var o=b.textContent;b.textContent='Copied';setTimeout(function(){b.textContent=o},1600)};
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(v).then(done,function(){})}else{var i=document.createElement('input');i.value=v;document.body.appendChild(i);i.select();try{document.execCommand('copy');done()}catch(_){}i.remove()}})
}catch(_){}})();
