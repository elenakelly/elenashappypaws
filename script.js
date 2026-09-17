/* ================================================================
   Elena's Happy Paws — Script
================================================================ */

/* ================================================================
   REVIEWS DATA
   To add a new review: copy one block and fill in the details.
   photo: path to pet photo e.g. "images/reviews/vlad-cats.jpg"
         leave as "" if you don't have a photo yet
   duration: e.g. "Drop-in visits · 7 days"
================================================================ */
const REVIEWS = [
  {
    name: "Patricia O.", date: "September 2026", source: "rover",
    stars: 5, service: "House Sitting", duration: "House sitting · 1 day",
    photo: "",
    text: "Wij hebben het erg getroffen met Elena. Ze was super lief voor Bikkel en ook ondernemend. Ondanks dat Bikkel terminaal is heeft ze echt alles uit de kast getrokken om er een leuke dag van te maken voor Bikkel. Bikkel was zeer actief die dag, ondanks dat hij zo ziek is. Wij waren echt de hele dag weg en kregen de dag door mooie foto's en informatie over Bikkel. Wij merkte aan Bikkel dat hij rustig was en niet overprikkeld was toen wij thuis kwamen. Elena is een echte aanrader. 😊"
  },
  {
    name: "Vlad A.", date: "September 2026", source: "rover",
    stars: 5, service: "Drop-in Visits", duration: "Twice a day visits · 7 days",
    photo: "",
    text: "Elena was amazing with our cats. She literally made our vacation care free. Our cats were happy to see her and she spent quality time with them."
  },
  {
    name: "Yosri B.", date: "September 2026", source: "rover",
    stars: 5, service: "Drop-in Visits", duration: "Daily visits · 20 days",
    photo: "",
    text: "Elena provided incredible service for my two cats. They thrive on attention and play, which she provided expertly. I was able to leave on a 2-week trip without any worries thanks to her daily updates. Will contact her again!"
  },
  {
    name: "Seoyoon L.", date: "August 2026", source: "rover",
    stars: 5, service: "Drop-in Visits", duration: "Twice a day visits · 7 days",
    photo: "",
    text: "She is a great sitter. Her approach is gentle and she takes time to observe my cat and the situation during my absence. I could fully rely on her during my holiday and the first time I was away from my cat."
  },
  {
    name: "Tess D.", date: "August 2026", source: "rover",
    stars: 5, service: "Drop-in Visits", duration: "Every second day · 7 days",
    photo: "",
    text: "Elena is amazing! We immediately felt at ease after meeting her. Both Lilith and Mars immediately came and greeted her upon arrival, which is rare for them. She sent updates with pictures and videos every day. We will definitely ask her again!"
  },
  {
    name: "Karin T.", date: "August 2026", source: "rover",
    stars: 5, service: "Drop-in Visits", duration: "Twice a day visits · 7 days",
    photo: "",
    text: "Elena heeft een week voor onze twee poezen gezorgd. Eentje is nogal schuw en ze heeft met enorm veel geduld en begrip voor haar gezorgd, iedere dag kregen we uitgebreid verslag. We zijn ontzettend blij en gaan haar zeker weer vragen!"
  },
  {
    name: "Rob V.", date: "April 2026", source: "rover",
    stars: 5, service: "Drop-in Visits", duration: "Daily visits · 5 days",
    photo: "",
    text: "Elena took very well care of our two cats. Every day some lovely pictures and short movies of our cats. Thanks Elena, for all your help."
  },
  {
    name: "Tiffany S.", date: "March 2026", source: "rover",
    stars: 5, service: "Drop-in Visits", duration: "Daily visits · 7 days",
    photo: "images/pet16.jpg",
    text: "Elena was a great sitter for our cat Salchi. She was really attentive, especially when Salchi threw up at some point — she watched over him and kept us posted the whole time. Super reliable and easy to communicate with. Definitely recommend."
  },
  {
    name: "Maartje v.", date: "January 2026", source: "rover",
    stars: 5, service: "Drop-in Visits", duration: "Daily visits · 10 days",
    photo: "",
    text: "Elena was a dream catsitter! Everything in her profile is true, and more. Excellent with communication, spent plenty of time playing with our 2 cats. Without her, we wouldn't have been able to enjoy our holiday ❤️"
  },
  {
    name: "Danielle F.", date: "November 2025", source: "rover",
    stars: 5, service: "Drop-in Visits", duration: "Daily visits · 5 days",
    photo: "",
    text: "We're really pleased with our experience with Elena. She's very communicative, reliable, and we came home to a happy and relaxed little cat. We would definitely recommend her to anyone looking for a pet sitter in the Amersfoort area."
  },
];

