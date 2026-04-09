import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Tooltip
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function SystemUserTable({ users }) {
  return (
    <Paper elevation={10} className="rounded-2xl overflow-hidden">
      <Table>
        <TableHead sx={{ bgcolor: "#f5f3ff" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>User</TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Role</TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Status</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600, fontSize: 12 }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((u) => (
            <TableRow hover key={u.systemUserId}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar sx={{ bgcolor: "#4f1d7d" }}>
                    {u.firstName[0]}
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">
                      {u.firstName} {u.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {u.email}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell>{u.role}</TableCell>

              <TableCell>
                <Chip
                  label={u.isApproved ? "Active" : "Inactive"}
                  color={u.isApproved ? "success" : "error"}
                  size="small"
                />
              </TableCell>

              <TableCell align="right">
                <Tooltip title="View user">
                  <IconButton size="small" color="primary">
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}