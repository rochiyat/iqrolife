-- ============================================
-- PHASE 1 MIGRATION: Payment Management
-- Date: 2024-11-29
-- Purpose: Track all payments with verification workflow
-- ============================================

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES calon_murid(id) ON DELETE CASCADE,
  payment_type VARCHAR(50) NOT NULL, -- registration, tuition, monthly, annual, etc.
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'IDR',
  payment_method VARCHAR(50), -- transfer, cash, credit_card, etc.
  payment_date DATE,
  proof_url TEXT,
  proof_public_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  verified_by INTEGER REFERENCES users(id),
  verified_at TIMESTAMP,
  notes TEXT,
  reference_number VARCHAR(100),
  bank_name VARCHAR(100),
  account_name VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_type ON payments(payment_type);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Create trigger for auto-update timestamps
CREATE TRIGGER update_payments_updated_at 
  BEFORE UPDATE ON payments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE payments IS 'Track all payments with verification workflow and financial reporting';
COMMENT ON COLUMN payments.student_id IS 'Reference to calon_murid (student)';
COMMENT ON COLUMN payments.payment_type IS 'Type of payment: registration, tuition, monthly, annual, etc.';
COMMENT ON COLUMN payments.amount IS 'Payment amount in specified currency';
COMMENT ON COLUMN payments.status IS 'Verification status: pending, verified, rejected';
COMMENT ON COLUMN payments.verified_by IS 'Admin who verified the payment';
COMMENT ON COLUMN payments.reference_number IS 'Bank transfer reference number or transaction ID';

-- ============================================
-- USAGE EXAMPLES:
-- ============================================

-- Record payment
-- INSERT INTO payments (student_id, payment_type, amount, payment_method, payment_date, proof_url, reference_number)
-- VALUES (1, 'registration', 500000, 'transfer', '2024-11-29', 'https://...', 'TRX123456');

-- Verify payment
-- UPDATE payments 
-- SET status = 'verified', verified_by = 1, verified_at = NOW()
-- WHERE id = 1;

-- Get all payments for student
-- SELECT * FROM payments WHERE student_id = 1 ORDER BY payment_date DESC;

-- Get pending payments
-- SELECT * FROM payments WHERE status = 'pending';

-- Financial report
-- SELECT 
--   payment_type,
--   COUNT(*) as total_transactions,
--   SUM(amount) as total_amount
-- FROM payments
-- WHERE status = 'verified'
-- GROUP BY payment_type;
