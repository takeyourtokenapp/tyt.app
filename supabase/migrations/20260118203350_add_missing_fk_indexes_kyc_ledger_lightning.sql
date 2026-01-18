/*
  # Add Missing Foreign Key Indexes - KYC, Ledger & Lightning
  
  ## Changes
  - kyc_documents: reviewed_by
  - ledger_entries: account_id
  - lightning_invoices: node_id, user_id
*/

CREATE INDEX IF NOT EXISTS idx_kyc_documents_reviewed_by 
  ON kyc_documents(reviewed_by);

CREATE INDEX IF NOT EXISTS idx_ledger_entries_account_id 
  ON ledger_entries(account_id);

CREATE INDEX IF NOT EXISTS idx_lightning_invoices_node_id 
  ON lightning_invoices(node_id);

CREATE INDEX IF NOT EXISTS idx_lightning_invoices_user_id 
  ON lightning_invoices(user_id);
