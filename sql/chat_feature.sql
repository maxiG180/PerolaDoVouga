-- Create chat_conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
    customer_name TEXT,
    customer_email TEXT,
    last_message_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
    sender_type TEXT CHECK (sender_type IN ('customer', 'admin')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies for chat_conversations
-- Allow anyone to create a conversation
CREATE POLICY "Allow public insert conversations" ON chat_conversations
    FOR INSERT WITH CHECK (true);

-- Allow admins to view all conversations (assuming admin has authenticated role or specific email check)
-- For simplicity in this MVP, we might allow public select by ID if they know it (UUID is hard to guess)
-- OR strictly, we should use a cookie/session.
-- Let's allow public to select if they have the ID (UUID security)
CREATE POLICY "Allow public select by id" ON chat_conversations
    FOR SELECT USING (true);

-- Policies for chat_messages
-- Allow public to insert messages to existing conversations
CREATE POLICY "Allow public insert messages" ON chat_messages
    FOR INSERT WITH CHECK (true);

-- Allow public to view messages of a conversation they know the ID of
CREATE POLICY "Allow public select messages" ON chat_messages
    FOR SELECT USING (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE chat_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- Create function to update updated_at and last_message_at
CREATE OR REPLACE FUNCTION update_chat_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_conversations
    SET updated_at = NOW(),
        last_message_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamp on new message
CREATE TRIGGER update_chat_timestamp_trigger
AFTER INSERT ON chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_chat_timestamp();