/* ================================================================
   CALENDAR RANGES
   To update availability: add, edit or remove ranges below.
   status: "free" | "busy" | "full" | "away"
   Single day: set from and to the same date
================================================================ */
const RANGES = [
  { from: "2026-12-21", to: "2027-01-08", status: "away" },
  { from: "2026-07-24", to: "2026-07-24", status: "busy" },
  { from: "2026-08-02", to: "2026-08-03", status: "full" },

];

/* ================================================================
   REVIEW COUNT
   Change this number when you get new reviews.
   It updates everywhere on the page automatically.
================================================================ */
const REVIEW_COUNT = 19;

/* ================================================================
   DO NOT EDIT BELOW THIS LINE
   (unless you know what you're doing!)
================================================================ */

// ---- Inject review count everywhere ----
document.querySelectorAll('.review-count').forEach(el => el.textContent = REVIEW_COUNT);

// ---- Reveal on scroll ----
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); } });
}, {threshold:0.12});
revealEls.forEach(el => io.observe(el));

// ---- Live date in logbook card ----
const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const now = new Date();
const logEl = document.getElementById('logbook-date');
if(logEl) logEl.textContent = days[now.getDay()] + ', ' + months[now.getMonth()] + ' ' + now.getDate();

// ---- Build and render flip review cards ----
function buildReviewCards() {
  const grid = document.getElementById('reviews-grid');
  if(!grid) return;

  // First add Rover reviews from data
  REVIEWS.forEach(r => {
    const stars = '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars);
    const badgeClass = r.source === 'rover' ? 'badge-rover' : 'badge-site';
    const badgeLabel = r.source === 'rover' ? '🐾 Via Rover' : '✓ Verified visit';
    const photoHtml = r.photo
      ? `<img src="${r.photo}" alt="Pet photo" class="review-back-photo" onerror="this.style.display='none'">`
      : `<div class="review-back-photo-placeholder">📸 Photo coming soon</div>`;

    const flip = document.createElement('div');
    flip.className = 'review-flip';
    flip.innerHTML = `
      <div class="review-flip-inner">
        <div class="review-front">
          <span class="review-badge ${badgeClass}">${badgeLabel}</span>
          <div class="review-stars">${stars}</div>
          <p class="review-text">"${r.text}"</p>
          <div class="review-meta">
            <strong>${r.name}</strong>
            <span>${r.service} · ${r.date}</span>
          </div>
          <span class="flip-hint">tap to see details →</span>
        </div>
        <div class="review-back">
          ${photoHtml}
          <div class="review-back-content">
            <h4>${r.name}</h4>
            <div class="review-back-row"><span class="rb-label">Service</span><span class="rb-val">${r.service}</span></div>
            <div class="review-back-row"><span class="rb-label">Duration</span><span class="rb-val">${r.duration}</span></div>
            <div class="review-back-row"><span class="rb-label">Date</span><span class="rb-val">${r.date}</span></div>
            <div class="review-back-row"><span class="rb-label">Rating</span><span class="rb-val">${stars}</span></div>
            <span class="flip-back-hint">← tap to go back</span>
          </div>
        </div>
      </div>`;
    flip.addEventListener('click', () => flip.classList.toggle('flipped'));
    grid.appendChild(flip);
  });

  // Then load approved on-site reviews from localStorage
  const approved = JSON.parse(localStorage.getItem('approved_reviews') || '[]');
  approved.forEach(r => {
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    const flip = document.createElement('div');
    flip.className = 'review-flip';
    flip.innerHTML = `
      <div class="review-flip-inner">
        <div class="review-front">
          <span class="review-badge badge-site">✓ Verified visit</span>
          <div class="review-stars">${stars}</div>
          <p class="review-text">"${r.text}"</p>
          <div class="review-meta"><strong>${r.name}</strong><span>${r.service} · ${r.date}</span></div>
          <span class="flip-hint">tap to see details →</span>
        </div>
        <div class="review-back">
          <div class="review-back-photo-placeholder">📸 Photo coming soon</div>
          <div class="review-back-content">
            <h4>${r.name}</h4>
            <div class="review-back-row"><span class="rb-label">Service</span><span class="rb-val">${r.service}</span></div>
            <div class="review-back-row"><span class="rb-label">Date</span><span class="rb-val">${r.date}</span></div>
            <div class="review-back-row"><span class="rb-label">Rating</span><span class="rb-val">${stars}</span></div>
            <span class="flip-back-hint">← tap to go back</span>
          </div>
        </div>
      </div>`;
    flip.addEventListener('click', () => flip.classList.toggle('flipped'));
    grid.appendChild(flip);
  });
}
buildReviewCards();

