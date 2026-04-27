import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const AccessDenied = () => {
  const { logout } = useContext(UserContext);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: 2,
        bgcolor: "background.default",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 460,
          p: 4,
          borderRadius: 3,
          border: "1px solid var(--app-border)",
          textAlign: "center",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Typography variant="h5" fontWeight={800}>
            Access not available
          </Typography>
          <Typography color="text.secondary">
            Your account does not have permission for any enabled module in this
            workspace.
          </Typography>
          <Button variant="contained" onClick={logout}>
            Back to Login
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default AccessDenied;
