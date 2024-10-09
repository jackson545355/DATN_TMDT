import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import {
  Box, Grid, AppBar, Container, Typography, Paper, IconButton, Avatar, Tooltip,
} from "@mui/material";
import { Logout } from "@mui/icons-material";

export default function NavBarComponent() {
  const { user, logout } = useContext(AuthContext);
  const token = localStorage.getItem('token');

  console.log(token);
  return (
    <Grid container>
      <Grid item md={12}>
        <Paper elevation={4}>
          <AppBar sx={{ padding: 2 }} position="static">
            <Container maxWidth="xxl">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  component="a"
                  href="/"
                  sx={{
                    mx: 2,
                    display: { xs: "none", md: "flex" },
                    fontWeight: 700,
                    letterSpacing: ".2rem",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  ADIMS
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "right",
                    alignItems: "center",
                  }}
                >
                  {token ? (
                    <>
                      <Typography fontFamily={"Inter"}>
                        {user ?  user.name : "ADMIN"}
                      </Typography>
                      <IconButton onClick={logout}>
                        <Tooltip title="Log out">
                          <Avatar sx={{ width: 32, height: 32 }}>{user? user.name[0]: "AD"}</Avatar>
                        </Tooltip>
                      </IconButton>
                    </>
                  ) : (
                    <Typography fontFamily={"Inter"}>Log In</Typography>
                  )}
                </Box>
              </Box>
            </Container>
          </AppBar>
        </Paper>
      </Grid>
    </Grid>
  );
}
