// ============================================
// SISTEMA DE NOTAS MARKDOWN
// ============================================
const STORAGE_KEY = "lorenotes";
let currentNoteId = null;

// --------------------------------------------
// UTILIDADES DE TEXTO
// --------------------------------------------

/**
 * Comprueba si un campo es vacío null o undefined
 * @param {string} value - el valor del campo a comprobar
 * @returns {boolean} si el campo no tiene contenido
 */
function testEmptyContent(value) {
  return value === null || value === undefined || value?.trim() === "";
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

// --------------------------------------------
// STORE DE NOTAS (FASE 2)
// Usa closures para encapsular el estado
// --------------------------------------------

/**
 * Crea un store que persiste automáticamente en localStorage
 * @returns {Object} Store con métodos para gestionar notas
 */
function createNotesStore() {
  const notes = loadFromStorage();

  function addNote(content, title, author, tags) {
    if (testEmptyContent(content)) {
      return { success: false, message: "El contenido no puede estar vacío" };
    }

    const newNote = createNote(content, title, author, tags);

    if (newNote === null) {
      return { success: false, message: "Error al crear la nota" };
    }

    notes.push(newNote);
    saveToStorage(notes);

    return { success: true, note: newNote };
  }

  /**
   * Obtiene todas las notas
   * @returns {Array} Copia del array de notas
   */
  function getAllNotes() {
    const notesCopy = notes.map(function (note) {
      return { ...note };
    });

    return notesCopy;
  }

  /**
   * Obtiene una nota por su ID
   * @param {number} noteId - ID de la nota a buscar
   * @returns {Object|null} Nota encontrada o null si no existe
   */
  function getNoteById(noteId) {
    const foundNote = notes.find(function (note) {
      return note.id === noteId;
    });

    if (foundNote === undefined) {
      return null;
    }

    return { ...foundNote };
  }

  /**
   * Actualiza una nota existente
   * @param {number} noteId - ID de la nota a actualizar
   * @param {Object} updates - Campos a actualizar
   * @param {string} [updates.content] - Nuevo contenido
   * @param {string} [updates.title] - Nuevo título
   * @param {boolean} [updates.favorite] - Estado de favorito
   * @param {string} [updates.author] - Autor
   * @param {Array} [updates.tags] - Etiquetas de la nota
   * @returns {Object} Resultado de la operación
   */
  function updateNote(noteId, updates) {
    if (!noteId) {
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
    saveToStorage(notes);

    return { success: true, note: { ...noteToUpdate } };
  }

  /**
   * Elimina una nota por su ID
   * @param {number} noteId - ID de la nota a eliminar
   * @returns {Object} Resultado de la operación
   */
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
    saveToStorage(notes);

    return { success: true, message: "Nota eliminada correctamente" };
  }

  /**
   * Busca notas por texto en título o contenido
   * @param {string} query - Texto a buscar
   * @returns {Array} Notas que coinciden con la búsqueda
   */
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
      const matchesTags = note.tags.some(function (tag) {
        return tag.toLowerCase().includes(normalizedQuery);
      });

      return matchesTitle || matchesContent;
    });

    return results.map(function (note) {
      return { ...note };
    });
  }

  /**
   * Obtiene las notas ordenadas por fecha de actualización
   * @returns {Array} Notas ordenadas de más reciente a más antigua
   */
  function getNotesOrderedByDate() {
    const notesCopy = notes.map(function (note) {
      return { ...note };
    });

    notesCopy.sort(function (a, b) {
      return b.updatedAt - a.updatedAt;
    });

    return notesCopy;
  }

  /**
   * Obtiene las notas marcadas como favoritas
   * @returns {Array} Notas favoritas
   */
  function getFavoriteNotes() {
    const favorites = notes.filter(function (note) {
      return note.favorite === true;
    });

    return favorites.map(function (note) {
      return { ...note };
    });
  }

  /**
   * Obtiene el número total de notas
   * @returns {number} Cantidad de notas
   */
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
 * Muestra el editor y el preview
 */
function showEditorAndPreview() {
  const editorSection = document.querySelector("#editor-section");
  const previewSection = document.querySelector("#preview-section");

  editorSection.style.display = "flex";
  previewSection.style.display = "flex";
}

