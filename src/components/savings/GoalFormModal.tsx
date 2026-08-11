import { useState } from 'react'
import { Modal } from '../shared/Modal.tsx'

interface GoalFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: { name: string; targetAmount: number; targetDate?: string }) => void
}

export function GoalFormModal({ open, onClose, onSubmit }: GoalFormModalProps) {
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [targetDate, setTargetDate] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = Number(targetAmount)
    if (!name.trim() || !Number.isFinite(parsed) || parsed <= 0) return
    onSubmit({ name: name.trim(), targetAmount: parsed, targetDate: targetDate || undefined })
    setName('')
    setTargetAmount('')
    setTargetDate('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="New savings goal">
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-row">
          <label htmlFor="goal-name">Name</label>
          <input id="goal-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-row">
          <label htmlFor="goal-amount">Target amount</label>
          <input
            id="goal-amount"
            type="number"
            min="0.01"
            step="0.01"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="goal-date">Target date (optional)</label>
          <input
            id="goal-date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary">
            Create
          </button>
        </div>
      </form>
    </Modal>
  )
}