// ---- Calendar ----
function buildSchedule(ranges) {
  const map = {};
  ranges.forEach(({ from, to, status }) => {
    const start = new Date(from), end = new Date(to);
    for(let d = new Date(start); d <= end; d.setDate(d.getDate()+1)){
      map[d.toISOString().slice(0,10)] = status;
    }
  });
  return map;
}
const SCHEDULE = buildSchedule(RANGES);

const TODAY = new Date();
let viewYear = TODAY.getFullYear(), viewMonth = TODAY.getMonth();
const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const monthShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function pad(n){ return String(n).padStart(2,'0'); }
let pickStart = null, pickEnd = null;
function dateKey(y,m,d){ return `${y}-${pad(m+1)}-${pad(d)}`; }
function friendlyDate(y,m,d){ return `${d} ${monthShort[m]} ${y}`; }
function isBookable(s){ return s==='free'||s==='busy'; }

function updateFormDates(){
  const f = document.getElementById('fdates'); if(!f) return;
  if(pickStart && pickEnd){
    const [sy,sm,sd]=pickStart.split('-').map(Number), [ey,em,ed]=pickEnd.split('-').map(Number);
    f.value=`${friendlyDate(sy,sm-1,sd)} – ${friendlyDate(ey,em-1,ed)}`;
  } else if(pickStart){ const [sy,sm,sd]=pickStart.split('-').map(Number); f.value=friendlyDate(sy,sm-1,sd); }
}

function updateHint(){
  const h=document.getElementById('cal-pick-hint'); if(!h) return;
  if(!pickStart){ h.textContent='👆 Tap a green or orange day to pre-fill your booking dates'; }
  else if(!pickEnd){ h.textContent='✅ Start date selected — now tap an end date'; }
  else {
    const [sy,sm,sd]=pickStart.split('-').map(Number), [ey,em,ed]=pickEnd.split('-').map(Number);
    h.innerHTML=`📅 ${friendlyDate(sy,sm-1,sd)} – ${friendlyDate(ey,em-1,ed)} selected &nbsp;·&nbsp; <a href="#contact" style="color:var(--clay-deep);text-decoration:underline;">Go to form →</a>`;
  }
}

function renderCalendar(){
  const grid=document.getElementById('cal-grid'); if(!grid) return;
  grid.innerHTML='';
  document.getElementById('cal-month-label').textContent=monthNames[viewMonth]+' '+viewYear;
  const firstDay=new Date(viewYear,viewMonth,1).getDay(), daysInMonth=new Date(viewYear,viewMonth+1,0).getDate();
  for(let i=0;i<firstDay;i++){ const e=document.createElement('div'); e.className='date-cell empty'; grid.appendChild(e); }
  let freeCount=0;
  for(let d=1;d<=daysInMonth;d++){
    const key=dateKey(viewYear,viewMonth,d), status=SCHEDULE[key]||'free';
    if(status==='free') freeCount++;
    const cell=document.createElement('div'); cell.className='date-cell status-'+status;
    if(viewYear===TODAY.getFullYear()&&viewMonth===TODAY.getMonth()&&d===TODAY.getDate()) cell.classList.add('today');
    const isPast=new Date(viewYear,viewMonth,d)<new Date(TODAY.getFullYear(),TODAY.getMonth(),TODAY.getDate());
    if(isPast){ cell.classList.add('past'); }
    else if(isBookable(status)){
      cell.classList.add('clickable');
      cell.setAttribute('data-key',key);
      cell.setAttribute('data-tip',status==='busy'?'Limited spots':'Available');
      if(pickStart&&pickEnd){
        const cd=new Date(viewYear,viewMonth,d),[sy,sm,sd]=pickStart.split('-').map(Number),[ey,em,ed]=pickEnd.split('-').map(Number);
        if(cd>=new Date(sy,sm-1,sd)&&cd<=new Date(ey,em-1,ed)) cell.classList.add('selected');
      } else if(pickStart===key){ cell.classList.add('selected'); }
      cell.addEventListener('click',()=>{
        if(!pickStart||(pickStart&&pickEnd)){ pickStart=key; pickEnd=null; }
        else { if(key<pickStart){pickEnd=pickStart;pickStart=key;}else{pickEnd=key;} }
        updateFormDates(); updateHint(); renderCalendar();
        if(pickStart&&pickEnd){ setTimeout(()=>document.getElementById('contact').scrollIntoView({behavior:'smooth',block:'start'}),400); }
      });
    }
    cell.innerHTML=d+'<span class="dot"></span>'; grid.appendChild(cell);
  }
  document.getElementById('cal-open-count').textContent=freeCount+' open day'+(freeCount===1?'':'s')+' this month';
}

