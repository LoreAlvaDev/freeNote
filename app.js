const notas = [
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
    contenido: "Esta es el contenido de mi segunda nota",
    fecha: new Date(),
    autor: "Lore",
    estado: "borrador",
    etiquetas: ["trabajo"],
  },
];
const pintaNota = (nota) => console.log(nota);

console.log("Todas las notas");

// notas.map((nota) => pintaNota(nota));
for (let nota of notas) {
  pintaNota(nota);
}

console.log(" las notas publicadas");
// let filtered = notas.filter((nota) => nota.etiquetas.includes("personal"));
// filtered.map((nota) => pintaNota(nota));
for (let nota of notas) {
  if (nota.estado === "publicado") pintaNota(nota);
}
