export default {
  id: 'data-types',
  title: '198. Data Types',
  explanation: `Every column in a MySQL table has a data type that defines what kind of data it stores. Choosing the right type saves storage, enforces constraints, and improves query performance.

**Numeric Types:**
| Type | Storage | Range |
|------|---------|-------|
| TINYINT | 1 byte | -128 to 127 (signed) |
| SMALLINT | 2 bytes | -32,768 to 32,767 |
| INT | 4 bytes | ~-2.1B to ~2.1B |
| BIGINT | 8 bytes | ~-9.2 quintillion |
| DECIMAL(p,s) | variable | Exact; p=total digits, s=decimal places |
| FLOAT / DOUBLE | 4/8 bytes | Approximate; not for money |

Use DECIMAL for money, FLOAT/DOUBLE only for scientific measurements.

**String Types:**
| Type | Notes |
|------|-------|
| VARCHAR(n) | Variable-length, up to n chars. Most common. |
| CHAR(n) | Fixed-length, always n chars (padded). Good for codes like 'US', 'CA'. |
| TEXT | Up to 65,535 chars. Cannot be indexed directly or have a default. |
| ENUM('a','b') | Stores one value from a fixed list. Efficient but inflexible. |

**Date/Time Types:**
| Type | Format | Notes |
|------|--------|-------|
| DATE | YYYY-MM-DD | Date only |
| DATETIME | YYYY-MM-DD HH:MM:SS | Date + time, no timezone |
| TIMESTAMP | YYYY-MM-DD HH:MM:SS | Auto-converts to/from UTC; good for audit fields |
| TIME | HH:MM:SS | Duration or time of day |
| YEAR | YYYY | Just the year |

**Boolean:**
MySQL has no true BOOLEAN type — it uses TINYINT(1). Values 0 = false, 1 = true. The keyword BOOL is an alias.

**Best practices:**
- Use INT UNSIGNED for IDs (doubles the positive range at no extra cost).
- Use VARCHAR over CHAR for most strings; use CHAR only for fixed-length codes.
- Prefer TIMESTAMP over DATETIME for created_at/updated_at fields — it auto-converts to UTC.
- Never use FLOAT/DOUBLE for monetary values — use DECIMAL(10,2) instead.`,
  code: `-- ===== MySQL Data Types =====

-- 1. Numeric types
CREATE TABLE numeric_demo (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    age           TINYINT UNSIGNED,         -- 0–255, no negatives for age
    salary        DECIMAL(10, 2) NOT NULL,  -- exact: 10 total digits, 2 decimal
    rating        FLOAT,                    -- approximate (OK for non-critical stats)
    total_orders  BIGINT UNSIGNED DEFAULT 0
);

-- 2. String types
CREATE TABLE string_demo (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(50) NOT NULL,   -- variable-length, up to 50 chars
    country_code  CHAR(2),               -- always 2 chars: 'US', 'IN', 'GB'
    bio           TEXT,                  -- up to 65,535 chars
    status        ENUM('active', 'inactive', 'banned') DEFAULT 'active'
);

-- 3. Date and time types
CREATE TABLE event_demo (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    event_date   DATE,                   -- '2026-06-30'
    start_time   TIME,                   -- '14:30:00'
    event_at     DATETIME,               -- '2026-06-30 14:30:00' (no tz)
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      -- auto-set on INSERT
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                 ON UPDATE CURRENT_TIMESTAMP               -- auto-set on UPDATE
);

-- 4. Boolean (stored as TINYINT(1))
CREATE TABLE user_flags (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    is_admin     BOOLEAN DEFAULT FALSE,   -- stored as 0 or 1
    is_verified  TINYINT(1) DEFAULT 0
);

-- 5. Insert and retrieve
INSERT INTO numeric_demo (age, salary, rating) VALUES (25, 75000.00, 4.5);
INSERT INTO string_demo (username, country_code, status) VALUES ('alice', 'US', 'active');
INSERT INTO event_demo (event_date, start_time, event_at) VALUES ('2026-07-01', '09:00:00', '2026-07-01 09:00:00');

-- 6. DECIMAL precision matters for money
SELECT 0.1 + 0.2;            -- FLOAT result: 0.30000000000000004 (imprecise)
SELECT CAST(0.1 AS DECIMAL(10,1)) + CAST(0.2 AS DECIMAL(10,1));  -- exact: 0.3`,
  codeTitle: 'MySQL Data Types in Practice',
  points: [
    'Use INT UNSIGNED for auto-increment IDs — doubles the positive range at no extra cost',
    'DECIMAL(p,s) stores exact values and is the only correct choice for monetary amounts',
    'FLOAT and DOUBLE are approximate — never use them for prices, balances, or anything requiring exactness',
    'VARCHAR(n) is variable-length (good for most strings); CHAR(n) is fixed-length (good for country/state codes)',
    'TIMESTAMP auto-converts to/from UTC and auto-sets on INSERT/UPDATE — use it for created_at/updated_at',
    'MySQL has no native BOOLEAN — it uses TINYINT(1) where 0=false, 1=true',
    'TEXT columns cannot have DEFAULT values or be directly indexed (use VARCHAR if you need those features)',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Never store prices or financial values as FLOAT or DOUBLE. Floating-point arithmetic is inherently imprecise — 0.1 + 0.2 does not equal exactly 0.3. Use DECIMAL(10,2) for currency to get exact decimal arithmetic.',
    },
    {
      type: 'tip',
      content: 'Use TIMESTAMP with DEFAULT CURRENT_TIMESTAMP and ON UPDATE CURRENT_TIMESTAMP for created_at and updated_at columns. MySQL will automatically fill and update these fields on every INSERT and UPDATE, saving you from doing it in application code.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between CHAR and VARCHAR?\nA: CHAR(n) always stores exactly n characters — shorter values are right-padded with spaces. VARCHAR(n) stores only as many bytes as needed plus 1-2 bytes for length. Use CHAR for values that are always the same length (ISO country codes, fixed codes). Use VARCHAR for everything else.',
    },
  ],
}
