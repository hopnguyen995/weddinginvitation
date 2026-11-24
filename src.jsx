import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

/* ================= Nội dung thiệp (giữ nguyên text của bạn) ================= */
const DATA = {
  groomShort: 'Hải Dương',
  brideShort: 'Trần Hảo',
  groom: 'Trần Hải Dương',
  bride: 'Trần Thị Quang Hảo',
  dateLabel: '12 tháng 12, 2026',
  families: [
    { title: 'Ông Bà', father: 'Trần Đình Đông', mother: 'Trần Thị Thúy Hằng', address: 'Thôn Đông Thành- Hát Môn- Hà Nội' },
    { title: 'Ông Bà', father: 'Trần Quang Tài', mother: 'Nguyễn Thị Ngọc Hạnh', address: 'Thôn Tiền Giang- Hát Môn- Hà Nội' },
  ],
  ceremony: { place: 'LỄ THÀNH HÔN ĐƯỢC CỬ HÀNH TẠI\nTƯ GIA NHÀ TRAI', time: '10:30', weekday: 'THỨ BẢY', day: '12', month: 'THÁNG 12', year: '2026', lunar: '(Tức ngày 4 tháng 11 năm Bính Ngọ)' },
  party: { time: '15:00', weekday: 'THỨ SÁU', day: '11', month: 'THÁNG 12', year: '2026', lunar: '(Tức ngày 3 tháng 11 năm Bính Ngọ)', start: '2026-12-11T15:00:00+07:00' },
  venue: 'Sân Phủ Quận Công',
  music: `${import.meta.env.BASE_URL}music/song.mp3`, // file nhạc: public/music/song.mp3
};
const BASE = import.meta.env.BASE_URL; // '/' khi dev, '/weddinginvitation/' trên GitHub Pages
const T = `${BASE}images/themes/minimalism-green/`;
const PHOTOS = Array.from({ length: 11 }, (_, i) => `${BASE}images/photos/album-${String(i + 1).padStart(2, '0')}.jpg`);
const G = 'Hải Dương', B = 'Trần Hảo';
const WISHES = [
  `Chúc ${G} và ${B} trăm năm hạnh phúc, đầu bạc răng long!`,
  `Chúc ${G} và ${B} một đời bình an, luôn nắm tay nhau qua mọi thăng trầm.`,
  `Chúc mừng ${G} và ${B}! Mong tổ ấm nhỏ của hai bạn luôn ngập tràn tiếng cười.`,
  `Chúc ${B} và ${G} mãi yêu thương, thấu hiểu và trân trọng nhau như ngày đầu.`,
  `Chúc hai bạn ${G}, ${B} sớm có thiên thần nhỏ, gia đình thêm viên mãn.`,
  `Chúc tình yêu của ${G} và ${B} luôn ấm áp, bền chặt theo năm tháng.`,
  `Chúc ${G} và ${B} cùng nhau đi hết con đường phía trước, luôn là chỗ dựa vững chắc cho nhau.`,
  `Hạnh phúc nhé ${G} và ${B}! Chúc hai bạn luôn vui vẻ, khỏe mạnh và thành công.`,
  `Chúc ${B} và ${G} xây dựng một gia đình thuận hòa, êm ấm và đủ đầy.`,
  `Chúc mừng ngày vui của ${G} và ${B}. Mong mỗi ngày bên nhau đều là một ngày đẹp.`,
  `Chúc ${G} và ${B} luôn giữ được nụ cười và sự dịu dàng dành cho nhau.`,
  `Chúc hai bạn ${G}, ${B} bách niên giai lão, vạn sự như ý!`,
  `Chúc ${G} và ${B} tình nồng ý hợp, cùng nhau vun đắp hạnh phúc trọn đời.`,
  `Chúc mừng ${B} và ${G}! Mong tình yêu của hai bạn luôn đong đầy như hôm nay.`,
  `Chúc ${G} và ${B} có một hành trình hôn nhân thật nhiều kỷ niệm đẹp.`,
  `Chúc ${G} và ${B} luôn bao dung, sẻ chia và cùng nhau lớn lên mỗi ngày.`,
  `Chúc hai bạn ${G} và ${B} hạnh phúc viên mãn, sớm sinh quý tử.`,
  `Chúc tổ ấm của ${G} và ${B} luôn bình yên, là nơi cả hai muốn trở về.`,
  `Chúc ${B} và ${G} mãi là bạn đồng hành tuyệt vời nhất của nhau.`,
  `Chúc mừng hạnh phúc ${G} và ${B}! Chúc hai bạn yêu nhau trọn đời, trọn kiếp.`,
];
const pickWishes = (n = 5) => [...WISHES].sort(() => Math.random() - 0.5).slice(0, n);
const calendarUrl = () => {
  const p = new URLSearchParams({
    action: 'TEMPLATE', text: `Đám cưới ${DATA.groom} & ${DATA.bride}`, dates: '20261211T080000Z/20261211T100000Z',
    ctz: 'Asia/Saigon', details: `Tiệc cưới của ${DATA.groom} & ${DATA.bride} tại ${DATA.venue}`, location: DATA.venue,
  });
  return `https://www.google.com/calendar/render?${p.toString().replace(/\+/g, '%20')}`;
};
const VENUE_GEO = '21.128502,105.617245'; // https://maps.app.goo.gl/qdQY6DH9vLZpDTeH8
const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${VENUE_GEO}`;
const mapEmbed = `https://maps.google.com/maps?q=${VENUE_GEO}&z=16&output=embed`;
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const INK = 'rgb(107, 123, 79)', SAGE = 'rgb(135, 161, 114)', DARK = 'rgb(39, 46, 19)';
const F = {
  times: '"Times New Roman", serif',
  bask: 'Baskerville, "Times New Roman", serif',
  corm: '"Cormorant Garamond", "Times New Roman", serif',
  viaoda: '"Viaoda Libre", serif',
  naut: '"The Nautigal", cursive',
  ebg: '"EB Garamond", serif',
  lora: 'Lora, "Times New Roman", serif',
};
const D = ({ children }) => <span dir="auto">{children}</span>;

