const express = require('express');
const router = express.Router();

// Get user points
router.get('/points', async (req, res) => {
  const { data: { user } } = await req.supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const { data, error } = await req.supabase.from('profiles').select('points').eq('user_id', user.id).single();
  if (error) return res.status(400).json({ error });
  res.json(data);
});

// Get missions
router.get('/missions', async (req, res) => {
  const { data: { user } } = await req.supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const { data, error } = await req.supabase.from('missions').select('*');
  if (error) return res.status(400).json({ error });
  // Get completed
  const { data: completed } = await req.supabase.from('user_missions').select('mission_id').eq('user_id', user.id);
  const completedIds = completed.map(c => c.mission_id);
  res.json(data.map(m => ({ ...m, completed: completedIds.includes(m.id) })));
});

// Claim mission
router.post('/claim-mission', async (req, res) => {
    const { missionId } = req.body;
    const { data: { user } } = await req.supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
  
    // Check if already claimed
    const { count, error: countError } = await req.supabase
      .from('user_missions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('mission_id', missionId);
  
    if (countError) return res.status(400).json({ error: countError.message });
    if (count > 0) return res.status(400).json({ error: 'Already claimed' });
  
    // Get mission points
    const { data: mission, error: missionError } = await req.supabase
      .from('missions')
      .select('points')
      .eq('id', missionId)
      .single();
  
    if (missionError) return res.status(400).json({ error: missionError.message });
  
    // Get current points and increment
    const { data: profile, error: profileError } = await req.supabase
      .from('profiles')
      .select('points')
      .eq('user_id', user.id)
      .single();
  
    if (profileError) return res.status(400).json({ error: profileError.message });
  
    const newPoints = profile.points + mission.points;
  
    // Update points
    const { error: updateError } = await req.supabase
      .from('profiles')
      .update({ points: newPoints })
      .eq('user_id', user.id);
  
    if (updateError) return res.status(400).json({ error: updateError.message });
  
    // Insert completion
    const { error: insertError } = await req.supabase
      .from('user_missions')
      .insert({ user_id: user.id, mission_id: missionId });
  
    if (insertError) return res.status(400).json({ error: insertError.message });
  
    res.json({ success: true });
  });

// Get rewards
router.get('/rewards', async (req, res) => {
  const { data, error } = await req.supabase.from('rewards').select('*');
  if (error) return res.status(400).json({ error });
  res.json(data);
});

// Redeem reward
router.post('/redeem', async (req, res) => {
    const { rewardId } = req.body;
    const { data: { user } } = await req.supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
  
    const { data: reward, error: rewardError } = await req.supabase
      .from('rewards')
      .select('cost')
      .eq('id', rewardId)
      .single();
  
    if (rewardError) return res.status(400).json({ error: rewardError.message });
  
    const { data: profile, error: profileError } = await req.supabase
      .from('profiles')
      .select('points')
      .eq('user_id', user.id)
      .single();
  
    if (profileError) return res.status(400).json({ error: profileError.message });
    if (profile.points < reward.cost) return res.status(400).json({ error: 'Insufficient points' });
  
    const newPoints = profile.points - reward.cost;
  
    const { error: updateError } = await req.supabase
      .from('profiles')
      .update({ points: newPoints })
      .eq('user_id', user.id);
  
    if (updateError) return res.status(400).json({ error: updateError.message });
  
    // Add real redemption logic here if needed (e.g., insert into redemptions table)
  
    res.json({ success: true });
  });


// Get user profile (points + display_name)
router.get('/profile', async (req, res) => {
    const { data: { user } } = await req.supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const { data, error } = await req.supabase.from('profiles').select('points, display_name').eq('user_id', user.id).single();
    if (error) return res.status(400).json({ error });
    res.json({ ...data, email: user.email });
  });
  
  // Update profile (display_name)
  router.post('/profile', async (req, res) => {
    const { display_name } = req.body;
    const { data: { user } } = await req.supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const { error } = await req.supabase.from('profiles').update({ display_name }).eq('user_id', user.id);
    if (error) return res.status(400).json({ error });
    res.json({ success: true });
  });

module.exports = router;