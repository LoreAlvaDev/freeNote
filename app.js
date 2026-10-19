const generateId = () => {
  const timestamp = Date.now();
  return timestamp;
};

//estructura de una nota
// id - tipo UID
// titulo - tipo String
// contenido - tipo String
// fecha - tipo Date
// autor - tipo String, tal vez una enumeración
// estado - tipo String, una enumeración
// etiquetas- array de String

const notasIni = [
  {
    id: 1,
    titulo: "Mi primera nota",
    contenido: "Esta es el contenido de mi primera nota",
    fecha: new Date(),
    autor: "Lore",
    estado: "publicado",
    etiquetas: ["personal", "trabajo"],
  },
  {
    id: 2,
    titulo: "Mi segunda nota",
    contenido: `Esta es el contenido de mi segunda nota`,
    fecha: new Date(),
    autor: "Lore",
    estado: "borrador",
    etiquetas: ["trabajo"],
  },
];

const notaBase = {
  id: new Date().getMilliseconds(),
  titulo: "",
  contenido: "",
  fecha: new Date(),
  autor: "Anónimo",
  estado: "borrador",
  etiquetas: [],
};

function crearLibreta(notasInicial = []) {
  let notas = notasInicial;
  return {
    notas,
    agregarNota(nota) {
      console.log("en agregarNota");
      notas.push({ ...notaBase, ...nota });
    },
    editarNota(nota) {
      console.log("en editarNota");
      notas.map((n) => (n.id === nota.id ? nota : n));
    },
    borrarNota(nota) {
      console.log("en borrarNota");
      notas = notas.filter((n) => n.id !== nota.id);
    },
    pintaNota(nota) {
      console.log(nota);
    },
  };
}

const misNotas = crearLibreta(notasIni);
console.log("Todas las notas");

// notas.map((nota) => pintaNota(nota));
for (let nota of misNotas.notas) {
  misNotas.pintaNota(nota);
}

console.log(" las notas publicadas");
// let filtered = notas.filter((nota) => nota.etiquetas.includes("personal"));
// filtered.map((nota) => pintaNota(nota));
for (let nota of misNotas.notas) {
  if (nota.estado === "publicado") misNotas.pintaNota(nota);
}

misNotas.agregarNota({ id: 3, titulo: "hola" });

console.log("Todas las notas");

// notas.map((nota) => pintaNota(nota));
for (let nota of misNotas.notas) {
  misNotas.pintaNota(nota);
}
