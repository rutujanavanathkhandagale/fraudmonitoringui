import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button
} from "@mui/material";
import { addSystemUser } from "../../services/systemUserService";

export default function AddSystemUserModal({ onClose, onSuccess }) {
  const [registrationId, setRegistrationId] = useState("");
  const [roleId, setRoleId] = useState("");

  async function handleAdd() {
    await addSystemUser(Number(registrationId), Number(roleId));
    onSuccess();
    onClose();
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add System User</DialogTitle>
      <DialogContent className="d-flex gap-3 mt-2">
        <TextField
          label="Registration ID"
          type="number"
          fullWidth
          value={registrationId}
          onChange={e => setRegistrationId(e.target.value)}
        />

        <TextField
          select
          label="Role"
          fullWidth
          value={roleId}
          onChange={e => setRoleId(e.target.value)}
        >
          <MenuItem value={1}>Admin</MenuItem>
          <MenuItem value={2}>Analyst</MenuItem>
          <MenuItem value={3}>Compliance</MenuItem>
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd}>
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
}