/**
 * Oculta el editor y el preview
 */
function hideEditorAndPreview() {
  const editorSection = document.querySelector("#editor-section");
  const previewSection = document.querySelector("#preview-section");

  editorSection.style.display = "none";
  previewSection.style.display = "none";
}

/**
 * Renderiza la lista de notas en el dom
 * @param {Array} notes -Array de notas a renderizar
 */
function renderNoteList(notes) {
  const container = document.querySelector("#note-list");

  if (!container) {
    console.error("no encuentro el nodo note-list");
    return;
  }

  // Limpiar el contenedor
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  // Mostrar estado vacío si no hay notas
  if (!Array.isArray(notes) || notes.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.textContent = "No hay notas aún. Crea una nota para empezar.";
    container.appendChild(emptyState);
    return;
  }

  // Renderizar cada nota
  notes.forEach(function (note) {
    const item = document.createElement("div");
    item.className = "note-item";
    item.dataset.id = String(note.id);

    const titleEl = document.createElement("h3");
    titleEl.className = "note-title";
    titleEl.textContent = note.title || deriveTitle(note.content);

    const excerptEl = document.createElement("p");
    excerptEl.className = "note-excerpt";
    excerptEl.textContent = note.excerpt || deriveExcerpt(note.content, 100);

    const dateEl = document.createElement("time");
    dateEl.className = "note-date";
    const timestamp = note.updatedAt || note.createdAt || Date.now();
    dateEl.textContent = new Date(timestamp).toLocaleString();

    const authorEl = document.createElement("span");
    authorEl.className = "note-author";
    authorEl.textContent = note.author;

    const tagsEl = document.createElement("span");
    tagsEl.className = "note-tags";
    tagsEl.textContent = note.tags.join(", ");

    const masInfo = document.createElement("p");
    masInfo.appendChild(authorEl);
    masInfo.appendChild(tagsEl);

    item.appendChild(titleEl);
    item.appendChild(excerptEl);
    item.appendChild(dateEl);
    item.appendChild(masInfo);

    // Marcar nota activa comparando su id con currentNoteId
    if (String(note.id) === String(currentNoteId)) {
      item.classList.add("active");
      item.setAttribute("aria-current", "true");
    }

    container.appendChild(item);
  });
}

/**
 * Renderiza el editor con el contenido de una nota
 * @param {Object|null} note - Nota a renderizar o null para editor vacío
 */
function renderEditor(note) {
  const editorTextarea = document.querySelector("#editor-textarea");
  const author = document.querySelector("#author");
  const tags = document.querySelector("#tags");

  if (note !== null && note !== undefined) {
    showEditorAndPreview();
    editorTextarea.value = note.content;
    author.value = note.author;
    tags.value = note.tags.join(", ");
    currentNoteId = note.id;
  } else {
    showEditorAndPreview();
    editorTextarea.value = "";
    currentNoteId = null;
  }

  renderPreview(editorTextarea.value);
}

/**
 * Función para hacer render del Markdown
 * @param {String} content - El contenido de l anota
 */
function renderMarkdown(content) {
  if (typeof window.markdownit != "undefined") {
    const md = window.markdownit();
    return md.render(content);
  }
}

/**
 * Renderiza el preview del contenido Markdown
 * @param {string} content - Contenido Markdown a renderizar
 */
function renderPreview(content) {
  const previewContainer = document.querySelector("#preview-container");

  previewContainer.innerHTML = "";

  if (content === "" || content === null || content === undefined) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "El preview aparecerá aquí...";
    emptyMessage.className = "preview-empty";
    previewContainer.append(emptyMessage);
    return;
  }

  const html = renderMarkdown(content);
  previewContainer.innerHTML = html;
}

/**
 * Muestra un mensaje de error o éxito
 * @param {string} message - Mensaje a mostrar
 * @param {boolean} isError - true si es error, false si es éxito
 */
