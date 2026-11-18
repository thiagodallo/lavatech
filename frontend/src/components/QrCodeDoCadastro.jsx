import qrcode from 'qrcode-generator'
import { useMemo } from 'react'
import { Link } from 'react-router'

import './QrCodeDoCadastro.css'

const MARGEM_EM_MODULOS = 4

function desenharModulos(endereco) {
  const codigo = qrcode(0, 'M')
  codigo.addData(endereco)
  codigo.make()

  const tamanho = codigo.getModuleCount()
  let tracado = ''
  for (let linha = 0; linha < tamanho; linha += 1) {
    for (let coluna = 0; coluna < tamanho; coluna += 1) {
      if (codigo.isDark(linha, coluna)) tracado += `M${coluna} ${linha}h1v1h-1z`
    }
  }
  return { tracado, tamanho }
}

export default function QrCodeDoCadastro() {
  const { tracado, tamanho } = useMemo(
    () => desenharModulos(`${window.location.origin}/cadastro`),
    [],
  )
  const lado = tamanho + MARGEM_EM_MODULOS * 2

  return (
    <Link to="/cadastro" className="qr-cadastro">
      <svg
        className="qr-cadastro-codigo"
        viewBox={`${-MARGEM_EM_MODULOS} ${-MARGEM_EM_MODULOS} ${lado} ${lado}`}
        shapeRendering="crispEdges"
        role="img"
        aria-label="QR Code para a tela de cadastro"
      >
        <rect x={-MARGEM_EM_MODULOS} y={-MARGEM_EM_MODULOS} width={lado} height={lado} fill="#ffffff" />
        <path d={tracado} fill="#0a2239" />
      </svg>
      <span className="qr-cadastro-rotulo">Cadastre-se pelo celular</span>
    </Link>
  )
}
