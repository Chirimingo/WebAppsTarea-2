# Monitor de consumo energético

Solución para la Tarea #2 de Web Apps (Algoritmos y Resolución de Problemas), Universidad Galileo.
Encuentra la ventana consecutiva de k mediciones con mayor consumo promedio, usando dos estrategias: una directa y una optimizada con ventana deslizante.

## 1. Reformulación del problema

- **Qué representa una lectura:** el consumo eléctrico del edificio durante una hora, en kWh. Cada lectura tiene una hora (`"HH:00"`) y un valor `kwh` no negativo.
- **Qué significa k:** la cantidad de lecturas consecutivas que forman una ventana. Una ventana es un tramo continuo del arreglo, sin saltos.
- **Qué debe devolver el programa:** la ventana de k lecturas con mayor promedio, indicando su posición inicial y final, sus horas, su promedio y cuántas operaciones de suma o resta se hicieron.
- **Qué entradas son válidas:** un arreglo no vacío de objetos completos (`hora` y `kwh`), con `kwh` numérico, finito y mayor o igual a 0, y un `k` entero con 1 ≤ k ≤ n, donde n es la cantidad de lecturas.
- **Qué ocurre cuando no se puede calcular una ventana:** si la entrada no es válida, el programa no calcula nada. Devuelve la lista de errores con un código y un mensaje. Nunca inventa valores ni busca una ventana que no existe.

## 2. Contrato

| Elemento | Definición |
|---|---|
| Entrada `lecturas` | Arreglo de `{ hora: string, kwh: number }`, en orden temporal. No se ordena ni se modifica. |
| Entrada `k` | Entero, 1 ≤ k ≤ `lecturas.length`. |
| Salida (válida) | `{ inicio, fin, horaInicio, horaFin, promedio, operaciones, ventanas }` por estrategia. `inicio` y `fin` son posiciones base 0, con `fin = inicio + k - 1`. |
| Salida (inválida) | `{ valido: false, errores: [{ codigo, mensaje, indice? }] }`. |
| Empates | Se elige la ventana más temprana. |
| Comparación de promedios | Dos promedios son iguales si su diferencia absoluta es ≤ `1e-9` (`EPSILON`). Una ventana sólo reemplaza a la mejor si supera a ésta por más de `EPSILON`. |

**Códigos de error:** `NO_ES_ARREGLO`, `ARREGLO_VACIO`, `LECTURA_INCOMPLETA`, `KWH_NO_NUMERICO`, `KWH_NEGATIVO`, `K_NO_ENTERO`, `K_FUERA_DE_RANGO`.

## 3. Ejemplo manual (distinto de los datos principales)

Lecturas: `[2, 4, 1, 5, 3, 6]`, con k = 3 (n = 6). Son 4 ventanas:

| Ventana | Posiciones | Valores | Suma | Promedio |
|---|---|---|---|---|
| 1 | 0–2 | 2, 4, 1 | 7 | 2.333 |
| 2 | 1–3 | 4, 1, 5 | 10 | 3.333 |
| 3 | 2–4 | 1, 5, 3 | 9 | 3.000 |
| 4 | 3–5 | 5, 3, 6 | 14 | **4.667** |

Mejor ventana: posiciones 3–5, promedio 4.667.

**Simulación de la estrategia deslizante:**

| Paso | Acción | Lectura que sale | Lectura que entra | Suma | Promedio |
|---|---|---|---|---|---|
| Inicio | Suma de las primeras 3 | — | — | 7 | 2.333 |
| Avance 1 | Retirar y agregar | 2 | 5 | 10 | 3.333 |
| Avance 2 | Retirar y agregar | 4 | 3 | 9 | 3.000 |
| Avance 3 | Retirar y agregar | 1 | 6 | 14 | 4.667 |

El límite está bien controlado: el último avance agrega la posición 5 (`n - 1`), y no hay lectura que salga de un índice inválido.

**Operaciones:** directa = 4 ventanas × 3 sumas = 12. Deslizante = 3 sumas iniciales + 3 avances × 2 = 9.

## 4. Requisitos previos

- Node.js 18 o superior (probado con Node.js v22.22.0).
- No hay dependencias externas ni `npm install`.

## 5. Ejecución

Desde la raíz del proyecto `monitor-consumo/`:

```bash
node src/index.js
```

El programa ejecuta el caso principal, las variaciones pedidas (k = 1, k = n, valores iguales y entrada inválida) y confirma que el arreglo original no cambió.

## 6. Estructura

```
monitor-consumo/
├── README.md
└── src/
    ├── datos.js       lecturas de ejemplo (12 horas, 08:00 a 19:00)
    ├── analizador.js  validación, estrategia directa, estrategia deslizante, analizarConsumo
    └── index.js       programa principal y variaciones
```

## 7. Validación

Casos cubiertos:

- **Normales:** caso principal con k = 3.
- **Límites:** k = 1, k = n, y todos los valores iguales (empate entre ventanas).
- **Inválidos:** k = 0, kWh negativo, kWh no numérico y lectura incompleta.

