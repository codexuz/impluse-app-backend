-- =============================================================================
-- SpeechSuper seed data: topics + questions
-- =============================================================================
-- Run against the impulse database (the speechsuper_topics / speechsuper_questions
-- tables must already exist — they are created by Sequelize sync/migration).
--
-- Notes:
--   * IDs are generated with MySQL UUID() and captured into @vars so the child
--     questions link to the right topic_id.
--   * Scripted parts (word/sentence/paragraph) require ref_text (the text the
--     student reads aloud). Unscripted parts (part1/2/3, general) require prompt.
--   * created_at/updated_at are set explicitly because the columns are NOT NULL
--     with no DB-level default under Sequelize.
--   * sort_order controls display ordering; is_active = 1 makes it visible.
-- =============================================================================

SET @now = NOW();

-- -----------------------------------------------------------------------------
-- TOPIC 1: Everyday Words  (category: pronunciation, scripted "word")
-- -----------------------------------------------------------------------------
SET @topic_words = UUID();

INSERT INTO `speechsuper_topics`
  (`id`, `title`, `description`, `category`, `level`, `image_url`, `sort_order`, `is_active`, `created_at`, `updated_at`)
VALUES
  (@topic_words, 'Everyday Words', 'Practise the pronunciation of common English words.', 'pronunciation', 'A2', NULL, 1, 1, @now, @now);

INSERT INTO `speechsuper_questions`
  (`id`, `topic_id`, `part_type`, `prompt`, `ref_text`, `hint`, `audio_url`, `sort_order`, `is_active`, `created_at`, `updated_at`)
VALUES
  (UUID(), @topic_words, 'word', NULL, 'hometown',     'Say it clearly: HOME-town', NULL, 1, 1, @now, @now),
  (UUID(), @topic_words, 'word', NULL, 'comfortable',  'Three syllables: COMF-ter-bul', NULL, 2, 1, @now, @now),
  (UUID(), @topic_words, 'word', NULL, 'vegetable',    'Often said VEJ-ta-bul', NULL, 3, 1, @now, @now),
  (UUID(), @topic_words, 'word', NULL, 'entrepreneur', 'on-truh-pruh-NUR', NULL, 4, 1, @now, @now),
  (UUID(), @topic_words, 'word', NULL, 'pronunciation','pruh-nun-see-AY-shun', NULL, 5, 1, @now, @now);

-- -----------------------------------------------------------------------------
-- TOPIC 2: Useful Sentences  (category: pronunciation, scripted "sentence")
-- -----------------------------------------------------------------------------
SET @topic_sentences = UUID();

INSERT INTO `speechsuper_topics`
  (`id`, `title`, `description`, `category`, `level`, `image_url`, `sort_order`, `is_active`, `created_at`, `updated_at`)
VALUES
  (@topic_sentences, 'Useful Sentences', 'Read everyday sentences aloud and improve fluency.', 'pronunciation', 'B1', NULL, 2, 1, @now, @now);

INSERT INTO `speechsuper_questions`
  (`id`, `topic_id`, `part_type`, `prompt`, `ref_text`, `hint`, `audio_url`, `sort_order`, `is_active`, `created_at`, `updated_at`)
VALUES
  (UUID(), @topic_sentences, 'sentence', NULL, 'Could you tell me how to get to the station?', 'Rising tone on the question.', NULL, 1, 1, @now, @now),
  (UUID(), @topic_sentences, 'sentence', NULL, 'I would like a cup of coffee, please.',        'Link "cup of" smoothly.', NULL, 2, 1, @now, @now),
  (UUID(), @topic_sentences, 'sentence', NULL, 'The weather has been lovely this week.',        'Stress LOVE-ly.', NULL, 3, 1, @now, @now),
  (UUID(), @topic_sentences, 'sentence', NULL, 'She sells seashells by the seashore.',          'A classic tongue-twister.', NULL, 4, 1, @now, @now);

-- -----------------------------------------------------------------------------
-- TOPIC 3: Read a Paragraph  (category: pronunciation, scripted "paragraph")
-- -----------------------------------------------------------------------------
SET @topic_paragraph = UUID();

