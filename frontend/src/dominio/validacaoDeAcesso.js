const formatoDeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MENOR_NOME = 2
const MENOR_SENHA = 8

function erroDoEmail(email) {
  const texto = email.trim()
  if (!texto) return 'Informe o e-mail.'
  if (!formatoDeEmail.test(texto)) return 'Informe um e-mail válido, como nome@empresa.com.'
  return null
}

function erroDaSenha(senha) {
  if (!senha) return 'Informe a senha.'
  return null
}

function removerVazios(erros) {
  return Object.fromEntries(Object.entries(erros).filter(([, mensagem]) => mensagem))
}

export function validarLogin({ email, senha }) {
  return removerVazios({ email: erroDoEmail(email), senha: erroDaSenha(senha) })
}

export function validarCadastro({ nome, email, senha }) {
  const erroDoNome = nome.trim().length < MENOR_NOME ? 'Informe o nome, com ao menos 2 letras.' : null
  const erroDaSenhaNova = !senha
    ? 'Informe a senha.'
    : senha.length < MENOR_SENHA
      ? 'A senha precisa ter ao menos 8 caracteres.'
      : null
  return removerVazios({ nome: erroDoNome, email: erroDoEmail(email), senha: erroDaSenhaNova })
}
