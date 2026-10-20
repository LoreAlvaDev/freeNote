// ============================================
// SISTEMA DE NOTAS MARKDOWN
// ============================================
const STORAGE_KEY = "lorenotes";

// --------------------------------------------
// UTILIDADES DE TEXTO
// --------------------------------------------

/**
 * Comprueba si un campo es vacío null o undefined
 * @param {string} value - el valor del campo a comprobar
 * @returns {boolean} si el campo no tiene contenido
 */
function testEmptyContent(value) {
  return value === null || value === undefined || value.trim() === "";
}

/**
 * Extrae el título de una nota desde su contenido
 * @param {string} content - Contenido de la nota
 * @returns {string} Título derivado del contenido
 */
function deriveTitle(content) {
  if (testEmptyContent(content)) {
    return "Sin título";
  }

  const cleanContent = content.trim();

  if (cleanContent === "") {
    return "Sin título";
  }

  let firstLine = "";

  for (let i = 0; i < cleanContent.length; i = i + 1) {
    const char = cleanContent[i];

    if (char === "\n") {
      break;
    }

    firstLine = firstLine + char;
  }

  if (firstLine.trim() === "") {
    return "Sin título";
  }

  if (firstLine.length > 50) {
    firstLine = firstLine.slice(0, 50) + "...";
  }

  return firstLine.trim();
}

/**
 * Extrae un resumen corto del contenido de la nota
 * @param {string} content - Contenido de la nota
 * @param {number} maxLen - Longitud máxima del resumen (opcional)
 * @returns {string} Resumen del contenido
 */
function deriveExcerpt(content, maxLen) {
  if (testEmptyContent(content)) {
    return "";
  }

  let maxLength = maxLen;
  if (maxLength === undefined || maxLength === null) {
    maxLength = 100;
  }

  const cleanContent = content.trim();

  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  const excerpt = cleanContent.slice(0, maxLength) + "...";

  return excerpt;
}

// --------------------------------------------
// GENERACIÓN DE ID ÚNICO
// --------------------------------------------

/**
 * Genera un ID único basado en la fecha actual
 * @returns {number} Timestamp en milisegundos desde 1970
 */
function generateId() {
  const timestamp = Date.now();
  return timestamp;
}

// --------------------------------------------
// FUNCIONES CRUD DE NOTAS
// --------------------------------------------

/**
 * Crea un objeto de nota con el contenido proporcionado
 * @param {string} content - Contenido de la nota
 * @param {string} title - Título de la nota (opcional)
 * @returns {Object|null} Objeto de nota o null si hay error
 */
function createNote(content, title, author = "Anónimo", tags = []) {
  const trimmedContent = content.trim();

  if (trimmedContent === "") {
    return null;
  }

  const noteId = generateId();

  const currentTime = Date.now();

  let noteTitle = title;
  if (testEmptyContent(title)) {
    noteTitle = deriveTitle(trimmedContent);
  }

  const noteExcerpt = deriveExcerpt(trimmedContent, 100);

  const note = {
    id: noteId,
    content: trimmedContent,
    title: noteTitle,
    excerpt: noteExcerpt,
    author: author,
    tags: tags,
    createdAt: currentTime,
    updatedAt: currentTime,
    favorite: false,
  };

  return note;
}

// --------------------------------------------
// STORE DE NOTAS (FASE 2)
// Usa closures para encapsular el estado
// --------------------------------------------

/**
 * Crea un store para manejar el estado de las notas
 * @returns {Object} Objeto con métodos para interactuar con las notas
 */