En todos los casos válidos, ambas estrategias devuelven la misma ventana y el mismo promedio.

## 8. Evidencia (salida real de `node src/index.js`)

```
=== Caso principal (k = 3, n = 12) ===
Validación: entrada VÁLIDA
Estrategia directa: ventana 11:00 a 13:00 (posiciones 3 a 5), promedio 3.133 kWh, operaciones 30, ventanas evaluadas 10
Estrategia deslizante: ventana 11:00 a 13:00 (posiciones 3 a 5), promedio 3.133 kWh, operaciones 21, ventanas evaluadas 10
Ambas estrategias identifican la misma ventana: SÍ

=== Variación: k = 1 (k = 1, n = 12) ===
Validación: entrada VÁLIDA
Estrategia directa: ventana 12:00 a 12:00 (posiciones 4 a 4), promedio 3.400 kWh, operaciones 12, ventanas evaluadas 12
Estrategia deslizante: ventana 12:00 a 12:00 (posiciones 4 a 4), promedio 3.400 kWh, operaciones 23, ventanas evaluadas 12
Ambas estrategias identifican la misma ventana: SÍ

=== Variación: k = n (k = 12, n = 12) ===
Validación: entrada VÁLIDA
Estrategia directa: ventana 08:00 a 19:00 (posiciones 0 a 11), promedio 2.008 kWh, operaciones 12, ventanas evaluadas 1
Estrategia deslizante: ventana 08:00 a 19:00 (posiciones 0 a 11), promedio 2.008 kWh, operaciones 12, ventanas evaluadas 1
Ambas estrategias identifican la misma ventana: SÍ

=== Variación: todos los valores iguales (k = 4, n = 10) ===
Validación: entrada VÁLIDA
Estrategia directa: ventana 08:00 a 11:00 (posiciones 0 a 3), promedio 2.500 kWh, operaciones 28, ventanas evaluadas 7
Estrategia deslizante: ventana 08:00 a 11:00 (posiciones 0 a 3), promedio 2.500 kWh, operaciones 16, ventanas evaluadas 7
Ambas estrategias identifican la misma ventana: SÍ

=== Variación: entrada inválida (k = 0, n = 4) ===
Validación: entrada INVÁLIDA. No se calcula ninguna ventana.
  - [KWH_NEGATIVO] La lectura 1 tiene kwh negativo (-0.5).
  - [LECTURA_INCOMPLETA] La lectura 2 no tiene kwh.
  - [KWH_NO_NUMERICO] La lectura 3 tiene kwh no numérico (abc).
  - [K_FUERA_DE_RANGO] k debe ser al menos 1 (recibido: 0).

El arreglo original no cambió: SÍ
```

**Fórmulas de trabajo** (n = lecturas, k = tamaño de ventana):
- Directa: k × (n − k + 1) sumas.
- Deslizante: k + 2 × (n − k) actualizaciones (una resta y una suma por avance).

Comprobación con el caso principal (n = 12, k = 3): directa = 3 × 10 = 30; deslizante = 3 + 2 × 9 = 21.

## 9. Análisis de estrategias

**¿Por qué la estrategia directa puede ser útil aunque haga más trabajo?**
Es más simple y tiene menos riesgo de error. No mantiene una suma acumulada, así que no hay errores de redondeo que se propaguen. Sirve como referencia para verificar la versión optimizada, y en la práctica es suficiente cuando n es pequeño.

**¿Qué información se reutiliza en la ventana deslizante?**
La suma de la ventana anterior. Dos ventanas consecutivas comparten k − 1 lecturas. Al avanzar, sólo se resta la lectura que sale y se suma la que entra, en lugar de volver a sumar las k lecturas.

**¿Qué sucede en los casos k = 1 y k = n?**
- **k = 1:** cada ventana es una sola lectura, así que no hay trabajo compartido. La deslizante hace más operaciones (23 frente a 12), porque la suma inicial más las restas y sumas de cada avance cuestan más que leer cada valor una vez. La ventaja aparece cuando k es grande.
- **k = n:** sólo existe una ventana. Ambas estrategias hacen n sumas y la comparación es trivial.

**¿Qué condición de la entrada evita que el promedio sea ambiguo?**
k debe ser un entero mayor o igual a 1 y no mayor que n. Así siempre hay al menos una ventana completa, y el promedio se calcula dividiendo entre un número positivo. Además, todos los kWh deben ser números finitos: un `NaN` o un valor no numérico haría que el promedio no tenga sentido.

## 10. Complejidad observada

- Directa: O(n·k). Con los datos principales hace 30 sumas.
- Deslizante: O(n + k). Con los datos principales hace 21 actualizaciones.

En la prueba con valores iguales (n = 10, k = 4) la directa hizo 28 sumas y la deslizante 16. La diferencia crece con k: con n = 12 y k = 3, la directa hace 30 y la deslizante 21, y la brecha crece con el tamaño de la ventana.
