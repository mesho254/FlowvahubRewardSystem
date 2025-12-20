const express = require('express');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password, redirectTo } = req.body;
  const { data, error } = await req.supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: redirectTo + '/auth/confirm' }
  });
  if (error) return res.status(400).json({ error: error.message });
  if (data.user) {
    await req.supabase.from('profiles').insert({ user_id: data.user.id, points: 0 });
  }
  res.json(data);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await req.supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.post('/logout', async (req, res) => {
  const { error } = await req.supabase.auth.signOut();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Logged out' });
});

router.post('/resend-confirmation', async (req, res) => {
  const { email } = req.body;
  const { data, error } = await req.supabase.auth.resend({
    type: 'signup',
    email,
  });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.post('/refresh', async (req, res) => {
  const { refresh_token } = req.body;
  const { data, error } = await req.supabase.auth.refreshSession({ refresh_token });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// New: Change password
router.post('/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { data: { user } } = await req.supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  // Verify current password by signing in
  const { error: signInError } = await req.supabase.auth.signInWithPassword({ email: user.email, password: currentPassword });
  if (signInError) return res.status(400).json({ error: 'Current password incorrect' });
  // Update password
  const { error } = await req.supabase.auth.updateUser({ password: newPassword });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;