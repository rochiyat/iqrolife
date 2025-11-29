-- ============================================
-- PHASE 1 MIGRATION: Notifications System
-- Date: 2024-11-29
-- Purpose: Track all notifications with delivery status
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- email, sms, push, in_app
  channel VARCHAR(50) NOT NULL, -- email, whatsapp, telegram, etc.
  subject VARCHAR(255),
  message TEXT NOT NULL,
  data JSONB, -- Additional data (links, buttons, etc.)
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'read')),
  sent_at TIMESTAMP,
  read_at TIMESTAMP,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_sent_at ON notifications(sent_at);

-- Add comments
COMMENT ON TABLE notifications IS 'Track all notifications with delivery status and read receipts';
COMMENT ON COLUMN notifications.user_id IS 'Reference to user who receives the notification';
COMMENT ON COLUMN notifications.type IS 'Notification type: email, sms, push, in_app';
COMMENT ON COLUMN notifications.channel IS 'Delivery channel: email, whatsapp, telegram, etc.';
COMMENT ON COLUMN notifications.status IS 'Delivery status: pending, sent, failed, read';
COMMENT ON COLUMN notifications.data IS 'Additional data in JSON format (links, buttons, metadata)';
COMMENT ON COLUMN notifications.retry_count IS 'Number of retry attempts for failed notifications';

-- ============================================
-- USAGE EXAMPLES:
-- ============================================

-- Send notification
-- INSERT INTO notifications (user_id, type, channel, subject, message, data)
-- VALUES (1, 'email', 'email', 'Welcome!', 'Welcome to Iqrolife', '{"action_url": "https://..."}'::jsonb);

-- Mark as sent
-- UPDATE notifications 
-- SET status = 'sent', sent_at = NOW()
-- WHERE id = 1;

-- Mark as read
-- UPDATE notifications 
-- SET status = 'read', read_at = NOW()
-- WHERE id = 1;

-- Get unread notifications
-- SELECT * FROM notifications 
-- WHERE user_id = 1 AND status != 'read'
-- ORDER BY created_at DESC;

-- Get failed notifications for retry
-- SELECT * FROM notifications 
-- WHERE status = 'failed' AND retry_count < 3;

-- Notification statistics
-- SELECT 
--   type,
--   status,
--   COUNT(*) as total
-- FROM notifications
-- GROUP BY type, status;
