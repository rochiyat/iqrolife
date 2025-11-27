-- Add password_reset_tokens table for forgot password functionality

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  used_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Add comment
COMMENT ON TABLE password_reset_tokens IS 'Tabel untuk menyimpan token reset password';
COMMENT ON COLUMN password_reset_tokens.token IS 'Token unik untuk reset password (32 bytes hex)';
COMMENT ON COLUMN password_reset_tokens.expires_at IS 'Waktu kadaluarsa token (1 jam dari pembuatan)';
COMMENT ON COLUMN password_reset_tokens.used IS 'Status apakah token sudah digunakan';
