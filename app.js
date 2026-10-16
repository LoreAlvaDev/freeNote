const notas = [
  {
    id: 1,
    titulo: "Mi primera nota",
    contenido: "Esta es el contenido de mi primera nota",
    fecha: new Date(),
    autor: "Lore",
    etiquetas: ["personal", "trabajo"],
  },
  {
    id: 2,
    titulo: "Mi segunda nota",
    contenido: "Esta es el contenido de mi segunda nota",
    fecha: new Date(),
    autor: "Lore",
    etiquetas: ["trabajo"],
  },
];
const pintaNota = (nota) => console.log(nota);

console.log("las notas");

notas.map((nota) => pintaNota(nota));

console.log(" las notas personal");
let filtered = notas.filter((nota) => nota.etiquetas.includes("personal"));
filtered.map((nota) => pintaNota(nota));