const calTodayLabel = document.getElementById('cal-today-label');
if(calTodayLabel) calTodayLabel.textContent='Today: '+monthNames[TODAY.getMonth()].slice(0,3)+' '+TODAY.getDate();
document.getElementById('cal-prev')?.addEventListener('click',()=>{ viewMonth--; if(viewMonth<0){viewMonth=11;viewYear--;} renderCalendar(); });
document.getElementById('cal-next')?.addEventListener('click',()=>{ viewMonth++; if(viewMonth>11){viewMonth=0;viewYear++;} renderCalendar(); });
renderCalendar();

// ---- Contact form ----
document.getElementById('contact-form')?.addEventListener('submit', async function(e){
  e.preventDefault();
  const btn=document.getElementById('submit-btn'), status=document.getElementById('form-status');
  const data={ name:document.getElementById('fname').value, email:document.getElementById('femail').value, dates:document.getElementById('fdates').value, service:document.getElementById('fservice').value, message:document.getElementById('fmessage').value };
  btn.textContent='Sending...'; btn.disabled=true; status.textContent='';
  try {
    const [r] = await Promise.all([
      fetch('https://formspree.io/f/mwvdazga',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)}),
      fetch('/api/notify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}),
    ]);
    if(r.ok){ status.style.color='#4A9B6F'; status.textContent="✅ Inquiry sent! I'll get back to you within an hour."; this.reset(); }
    else throw new Error();
  } catch(err){ status.style.color='var(--clay-deep)'; status.textContent='❌ Something went wrong — please try again or email me directly.'; }
  finally{ btn.textContent='Send inquiry'; btn.disabled=false; }
});

// ---- Star picker ----
const starEls=document.querySelectorAll('#star-picker span');
let selectedRating=5;
function setStars(val){ starEls.forEach(s=>s.classList.toggle('active',parseInt(s.dataset.val)<=val)); const rr=document.getElementById('rrating'); if(rr) rr.value=val; selectedRating=val; }
setStars(5);
starEls.forEach(s=>{
  s.addEventListener('mouseover',()=>setStars(parseInt(s.dataset.val)));
  s.addEventListener('mouseout',()=>setStars(selectedRating));
  s.addEventListener('click',()=>{ selectedRating=parseInt(s.dataset.val); setStars(selectedRating); });
});

// ---- On-site review form ----
document.getElementById('review-form')?.addEventListener('submit', async function(e){
  e.preventDefault();
  const btn=document.getElementById('review-submit-btn'), status=document.getElementById('review-submit-status');
  const data={ type:'review', name:document.getElementById('rname').value, rating:document.getElementById('rrating').value, service:document.getElementById('rservice').value, text:document.getElementById('rtext').value };
  btn.textContent='Submitting...'; btn.disabled=true;
  try {
    await fetch('/api/notify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    status.style.color='#4A9B6F';
    status.textContent='✅ Thank you! Your review has been submitted and will appear once approved.';
    this.reset(); setStars(5);
  } catch(err){ status.style.color='var(--clay-deep)'; status.textContent='❌ Something went wrong — please try again.'; }
  finally{ btn.textContent='Submit review'; btn.disabled=false; }
});

// ---- Photo strip ----
const track=document.getElementById('stripTrack'), viewport=document.getElementById('stripViewport');
if(track && viewport){
  const SLIDE_W=312; let offset=0, autoTimer, isPaused=false;
  function cloneSlides(){ [...track.querySelectorAll('.strip-slide')].forEach(s=>track.appendChild(s.cloneNode(true))); }
  cloneSlides();
  function moveTo(x,smooth){ track.style.transition=smooth?'transform 0.5s ease':'none'; track.style.transform=`translateX(${-x}px)`; }
  function getMax(){ return (track.querySelectorAll('.strip-slide').length/2)*SLIDE_W; }
  function advance(dir){
    offset+=dir*SLIDE_W; const max=getMax();
    if(offset>=max){moveTo(max,false);offset=0;setTimeout(()=>moveTo(0,false),20);return;}
    if(offset<0){offset=max-SLIDE_W;moveTo(offset,false);return;}
    moveTo(offset,true);
  }
  function startAuto(){ autoTimer=setInterval(()=>{if(!isPaused)advance(1);},3200); }
  document.getElementById('stripPrev')?.addEventListener('click',()=>{advance(-1);isPaused=true;clearInterval(autoTimer);setTimeout(()=>{isPaused=false;startAuto();},6000);});
  document.getElementById('stripNext')?.addEventListener('click',()=>{advance(1);isPaused=true;clearInterval(autoTimer);setTimeout(()=>{isPaused=false;startAuto();},6000);});
  viewport.addEventListener('mouseenter',()=>isPaused=true);
  viewport.addEventListener('mouseleave',()=>isPaused=false);
  moveTo(0,false); startAuto();
}