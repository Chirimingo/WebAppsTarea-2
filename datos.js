// Lecturas de consumo eléctrico de un edificio (kWh por hora).
// Contrato de cada lectura: { hora: string, kwh: number }, con kwh >= 0.
// Las horas son consecutivas y el arreglo conserva su orden temporal.

const lecturas = [
  { hora: '08:00', kwh: 1.2 },
  { hora: '09:00', kwh: 1.5 },
  { hora: '10:00', kwh: 2.8 },
  { hora: '11:00', kwh: 3.1 },
  { hora: '12:00', kwh: 3.4 },
  { hora: '13:00', kwh: 2.9 },
  { hora: '14:00', kwh: 1.1 },
  { hora: '15:00', kwh: 0.9 },
  { hora: '16:00', kwh: 1.0 },
  { hora: '17:00', kwh: 2.2 },
  { hora: '18:00', kwh: 2.6 },
  { hora: '19:00', kwh: 1.4 },
];

module.exports = { lecturas };
