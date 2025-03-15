const supabase = require("../supabaseClient");

const register = async (req, res) => {
  const { email, password, role } = req.body;

  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });

  await supabase.from("users").insert([{ id: user.id, email, role }]);
  res.status(201).json({ message: "User registered", user });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: "Login successful", user });
};

module.exports = { register, login };
