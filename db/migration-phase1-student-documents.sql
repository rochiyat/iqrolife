-- ============================================
-- PHASE 1 MIGRATION: Student Documents Management
-- Date: 2024-11-29
-- Purpose: Track uploaded documents per student
-- ============================================

CREATE TABLE IF NOT EXISTS student_documents (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES calon_murid(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL, -- birth_cert, health_cert, photo, payment_proof, etc.
  file_url TEXT NOT NULL,
  file_public_id VARCHAR(255),
  file_name VARCHAR(255),
  file_size INTEGER,
  mime_type VARCHAR(100),
  uploaded_by INTEGER REFERENCES users(id),
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  verified_by INTEGER REFERENCES users(id),
  verified_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT unique_student_document_type UNIQUE (student_id, document_type)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_student_documents_student_id ON student_documents(student_id);
CREATE INDEX IF NOT EXISTS idx_student_documents_status ON student_documents(status);
CREATE INDEX IF NOT EXISTS idx_student_documents_type ON student_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_student_documents_uploaded_at ON student_documents(uploaded_at);

-- Create trigger for auto-update timestamps
CREATE TRIGGER update_student_documents_updated_at 
  BEFORE UPDATE ON student_documents 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE student_documents IS 'Track all uploaded documents per student with verification workflow';
COMMENT ON COLUMN student_documents.student_id IS 'Reference to calon_murid (student)';
COMMENT ON COLUMN student_documents.document_type IS 'Type of document: birth_cert, health_cert, photo, payment_proof, etc.';
COMMENT ON COLUMN student_documents.status IS 'Verification status: pending, approved, rejected';
COMMENT ON COLUMN student_documents.uploaded_by IS 'User who uploaded the document (parent or admin)';
COMMENT ON COLUMN student_documents.verified_by IS 'Admin who verified the document';

-- ============================================
-- USAGE EXAMPLES:
-- ============================================

-- Upload document
-- INSERT INTO student_documents (student_id, document_type, file_url, file_public_id, file_name, uploaded_by)
-- VALUES (1, 'birth_cert', 'https://...', 'cloudinary_id', 'birth_certificate.pdf', 4);

-- Verify document
-- UPDATE student_documents 
-- SET status = 'approved', verified_by = 1, verified_at = NOW()
-- WHERE id = 1;

-- Get all documents for student
-- SELECT * FROM student_documents WHERE student_id = 1;

-- Get pending documents
-- SELECT * FROM student_documents WHERE status = 'pending';
