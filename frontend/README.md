# Front-end

Interface web do LavaTech, seguindo o protótipo das oito telas do MVP (Login, Agenda, Novo agendamento, Dashboard, Clientes, Catálogo, Estoque e Qualidade).

- React 19 e Vite 8
- React Router (navegação entre as telas)
- Context API, restrita à sessão do funcionário logado

## Como rodar

Precisa do Node.js 22.12 ou mais novo. De dentro de `frontend/`:

```bash
npm install
npm run dev
```

A interface abre em `http://localhost:5173`. Toda chamada para `/api` é repassada pelo Vite para o back-end em `http://localhost:3000`, então a API precisa estar rodando ao mesmo tempo para o login funcionar. Como o navegador enxerga front e API no mesmo endereço, o cookie de sessão funciona sem configurar CORS.
