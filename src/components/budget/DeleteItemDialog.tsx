import { Modal } from '../shared/Modal.tsx'

interface DeleteItemDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  description?: string
}

export function DeleteItemDialog({ open, onClose, onConfirm, description }: DeleteItemDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title="Delete item">
      <div className="delete-dialog">
        <p>Delete {description ? `"${description}"` : 'this item'} from your monthly budget?</p>
        <div className="form-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </Modal>
  )
}
