import * as React from 'react';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Container, Paper, Box, Button } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6750A4', // Material 3 primary
    },
    secondary: {
      main: '#625B71',
    },
    background: {
      default: '#F8F7FA',
      paper: '#FFFFFF',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            管理后台
          </Typography>
          <Button color="inherit">登录</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            欢迎使用管理界面
          </Typography>
          <Typography variant="body1" gutterBottom>
            这里是基于 Material Design 3 设计规范的 Web 管理后台示例。
          </Typography>
          <Box mt={2}>
            <Button variant="contained" color="primary">操作示例</Button>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