/* ================= Parallax (dùng chung cho các ảnh hoa nền) ================= */
function useParallax() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let cur = 0, raf;
    const tick = () => {
      const target = window.scrollY * 0.055;
      cur += (target - cur) * 0.08;
      if (Math.abs(target - cur) < 0.01) cur = target;
      setY(Math.round(cur * 100) / 100);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return y;
}
/* ================= Tự cuộn tới cuối trang (giống bản gốc) =================
   - Bắt đầu ~1.2s sau khi trang thiệp hiện, tốc độ 50px/giây, dừng ở cuối trang.
   - Chạm vào nội dung thiệp: bật/tắt tự cuộn (bấm nút nhạc, nút, link, ô nhập… không ảnh hưởng).
   - Cuộn tay (lăn chuột, vuốt, phím): dừng. */
function useAutoScroll(enabled) {
  const st = useRef({ on: false, pos: 0, last: 0, raf: 0 });
  useEffect(() => {
    if (!enabled) return;
    const s = st.current;
    const max = () => document.documentElement.scrollHeight - window.innerHeight;
    const loop = (t) => {
      if (!s.on) { s.raf = 0; return; }
      const dt = s.last ? (t - s.last) / 1000 : 0; s.last = t;
      s.pos = Math.min(max(), s.pos + 50 * dt);
      window.scrollTo(0, s.pos);
      if (s.pos >= max() - 0.5) { s.on = false; s.raf = 0; return; }
      s.raf = requestAnimationFrame(loop);
    };
    const start = () => { if (s.on || window.scrollY >= max() - 1) return; s.on = true; s.pos = window.scrollY; s.last = 0; s.raf = requestAnimationFrame(loop); };
    const stop = () => { s.on = false; if (s.raf) cancelAnimationFrame(s.raf); s.raf = 0; };
    // Chỉ bật/tắt khi chạm vào nội dung thiệp; bỏ qua nút nhạc, nút, link, ô nhập, hộp thoại, ảnh phóng to
    const IGNORE = '.music, button, a, input, textarea, select, label, dialog, iframe, .lb';
    const toggle = (e) => { if (e.target.closest(IGNORE)) return; s.on ? stop() : start(); };
    const manual = () => stop();
    const onKey = (e) => { if (e.target.closest?.('input, textarea, select, [contenteditable]')) return; if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key)) stop(); };
    const root = document.querySelector('.inv');
    const startTimer = setTimeout(start, 1200);
    root?.addEventListener('click', toggle);
    window.addEventListener('wheel', manual, { passive: true });
    window.addEventListener('touchmove', manual, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(startTimer); stop(); root?.removeEventListener('click', toggle); window.removeEventListener('wheel', manual); window.removeEventListener('touchmove', manual); window.removeEventListener('keydown', onKey); };
  }, [enabled]);
}

/* Co chữ cho vừa khung (giống template tự fit tên cô dâu/chú rể) */
function FitH3({ children, max = 42 }) {
  const ref = useRef(null);
  const [size, setSize] = useState(max);
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const fit = () => {
      let s = max; el.style.fontSize = s + 'px';
      while (s > 16 && el.scrollWidth > el.clientWidth) { s -= 1; el.style.fontSize = s + 'px'; }
      setSize(s);
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit); ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, [children, max]);
  return (
    <h3 ref={ref} className="couple-name" style={{ fontSize: size, fontFamily: F.viaoda, color: '#fff' }}>{children}</h3>
  );
}

/* ================= Bìa thiệp ================= */
const LEAF = 'M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z';
const HEART = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';
const LEAVES = Array.from({ length: 12 }, (_, i) => {
  const r = (n) => { const x = Math.sin(i * 97.13 + n * 13.7) * 10000; return x - Math.floor(x); };
  return { left: r(1) * 100, size: 10 + r(2) * 10, sway: 5 + r(3) * 25, dur: 15 + r(4) * 10, delay: -r(5) * 20 };
});

