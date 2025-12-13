/*
  # Seed Academy Quiz Questions

  1. Purpose
    - Add sample quiz questions for Bitcoin basics lessons
    - Enable immediate testing of quiz functionality
    
  2. Notes
    - Questions are tied to existing lessons from previous seeds
    - Each lesson gets 3-5 questions
    - Questions test understanding of key concepts
*/

DO $$
DECLARE
  v_lesson_id uuid;
BEGIN
  SELECT id INTO v_lesson_id FROM academy_lessons WHERE slug = 'what-is-bitcoin' LIMIT 1;
  
  IF v_lesson_id IS NOT NULL THEN
    INSERT INTO academy_quiz_questions (lesson_id, question_text, options, correct_answer_index, explanation, display_order) VALUES
    (v_lesson_id, 'What is Bitcoin?', '["A physical coin", "A digital currency", "A bank", "A credit card company"]', 1, 'Bitcoin is a decentralized digital currency that operates without a central authority.', 1),
    (v_lesson_id, 'Who created Bitcoin?', '["Elon Musk", "Bill Gates", "Satoshi Nakamoto", "Vitalik Buterin"]', 2, 'Bitcoin was created by an anonymous person or group using the pseudonym Satoshi Nakamoto in 2009.', 2),
    (v_lesson_id, 'What is the maximum supply of Bitcoin?', '["Unlimited", "21 million", "100 million", "1 billion"]', 1, 'Bitcoin has a fixed maximum supply of 21 million coins, making it a deflationary asset.', 3),
    (v_lesson_id, 'What technology does Bitcoin use?', '["Cloud computing", "Artificial Intelligence", "Blockchain", "Quantum computing"]', 2, 'Bitcoin uses blockchain technology, a distributed ledger that records all transactions.', 4);
  END IF;

  SELECT id INTO v_lesson_id FROM academy_lessons WHERE slug = 'how-blockchain-works' LIMIT 1;
  
  IF v_lesson_id IS NOT NULL THEN
    INSERT INTO academy_quiz_questions (lesson_id, question_text, options, correct_answer_index, explanation, display_order) VALUES
    (v_lesson_id, 'What is a blockchain?', '["A type of chain", "A distributed database", "A programming language", "A mining tool"]', 1, 'A blockchain is a distributed database that maintains a continuously growing list of ordered records called blocks.', 1),
    (v_lesson_id, 'What connects blocks in a blockchain?', '["Ropes", "Cryptographic hashes", "URLs", "Email addresses"]', 1, 'Each block contains a cryptographic hash of the previous block, creating a secure chain.', 2),
    (v_lesson_id, 'Can blockchain data be altered?', '["Yes, easily", "No, it is immutable", "Only by admins", "Only on weekends"]', 1, 'Blockchain data is immutable - once recorded, it cannot be altered without changing all subsequent blocks.', 3),
    (v_lesson_id, 'What validates transactions on Bitcoin blockchain?', '["Banks", "Miners", "Government", "Credit card companies"]', 1, 'Miners validate transactions by solving complex mathematical problems in a process called Proof of Work.', 4);
  END IF;

  SELECT id INTO v_lesson_id FROM academy_lessons WHERE slug = 'bitcoin-wallets-basics' LIMIT 1;
  
  IF v_lesson_id IS NOT NULL THEN
    INSERT INTO academy_quiz_questions (lesson_id, question_text, options, correct_answer_index, explanation, display_order) VALUES
    (v_lesson_id, 'What is a Bitcoin wallet?', '["A physical wallet", "Software that stores private keys", "A bank account", "A credit card"]', 1, 'A Bitcoin wallet is software that stores your private keys and allows you to send and receive Bitcoin.', 1),
    (v_lesson_id, 'What is a private key?', '["A house key", "A secret code to access your Bitcoin", "A password", "A username"]', 1, 'A private key is a secret cryptographic code that proves ownership of your Bitcoin.', 2),
    (v_lesson_id, 'Should you share your private key?', '["Yes, with friends", "Yes, with exchanges", "No, never", "Only on social media"]', 2, 'You should NEVER share your private key with anyone. Anyone with your private key can access your Bitcoin.', 3),
    (v_lesson_id, 'What type of wallet is most secure for large amounts?', '["Web wallet", "Mobile wallet", "Hardware wallet", "Paper note"]', 2, 'Hardware wallets are the most secure for storing large amounts as they keep private keys offline.', 4);
  END IF;

  SELECT id INTO v_lesson_id FROM academy_lessons WHERE slug = 'what-is-mining' LIMIT 1;
  
  IF v_lesson_id IS NOT NULL THEN
    INSERT INTO academy_quiz_questions (lesson_id, question_text, options, correct_answer_index, explanation, display_order) VALUES
    (v_lesson_id, 'What is Bitcoin mining?', '["Digging for coins", "Validating transactions and creating new blocks", "Trading Bitcoin", "Buying Bitcoin"]', 1, 'Bitcoin mining is the process of validating transactions and adding them to the blockchain while creating new Bitcoin.', 1),
    (v_lesson_id, 'What do miners receive as reward?', '["Free electricity", "New Bitcoin and transaction fees", "Gold coins", "Gift cards"]', 1, 'Miners receive newly created Bitcoin (block reward) plus transaction fees from the transactions they include in blocks.', 2),
    (v_lesson_id, 'What is the Bitcoin halving?', '["Price drops by half", "Block reward cuts in half", "Network speed halves", "Mining difficulty halves"]', 1, 'The Bitcoin halving is an event that occurs every 210,000 blocks where the block reward is cut in half.', 3),
    (v_lesson_id, 'What equipment is used for Bitcoin mining?', '["Regular computers", "ASIC miners", "Smartphones", "Calculators"]', 1, 'ASIC (Application-Specific Integrated Circuit) miners are specialized hardware designed specifically for Bitcoin mining.', 4);
  END IF;

END $$;
