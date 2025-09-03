-- Create the contract_analyses table
CREATE TABLE IF NOT EXISTS contract_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contracts JSONB NOT NULL,
  total_savings DECIMAL(12,2),
  total_spend DECIMAL(12,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the vendors table for reference data
CREATE TABLE IF NOT EXISTS vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,
  features TEXT[],
  avg_price_per_user DECIMAL(10,2),
  market_position VARCHAR(50) CHECK (market_position IN ('Premium', 'Standard', 'Budget')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the user_sessions table for tracking mobile app users
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  device_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contract_analyses_created_at ON contract_analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(category);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);

-- Insert vendor data
INSERT INTO vendors (name, category, features, avg_price_per_user, market_position) VALUES
('Slack', 'Communication', ARRAY['Team Messaging', 'File Sharing', 'App Integration'], 8.75, 'Standard'),
('Zoom', 'Communication', ARRAY['Video Conferencing', 'Screen Sharing', 'Recording'], 15.00, 'Standard'),
('Salesforce', 'CRM', ARRAY['Contact Management', 'Sales Pipeline', 'Email Marketing'], 80.00, 'Premium'),
('HubSpot', 'CRM', ARRAY['Contact Management', 'Email Marketing', 'Landing Pages'], 20.00, 'Standard'),
('Asana', 'Project Management', ARRAY['Task Management', 'Team Collaboration', 'Timeline View'], 24.00, 'Standard'),
('Jira', 'Project Management', ARRAY['Issue Tracking', 'Agile Planning', 'Reporting'], 14.00, 'Standard'),
('Datadog', 'Observability & Monitoring', ARRAY['APM', 'Infrastructure', 'Log Management'], 46.00, 'Standard'),
('New Relic', 'Observability & Monitoring', ARRAY['APM', 'Infrastructure', 'Logs & Metrics'], 99.00, 'Standard'),
('Mailchimp', 'Email Marketing', ARRAY['Email Marketing', 'Automation', 'Landing Pages'], 20.00, 'Standard'),
('Klaviyo', 'Email Marketing', ARRAY['E-commerce Personalization', 'SMS Marketing', 'Advanced Segmentation'], 45.00, 'Premium')
ON CONFLICT (name) DO NOTHING;
