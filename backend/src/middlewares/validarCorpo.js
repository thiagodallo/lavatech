export default function validarCorpo(formato) {
  return (req, res, next) => {
    req.body = formato.parse(req.body)
    next()
  }
}
