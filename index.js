// Programa principal: ejecuta el caso principal y las variaciones solicitadas.
// Uso desde la raíz del proyecto:  node src/index.js

const { lecturas } = require('./datos');
const { analizarConsumo } = require('./analizador');

function imprimirCaso(titulo, entrada, k) {
  console.log(`\n=== ${titulo} (k = ${k}, n = ${Array.isArray(entrada) ? entrada.length : 'N/A'}) ===`);
  const r = analizarConsumo(entrada, k);

  if (!r.valido) {
    console.log('Validación: entrada INVÁLIDA. No se calcula ninguna ventana.');
    r.errores.forEach((e) => console.log(`  - [${e.codigo}] ${e.mensaje}`));
    return;
  }

  console.log('Validación: entrada VÁLIDA');
  for (const res of [r.directa, r.deslizante]) {
    console.log(
      `Estrategia ${res.estrategia}: ventana ${res.horaInicio} a ${res.horaFin} ` +
        `(posiciones ${res.inicio} a ${res.fin}), promedio ${res.promedio.toFixed(3)} kWh, ` +
        `operaciones ${res.operaciones}, ventanas evaluadas ${res.ventanas}`
    );
  }
  console.log(`Ambas estrategias identifican la misma ventana: ${r.coinciden ? 'SÍ' : 'NO'}`);
}

const copiaAntes = JSON.stringify(lecturas);

imprimirCaso('Caso principal', lecturas, 3);
imprimirCaso('Variación: k = 1', lecturas, 1);
imprimirCaso('Variación: k = n', lecturas, lecturas.length);

const valoresIguales = Array.from({ length: 10 }, (_, i) => ({
  hora: `${String(i + 8).padStart(2, '0')}:00`,
  kwh: 2.5,
}));
imprimirCaso('Variación: todos los valores iguales', valoresIguales, 4);

const entradaInvalida = [
  { hora: '08:00', kwh: 1.0 },
  { hora: '09:00', kwh: -0.5 },
  { hora: '10:00' },
  { hora: '11:00', kwh: 'abc' },
];
imprimirCaso('Variación: entrada inválida', entradaInvalida, 0);

const copiaDespues = JSON.stringify(lecturas);
console.log(`\nEl arreglo original no cambió: ${copiaAntes === copiaDespues ? 'SÍ' : 'NO'}`);
