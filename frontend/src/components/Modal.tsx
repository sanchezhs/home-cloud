import { Modal, Box, Typography } from "@mui/material";


type AppModalProps = {
  open: boolean;
  handleClose: () => void;
  title: string;
  body: string;
  style?: object;
}

const DEF_STYLE = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

function AppModal({ open, handleClose, title, body, style }: AppModalProps) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style || DEF_STYLE}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Box
          id="modal-modal-description"
          sx={{
            mt: 2,
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          {typeof body === 'string' ? (
            <Typography variant="body1">{body}</Typography>
          ) : (
            body
          )}
        </Box>
      </Box>
    </Modal>
  );
}

export default AppModal;
