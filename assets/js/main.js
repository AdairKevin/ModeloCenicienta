/* ===== CONFIGURACIÓN: edita aquí los datos del evento ===== */
const CONFIG = {
  titulo: "Mis XV años",
  inicio: "2027-05-01T18:00", // AAAA-MM-DDTHH:MM (también lo usa la cuenta regresiva)
  duracionHoras: 7,
  lugar: "Nombre del salón",
};

/* Cuenta regresiva */
const fechaEvento = new Date(CONFIG.inicio).getTime();
const ids = ["dias", "horas", "minutos", "segundos"];
const timer = setInterval(() => {
  const d = Math.max(0, fechaEvento - Date.now());
  const valores = [
    Math.floor(d / 86400000),
    Math.floor((d % 86400000) / 3600000),
    Math.floor((d % 3600000) / 60000),
    Math.floor((d % 60000) / 1000),
  ];
  ids.forEach((id, i) => (document.getElementById(id).innerText = valores[i]));
  if (d === 0) clearInterval(timer);
}, 1000);

/* Música */
const music = document.getElementById("music");
const playPauseBtn = document.getElementById("playPauseBtn");
const progressBar = document.getElementById("progressBar");
const musicFloat = document.getElementById("musicFloat");
const alternarMusica = () => (music.paused ? music.play() : music.pause());
music.volume = 0.5;
playPauseBtn.addEventListener("click", alternarMusica);
musicFloat.addEventListener("click", alternarMusica);
music.addEventListener("play", () => {
  playPauseBtn.textContent = "⏸";
  musicFloat.classList.add("sonando");
});
music.addEventListener("pause", () => {
  playPauseBtn.textContent = "▶";
  musicFloat.classList.remove("sonando");
});
music.addEventListener("timeupdate", () => {
  progressBar.style.width = (music.currentTime / music.duration) * 100 + "%";
});
new IntersectionObserver(([e]) => musicFloat.classList.toggle("visible", !e.isIntersecting)).observe(
  document.querySelector(".music-card")
);

/* Sobre */
document.getElementById("openEnvelope").addEventListener("click", () => {
  document.querySelector(".envelope").classList.add("open");
  for (let i = 0; i < 40; i++) setTimeout(crearChispa, i * 25);
  music.play().catch(() => {});
  setTimeout(() => {
    document.getElementById("envelopeScreen").classList.add("fade-out");
    document.getElementById("invitationContent").classList.remove("hidden");
  }, 1200);
});

/* Polvo de hada */
const polvo = document.getElementById("polvoHada");
function crearChispa() {
  const c = document.createElement("span");
  c.className = "chispa";
  c.textContent = Math.random() > 0.5 ? "✦" : "✧";
  c.style.left = Math.random() * 100 + "vw";
  c.style.fontSize = 8 + Math.random() * 12 + "px";
  c.style.setProperty("--dx", (Math.random() - 0.5) * 120 + "px");
  c.style.animationDuration = 5 + Math.random() * 5 + "s";
  polvo.appendChild(c);
  c.addEventListener("animationend", () => c.remove());
}
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) setInterval(crearChispa, 700);

/* Animación al bajar */
const revelar = new IntersectionObserver(
  (entradas) =>
    entradas.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        revelar.unobserve(e.target);
      }
    }),
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => revelar.observe(el));

/* Calendario */
const inicio = new Date(CONFIG.inicio);
const fin = new Date(inicio.getTime() + CONFIG.duracionHoras * 3600000);
const calendario = document.getElementById("calendario");
if (calendario) {
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const primerDia = new Date(inicio.getFullYear(), inicio.getMonth(), 1).getDay();
  const diasMes = new Date(inicio.getFullYear(), inicio.getMonth() + 1, 0).getDate();
  let celdas = ["D", "L", "M", "M", "J", "V", "S"].map((d) => `<span class="cal-dia-semana">${d}</span>`).join("");
  celdas += "<span></span>".repeat(primerDia);
  for (let d = 1; d <= diasMes; d++) {
    celdas += `<span${d === inicio.getDate() ? ' class="cal-evento"' : ""}>${d}</span>`;
  }
  calendario.innerHTML = `<div class="cal-mes">${meses[inicio.getMonth()]} ${inicio.getFullYear()}</div><div class="cal-grid">${celdas}</div>`;

  const fmt = (f) => f.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  document.getElementById("btnGoogleCal").href =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(CONFIG.titulo)}&dates=${fmt(inicio)}/${fmt(fin)}&location=${encodeURIComponent(CONFIG.lugar)}`;
  document.getElementById("btnIcs").addEventListener("click", () => {
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Mirai//Invitacion//ES", "BEGIN:VEVENT",
      `UID:${Date.now()}@mirai`, `DTSTAMP:${fmt(new Date())}`, `DTSTART:${fmt(inicio)}`, `DTEND:${fmt(fin)}`,
      `SUMMARY:${CONFIG.titulo}`, `LOCATION:${CONFIG.lugar}`,
      "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", `DESCRIPTION:${CONFIG.titulo}`, "END:VALARM",
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "evento.ics";
    a.click();
  });
}

/* Galería */
const sliderTrack = document.getElementById("sliderTrack");
if (sliderTrack) {
  const total = sliderTrack.children.length;
  const contenedor = sliderTrack.parentElement;
  let actual = 0;
  const ajustarAltura = () => {
    const alto = sliderTrack.children[actual].offsetHeight;
    if (alto) contenedor.style.height = alto + "px";
  };
  window.addEventListener("load", ajustarAltura);
  window.addEventListener("resize", ajustarAltura);
  setInterval(() => {
    actual = (actual + 1) % total;
    sliderTrack.style.transform = `translateX(-${actual * 100}%)`;
    ajustarAltura();
  }, 3500);
}

/* Confirmación por WhatsApp: pon el número en data-whatsapp (ej. 5215512345678) */
document.querySelectorAll(".rsvp-form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const datos = new FormData(form);
    let texto =
      `¡Hola! Confirmo mi asistencia a ${form.dataset.evento}.\n` +
      `Nombre: ${datos.get("nombre").trim()}\n` +
      `Número de asistentes: ${datos.get("personas")}`;
    const mensaje = (datos.get("mensaje") || "").trim();
    if (mensaje) texto += `\nMensaje: ${mensaje}`;
    window.open(`https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank");
  });
});
