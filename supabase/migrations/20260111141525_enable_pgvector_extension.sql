/*
  # Enable pgvector Extension

  1. Extension
    - Enable `vector` extension for embeddings storage and similarity search
  
  Note: This is required before any VECTOR data types can be used
*/

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;