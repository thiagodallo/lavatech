export function camposIniciaisDoVeiculo(veiculo) {
  return {
    placa: veiculo?.placa ?? '',
    marca: veiculo?.marca ?? '',
    modelo: veiculo?.modelo ?? '',
    cor: veiculo?.cor ?? '',
  }
}

export function dadosDoVeiculo(campos) {
  return {
    placa: campos.placa,
    marca: campos.marca.trim() || null,
    modelo: campos.modelo.trim() || null,
    cor: campos.cor.trim() || null,
  }
}

export function veiculoPreenchido(campos) {
  return Object.values(campos).some((valor) => valor.trim() !== '')
}