const PARTICLES = Array.from({ length: 32 }, (_, i) => {
  const r = (n) => { const x = Math.sin(i * 53.71 + n * 7.31) * 10000; return x - Math.floor(x); };
  const ang = (i / 32) * Math.PI * 2 + r(1) * 0.4, dist = 110 + r(2) * 150;
  return { size: 10 + r(3) * 10, dx: Math.cos(ang) * dist, dy: Math.sin(ang) * dist, rs: (r(4) * 30 - 15), re: (r(5) * 360 - 180), delay: 0.02 + r(6) * 0.13 };
});

function Cover({ onOpen, phase }) {
  const opening = phase !== 'closed';
  const [burst, setBurst] = useState(false);
  useEffect(() => { if (!opening) return; const t = setTimeout(() => setBurst(true), 560); return () => clearTimeout(t); }, [opening]);
  return (
    <div className={`cover${phase === 'leaving' ? ' cover--leaving' : ''}`} style={{ background: 'linear-gradient(to bottom right, #e9efe1, #dbe6cf, #cdd9bd)' }}>
      <div className="cover__leaves" style={{ zIndex: 1 }}>
        {LEAVES.map((l, i) => (
          <div key={i} className="cover__leaf" style={{ left: `${l.left}%`, top: -30, color: '#6b7b4f', fontSize: l.size, '--sway': `${l.sway}px`, animation: `ambient-fall ${l.dur}s ease-in-out ${l.delay}s infinite` }}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d={LEAF} /></svg>
          </div>
        ))}
      </div>
      {burst && (
        <div className="cover__burst" style={{ zIndex: 100 }}>
          {PARTICLES.map((p, i) => (
            <div key={i} className="cover__particle" style={{ color: 'rgb(135, 161, 114)', fontSize: p.size, textShadow: 'rgb(135, 161, 114) 0px 0px 10px', '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--rot-start': `${p.rs}deg`, '--rot-end': `${p.re}deg`, animation: `1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${p.delay}s 1 normal forwards running particle-burst` }}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d={LEAF} /></svg>
            </div>
          ))}
        </div>
      )}
      <div className="cover__stage" style={{ zIndex: 10 }}>
        <div className={`cover__card${burst ? ' is-away' : ''}`}>
          {opening && <div className="cover__ring" />}
          <div className={`cover__seal${opening ? ' is-break' : ''}`}>
            <svg viewBox="0 0 24 24" style={{ fill: '#fff' }}><path d={HEART} /></svg>
          </div>
          <div className="cover__shadow">
            <div className="cover__bg">
              <img src={`${T}flower-background.webp`} alt="" aria-hidden="true" className={`cover__flower cover__flower--tl${opening ? ' is-fly' : ''}`} />
              <img src={`${T}flower-background.webp`} alt="" aria-hidden="true" className={`cover__flower cover__flower--br${opening ? ' is-fly' : ''}`} style={{ '--fly-scale-x': -1 }} />
            </div>
            <div className="cover__content">
              <h1 className="cover__names" style={{ color: '#6b7b4f', fontFamily: F.ebg }}>
                <span>{DATA.groomShort}</span>
                <span className="cover__amp" style={{ fontFamily: F.bask }}>&amp;</span>
                <span>{DATA.brideShort}</span>
              </h1>
              <div className="cover__divider">
                <div style={{ background: 'linear-gradient(to right, transparent, #6b7b4f)' }} />
                <span style={{ color: '#6b7b4f', opacity: 0.7 }}>❦</span>
                <div style={{ background: 'linear-gradient(to left, transparent, #6b7b4f)' }} />
              </div>
              <div className="cover__date" style={{ color: 'rgba(107, 123, 79, 0.7)', fontFamily: F.lora }}><D>{DATA.dateLabel}</D></div>
              <div className="cover__invite-wrap">
                <p className="cover__invite" style={{ color: 'rgba(107, 123, 79, 0.7)', fontFamily: F.lora }}><D>Thân Mời</D></p>
              </div>
              <a href="#open" role="button" className="cover__btn" onClick={(e) => { e.preventDefault(); if (!opening) onOpen(); }}
                style={{ backgroundColor: '#6b7b4f', color: '#fff', boxShadow: '0 4px 14px rgba(107, 123, 79, 0.35)', fontFamily: F.lora }}>
                <D>Mở thiệp</D>
                <div className="cover__shine" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Trang thiệp ================= */
function Paper({ size }) {
  return <div aria-hidden="true" className="paper" style={{ backgroundImage: `url("${T}paper.webp")`, backgroundSize: size || '100% auto' }} />;
}
function FlowerParallax({ y, left, top, width, height, rotate = 24.65 }) {
  return (
    <div aria-hidden="true" className="parallax" style={{ left, top, width, height, transform: `translateY(${y}px)` }}>
      <div style={{ transform: `rotate(${rotate}deg)` }}>
        <img alt="" className="flower-img flower-img--10" src={`${T}flower-background.webp`} style={{ width: 784, height: 845 }} />
      </div>
    </div>
  );
}

function Header({ y }) {
  return (
    <header className="hdr">
      <img alt="" aria-hidden="true" className="hdr__flower" src={`${T}flower-background.webp`} style={{ left: '-335.5px', top: '-52px', width: 784, height: 845, transform: `translateY(${y}px)` }} />
      <p className="hdr__kicker" style={{ fontFamily: F.corm, color: INK, letterSpacing: '0.14em', fontWeight: 600 }}>Save The Date</p>
      <img alt="" aria-hidden="true" className="flower-line hdr__line1" src={`${T}flower-line.webp`} />
      <div className="hdr__env">
        <img alt="" aria-hidden="true" className="hdr__env-back" src={`${T}envelope.webp`} />
        <div className="hdr__photo hdr__photo--g" style={{ animation: '4s ease-in-out 0s infinite normal none running mgFloatG' }}>
          <div className="hdr__frame"><img alt={DATA.groomShort} src={`${BASE}images/photos/groom.jpg`} /></div>
        </div>
        <div className="hdr__photo hdr__photo--b" style={{ animation: '4.6s ease-in-out 0s infinite normal none running mgFloatB' }}>
          <div className="hdr__frame"><img alt={DATA.brideShort} src={`${BASE}images/photos/bride.jpg`} /></div>
        </div>
        <img alt="" aria-hidden="true" className="hdr__env-cut" src={`${T}envelope-cut.webp`} />
      </div>
      <div className="hdr__names">
        <p style={{ fontFamily: F.times, color: INK }}>{DATA.groomShort}</p>
        <span aria-hidden="true" className="hdr__amp" style={{ fontFamily: F.naut, color: 'rgba(107, 123, 79, 0.15)' }}>&amp;</span>
        <p style={{ fontFamily: F.times, color: INK }}>{DATA.brideShort}</p>
      </div>
      <img alt="" aria-hidden="true" className="flower-line hdr__line2" src={`${T}flower-line.webp`} />
    </header>
  );
}

function Ceremony() {
  const c = DATA.ceremony;
  const W = '#fff', W7 = 'rgba(255, 255, 255, 0.7)';
  return (
    <section className="cer">
      <div className="cer__arch">
        <div aria-hidden="true" className="cer__fill" style={{ backgroundColor: SAGE }} />
        <div aria-hidden="true" className="paper cer__paper" style={{ backgroundImage: `url("${T}paper.webp")`, backgroundSize: '666.5px 1000px' }} />
        <div className="cer__body">
          <h2 className="h2 cer__title" style={{ color: W, fontFamily: F.times }}><span className="t20"><D>THÔNG TIN LỄ&nbsp;CƯỚI</D></span></h2>
          <div className="fam" style={{ color: W, fontFamily: F.bask }}>
            {DATA.families.map((f, i) => (
              <React.Fragment key={i}>
                {i === 1 && <div className="fam__rule" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }} />}
                <div className="fam__col">
                  <span className="t12" style={{ color: W7 }}><D>{f.title}</D></span>
                  <span className="t12 fam__name" style={{ color: W, fontSize: 14 }}><D>{f.father}</D></span>
                  <span className="t12 fam__name" style={{ color: W, fontSize: 14 }}><D>{f.mother}</D></span>
                  <div className="fam__addr" style={{ color: W7 }}><D>{f.address}</D></div>
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="cer__announce" style={{ whiteSpace: 'pre-line', fontFamily: F.bask, color: W }}><D>{'TRÂN TRỌNG KÍNH MỜI\nDỰ LỄ THÀNH HÔN CỦA CÁC CON'}</D></div>
          <div className="couple">
            <FitH3>{DATA.groom}</FitH3>
            <div className="couple__label" style={{ color: W7, fontFamily: F.bask, letterSpacing: '0.1em' }}><D>{''}</D></div>
            <div className="couple__amp" style={{ color: W, fontFamily: F.times }}>&amp;</div>
            <FitH3>{DATA.bride}</FitH3>
            <div className="couple__label" style={{ color: W7, fontFamily: F.bask, letterSpacing: '0.1em' }}><D>{''}</D></div>
          </div>
          <div className="when" style={{ fontFamily: F.bask }}>
            <div className="when__intro" style={{ color: W7 }}>
              <span dir="auto" className="when__place">{c.place}</span>
              <p className="when__at" style={{ color: W7 }}>VÀO LÚC</p>
            </div>
            <div className="when__time" style={{ color: W, fontFamily: F.bask }}>{c.time}</div>
            <div className="when__row" style={{ color: W }}>
              <span className="when__side" style={{ fontFamily: F.bask, textAlign: 'right' }}><D>{c.weekday}</D></span>
              <span className="when__bar" style={{ fontFamily: F.bask, color: 'rgba(255, 255, 255, 0.5)' }}>|</span>
              <span className="when__day" style={{ fontFamily: F.bask }}>{c.day}</span>
              <span className="when__bar" style={{ fontFamily: F.bask, color: 'rgba(255, 255, 255, 0.5)' }}>|</span>
              <span className="when__side" style={{ fontFamily: F.bask, textAlign: 'left' }}><D>{c.month}</D></span>
            </div>
            <div className="when__year" style={{ color: W, fontFamily: F.bask }}>{c.year}</div>
            <div className="lunar" style={{ color: W7, fontFamily: F.bask }}>{c.lunar}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Album() {
  const n = PHOTOS.length;
  const [i, setI] = useState(0);
  const [ratios, setRatios] = useState(() => PHOTOS.map(() => 2 / 3));
  const [box, setBox] = useState(null);
  // Tự chuyển ảnh: bắt đầu khi album lần đầu vào màn hình, ~1.4s/ảnh, dừng hẳn khi người xem tự chuyển ảnh
  const [auto, setAuto] = useState(true);
  const [seen, setSeen] = useState(false);
  const stageRef = useRef(null);
  const go = (d) => { setAuto(false); setI((x) => (x + d + n) % n); };
  const goTo = (k) => { setAuto(false); setI(k); };
  useEffect(() => {
    const el = stageRef.current; if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el); return () => io.disconnect();
  }, [seen]);
  useEffect(() => {
    if (!auto || !seen || box !== null) return;
    const id = setInterval(() => setI((x) => (x + 1) % n), 1400);
    return () => clearInterval(id);
  }, [auto, seen, box, n]);
  useEffect(() => {
    PHOTOS.forEach((src, k) => { const im = new Image(); im.onload = () => setRatios((r) => { const c = [...r]; c[k] = im.naturalWidth / im.naturalHeight; return c; }); im.src = src; });
  }, []);
  useEffect(() => {
    if (box === null) return;
    const onKey = (e) => { if (e.key === 'Escape') setBox(null); if (e.key === 'ArrowRight') setBox((b) => (b + 1) % n); if (e.key === 'ArrowLeft') setBox((b) => (b - 1 + n) % n); };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [box, n]);
  const start = useRef(null);
  const off = (k) => { let o = k - i; if (o > n / 2) o -= n; if (o < -n / 2) o += n; return o; };
  return (
    <div className="alb">
      <h2 className="h2" style={{ color: INK, fontFamily: F.times, fontSize: 20 }}><D>Album Ảnh</D></h2>
      <div className="alb__wrap">
        <div className="alb__stage" ref={stageRef} onPointerDown={(e) => { start.current = e.clientX; }}
          onPointerUp={(e) => { if (start.current == null) return; const dx = e.clientX - start.current; start.current = null; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); }}>
          <button type="button" aria-label="Previous photo" className="alb__nav alb__nav--l" onClick={() => go(-1)}>
            <svg className="ico4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>
          <button type="button" aria-label="Next photo" className="alb__nav alb__nav--r" onClick={() => go(1)}>
            <svg className="ico4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </button>
          <div className="alb__track" style={{ perspective: '1000px' }}>
            {PHOTOS.map((src, k) => {
              const o = off(k), a = Math.abs(o), s = Math.sign(o);
              return (
                <div key={src} className={`alb__item${a === 0 ? ' alb__item--on' : ''}`}
                  style={{ aspectRatio: `${ratios[k].toFixed(6)} / 1`, transitionDuration: '1100ms', transform: `translateX(${o * 60}%) translateZ(${-150 * a}px) rotateY(${s * a * 45}deg) scale(${a === 0 ? 1 : a === 1 ? 0.85 : 0.7})`, opacity: a === 0 ? 1 : a === 1 ? 0.75 : a === 2 ? 0.5 : 0.3, zIndex: 100 - a }}
                  onClick={() => (a === 0 ? setBox(k) : goTo(k))}>
                  <img alt={`Wedding photo ${k + 1}`} src={src} draggable="false" style={{ objectPosition: '50% 50%' }} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="alb__dots">
          {PHOTOS.map((_, k) => (
            <button key={k} type="button" aria-label={`Go to photo ${k + 1}`} className={`alb__dot${k === i ? ' is-on' : ''}`} onClick={() => goTo(k)} />
          ))}
        </div>
      </div>
      {box !== null && (
        <div className="lb" onClick={() => setBox(null)}>
          <button type="button" aria-label="Close lightbox" className="lb__close" onClick={() => setBox(null)}>✕</button>
          <div className="lb__count">{box + 1} / {n}</div>
          <button type="button" aria-label="Previous image" className="lb__nav lb__nav--l" onClick={(e) => { e.stopPropagation(); setBox((box - 1 + n) % n); }}>‹</button>
          <img className="lb__img" alt={`Wedding photo ${box + 1}`} src={PHOTOS[box]} onClick={(e) => e.stopPropagation()} />
          <button type="button" aria-label="Next image" className="lb__nav lb__nav--r" onClick={(e) => { e.stopPropagation(); setBox((box + 1) % n); }}>›</button>
          <div className="lb__thumbs" onClick={(e) => e.stopPropagation()}>
            {PHOTOS.map((src, k) => (
              <button type="button" key={src} aria-label={`View image ${k + 1}`} className={k === box ? 'on' : ''} onClick={() => setBox(k)}><img alt="" src={src} /></button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Countdown() {
  const calc = () => { const ms = new Date(DATA.party.start) - Date.now(); if (ms <= 0) return null; return [Math.floor(ms / 864e5), Math.floor(ms / 36e5) % 24, Math.floor(ms / 6e4) % 60, Math.floor(ms / 1e3) % 60]; };
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, []);
  return <p>{t ? `${t[0]} ngày ${t[1]} giờ ${t[2]} phút ${t[3]} giây` : 'Hôm nay là ngày vui!'}</p>;
}
function Calendar() {
  const first = (new Date(2026, 11, 1).getDay() + 6) % 7;
  const cells = [...Array(first).fill(null), ...Array.from({ length: 31 }, (_, i) => i + 1)];
  return (
    <div className="calwrap" style={{ backgroundColor: SAGE }}>
      <div className="cal" style={{ color: '#fff' }}>
        <div className="cal__title" style={{ borderColor: 'color-mix(in srgb, rgb(255, 255, 255) 27%, transparent 73%)', fontFamily: F.naut, color: '#fff', fontSize: 22 }}>Tháng 12 / 2026</div>
        <div className="cal__head" style={{ borderColor: '#fff' }}>{['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => <div key={d}>{d}</div>)}</div>
        <div className="cal__grid">
          {cells.map((d, k) => (
            <div key={k} className="cal__cell">
              {d && (d === Number(DATA.party.day) ? (
                <div className="cal__mark">
                  <svg viewBox="0 0 24 22" fill="#ffffff"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" transform="translate(0 -1)" /></svg>
                  <span style={{ color: 'rgb(51, 51, 51)' }}>{d}</span>
                </div>
              ) : <span className="cal__num">{d}</span>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Party({ y, onRsvp }) {
  const p = DATA.party;
  return (
    <section className="par">
      <div className="par__box" style={{ borderColor: INK }}>
        <div aria-hidden="true" className="par__fill" style={{ backgroundColor: '#fff' }} />
        <div aria-hidden="true" className="paper par__paper" style={{ backgroundImage: `url("${T}paper.webp")`, backgroundSize: '666.5px 1000px' }} />
        <FlowerParallax y={y} left="-351.49px" top="-239.99px" width="1064.98px" height="1094.98px" />
        <div className="par__body">
          <h2 className="h2" style={{ color: INK, fontFamily: F.times }}><span className="t20"><D>THÔNG TIN TIỆC&nbsp;CƯỚI</D></span></h2>
          <div className="par__info" style={{ fontFamily: F.bask, color: INK }}>
            <h3 className="par__lead" style={{ color: INK, fontFamily: F.bask, textTransform: 'uppercase' }}><D>Tiệc cưới sẽ diễn ra vào&nbsp;lúc:</D></h3>
            <div className="when__time when__time--d" style={{ color: SAGE, fontFamily: F.bask }}>{p.time}</div>
            <div className="when__row" style={{ color: INK, fontFamily: F.times }}>
              <span className="when__side" style={{ color: INK, fontFamily: F.times, textAlign: 'right', textTransform: 'uppercase' }}><D>{p.weekday}</D></span>
              <div className="par__rule" style={{ backgroundColor: INK }} />
              <span className="when__day" style={{ color: INK, fontFamily: F.bask }}>{p.day}</span>
              <div className="par__rule" style={{ backgroundColor: INK }} />
              <span className="when__side" style={{ color: INK, fontFamily: F.times, textAlign: 'left', textTransform: 'uppercase' }}><D>{p.month}</D></span>
            </div>
            <div className="when__year" style={{ color: INK, fontFamily: F.times }}>{p.year}</div>
            <div className="lunar" style={{ color: SAGE, fontFamily: F.bask }}>{p.lunar}</div>
            <div className="par__count">
              <h2 style={{ color: SAGE, fontFamily: F.bask }}><D>Cùng đếm&nbsp;ngược</D></h2>
              <div className="par__countval" style={{ color: SAGE, fontFamily: F.bask }}><Countdown /></div>
            </div>
            <Calendar />
            <a href={calendarUrl()} target="_blank" rel="noopener noreferrer" className="par__cal-link" style={{ color: INK, fontFamily: F.times, background: 'none' }}><D>Thêm vào lịch</D></a>
          </div>
          <div className="par__rsvp">
            <button type="button" className="par__rsvp-btn" onClick={onRsvp} style={{ backgroundColor: INK, color: '#fff', fontFamily: F.bask }}>
              <span><D>XÁC NHẬN THAM DỰ</D></span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Venue({ y }) {
  return (
    <div className="ven">
      <div aria-hidden="true" className="ven__flower" style={{ width: '1064.98px', height: '1094.98px', transform: `translate(-50%, ${y}px)` }}>
        <div style={{ transform: 'scaleY(-1) rotate(180deg)' }}>
          <div className="ven__flower-inner" style={{ width: '1064.98px', height: '1094.98px' }}>
            <div style={{ transform: 'rotate(24.65deg)' }}>
              <img alt="" className="flower-img flower-img--10" src={`${T}flower-background.webp`} style={{ width: 784, height: 845 }} />
            </div>
          </div>
        </div>
      </div>
      <section className="ven__body">
        <div className="ven__head">
          <h3 className="ven__title" style={{ color: INK, fontFamily: F.times, fontWeight: 700, letterSpacing: '0.04em' }}><D>Tiệc cưới sẽ tổ chức&nbsp;tại</D></h3>
          <div className="ven__addr" style={{ backgroundColor: 'transparent', color: DARK, fontFamily: F.bask }}><D>{DATA.venue}</D></div>
        </div>
        <div className="ven__map-wrap">
          <iframe title={`Bản đồ ${DATA.venue}`} className="ven__map" src={mapEmbed} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" style={{ borderColor: INK }} />
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="ven__dir" style={{ backgroundColor: 'transparent', color: DARK, fontFamily: F.bask }}>
            <svg className="ico4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
            <span>Chỉ đường</span>
          </a>
        </div>
      </section>
    </div>
  );
}

function Guestbook() {
  const [list, setList] = useState(() => load('wishes', []));
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [suggest, setSuggest] = useState(null);
  const fmt = (t) => { const d = new Date(t); const p = (x) => String(x).padStart(2, '0'); return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())} ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`; };
  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !msg.trim()) return;
    const next = [{ name: name.trim(), msg: msg.trim(), at: Date.now() }, ...list];
    setList(next); save('wishes', next); setName(''); setMsg('');
  };
  const inp = { borderColor: INK, color: INK, backgroundColor: 'transparent' };
  return (
    <div className="gb">
      <img alt="" aria-hidden="true" className="gb__bg" src={`${T}guestbook-background.webp`} />
      <section className="gb__body" style={{ color: INK, fontFamily: F.times }}>
        <div className="gb__head">
          <h2 className="h2 gb__title" style={{ color: INK, fontFamily: F.times, fontSize: 20 }}><D>Sổ lưu bút</D></h2>
        </div>
        <form className="gb__form" onSubmit={submit}>
          <div className="gb__card" style={{ background: 'transparent' }}>
            <div className="gb__row"><input placeholder="Nhập tên*" className="gb__input" maxLength={500} required type="text" value={name} onChange={(e) => setName(e.target.value)} style={inp} /></div>
            <textarea placeholder="Nhập lời chúc*" className="gb__input gb__ta" rows={4} maxLength={10000} required value={msg} onChange={(e) => setMsg(e.target.value)} style={{ ...inp, resize: 'none' }} />
            <div className="gb__actions">
              <div className="gb__tools">
                <button type="button" className="gb__magic" title="Gợi ý lời chúc" onClick={() => setSuggest(pickWishes())} style={{ backgroundColor: 'rgba(107, 123, 79, 0.1)', color: INK }}>🪄</button>
              </div>
              <button type="submit" className="gb__send" style={{ backgroundColor: INK }}><D>GỬI LỜI CHÚC</D></button>
            </div>
          </div>
        </form>
        <div className="gb__list">
          {list.length ? list.map((w) => (
            <div key={w.at} className="gb__item" style={{ borderColor: 'rgba(107, 123, 79, 0.4)', backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
              <div className="gb__item-head"><span className="gb__item-name" style={{ color: INK }}>{w.name}</span><span className="gb__item-time">{fmt(w.at)}</span></div>
              <p className="gb__item-msg">{w.msg}</p>
            </div>
          )) : <p className="gb__empty">Chưa có lời chúc nào. Hãy là người đầu tiên!</p>}
        </div>
      </section>
      {suggest && <WishModal wishes={suggest} onPick={(w) => { setMsg(w); setSuggest(null); }} onClose={() => setSuggest(null)} />}
    </div>
  );
}

function WishModal({ wishes, onPick, onClose }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.showModal(); }, []);
  return (
    <dialog ref={ref} className="wm" onClose={onClose} onClick={(e) => { if (e.target === ref.current) ref.current.close(); }}>
      <div className="wm__box">
        <div className="wm__head">
          <h3 className="wm__title">✨ Lời chúc gợi ý cho bạn</h3>
          <button type="button" className="wm__x" aria-label="Đóng" onClick={() => ref.current.close()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <p className="wm__sub">Chọn một lời chúc bạn thích</p>
        <div className="wm__list">
          {wishes.map((w) => (
            <button type="button" key={w} className="wm__item" onClick={() => onPick(w)}><p>{w}</p></button>
          ))}
        </div>
        <div className="wm__foot">
          <button type="button" className="wm__close" onClick={() => ref.current.close()}>Đóng</button>
        </div>
      </div>
    </dialog>
  );
}

function Rsvp({ onClose }) {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const [attend, setAttend] = useState('');
  const ref = useRef(null);
  useEffect(() => { ref.current?.showModal(); }, []);
  const ok = name.trim() && attend;
  const submit = (e) => { e.preventDefault(); if (!ok) return; save('rsvp', [...load('rsvp', []), { name: name.trim(), attend, at: Date.now() }]); setSent(true); };
  const close = () => ref.current?.close();
  const Opt = ({ value, label, icon }) => (
    <label className={`rsvp__opt${attend === value ? ' is-on' : ''}`}>
      <input type="radio" name="attend" value={value} checked={attend === value} onChange={() => setAttend(value)} />
      <div className="rsvp__opt-ico">{icon}</div>
      <span>{label}</span>
    </label>
  );
  return (
    <dialog ref={ref} className="rsvp" onClose={onClose} onClick={(e) => { if (e.target === ref.current) close(); }}>
      <div className="rsvp__box">
        <button type="button" className="rsvp__x" aria-label="Đóng" onClick={close}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
        {sent ? (
          <div className="rsvp__done">
            <div className="rsvp__done-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg></div>
            <span className="rsvp__title">Cảm ơn bạn!</span>
            <span className="rsvp__sub">{attend === 'yes' ? 'Gia đình rất mong được đón tiếp bạn trong ngày vui.' : 'Cảm ơn bạn đã báo cho gia đình biết.'}</span>
            <button type="button" className="rsvp__submit" onClick={close}><span>Đóng</span></button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <span className="rsvp__title">Xác nhận tham dự</span>
            <span className="rsvp__sub">Sự hiện diện của bạn là niềm vinh hạnh cho gia đình chúng tôi. Xin xác nhận để chúng tôi chuẩn bị chu đáo nhất.</span>
            <label className="rsvp__label"><span>Tên của bạn</span></label>
            <input className="rsvp__input" type="text" placeholder="Nhập tên của bạn" value={name} onChange={(e) => setName(e.target.value)} required />
            <label className="rsvp__label rsvp__label--2"><span>Bạn sẽ đến chứ?</span></label>
            <div className="rsvp__opts">
              <Opt value="yes" label="Tôi sẽ đến" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>} />
              <Opt value="no" label="Rất tiếc, tôi không thể đến" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>} />
            </div>
            <button type="submit" className="rsvp__submit" disabled={!ok}><span>Gửi xác nhận</span></button>
          </form>
        )}
      </div>
    </dialog>
  );
}

function Music({ playing, onToggle }) {
  return (
    <div className="music">
      <button aria-label={playing ? 'Tạm dừng nhạc' : 'Phát nhạc'} className="music__btn" onClick={onToggle}>
        <div className={`music__disc${playing ? ' is-on' : ''}`} style={{ background: 'linear-gradient(to right bottom, rgba(107, 123, 79, 0.8), rgb(107, 123, 79), rgba(107, 123, 79, 0.867))' }}>
          <div className="music__ring" />
          <div className="music__gloss" />
        </div>
        <div className="music__eq-wrap">
          {playing ? (
            <div className="music__eq is-on">
              {[60, 100, 40, 80].map((h, k) => <div key={k} className={`music__bar music__bar--${k + 1}`} style={{ height: `${h}%` }} />)}
            </div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="music__note"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg>
          )}
        </div>
      </button>
    </div>
  );
}

function App() {
  const [phase, setPhase] = useState('closed'); // closed → opening → leaving → open
  const [playing, setPlaying] = useState(false);
  const [rsvp, setRsvp] = useState(false);
  const audio = useRef(null);
  const y = useParallax();
  useAutoScroll(phase === 'open');
  const openCard = () => {
    window.scrollTo(0, 0);
    setPhase('opening');
    audio.current?.play().then(() => setPlaying(true)).catch(() => {});
    setTimeout(() => setPhase('leaving'), 1350);
    setTimeout(() => setPhase('open'), 1650);
  };
  const toggle = () => { const a = audio.current; if (!a) return; if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {}); else { a.pause(); setPlaying(false); } };
  return (
    <>
      <audio ref={audio} style={{ display: 'none' }} loop preload="auto" src={DATA.music} onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} />
      {phase !== 'open' && <Cover onOpen={openCard} phase={phase} />}
      {phase !== 'closed' && (
        <div dir="ltr" lang="vi" className="inv">
          <div className="inv__bg">
            <main className="inv__main">
              <div className="inv__center">
                <div className="sheet" style={{ backgroundColor: 'rgb(255, 255, 255)', color: INK }}>
                  <style>{'@keyframes mgFloatG{0%,100%{transform:translate(-50%,0) rotate(9.59deg)}50%{transform:translate(-50%,-8px) rotate(9.59deg)}}@keyframes mgFloatB{0%,100%{transform:translate(-50%,0) rotate(-12.55deg)}50%{transform:translate(-50%,-8px) rotate(-12.55deg)}}'}</style>
                  <Paper />
                  <Header y={y} />
                  <Ceremony />
                  <Album />
                  <Party y={y} onRsvp={() => setRsvp(true)} />
                  <Venue y={y} />
                  <Guestbook />
                  <footer className="ftr">
                    <span className="ftr__text" style={{ color: INK, fontFamily: F.times }}><D>Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!</D></span>
                  </footer>
                </div>
              </div>
            </main>
          </div>
          <Music playing={playing} onToggle={toggle} />
          {rsvp && <Rsvp onClose={() => setRsvp(false)} />}
        </div>
      )}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
