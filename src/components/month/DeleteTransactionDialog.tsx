import type { DeleteScope } from '../../types/state.ts'
import { Modal } from '../shared/Modal.tsx'

interface DeleteTransactionDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (scope: DeleteScope) => void
  isRecurring: boolean
}

export function DeleteTransactionDialog({
  open,
  onClose,
  onConfirm,
  isRecurring,
}: DeleteTransactionDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title="Delete transaction">
      {isRecurring ? (
        <div className="delete-dialog">
          <p>This transaction is part of a monthly series. What would you like to delete?</p>
          <div className="form-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="button" onClick={() => onConfirm('this')}>
              Just this occurrence
            </button>
            <button type="button" className="danger" onClick={() => onConfirm('series')}>
              This and future occurrences
            </button>
          </div>
        </div>
      ) : (
        <div className="delete-dialog">
          <p>Delete this transaction?</p>
          <div className="form-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="danger" onClick={() => onConfirm('this')}>
              Delete
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}