INSERT INTO `speechsuper_topics`
  (`id`, `title`, `description`, `category`, `level`, `image_url`, `sort_order`, `is_active`, `created_at`, `updated_at`)
VALUES
  (@topic_paragraph, 'Read a Paragraph', 'Read short paragraphs aloud for fluency and rhythm.', 'pronunciation', 'B2', NULL, 3, 1, @now, @now);

INSERT INTO `speechsuper_questions`
  (`id`, `topic_id`, `part_type`, `prompt`, `ref_text`, `hint`, `audio_url`, `sort_order`, `is_active`, `created_at`, `updated_at`)
VALUES
  (UUID(), @topic_paragraph, 'paragraph', NULL,
   'Learning a new language takes time and patience. Every day you practise, you get a little better. Do not be afraid to make mistakes, because they are part of the process.',
   'Pause briefly at each full stop.', NULL, 1, 1, @now, @now),
  (UUID(), @topic_paragraph, 'paragraph', NULL,
   'The sun rose slowly over the quiet hills. Birds began to sing, and a gentle breeze moved through the trees. It was the start of a beautiful morning.',
   'Keep an even, calm rhythm.', NULL, 2, 1, @now, @now);

-- -----------------------------------------------------------------------------
-- TOPIC 4: IELTS Speaking  (category: ielts, unscripted part1/part2/part3)
-- -----------------------------------------------------------------------------
SET @topic_ielts = UUID();

INSERT INTO `speechsuper_topics`
  (`id`, `title`, `description`, `category`, `level`, `image_url`, `sort_order`, `is_active`, `created_at`, `updated_at`)
VALUES
  (@topic_ielts, 'IELTS Speaking', 'Practise IELTS Part 1, 2 and 3 questions with AI scoring.', 'ielts', '6.0', NULL, 4, 1, @now, @now);

INSERT INTO `speechsuper_questions`
  (`id`, `topic_id`, `part_type`, `prompt`, `ref_text`, `hint`, `audio_url`, `sort_order`, `is_active`, `created_at`, `updated_at`)
VALUES
  (UUID(), @topic_ielts, 'part1', 'What is your favourite food and why?',                 NULL, 'Answer in 2-3 sentences.', NULL, 1, 1, @now, @now),
  (UUID(), @topic_ielts, 'part1', 'Do you prefer living in a city or the countryside?',   NULL, 'Give a reason.', NULL, 2, 1, @now, @now),
  (UUID(), @topic_ielts, 'part2', 'Describe a place you would like to visit. You should say where it is, why you want to go there, and what you would do.', NULL, 'Speak for 1-2 minutes.', NULL, 3, 1, @now, @now),
  (UUID(), @topic_ielts, 'part3', 'How has travel changed in the last fifty years?',      NULL, 'Discuss causes and effects.', NULL, 4, 1, @now, @now);

-- -----------------------------------------------------------------------------
-- TOPIC 5: Free Speaking  (category: general, unscripted "general")
-- -----------------------------------------------------------------------------
SET @topic_general = UUID();

INSERT INTO `speechsuper_topics`
  (`id`, `title`, `description`, `category`, `level`, `image_url`, `sort_order`, `is_active`, `created_at`, `updated_at`)
VALUES
  (@topic_general, 'Free Speaking', 'Speak freely on a topic and get a fluency score.', 'general', 'B1', NULL, 5, 1, @now, @now);

INSERT INTO `speechsuper_questions`
  (`id`, `topic_id`, `part_type`, `prompt`, `ref_text`, `hint`, `audio_url`, `sort_order`, `is_active`, `created_at`, `updated_at`)
VALUES
  (UUID(), @topic_general, 'general', 'Talk about what you did last weekend.',          NULL, 'Just speak naturally.', NULL, 1, 1, @now, @now),
  (UUID(), @topic_general, 'general', 'Describe your typical day from morning to night.', NULL, 'Use time words: first, then, after that.', NULL, 2, 1, @now, @now);

-- =============================================================================
-- Verify
-- =============================================================================
-- SELECT t.title, t.category, COUNT(q.id) AS questions
-- FROM speechsuper_topics t
-- LEFT JOIN speechsuper_questions q ON q.topic_id = t.id
-- GROUP BY t.id ORDER BY t.sort_order;
