# Landing do pitch: design

Data: 2026-11-16. Banca em 2026-11-24.

## Intenção

A página em `/` é projetada enquanto o apresentador fala, para uma banca que inclui pessoas do iFood e do Nubank. Precisa mostrar que o produto funciona e que foi construído com critério, sem prometer o que não existe.

## Objetivos

- Produto vivo no topo: uma agenda de demonstração que se desenrola sozinha.
- Uma ideia por tela, legível de longe, navegável pelo teclado.
- Mostrar o fluxo real (agendar, atender, conferir, receber) com as telas do sistema.
- Mostrar a estrutura técnica (interface, API, banco) com a rota real de um agendamento.

## Não objetivos

- Nenhum número, depoimento ou pacote de preço inventado.
- Nenhuma linha de confiança na hero (decisão do dono em 2026-11-16).
- Nenhuma seção de próximos passos por enquanto (depende do dono).
- Sem mascote, WebGL ou animação de entrada em todas as seções.

## Anti-objetivos

- Parecer uma página gerada por IA: cartões iguais, gradientes decorativos, rótulos em caixa alta, numeração sem sequência real.

## Restrições

- Funciona offline: fontes e imagens locais, sem CDN.
- Respeita `prefers-reduced-motion`.
- Só `transform` e `opacity` em movimento. Curva `cubic-bezier(0.16, 1, 0.3, 1)` em entrada de marketing, `cubic-bezier(0.23, 1, 0.32, 1)` em UI, saída 20% mais curta.
- Grade de 8 pt, tokens do projeto, identidade LavaTech (marinho, azul de marca, um acento).

## Abordagens consideradas

1. Só acabamento e polimento. Barata, mas sem segundo momento de impacto.
2. Acabamento mais cena do fluxo presa à rolagem. Mostra o produto em cada etapa. Escolhida.
3. Demo clicável sem login. Exige base isolada, fora do prazo.

## Decisões

Ordem de trabalho:

1. Acabamento técnico, entrada da hero com tecla R para reiniciar o dia, modo apresentação (indicador de seção, âncora na URL, tela cheia com F).
2. Cena do fluxo: seção alta com palco fixo; cada etapa troca a interface mostrada (grade de horários, cartão em andamento, checklist, pagamento). Setas passam etapa por etapa. Sem rolagem fixa no celular ou com movimento reduzido: vira a lista atual.
3. Dashboard animado (barras e números, uma vez) e arquitetura com um agendamento atravessando as camadas.
4. Ensaio no projetor e correções, com folga de um dia antes de 24/11.

Se o prazo apertar, a animação da arquitetura é o primeiro corte.

## Fica para o construtor

Valores finais de espaçamento e tipografia, textos curtos de cada etapa e dos créditos, detalhes de acessibilidade (foco, rótulos).
