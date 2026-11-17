const VIDEO = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const GENEROS = { accion: ["Acción", "#b71c1c"], comedia: ["Comedia", "#e69500"],
  drama: ["Drama", "#1565c0"], terror: ["Terror", "#6a1b9a"], scifi: ["Ciencia ficción", "#00838f"] };
const catalogo = [
  "Operación Relámpago|Película|accion|2024|Un agente frena un atentado.",
  "Ruta Mortal|Serie|accion|2023|Una piloto en carreras ilegales.",
  "Vecinos Ruidosos|Película|comedia|2022|Dos familias, una sola casa.",
  "Oficina Absurda|Serie|comedia|2024|Un trabajo cada vez más absurdo.",
  "Cartas al Mar|Película|drama|2021|Las cartas que nunca llegaron.",
  "Raíces|Serie|drama|2023|Tres generaciones defienden su finca.",
  "La Casa del Lago|Película|terror|2023|Voces en una cabaña vacía.",
  "Noche Eterna|Serie|terror|2024|En un pueblo el sol no vuelve a salir.",
  "Órbita Cero|Película|scifi|2025|Una nave pierde la señal.",
  "Código Nexus|Serie|scifi|2024|Una IA descubre que piensa."
].map((fila, i) => {
  const [titulo, tipo, genero, anio, desc] = fila.split("|");
  return { id: i + 1, titulo, tipo, genero, anio, desc };
});
const $ = (id) => document.getElementById(id);
const estado = { vista: "all", genero: "all", texto: "" };
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
let actual = null;
const esFavorito = (id) => favoritos.includes(id);
function alternarFavorito(id) {
  favoritos = esFavorito(id) ? favoritos.filter((f) => f !== id) : [...favoritos, id];
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  render();
}
function poster(p) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450"><rect width="300" height="450" fill="${GENEROS[p.genero][1]}"/><text x="150" y="270" font-size="160" fill="#fff" text-anchor="middle">${p.titulo[0]}</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}
function filtrar() {
  const t = estado.texto.toLowerCase().trim();
  return catalogo.filter((p) =>
    (estado.vista === "all" || (estado.vista === "fav" ? esFavorito(p.id) : p.tipo === estado.vista)) &&
    (estado.genero === "all" || p.genero === estado.genero) &&
    (p.titulo + " " + p.desc).toLowerCase().includes(t));
}
function render() {
  const lista = filtrar();
  $("grid").innerHTML = "";
  lista.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `<button class="heart ${esFavorito(p.id) ? "on" : ""}">♥</button>
      <img src="${poster(p)}" alt="${p.titulo}">
      <div><h4>${p.titulo}</h4><p>${p.desc}</p></div>`;
    card.querySelector(".heart").addEventListener("click", (e) => {
      e.stopPropagation();
      alternarFavorito(p.id);
    });
    card.addEventListener("click", () => abrir(p));
    $("grid").appendChild(card);
  });
  $("empty").hidden = lista.length > 0;
  if (actual) $("m-fav").textContent = esFavorito(actual.id) ? "Quitar de favoritos" : "Agregar a favoritos";
}
function abrir(p) {
  actual = p;
  $("m-title").textContent = p.titulo;
  $("m-meta").textContent = [p.tipo, GENEROS[p.genero][0], p.anio].join(" · ");
  $("m-desc").textContent = p.desc;
  $("player").poster = poster(p);
  $("player").src = VIDEO;
  $("modal").classList.add("open");
  render();
}
function cerrar() {
  $("player").pause();
  $("modal").classList.remove("open");
  actual = null;
}
function enlazar(selector, clave, atributo) {
  document.querySelectorAll(selector).forEach((b) => b.addEventListener("click", () => {
    document.querySelectorAll(selector).forEach((x) => x.classList.toggle("active", x === b));
    estado[clave] = b.dataset[atributo];
    render();
  }));
}
enlazar(".nav-btn", "vista", "view");
enlazar(".cat", "genero", "genre");
$("search").addEventListener("input", (e) => { estado.texto = e.target.value; render(); });
$("m-fav").addEventListener("click", () => alternarFavorito(actual.id));
$("close").addEventListener("click", cerrar);
render();
