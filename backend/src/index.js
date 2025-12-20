require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const authRoutes = require('./routes/auth');
const rewardsRoutes = require('./routes/rewards');

const app = express();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Test connection
async function testConnection() {
  try {
    const { count, error } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    if (error) throw error;
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
}
testConnection();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/rewards', rewardsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));