function createNotesStore() {
  const notes = [];

  function addNote(content, title, author, tags) {
    if (testEmptyContent(content)) {
      return { success: false, message: "El contenido no puede estar vacío" };
    }

    const newNote = createNote(content, title, author, tags);

    if (newNote === null) {
      return { success: false, message: "Error al crear la nota" };
    }

    notes.push(newNote);

    return { success: true, note: newNote };
  }

  function getAllNotes() {
    const notesCopy = notes.map(function (note) {
      return { ...note };
    });

    return notesCopy;
  }

  function getNoteById(noteId) {
    const foundNote = notes.find(function (note) {
      return note.id === noteId;
    });

    if (foundNote === undefined) {
      return null;
    }

    return { ...foundNote };
  }

  function updateNote(noteId, updates) {
    if (testEmptyContent(noteId)) {
      return { success: false, message: "ID inválido" };
    }

    const noteToUpdate = notes.find(function (note) {
      return note.id === noteId;
    });

    if (noteToUpdate === undefined) {
      return { success: false, message: "Nota no encontrada" };
    }

    if (updates.content !== undefined) {
      const trimmedContent = updates.content.trim();

      if (trimmedContent === "") {
        return { success: false, message: "El contenido no puede estar vacío" };
      }

      noteToUpdate.content = updates.content;
      noteToUpdate.title = deriveTitle(updates.content);
      noteToUpdate.excerpt = deriveExcerpt(updates.content, 100);
      noteToUpdate.author = updates.author;
      noteToUpdate.tags = updates.tags;
    }

    if (updates.title !== undefined && updates.title !== "") {
      noteToUpdate.title = updates.title;
    }

    if (updates.favorite !== undefined) {
      noteToUpdate.favorite = updates.favorite;
    }

    noteToUpdate.updatedAt = Date.now();

    return { success: true, note: { ...noteToUpdate } };
  }

  function deleteNote(noteId) {
    if (testEmptyContent(noteId)) {
      return { success: false, message: "ID inválido" };
    }

    const initialLength = notes.length;

    notes = notes.filter(function (note) {
      return note.id !== noteId;
    });

    if (notes.length === initialLength) {
      return { success: false, message: "Nota no encontrada" };
    }

    return { success: true, message: "Nota eliminada correctamente" };
  }

  function searchNotes(query) {
    if (testEmptyContent(query)) {
      return [];
    }

    const normalizedQuery = query.toLowerCase().trim();

    const results = notes.filter(function (note) {
      const normalizedTitle = note.title.toLowerCase();
      const normalizedContent = note.content.toLowerCase();

      const matchesTitle = normalizedTitle.includes(normalizedQuery);
      const matchesContent = normalizedContent.includes(normalizedQuery);

      return matchesTitle || matchesContent;
    });

    return results.map(function (note) {
      return { ...note };
    });
  }

  function getNotesOrderedByDate() {
    const notesCopy = notes.map(function (note) {
      return { ...note };
    });

    notesCopy.sort(function (a, b) {
      return b.updatedAt - a.updatedAt;
    });

    return notesCopy;
  }

  function getFavoriteNotes() {
    const favorites = notes.filter(function (note) {
      return note.favorite === true;
    });

    return favorites.map(function (note) {
      return { ...note };
    });
  }

  function getNotesCount() {
    return notes.length;
  }

  return {
    addNote: addNote,
    getAllNotes: getAllNotes,
    getNoteById: getNoteById,
    updateNote: updateNote,
    deleteNote: deleteNote,
    searchNotes: searchNotes,
    getNotesOrderedByDate: getNotesOrderedByDate,
    getFavoriteNotes: getFavoriteNotes,
    getNotesCount: getNotesCount,
  };
}

/**
 * Guarda las notas en LocalStorage
 * @param {Array} notes -Array de notas a guardar
 */
function saveToStorage(notes) {
  if (!notes) {
    console.error("No se pudieron guardar las notas.");
  }
  const notesJson = JSON.stringify(notes);
  localStorage.setItem(STORAGE_KEY, notesJson);
}

/**
 * Carga las notas desde LocalStorage
 * @returns{Array} array de notas o vacío si no hay datos
 */
function loadFromStorage() {
  const notesJson = localStorage.getItem(STORAGE_KEY);
  if (!notesJson) return [];
  let notes = [];
  const parsedNotes = JSON.parse(notesJson);
  if (Array.isArray(parsedNotes)) {
    notes = parsedNotes;
  }
  return notes;
}

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
