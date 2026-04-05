-- PA CareRate Transparency Platform — D1 Schema

CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rate REAL NOT NULL,
    state TEXT NOT NULL DEFAULT 'PA',
    county TEXT NOT NULL,
    employer_name_raw TEXT,
    employer_name TEXT,
    job_type TEXT,
    hours_per_week INTEGER,
    benefits TEXT,
    satisfaction INTEGER CHECK (satisfaction IS NULL OR (satisfaction >= 1 AND satisfaction <= 5)),
    account_id INTEGER,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'flagged', 'removed')),
    ip_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX idx_submissions_county_status ON submissions(county, status);
CREATE INDEX idx_submissions_ip_hash ON submissions(ip_hash);
CREATE INDEX idx_submissions_created_at ON submissions(created_at);

CREATE TABLE IF NOT EXISTS rate_limits (
    ip_hash TEXT PRIMARY KEY,
    submission_count INTEGER NOT NULL DEFAULT 1,
    window_start TEXT NOT NULL
);
