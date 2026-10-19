const generateId = () => {
  const timestamp = Date.now();
  return timestamp;
};

// CRUD de notas

const createNote = (content, title) => {
  const trimmedContent = content.trim();
  if (trimmedContent === "") return "Error: Debe haber contenido";

  const noteId = generateId();
  const currentTime = Date.now();
  const noteTitle = title || "Sin título";
  const noteExcept =
    trimmedContent.length > 100
      ? trimmedContent.slice(0, 100) + "..."
      : trimmedContent;

  const noteInfo = `ID: ${noteId} | Título: ${noteTitle} | Contenido: ${trimmedContent} | Excerpt: ${noteExcept} | Creado: ${currentTime} | Actualizado: ${currentTime}`;
  return noteInfo;
};

const updateNote = (noteId, newContent) => {
  if (noteId === undefined || noteId === null || noteId === "")
    return "Error: Id inválido";
  const trimmedContent = newContent.trim();
  if (trimmedContent === "") return "Error: Debe haber contenido";

  const currentTime = Date.now();
  const noteTitle = title || "Sin título";
  const noteExcept =
    trimmedContent.length > 100
      ? trimmedContent.slice(0, 100) + "..."
      : trimmedContent;

  const updateNoteInfo = `ID: ${noteId} | Título: ${noteTitle} | Contenido: ${trimmedContent} | Excerpt: ${noteExcept} | Creado: ${currentTime} | Actualizado: ${currentTime}`;
  return updateNoteInfo;
};

const deleteNote = (noteId) => {
  if (noteId === undefined || noteId === null || noteId === "")
    return "Error: Id inválido";
  const message = `Nota con ID ${noteId} fue eliminada`;
  return message;
};

const listNotes = () => {
  const message = "Listando todas las notas disponibles";
  return message;
};
// Ejemplo 1: Crear una nota
console.log("=== CREAR NOTA ===");
const nota1 = createNote(
  "# Mi primera nota\nEste es el contenido de mi primera nota en Markdown.",
);
console.log(nota1);

// Ejemplo 2: Crear nota con título personalizado
console.log("\n=== CREAR NOTA CON TÍTULO ===");
const nota2 = createNote("Contenido de la segunda nota", "Nota Importante");
console.log(nota2);

// Ejemplo 3: Intentar crear nota vacía (validación)
console.log("\n=== VALIDACIÓN: NOTA VACÍA ===");
const notaVacia = createNote("");
console.log(notaVacia);

// //estructura de una nota
// // id - tipo UID
// // titulo - tipo String
// // contenido - tipo String
// // fecha - tipo Date
// // autor - tipo String, tal vez una enumeración
// // estado - tipo String, una enumeración
// // etiquetas- array de String

// const notasIni = [
//   {
//     id: 1,
//     titulo: "Mi primera nota",
//     contenido: "Esta es el contenido de mi primera nota",
//     fecha: new Date(),
//     autor: "Lore",
//     estado: "publicado",
//     etiquetas: ["personal", "trabajo"],
//   },
//   {
//     id: 2,
//     titulo: "Mi segunda nota",
//     contenido: `Esta es el contenido de mi segunda nota`,
//     fecha: new Date(),
//     autor: "Lore",
//     estado: "borrador",
//     etiquetas: ["trabajo"],
//   },
// ];

// const notaBase = {
//   id: new Date().getMilliseconds(),
//   titulo: "",
//   contenido: "",
//   fecha: new Date(),
//   autor: "Anónimo",
//   estado: "borrador",
//   etiquetas: [],
// };

// function crearLibreta(notasInicial = []) {
//   let notas = notasInicial;
//   return {
//     notas,
//     agregarNota(nota) {
//       console.log("en agregarNota");
//       notas.push({ ...notaBase, ...nota });
//     },
//     editarNota(nota) {
//       console.log("en editarNota");
//       notas.map((n) => (n.id === nota.id ? nota : n));
//     },
//     borrarNota(nota) {
//       console.log("en borrarNota");
//       notas = notas.filter((n) => n.id !== nota.id);
//     },
//     pintaNota(nota) {
//       console.log(nota);
//     },
//   };
// }

// const misNotas = crearLibreta(notasIni);
// console.log("Todas las notas");

// // notas.map((nota) => pintaNota(nota));
// for (let nota of misNotas.notas) {
//   misNotas.pintaNota(nota);
// }

// console.log(" las notas publicadas");
// // let filtered = notas.filter((nota) => nota.etiquetas.includes("personal"));
// // filtered.map((nota) => pintaNota(nota));
// for (let nota of misNotas.notas) {
//   if (nota.estado === "publicado") misNotas.pintaNota(nota);
// }

// misNotas.agregarNota({ id: 3, titulo: "hola" });

// console.log("Todas las notas");

// // notas.map((nota) => pintaNota(nota));
// for (let nota of misNotas.notas) {
//   misNotas.pintaNota(nota);
// }
