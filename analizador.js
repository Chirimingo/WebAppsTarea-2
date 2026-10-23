// Analizador de ventanas consecutivas de mayor promedio.
//
// Contrato:
//   Entrada:  lecturas = arreglo de { hora: string, kwh: number }
//             k        = entero, 1 <= k <= lecturas.length
//   Salida:   la ventana consecutiva de k lecturas con mayor promedio,
//             indicando posición inicial, posición final, promedio y trabajo.
//   Empates:  se elige la ventana más temprana.
//   Comparación de promedios: dos promedios se consideran iguales si su
//   diferencia absoluta es <= EPSILON. Un promedio sólo reemplaza al mejor
//   si lo supera por más de EPSILON.
//   Nunca se modifica el arreglo de entrada.

const EPSILON = 1e-9;

// Responsabilidad: validar la entrada y explicar cada error encontrado.
function validarEntrada(lecturas, k) {
  const errores = [];

  if (!Array.isArray(lecturas)) {
    errores.push({ codigo: 'NO_ES_ARREGLO', mensaje: 'Las lecturas deben ser un arreglo.' });
    return { valido: false, errores };
  }

  if (lecturas.length === 0) {
    errores.push({ codigo: 'ARREGLO_VACIO', mensaje: 'El arreglo de lecturas está vacío.' });
  }

  lecturas.forEach((lectura, i) => {
    if (typeof lectura !== 'object' || lectura === null) {
      errores.push({ codigo: 'LECTURA_INCOMPLETA', indice: i, mensaje: `La lectura ${i} no es un objeto.` });
      return;
    }
    if (lectura.hora === undefined || lectura.hora === null || lectura.hora === '') {
      errores.push({ codigo: 'LECTURA_INCOMPLETA', indice: i, mensaje: `La lectura ${i} no tiene hora.` });
    }
    if (lectura.kwh === undefined || lectura.kwh === null) {
      errores.push({ codigo: 'LECTURA_INCOMPLETA', indice: i, mensaje: `La lectura ${i} no tiene kwh.` });
    } else if (typeof lectura.kwh !== 'number' || !Number.isFinite(lectura.kwh)) {
      errores.push({ codigo: 'KWH_NO_NUMERICO', indice: i, mensaje: `La lectura ${i} tiene kwh no numérico (${String(lectura.kwh)}).` });
    } else if (lectura.kwh < 0) {
      errores.push({ codigo: 'KWH_NEGATIVO', indice: i, mensaje: `La lectura ${i} tiene kwh negativo (${lectura.kwh}).` });
    }
  });

  if (!Number.isInteger(k)) {
    errores.push({ codigo: 'K_NO_ENTERO', mensaje: `k debe ser un entero (recibido: ${String(k)}).` });
  } else if (k < 1) {
    errores.push({ codigo: 'K_FUERA_DE_RANGO', mensaje: `k debe ser al menos 1 (recibido: ${k}).` });
  } else if (lecturas.length > 0 && k > lecturas.length) {
    errores.push({ codigo: 'K_FUERA_DE_RANGO', mensaje: `k (${k}) no puede ser mayor que la cantidad de lecturas (${lecturas.length}).` });
  }

  return { valido: errores.length === 0, errores };
}

// Responsabilidad: construir el objeto de resultado común a ambas estrategias.
function construirResultado(estrategia, lecturas, k, mejor, operaciones, ventanas) {
  const fin = mejor.inicio + k - 1;
  return {
    estrategia,
    inicio: mejor.inicio,
    fin,
    horaInicio: lecturas[mejor.inicio].hora,
    horaFin: lecturas[fin].hora,
    promedio: mejor.promedio,
    operaciones,
    ventanas,
  };
}

// Estrategia directa: recalcula la suma completa de cada ventana.
// Operación contada: cada lectura sumada (k por ventana).
function estrategiaDirecta(lecturas, k) {
  const n = lecturas.length;
  let mejor = null;
  let operaciones = 0;
  let ventanas = 0;

  for (let inicio = 0; inicio <= n - k; inicio++) {
    let suma = 0;
    for (let j = inicio; j < inicio + k; j++) {
      suma += lecturas[j].kwh;
      operaciones++;
    }
    const promedio = suma / k;
    ventanas++;
    if (mejor === null || promedio > mejor.promedio + EPSILON) {
      mejor = { inicio, promedio };
    }
  }

  return construirResultado('directa', lecturas, k, mejor, operaciones, ventanas);
}

// Estrategia deslizante: calcula la primera suma y luego, por cada avance,
// retira la lectura que sale y agrega la que entra.
// Operaciones contadas: k sumas iniciales + 2 actualizaciones por avance.
function estrategiaDeslizante(lecturas, k) {
  const n = lecturas.length;
  let suma = 0;
  let operaciones = 0;

  for (let j = 0; j < k; j++) {
    suma += lecturas[j].kwh;
    operaciones++;
  }

  let mejor = { inicio: 0, promedio: suma / k };
  let ventanas = 1;

  for (let inicio = 1; inicio <= n - k; inicio++) {
    suma -= lecturas[inicio - 1].kwh; // sale de la ventana
    suma += lecturas[inicio + k - 1].kwh; // entra a la ventana
    operaciones += 2;
    ventanas++;

    const promedio = suma / k;
    if (promedio > mejor.promedio + EPSILON) {
      mejor = { inicio, promedio };
    }
  }

  return construirResultado('deslizante', lecturas, k, mejor, operaciones, ventanas);
}

// Operación pública: valida primero y ejecuta ambas estrategias sólo si la entrada es válida.
function analizarConsumo(lecturas, k) {
  const validacion = validarEntrada(lecturas, k);
  if (!validacion.valido) {
    return { valido: false, errores: validacion.errores };
  }

  const directa = estrategiaDirecta(lecturas, k);
  const deslizante = estrategiaDeslizante(lecturas, k);
  const coinciden =
    directa.inicio === deslizante.inicio &&
    Math.abs(directa.promedio - deslizante.promedio) <= EPSILON;

  return { valido: true, k, n: lecturas.length, directa, deslizante, coinciden };
}

module.exports = {
  EPSILON,
  validarEntrada,
  estrategiaDirecta,
  estrategiaDeslizante,
  analizarConsumo,
};
