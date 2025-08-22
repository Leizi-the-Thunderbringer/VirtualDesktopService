import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Container, Paper, Box, Button } from '@mui/material';
import axios from 'axios';
import { List, ListItem, ListItemText, IconButton, TextField, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material';

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

function LoginDialog({ open, onLogin }: { open: boolean, onLogin: (token: string, user: any) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/login', { username, password });
      onLogin(res.data.token, res.data);
    } catch (e: any) {
      setError(e?.response?.data?.error || '登录失败');
    }
    setLoading(false);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>登录</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="用户名" value={username} onChange={e => setUsername(e.target.value)} autoFocus />
          <TextField label="密码" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogin} disabled={loading || !username || !password} variant="contained">登录</Button>
      </DialogActions>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError('')}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Dialog>
  );
}

function ClusterManager({ token }: { token: string }) {
  const [clusters, setClusters] = useState<any[]>([]);
  const [nodes, setNodes] = useState<any[]>([]);
  const [newCluster, setNewCluster] = useState('');
  const [newNode, setNewNode] = useState({ hostname: '', ip: '' });

  const fetchClusters = async () => {
    const res = await axios.get('/api/clusters', { headers: { Authorization: token } });
    setClusters(res.data);
  };
  const fetchNodes = async () => {
    const res = await axios.get('/api/nodes', { headers: { Authorization: token } });
    setNodes(res.data);
  };
  useEffect(() => { fetchClusters(); fetchNodes(); }, []);

  const handleAddCluster = async () => {
    await axios.post('/api/clusters', { name: newCluster }, { headers: { Authorization: token } });
    setNewCluster('');
    fetchClusters();
  };
  const handleDeleteCluster = async (id: string) => {
    await axios.delete(`/api/clusters/${id}`, { headers: { Authorization: token } });
    fetchClusters();
  };
  const handleAddNode = async () => {
    await axios.post('/api/nodes', newNode, { headers: { Authorization: token } });
    setNewNode({ hostname: '', ip: '' });
    fetchNodes();
  };
  const handleDeleteNode = async (id: string) => {
    await axios.delete(`/api/nodes/${id}`, { headers: { Authorization: token } });
    fetchNodes();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>集群管理</Typography>
      <Stack direction="row" spacing={2} mb={2}>
        <TextField label="新集群名称" value={newCluster} onChange={e => setNewCluster(e.target.value)} size="small" />
        <Button variant="contained" onClick={handleAddCluster} disabled={!newCluster}>添加集群</Button>
      </Stack>
      <Paper variant="outlined" sx={{ mb: 3 }}>
        <List>
          {clusters.map((c) => (
            <ListItem key={c.id} secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCluster(c.id)}>
                <DeleteIcon />
              </IconButton>
            }>
              <ListItemText primary={c.name} secondary={`节点数: ${c.nodes.length}`} />
            </ListItem>
          ))}
          {clusters.length === 0 && <ListItem><ListItemText primary="暂无集群" /></ListItem>}
        </List>
      </Paper>
      <Typography variant="h6">节点管理</Typography>
      <Stack direction="row" spacing={2} mb={2}>
        <TextField label="主机名" value={newNode.hostname} onChange={e => setNewNode({ ...newNode, hostname: e.target.value })} size="small" />
        <TextField label="IP地址" value={newNode.ip} onChange={e => setNewNode({ ...newNode, ip: e.target.value })} size="small" />
        <Button variant="contained" onClick={handleAddNode} disabled={!newNode.hostname || !newNode.ip}>添加节点</Button>
      </Stack>
      <Paper variant="outlined">
        <List>
          {nodes.map((n) => (
            <ListItem key={n.id} secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteNode(n.id)}>
                <DeleteIcon />
              </IconButton>
            }>
              <ListItemText primary={n.hostname} secondary={`IP: ${n.ip} 状态: ${n.status}`} />
            </ListItem>
          ))}
          {nodes.length === 0 && <ListItem><ListItemText primary="暂无节点" /></ListItem>}
        </List>
      </Paper>
    </Box>
  );
}

function SpiceSessionManager() {
  const [sessions, setSessions] = React.useState<any[]>([]);
  const [newName, setNewName] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    const res = await axios.get('/api/spice/sessions');
    setSessions(res.data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchSessions();
  }, []);

  const handleCreate = async () => {
    if (!newName) return;
    await axios.post('/api/spice/sessions', { name: newName });
    setNewName('');
    fetchSessions();
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/spice/sessions/${id}`);
    fetchSessions();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>SPICE 会话管理</Typography>
      <Stack direction="row" spacing={2} mb={2}>
        <TextField label="新会话名称" value={newName} onChange={e => setNewName(e.target.value)} size="small" />
        <Button variant="contained" onClick={handleCreate} disabled={!newName}>新建会话</Button>
      </Stack>
      <Paper variant="outlined">
        <List>
          {sessions.map((s) => (
            <ListItem key={s.id} secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(s.id)}>
                <DeleteIcon />
              </IconButton>
            }>
              <ListItemText primary={s.name} secondary={`状态: ${s.status}`} />
            </ListItem>
          ))}
          {sessions.length === 0 && <ListItem><ListItemText primary="暂无会话" /></ListItem>}
        </List>
      </Paper>
    </Box>
  );
}

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<any>(null);
  const [loginOpen, setLoginOpen] = useState(!token);

  useEffect(() => {
    if (token) {
      axios.get('/api/userinfo', { headers: { Authorization: token } })
        .then(res => setUser(res.data))
        .catch(() => { setToken(null); setLoginOpen(true); });
    }
  }, [token]);

  const handleLogin = (tk: string, user: any) => {
    setToken(tk);
    setUser(user);
    localStorage.setItem('token', tk);
    setLoginOpen(false);
  };
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    setLoginOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            管理后台
          </Typography>
          {user && <Button color="inherit" onClick={handleLogout}>退出登录</Button>}
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {!token && <LoginDialog open={loginOpen} onLogin={handleLogin} />}
          {token && user && <>
            <Typography variant="h4" gutterBottom>欢迎，{user.username}</Typography>
            <Typography variant="body1" gutterBottom>角色：{user.roles.join(', ')}</Typography>
            <Box mt={4}><ClusterManager token={token} /></Box>
            <Box mt={4}><SpiceSessionManager /></Box>
          </>}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