function showMessage(message, isError) {
  const messageContainer = document.querySelector("#message-container");

  messageContainer.textContent = message;

  if (isError === true) {
    messageContainer.className = "message error";
  } else {
    messageContainer.className = "message success";
  }

  setTimeout(() => {
    messageContainer.textContent = "";
    messageContainer.className = "message";
  }, 3000);
}

/**
 * Inicitaliza todos los events listeners de la aplicación
 * @param {Object} store - Store de notas
 */
function initializeEventLIsteners(store) {
  const newNoteButton = document.querySelector("#new-note-button");

  newNoteButton.addEventListener("click", () => {
    renderEditor(null);
  });

  const saveNoteButton = document.querySelector("#save-note-button");

  saveNoteButton.addEventListener("click", () => {
    const editorTextArea = document.querySelector("#editor-textarea");
    const content = editorTextArea.value;
    const author = document.querySelector("#author").value;
    const tags = document.querySelector("#tags").value.split(",");

    if (content.trim() === "") {
      showMessage("El contenido no puede estar vacío", true);
      return;
    }

    if (currentNoteId != null) {
      const result = store.updateNote(currentNoteId, {
        content: content,
        author,
        tags,
      });

      if (result.success === true) {
        showMessage("Nota actualizada Exitosamente", false);
        const notes = store.getNotesOrderedByDate();
        renderNoteList(notes);
      } else {
        showMessage(result.message, true);
      }
    } else {
      const result = store.addNote(content, null, author, tags);

      if (result.success === true) {
        showMessage("Nota creada exitosamente", false);
        currentNoteId = result?.note?.id;
        const notes = store.getNotesOrderedByDate();
        renderNoteList(notes);
      } else {
        showMessage(result.message, true);
      }
    }
  });

  const deleteNoteButton = document.querySelector("#delete-note-button");

  deleteNoteButton.addEventListener("click", () => {
    if (currentNoteId === null) {
      showMessage("No hay una nota seleccionada para eliminar", true);
    }

    const confirmed = confirm("¿Estás seguro de eliminar esta nota?");

    if (confirmed === true) {
      const result = store.deleteNote(currentNoteId);

      if (result.success === true) {
        showMessage("Nota Eliinada exitosamente", false);
        hideEditorAndPreview();
        currentNoteId = null;
        const notes = store.getNotesOrderedByDate();
        renderNoteList(notes);
      } else {
        showMessage(result.message, true);
      }
    }
  });

  const editorTextarea = document.querySelector("#editor-textarea");
  editorTextarea.addEventListener("input", () => {
    const content = editorTextarea.value;
    renderPreview(content);
  });

  const noteListContainer = document.querySelector("#note-list");

  noteListContainer.addEventListener("click", () => {
    const noteItem = event.target.closest(".note-item");

    if (noteItem != null) {
      const noteId = Number(noteItem.dataset.id);
      const note = store.getNoteById(noteId);

      if (note != null) {
        renderEditor(note);
        const notes = store.getNotesOrderedByDate();
        renderNoteList(notes);
      }
    }
  });
}

/**
 * Función principal que inicializa la aplicación
 */
function initialzeApp() {
  const store = createNotesStore();
  const notes = store.getNotesOrderedByDate();
  renderNoteList(notes);

  hideEditorAndPreview();

  initializeEventLIsteners(store);

  console.log("Aplicación inicializada correctamente");
  console.log("Total de notas cargadas:", store.getNotesCount());

  // // Ejemplo 1: Crear una nota
  // console.log("=== CREAR NOTA ===");
  // const nota1 = store.addNote(
  //   "# Mi primera nota\nEste es el contenido de mi primera nota en Markdown.",
  // );
  // console.log(nota1);

  // // Ejemplo 2: Crear nota con título personalizado
  // console.log("\n=== CREAR NOTA CON TÍTULO ===");
  // const nota2 = store.addNote(
  //   "Contenido de la segunda nota",
  //   "Nota Importante",
  // );
  // console.log(nota2);

  // // Ejemplo 3: Intentar crear nota vacía (validación)
  // console.log("\n=== VALIDACIÓN: NOTA VACÍA ===");
  // const notaVacia = store.addNote("");
  // console.log(notaVacia);
}

document.addEventListener("DOMContentLoaded", () => {
  initialzeApp();
});
