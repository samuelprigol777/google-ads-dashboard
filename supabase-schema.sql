-- Google Ads Dashboard - Supabase Schema
-- Execute this in the Supabase SQL Editor

-- Accounts table
CREATE TABLE accounts (
  id BIGSERIAL PRIMARY KEY,
  google_ads_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  currency TEXT DEFAULT 'BRL',
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  status TEXT DEFAULT 'ENABLED',
  parent_mcc TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE campaigns (
  id BIGSERIAL PRIMARY KEY,
  account_id BIGINT REFERENCES accounts(id) ON DELETE CASCADE,
  google_campaign_id TEXT,
  name TEXT NOT NULL,
  type TEXT, -- SEARCH, DISPLAY, PERFORMANCE_MAX, VIDEO, SHOPPING, DEMAND_GEN
  status TEXT DEFAULT 'ENABLED',
  daily_budget NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, name)
);

-- Campaign metrics (daily snapshots)
CREATE TABLE campaign_metrics (
  id BIGSERIAL PRIMARY KEY,
  campaign_id BIGINT REFERENCES campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr NUMERIC(8,4) DEFAULT 0,
  avg_cpc NUMERIC(12,2) DEFAULT 0,
  conversions NUMERIC(10,1) DEFAULT 0,
  cost NUMERIC(12,2) DEFAULT 0,
  cpa NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, date)
);

-- Search terms
CREATE TABLE search_terms (
  id BIGSERIAL PRIMARY KEY,
  account_id BIGINT REFERENCES accounts(id) ON DELETE CASCADE,
  campaign_name TEXT,
  ad_group TEXT,
  term TEXT NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr NUMERIC(8,4) DEFAULT 0,
  conversions NUMERIC(10,1) DEFAULT 0,
  cost NUMERIC(12,2) DEFAULT 0,
  date_from DATE,
  date_to DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Keywords quality score
CREATE TABLE keywords_quality (
  id BIGSERIAL PRIMARY KEY,
  account_id BIGINT REFERENCES accounts(id) ON DELETE CASCADE,
  campaign_name TEXT,
  ad_group TEXT,
  keyword TEXT NOT NULL,
  quality_score INTEGER,
  expected_ctr TEXT,
  ad_relevance TEXT,
  landing_page_exp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sync log
CREATE TABLE sync_log (
  id BIGSERIAL PRIMARY KEY,
  account_id BIGINT REFERENCES accounts(id) ON DELETE CASCADE,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'success',
  records_count INTEGER DEFAULT 0,
  details TEXT
);

-- Indexes for performance
CREATE INDEX idx_campaign_metrics_date ON campaign_metrics(date);
CREATE INDEX idx_campaign_metrics_campaign ON campaign_metrics(campaign_id);
CREATE INDEX idx_search_terms_account ON search_terms(account_id);
CREATE INDEX idx_keywords_quality_account ON keywords_quality(account_id);
CREATE INDEX idx_campaigns_account ON campaigns(account_id);

-- RLS policies (allow read access via anon key)
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords_quality ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON accounts FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON campaign_metrics FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON search_terms FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON keywords_quality FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON sync_log FOR SELECT USING (true);

-- Insert the two accounts
INSERT INTO accounts (google_ads_id, name, currency, timezone, status) VALUES
  ('1206981886', 'Y-U-P Cosméticos', 'BRL', 'America/Sao_Paulo', 'ENABLED'),
  ('7502967093', 'Zanfir (Ótica Erechim)', 'BRL', 'America/Sao_Paulo', 'ENABLED');
