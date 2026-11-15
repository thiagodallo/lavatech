export const modelosPorMarca = {
  Chevrolet: ['Onix', 'Onix Plus', 'Prisma', 'Celta', 'Corsa', 'Cruze', 'S10', 'Tracker', 'Spin', 'Montana', 'Cobalt', 'Equinox'],
  Fiat: ['Uno', 'Mobi', 'Argo', 'Cronos', 'Palio', 'Siena', 'Strada', 'Toro', 'Pulse', 'Fastback', 'Fiorino', 'Doblò', 'Ducato'],
  Volkswagen: ['Gol', 'Voyage', 'Polo', 'Virtus', 'Fox', 'Up', 'T-Cross', 'Nivus', 'Saveiro', 'Amarok', 'Jetta', 'Tiguan', 'Taos'],
  Ford: ['Ka', 'Fiesta', 'Focus', 'EcoSport', 'Ranger', 'Fusion', 'Territory', 'Maverick'],
  Toyota: ['Corolla', 'Corolla Cross', 'Etios', 'Yaris', 'Hilux', 'SW4', 'RAV4', 'Camry'],
  Honda: ['Civic', 'Fit', 'City', 'HR-V', 'WR-V', 'CR-V', 'Accord'],
  Hyundai: ['HB20', 'HB20S', 'Creta', 'i30', 'ix35', 'Tucson', 'Santa Fe', 'HR'],
  Renault: ['Kwid', 'Sandero', 'Logan', 'Duster', 'Captur', 'Oroch', 'Master', 'Clio'],
  Jeep: ['Renegade', 'Compass', 'Commander', 'Wrangler', 'Cherokee'],
  Nissan: ['March', 'Versa', 'Kicks', 'Frontier', 'Sentra', 'Tiida', 'Livina'],
  Peugeot: ['208', '2008', '207', '308', '3008', 'Partner', 'Expert'],
  Citroën: ['C3', 'C4 Cactus', 'C4 Lounge', 'Aircross', 'Jumpy', 'Jumper'],
  Mitsubishi: ['L200 Triton', 'Pajero', 'ASX', 'Outlander', 'Eclipse Cross'],
  Kia: ['Sportage', 'Cerato', 'Sorento', 'Picanto', 'Stonic', 'Soul'],
  BMW: ['Série 1', 'Série 3', 'X1', 'X3', 'X5'],
  'Mercedes-Benz': ['Classe A', 'Classe C', 'GLA', 'GLC', 'Sprinter', 'Accelo'],
  Audi: ['A3', 'A4', 'Q3', 'Q5'],
  Volvo: ['XC40', 'XC60', 'XC90'],
  BYD: ['Dolphin', 'Song Plus', 'Seal', 'Yuan Plus'],
}

export const marcas = Object.keys(modelosPorMarca).sort((primeira, segunda) => primeira.localeCompare(segunda, 'pt-BR'))
