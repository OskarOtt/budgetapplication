import { useState } from 'react'
import { Modal } from '../shared/Modal.tsx'
import { todayISO } from '../../utils/date.ts'

interface AddContributionFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (amount: number, date: string, note?: string) => void
}

export function AddContributionForm({ open, onClose, onSubmit }: AddContributionFormProps) {
  const [type, setType] = useState<'deposit' | 'withdraw'>('deposit')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(todayISO())
  const [note, setNote] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = Number(amount)
    if (!Number.isFinite(parsed) || parsed <= 0) return
    onSubmit(type === 'deposit' ? parsed : -parsed, date, note.trim() || undefined)
    setAmount('')
    setNote('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Add contribution">
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-row kind-toggle">
          <button
            type="button"
            className={type === 'deposit' ? 'active income' : 'income'}
            onClick={() => setType('deposit')}
          >
            Deposit
          </button>
          <button
            type="button"
            className={type === 'withdraw' ? 'active expense' : 'expense'}
            onClick={() => setType('withdraw')}
          >
            Withdraw
          </button>
        </div>
        <div className="form-row">
          <label htmlFor="contrib-amount">Amount</label>
          <input
            id="contrib-amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="contrib-date">Date</label>
          <input
            id="contrib-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="contrib-note">Note (optional)</label>
          <input id="contrib-note" type="text" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <div className="form-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary">
            Save
          </button>
        </div>
      </form>
    </Modal>
  )
}
