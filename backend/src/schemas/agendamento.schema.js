import { z } from 'zod'

import { formatoDoChecklist } from './checklist.schema.js'

export const STATUS_DO_AGENDAMENTO = [
  'agendado',
  'aguardando',
  'em_andamento',
  'concluido',
  'cancelado',
  'no_show',
]

const statusValido = z.enum(STATUS_DO_AGENDAMENTO, 'Status inválido')

function referencia(mensagem) {
  return z.number(mensagem).int(mensagem).positive(mensagem)
}

const horarioComFuso = z.iso
  .datetime({
    offset: true,
    error: 'Informe data e hora no formato ISO 8601 com fuso, como 2026-11-10T09:30:00-03:00',
  })
  .transform((texto) => new Date(texto))

export const formatoDoAgendamento = z.object({
  cliente_id: referencia('Informe o cliente'),
  veiculo_id: referencia('Informe o veículo'),
  servico_id: referencia('Informe o serviço'),
  vaga_id: referencia('Informe a vaga'),
  data_hora_agendada: horarioComFuso,
  observacoes: z.string().trim().max(500, 'Observações muito longas').nullish(),
})

function conferirChecklistDoStatus(corpo, contexto) {
  const conclui = corpo.status === 'concluido'
  if (conclui && !corpo.checklist) {
    contexto.addIssue({
      code: 'custom',
      path: ['checklist'],
      message: 'Informe o checklist de qualidade para concluir o atendimento',
    })
  }
  if (!conclui && corpo.checklist) {
    contexto.addIssue({
      code: 'custom',
      path: ['checklist'],
      message: 'O checklist só é aceito ao concluir o atendimento',
    })
  }
}

export const formatoDaMudancaDeStatus = z
  .object({
    status: statusValido,
    checklist: formatoDoChecklist.optional(),
  })
  .superRefine(conferirChecklistDoStatus)

export const formatoDaAgenda = z.object({
  data: z.iso.date('Data inválida, use AAAA-MM-DD').optional(),
  status: statusValido.optional(),
})

export const formatoDosAlertas = z.object({
  minutos: z.coerce
    .number('Minutos inválidos')
    .int('Minutos deve ser um número inteiro')
    .min(1, 'Minutos deve ser de 1 a 240')
    .max(240, 'Minutos deve ser de 1 a 240')
    .default(15),
})
