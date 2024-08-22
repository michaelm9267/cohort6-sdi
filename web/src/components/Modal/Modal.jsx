import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'

const Modal = ({ open, onClose, content, actions }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="modal-overlay"
      sx={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(169, 169, 169, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <DialogContent
        className="modal"
        sx={{
          background: 'white',
          padding: '20px',
          borderRadius: '5px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        {content}
      </DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  )
}

export default Modal
