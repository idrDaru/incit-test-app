import {
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function passwordHelperText(password: string, isIn: boolean) {
  const hasLow = /[a-z]/g.test(password);
  const hasUpper = /[A-Z]/g.test(password);
  const hasDigit = /[0-9]/g.test(password);
  const hasSpecial = /[@#$%^&*()<>?/\|}{~`]/g.test(password);
  const isLongEnough = password.length >= 8;

  return (
    <Collapse in={isIn} sx={{ width: "100%" }}>
      <List sx={{ p: 0 }}>
        <ListItem sx={{ p: 0 }}>
          <ListItemIcon>
            {hasLow ? (
              <CheckCircleIcon color="success" />
            ) : (
              <CancelIcon color="error" />
            )}
          </ListItemIcon>
          <ListItemText secondary="Contains at least one lower character" />
        </ListItem>
        <ListItem sx={{ p: 0 }}>
          <ListItemIcon>
            {hasUpper ? (
              <CheckCircleIcon color="success" />
            ) : (
              <CancelIcon color="error" />
            )}
          </ListItemIcon>
          <ListItemText secondary="Contains at least one upper character" />
        </ListItem>
        <ListItem sx={{ p: 0 }}>
          <ListItemIcon>
            {hasDigit ? (
              <CheckCircleIcon color="success" />
            ) : (
              <CancelIcon color="error" />
            )}
          </ListItemIcon>
          <ListItemText secondary="Contains at least one digit character" />
        </ListItem>
        <ListItem sx={{ p: 0 }}>
          <ListItemIcon>
            {hasSpecial ? (
              <CheckCircleIcon color="success" />
            ) : (
              <CancelIcon color="error" />
            )}
          </ListItemIcon>
          <ListItemText secondary="Contains at least one special character" />
        </ListItem>
        <ListItem sx={{ p: 0 }}>
          <ListItemIcon>
            {isLongEnough ? (
              <CheckCircleIcon color="success" />
            ) : (
              <CancelIcon color="error" />
            )}
          </ListItemIcon>
          <ListItemText secondary="Contains at least 8 characters" />
        </ListItem>
      </List>
    </Collapse>
  );
}
