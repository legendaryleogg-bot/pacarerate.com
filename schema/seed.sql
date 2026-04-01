-- PA CareRate Transparency Platform — Seed Data
-- Generated: 2026-03-31
--
-- METHODOLOGY
-- -----------
-- Each of Pennsylvania's 67 counties receives exactly 6 seed submissions.
-- All seed rows carry ip_hash = 'seed' to distinguish them from real submissions.
-- Optional fields (employer_name, job_type, hours_per_week, benefits, satisfaction) are NULL.
--
-- Rate generation follows a two-step process:
--
--   Step 1 — Adjusted median
--     Each county is assigned to one of four OLTL regions, each with a base
--     median and a dollar range. A metro-type adjustment is then applied:
--       Metro core      +$0.50
--       Metro suburban  +$0.00
--       Micropolitan    -$0.25
--       Rural           -$0.50
--
--   Step 2 — Six-point distribution around adjusted median
--     Rate 1:  adjusted_median - $1.25  (low end)
--     Rate 2:  adjusted_median - $0.50
--     Rate 3:  adjusted_median - $0.25
--     Rate 4:  adjusted_median + $0.25
--     Rate 5:  adjusted_median + $0.50
--     Rate 6:  adjusted_median + $1.25  (high end)
--     All rates are clamped to the region's floor/ceiling and rounded to
--     the nearest $0.25 increment.
--
-- OLTL Region parameters:
--   Region 1 — Pittsburgh Area      Median $15.00  Range $13.50–$16.50
--   Region 2 — Rest of State        Median $16.50  Range $14.50–$18.00
--   Region 3 — Lehigh Capital       Median $15.75  Range $14.00–$17.00
--   Region 4 — Philadelphia Area    Median $16.75  Range $14.50–$18.00
--
-- Cambria County: not in spec county lists but present in canonical PA list.
--   Assigned to R1 micropolitan (Johnstown MSA). adj. median $14.75.
-- Carbon County note: listed under both R2 rural and R3 micropolitan.
--   Per the spec, Carbon is kept in R2 rural; Monroe takes R3 micropolitan.
-- Schuylkill County: listed in R2 micropolitan per spec note.
-- ---------------------------------------------------------------------------


-- ===========================================================================
-- REGION 1 — Pittsburgh Area  (Median $15.00, Range $13.50–$16.50)
-- ===========================================================================

-- Allegheny — Metro core  adj. median $15.50
-- Rates: 14.25, 15.00, 15.25, 15.75, 16.00, 16.50 (16.75 clamped to 16.50)
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.25, 'PA', 'Allegheny', 'active', 'seed'),
  (15.00, 'PA', 'Allegheny', 'active', 'seed'),
  (15.25, 'PA', 'Allegheny', 'active', 'seed'),
  (15.75, 'PA', 'Allegheny', 'active', 'seed'),
  (16.00, 'PA', 'Allegheny', 'active', 'seed'),
  (16.50, 'PA', 'Allegheny', 'active', 'seed');

-- Armstrong — Metro suburban  adj. median $15.00
-- Rates: 13.75, 14.50, 14.75, 15.25, 15.50, 16.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (13.75, 'PA', 'Armstrong', 'active', 'seed'),
  (14.50, 'PA', 'Armstrong', 'active', 'seed'),
  (14.75, 'PA', 'Armstrong', 'active', 'seed'),
  (15.25, 'PA', 'Armstrong', 'active', 'seed'),
  (15.50, 'PA', 'Armstrong', 'active', 'seed'),
  (16.25, 'PA', 'Armstrong', 'active', 'seed');

-- Beaver — Metro suburban  adj. median $15.00
-- Rates: 13.75, 14.50, 14.75, 15.25, 15.50, 16.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (13.75, 'PA', 'Beaver', 'active', 'seed'),
  (14.50, 'PA', 'Beaver', 'active', 'seed'),
  (14.75, 'PA', 'Beaver', 'active', 'seed'),
  (15.25, 'PA', 'Beaver', 'active', 'seed'),
  (15.50, 'PA', 'Beaver', 'active', 'seed'),
  (16.25, 'PA', 'Beaver', 'active', 'seed');

-- Butler — Metro suburban  adj. median $15.00
-- Rates: 13.75, 14.50, 14.75, 15.25, 15.50, 16.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (13.75, 'PA', 'Butler', 'active', 'seed'),
  (14.50, 'PA', 'Butler', 'active', 'seed'),
  (14.75, 'PA', 'Butler', 'active', 'seed'),
  (15.25, 'PA', 'Butler', 'active', 'seed'),
  (15.50, 'PA', 'Butler', 'active', 'seed'),
  (16.25, 'PA', 'Butler', 'active', 'seed');

-- Cambria — Micropolitan (Johnstown MSA, R1)  adj. median $14.75
-- Rates: 13.50, 14.25, 14.50, 15.00, 15.25, 16.00
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (13.50, 'PA', 'Cambria', 'active', 'seed'),
  (14.25, 'PA', 'Cambria', 'active', 'seed'),
  (14.50, 'PA', 'Cambria', 'active', 'seed'),
  (15.00, 'PA', 'Cambria', 'active', 'seed'),
  (15.25, 'PA', 'Cambria', 'active', 'seed'),
  (16.00, 'PA', 'Cambria', 'active', 'seed');

-- Fayette — Metro suburban  adj. median $15.00
-- Rates: 13.75, 14.50, 14.75, 15.25, 15.50, 16.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (13.75, 'PA', 'Fayette', 'active', 'seed'),
  (14.50, 'PA', 'Fayette', 'active', 'seed'),
  (14.75, 'PA', 'Fayette', 'active', 'seed'),
  (15.25, 'PA', 'Fayette', 'active', 'seed'),
  (15.50, 'PA', 'Fayette', 'active', 'seed'),
  (16.25, 'PA', 'Fayette', 'active', 'seed');

-- Greene — Rural  adj. median $14.50
-- Rates: 13.50 (13.25 clamped), 14.00, 14.25, 14.75, 15.00, 15.75
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (13.50, 'PA', 'Greene', 'active', 'seed'),
  (14.00, 'PA', 'Greene', 'active', 'seed'),
  (14.25, 'PA', 'Greene', 'active', 'seed'),
  (14.75, 'PA', 'Greene', 'active', 'seed'),
  (15.00, 'PA', 'Greene', 'active', 'seed'),
  (15.75, 'PA', 'Greene', 'active', 'seed');

-- Indiana — Micropolitan  adj. median $14.75
-- Rates: 13.50, 14.25, 14.50, 15.00, 15.25, 16.00
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (13.50, 'PA', 'Indiana', 'active', 'seed'),
  (14.25, 'PA', 'Indiana', 'active', 'seed'),
  (14.50, 'PA', 'Indiana', 'active', 'seed'),
  (15.00, 'PA', 'Indiana', 'active', 'seed'),
  (15.25, 'PA', 'Indiana', 'active', 'seed'),
  (16.00, 'PA', 'Indiana', 'active', 'seed');

-- Lawrence — Micropolitan  adj. median $14.75
-- Rates: 13.50, 14.25, 14.50, 15.00, 15.25, 16.00
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (13.50, 'PA', 'Lawrence', 'active', 'seed'),
  (14.25, 'PA', 'Lawrence', 'active', 'seed'),
  (14.50, 'PA', 'Lawrence', 'active', 'seed'),
  (15.00, 'PA', 'Lawrence', 'active', 'seed'),
  (15.25, 'PA', 'Lawrence', 'active', 'seed'),
  (16.00, 'PA', 'Lawrence', 'active', 'seed');

-- Washington — Metro suburban  adj. median $15.00
-- Rates: 13.75, 14.50, 14.75, 15.25, 15.50, 16.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (13.75, 'PA', 'Washington', 'active', 'seed'),
  (14.50, 'PA', 'Washington', 'active', 'seed'),
  (14.75, 'PA', 'Washington', 'active', 'seed'),
  (15.25, 'PA', 'Washington', 'active', 'seed'),
  (15.50, 'PA', 'Washington', 'active', 'seed'),
  (16.25, 'PA', 'Washington', 'active', 'seed');

-- Westmoreland — Metro suburban  adj. median $15.00
-- Rates: 13.75, 14.50, 14.75, 15.25, 15.50, 16.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (13.75, 'PA', 'Westmoreland', 'active', 'seed'),
  (14.50, 'PA', 'Westmoreland', 'active', 'seed'),
  (14.75, 'PA', 'Westmoreland', 'active', 'seed'),
  (15.25, 'PA', 'Westmoreland', 'active', 'seed'),
  (15.50, 'PA', 'Westmoreland', 'active', 'seed'),
  (16.25, 'PA', 'Westmoreland', 'active', 'seed');


-- ===========================================================================
-- REGION 2 — Rest of State  (Median $16.50, Range $14.50–$18.00)
-- ===========================================================================

-- Erie — Metro core  adj. median $17.00
-- Rates: 15.75, 16.50, 16.75, 17.25, 17.50, 18.00 (18.25 clamped to 18.00)
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (15.75, 'PA', 'Erie', 'active', 'seed'),
  (16.50, 'PA', 'Erie', 'active', 'seed'),
  (16.75, 'PA', 'Erie', 'active', 'seed'),
  (17.25, 'PA', 'Erie', 'active', 'seed'),
  (17.50, 'PA', 'Erie', 'active', 'seed'),
  (18.00, 'PA', 'Erie', 'active', 'seed');

-- York — Metro suburban  adj. median $16.50
-- Rates: 15.25, 16.00, 16.25, 16.75, 17.00, 17.75
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (15.25, 'PA', 'York', 'active', 'seed'),
  (16.00, 'PA', 'York', 'active', 'seed'),
  (16.25, 'PA', 'York', 'active', 'seed'),
  (16.75, 'PA', 'York', 'active', 'seed'),
  (17.00, 'PA', 'York', 'active', 'seed'),
  (17.75, 'PA', 'York', 'active', 'seed');

-- Adams — Micropolitan  adj. median $16.25
-- Rates: 15.00, 15.75, 16.00, 16.50, 16.75, 17.50
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (15.00, 'PA', 'Adams', 'active', 'seed'),
  (15.75, 'PA', 'Adams', 'active', 'seed'),
  (16.00, 'PA', 'Adams', 'active', 'seed'),
  (16.50, 'PA', 'Adams', 'active', 'seed'),
  (16.75, 'PA', 'Adams', 'active', 'seed'),
  (17.50, 'PA', 'Adams', 'active', 'seed');

-- Blair — Micropolitan  adj. median $16.25
-- Rates: 15.00, 15.75, 16.00, 16.50, 16.75, 17.50
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (15.00, 'PA', 'Blair', 'active', 'seed'),
  (15.75, 'PA', 'Blair', 'active', 'seed'),
  (16.00, 'PA', 'Blair', 'active', 'seed'),
  (16.50, 'PA', 'Blair', 'active', 'seed'),
  (16.75, 'PA', 'Blair', 'active', 'seed'),
  (17.50, 'PA', 'Blair', 'active', 'seed');

-- Bradford — Micropolitan  adj. median $16.25
-- Rates: 15.00, 15.75, 16.00, 16.50, 16.75, 17.50
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (15.00, 'PA', 'Bradford', 'active', 'seed'),
  (15.75, 'PA', 'Bradford', 'active', 'seed'),
  (16.00, 'PA', 'Bradford', 'active', 'seed'),
  (16.50, 'PA', 'Bradford', 'active', 'seed'),
  (16.75, 'PA', 'Bradford', 'active', 'seed'),
  (17.50, 'PA', 'Bradford', 'active', 'seed');

-- Centre — Micropolitan  adj. median $16.25
-- Rates: 15.00, 15.75, 16.00, 16.50, 16.75, 17.50
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (15.00, 'PA', 'Centre', 'active', 'seed'),
  (15.75, 'PA', 'Centre', 'active', 'seed'),
  (16.00, 'PA', 'Centre', 'active', 'seed'),
  (16.50, 'PA', 'Centre', 'active', 'seed'),
  (16.75, 'PA', 'Centre', 'active', 'seed'),
  (17.50, 'PA', 'Centre', 'active', 'seed');

-- Clearfield — Micropolitan  adj. median $16.25
-- Rates: 15.00, 15.75, 16.00, 16.50, 16.75, 17.50
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (15.00, 'PA', 'Clearfield', 'active', 'seed'),
  (15.75, 'PA', 'Clearfield', 'active', 'seed'),
  (16.00, 'PA', 'Clearfield', 'active', 'seed'),
  (16.50, 'PA', 'Clearfield', 'active', 'seed'),
  (16.75, 'PA', 'Clearfield', 'active', 'seed'),
  (17.50, 'PA', 'Clearfield', 'active', 'seed');

-- Columbia — Micropolitan  adj. median $16.25
-- Rates: 15.00, 15.75, 16.00, 16.50, 16.75, 17.50
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (15.00, 'PA', 'Columbia', 'active', 'seed'),
  (15.75, 'PA', 'Columbia', 'active', 'seed'),
  (16.00, 'PA', 'Columbia', 'active', 'seed'),
  (16.50, 'PA', 'Columbia', 'active', 'seed'),
  (16.75, 'PA', 'Columbia', 'active', 'seed'),
  (17.50, 'PA', 'Columbia', 'active', 'seed');

-- Crawford — Micropolitan  adj. median $16.25
-- Rates: 15.00, 15.75, 16.00, 16.50, 16.75, 17.50
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (15.00, 'PA', 'Crawford', 'active', 'seed'),
  (15.75, 'PA', 'Crawford', 'active', 'seed'),
  (16.00, 'PA', 'Crawford', 'active', 'seed'),
  (16.50, 'PA', 'Crawford', 'active', 'seed'),
  (16.75, 'PA', 'Crawford', 'active', 'seed'),
  (17.50, 'PA', 'Crawford', 'active', 'seed');

-- Lycoming — Micropolitan  adj. median $16.25
-- Rates: 15.00, 15.75, 16.00, 16.50, 16.75, 17.50
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (15.00, 'PA', 'Lycoming', 'active', 'seed'),
  (15.75, 'PA', 'Lycoming', 'active', 'seed'),
  (16.00, 'PA', 'Lycoming', 'active', 'seed'),
  (16.50, 'PA', 'Lycoming', 'active', 'seed'),
  (16.75, 'PA', 'Lycoming', 'active', 'seed'),
  (17.50, 'PA', 'Lycoming', 'active', 'seed');

-- Mercer — Micropolitan  adj. median $16.25
-- Rates: 15.00, 15.75, 16.00, 16.50, 16.75, 17.50
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (15.00, 'PA', 'Mercer', 'active', 'seed'),
  (15.75, 'PA', 'Mercer', 'active', 'seed'),
  (16.00, 'PA', 'Mercer', 'active', 'seed'),
  (16.50, 'PA', 'Mercer', 'active', 'seed'),
  (16.75, 'PA', 'Mercer', 'active', 'seed'),
  (17.50, 'PA', 'Mercer', 'active', 'seed');

-- Northumberland — Micropolitan  adj. median $16.25
-- Rates: 15.00, 15.75, 16.00, 16.50, 16.75, 17.50
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (15.00, 'PA', 'Northumberland', 'active', 'seed'),
  (15.75, 'PA', 'Northumberland', 'active', 'seed'),
  (16.00, 'PA', 'Northumberland', 'active', 'seed'),
  (16.50, 'PA', 'Northumberland', 'active', 'seed'),
  (16.75, 'PA', 'Northumberland', 'active', 'seed'),
  (17.50, 'PA', 'Northumberland', 'active', 'seed');

-- Schuylkill — Micropolitan (R2 per spec note)  adj. median $16.25
-- Rates: 15.00, 15.75, 16.00, 16.50, 16.75, 17.50
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (15.00, 'PA', 'Schuylkill', 'active', 'seed'),
  (15.75, 'PA', 'Schuylkill', 'active', 'seed'),
  (16.00, 'PA', 'Schuylkill', 'active', 'seed'),
  (16.50, 'PA', 'Schuylkill', 'active', 'seed'),
  (16.75, 'PA', 'Schuylkill', 'active', 'seed'),
  (17.50, 'PA', 'Schuylkill', 'active', 'seed');

-- Bedford — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Bedford', 'active', 'seed'),
  (15.50, 'PA', 'Bedford', 'active', 'seed'),
  (15.75, 'PA', 'Bedford', 'active', 'seed'),
  (16.25, 'PA', 'Bedford', 'active', 'seed'),
  (16.50, 'PA', 'Bedford', 'active', 'seed'),
  (17.25, 'PA', 'Bedford', 'active', 'seed');

-- Cameron — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Cameron', 'active', 'seed'),
  (15.50, 'PA', 'Cameron', 'active', 'seed'),
  (15.75, 'PA', 'Cameron', 'active', 'seed'),
  (16.25, 'PA', 'Cameron', 'active', 'seed'),
  (16.50, 'PA', 'Cameron', 'active', 'seed'),
  (17.25, 'PA', 'Cameron', 'active', 'seed');

-- Carbon — Rural (R2 per spec note; kept out of R3)  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Carbon', 'active', 'seed'),
  (15.50, 'PA', 'Carbon', 'active', 'seed'),
  (15.75, 'PA', 'Carbon', 'active', 'seed'),
  (16.25, 'PA', 'Carbon', 'active', 'seed'),
  (16.50, 'PA', 'Carbon', 'active', 'seed'),
  (17.25, 'PA', 'Carbon', 'active', 'seed');

-- Clarion — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Clarion', 'active', 'seed'),
  (15.50, 'PA', 'Clarion', 'active', 'seed'),
  (15.75, 'PA', 'Clarion', 'active', 'seed'),
  (16.25, 'PA', 'Clarion', 'active', 'seed'),
  (16.50, 'PA', 'Clarion', 'active', 'seed'),
  (17.25, 'PA', 'Clarion', 'active', 'seed');

-- Clinton — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Clinton', 'active', 'seed'),
  (15.50, 'PA', 'Clinton', 'active', 'seed'),
  (15.75, 'PA', 'Clinton', 'active', 'seed'),
  (16.25, 'PA', 'Clinton', 'active', 'seed'),
  (16.50, 'PA', 'Clinton', 'active', 'seed'),
  (17.25, 'PA', 'Clinton', 'active', 'seed');

-- Elk — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Elk', 'active', 'seed'),
  (15.50, 'PA', 'Elk', 'active', 'seed'),
  (15.75, 'PA', 'Elk', 'active', 'seed'),
  (16.25, 'PA', 'Elk', 'active', 'seed'),
  (16.50, 'PA', 'Elk', 'active', 'seed'),
  (17.25, 'PA', 'Elk', 'active', 'seed');

-- Forest — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Forest', 'active', 'seed'),
  (15.50, 'PA', 'Forest', 'active', 'seed'),
  (15.75, 'PA', 'Forest', 'active', 'seed'),
  (16.25, 'PA', 'Forest', 'active', 'seed'),
  (16.50, 'PA', 'Forest', 'active', 'seed'),
  (17.25, 'PA', 'Forest', 'active', 'seed');

-- Franklin — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Franklin', 'active', 'seed'),
  (15.50, 'PA', 'Franklin', 'active', 'seed'),
  (15.75, 'PA', 'Franklin', 'active', 'seed'),
  (16.25, 'PA', 'Franklin', 'active', 'seed'),
  (16.50, 'PA', 'Franklin', 'active', 'seed'),
  (17.25, 'PA', 'Franklin', 'active', 'seed');

-- Fulton — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Fulton', 'active', 'seed'),
  (15.50, 'PA', 'Fulton', 'active', 'seed'),
  (15.75, 'PA', 'Fulton', 'active', 'seed'),
  (16.25, 'PA', 'Fulton', 'active', 'seed'),
  (16.50, 'PA', 'Fulton', 'active', 'seed'),
  (17.25, 'PA', 'Fulton', 'active', 'seed');

-- Huntingdon — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Huntingdon', 'active', 'seed'),
  (15.50, 'PA', 'Huntingdon', 'active', 'seed'),
  (15.75, 'PA', 'Huntingdon', 'active', 'seed'),
  (16.25, 'PA', 'Huntingdon', 'active', 'seed'),
  (16.50, 'PA', 'Huntingdon', 'active', 'seed'),
  (17.25, 'PA', 'Huntingdon', 'active', 'seed');

-- Jefferson — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Jefferson', 'active', 'seed'),
  (15.50, 'PA', 'Jefferson', 'active', 'seed'),
  (15.75, 'PA', 'Jefferson', 'active', 'seed'),
  (16.25, 'PA', 'Jefferson', 'active', 'seed'),
  (16.50, 'PA', 'Jefferson', 'active', 'seed'),
  (17.25, 'PA', 'Jefferson', 'active', 'seed');

-- Juniata — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Juniata', 'active', 'seed'),
  (15.50, 'PA', 'Juniata', 'active', 'seed'),
  (15.75, 'PA', 'Juniata', 'active', 'seed'),
  (16.25, 'PA', 'Juniata', 'active', 'seed'),
  (16.50, 'PA', 'Juniata', 'active', 'seed'),
  (17.25, 'PA', 'Juniata', 'active', 'seed');

-- McKean — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'McKean', 'active', 'seed'),
  (15.50, 'PA', 'McKean', 'active', 'seed'),
  (15.75, 'PA', 'McKean', 'active', 'seed'),
  (16.25, 'PA', 'McKean', 'active', 'seed'),
  (16.50, 'PA', 'McKean', 'active', 'seed'),
  (17.25, 'PA', 'McKean', 'active', 'seed');

-- Mifflin — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Mifflin', 'active', 'seed'),
  (15.50, 'PA', 'Mifflin', 'active', 'seed'),
  (15.75, 'PA', 'Mifflin', 'active', 'seed'),
  (16.25, 'PA', 'Mifflin', 'active', 'seed'),
  (16.50, 'PA', 'Mifflin', 'active', 'seed'),
  (17.25, 'PA', 'Mifflin', 'active', 'seed');

-- Montour — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Montour', 'active', 'seed'),
  (15.50, 'PA', 'Montour', 'active', 'seed'),
  (15.75, 'PA', 'Montour', 'active', 'seed'),
  (16.25, 'PA', 'Montour', 'active', 'seed'),
  (16.50, 'PA', 'Montour', 'active', 'seed'),
  (17.25, 'PA', 'Montour', 'active', 'seed');

-- Perry — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Perry', 'active', 'seed'),
  (15.50, 'PA', 'Perry', 'active', 'seed'),
  (15.75, 'PA', 'Perry', 'active', 'seed'),
  (16.25, 'PA', 'Perry', 'active', 'seed'),
  (16.50, 'PA', 'Perry', 'active', 'seed'),
  (17.25, 'PA', 'Perry', 'active', 'seed');

-- Pike — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Pike', 'active', 'seed'),
  (15.50, 'PA', 'Pike', 'active', 'seed'),
  (15.75, 'PA', 'Pike', 'active', 'seed'),
  (16.25, 'PA', 'Pike', 'active', 'seed'),
  (16.50, 'PA', 'Pike', 'active', 'seed'),
  (17.25, 'PA', 'Pike', 'active', 'seed');

-- Potter — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Potter', 'active', 'seed'),
  (15.50, 'PA', 'Potter', 'active', 'seed'),
  (15.75, 'PA', 'Potter', 'active', 'seed'),
  (16.25, 'PA', 'Potter', 'active', 'seed'),
  (16.50, 'PA', 'Potter', 'active', 'seed'),
  (17.25, 'PA', 'Potter', 'active', 'seed');

-- Snyder — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Snyder', 'active', 'seed'),
  (15.50, 'PA', 'Snyder', 'active', 'seed'),
  (15.75, 'PA', 'Snyder', 'active', 'seed'),
  (16.25, 'PA', 'Snyder', 'active', 'seed'),
  (16.50, 'PA', 'Snyder', 'active', 'seed'),
  (17.25, 'PA', 'Snyder', 'active', 'seed');

-- Somerset — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Somerset', 'active', 'seed'),
  (15.50, 'PA', 'Somerset', 'active', 'seed'),
  (15.75, 'PA', 'Somerset', 'active', 'seed'),
  (16.25, 'PA', 'Somerset', 'active', 'seed'),
  (16.50, 'PA', 'Somerset', 'active', 'seed'),
  (17.25, 'PA', 'Somerset', 'active', 'seed');

-- Sullivan — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Sullivan', 'active', 'seed'),
  (15.50, 'PA', 'Sullivan', 'active', 'seed'),
  (15.75, 'PA', 'Sullivan', 'active', 'seed'),
  (16.25, 'PA', 'Sullivan', 'active', 'seed'),
  (16.50, 'PA', 'Sullivan', 'active', 'seed'),
  (17.25, 'PA', 'Sullivan', 'active', 'seed');

-- Susquehanna — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Susquehanna', 'active', 'seed'),
  (15.50, 'PA', 'Susquehanna', 'active', 'seed'),
  (15.75, 'PA', 'Susquehanna', 'active', 'seed'),
  (16.25, 'PA', 'Susquehanna', 'active', 'seed'),
  (16.50, 'PA', 'Susquehanna', 'active', 'seed'),
  (17.25, 'PA', 'Susquehanna', 'active', 'seed');

-- Tioga — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Tioga', 'active', 'seed'),
  (15.50, 'PA', 'Tioga', 'active', 'seed'),
  (15.75, 'PA', 'Tioga', 'active', 'seed'),
  (16.25, 'PA', 'Tioga', 'active', 'seed'),
  (16.50, 'PA', 'Tioga', 'active', 'seed'),
  (17.25, 'PA', 'Tioga', 'active', 'seed');

-- Union — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Union', 'active', 'seed'),
  (15.50, 'PA', 'Union', 'active', 'seed'),
  (15.75, 'PA', 'Union', 'active', 'seed'),
  (16.25, 'PA', 'Union', 'active', 'seed'),
  (16.50, 'PA', 'Union', 'active', 'seed'),
  (17.25, 'PA', 'Union', 'active', 'seed');

-- Venango — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Venango', 'active', 'seed'),
  (15.50, 'PA', 'Venango', 'active', 'seed'),
  (15.75, 'PA', 'Venango', 'active', 'seed'),
  (16.25, 'PA', 'Venango', 'active', 'seed'),
  (16.50, 'PA', 'Venango', 'active', 'seed'),
  (17.25, 'PA', 'Venango', 'active', 'seed');

-- Warren — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Warren', 'active', 'seed'),
  (15.50, 'PA', 'Warren', 'active', 'seed'),
  (15.75, 'PA', 'Warren', 'active', 'seed'),
  (16.25, 'PA', 'Warren', 'active', 'seed'),
  (16.50, 'PA', 'Warren', 'active', 'seed'),
  (17.25, 'PA', 'Warren', 'active', 'seed');

-- Wayne — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Wayne', 'active', 'seed'),
  (15.50, 'PA', 'Wayne', 'active', 'seed'),
  (15.75, 'PA', 'Wayne', 'active', 'seed'),
  (16.25, 'PA', 'Wayne', 'active', 'seed'),
  (16.50, 'PA', 'Wayne', 'active', 'seed'),
  (17.25, 'PA', 'Wayne', 'active', 'seed');

-- Wyoming — Rural  adj. median $16.00
-- Rates: 14.75, 15.50, 15.75, 16.25, 16.50, 17.25
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.75, 'PA', 'Wyoming', 'active', 'seed'),
  (15.50, 'PA', 'Wyoming', 'active', 'seed'),
  (15.75, 'PA', 'Wyoming', 'active', 'seed'),
  (16.25, 'PA', 'Wyoming', 'active', 'seed'),
  (16.50, 'PA', 'Wyoming', 'active', 'seed'),
  (17.25, 'PA', 'Wyoming', 'active', 'seed');


-- ===========================================================================
-- REGION 3 — Lehigh Capital  (Median $15.75, Range $14.00–$17.00)
-- ===========================================================================

-- Dauphin — Metro core  adj. median $16.25
-- Rates: 15.00, 15.75, 16.00, 16.50, 16.75, 17.00 (17.50 clamped to 17.00)
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (15.00, 'PA', 'Dauphin', 'active', 'seed'),
  (15.75, 'PA', 'Dauphin', 'active', 'seed'),
  (16.00, 'PA', 'Dauphin', 'active', 'seed'),
  (16.50, 'PA', 'Dauphin', 'active', 'seed'),
  (16.75, 'PA', 'Dauphin', 'active', 'seed'),
  (17.00, 'PA', 'Dauphin', 'active', 'seed');

-- Lehigh — Metro core  adj. median $16.25
-- Rates: 15.00, 15.75, 16.00, 16.50, 16.75, 17.00 (17.50 clamped to 17.00)
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (15.00, 'PA', 'Lehigh', 'active', 'seed'),
  (15.75, 'PA', 'Lehigh', 'active', 'seed'),
  (16.00, 'PA', 'Lehigh', 'active', 'seed'),
  (16.50, 'PA', 'Lehigh', 'active', 'seed'),
  (16.75, 'PA', 'Lehigh', 'active', 'seed'),
  (17.00, 'PA', 'Lehigh', 'active', 'seed');

-- Berks — Metro suburban  adj. median $15.75
-- Rates: 14.50, 15.25, 15.50, 16.00, 16.25, 17.00
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.50, 'PA', 'Berks', 'active', 'seed'),
  (15.25, 'PA', 'Berks', 'active', 'seed'),
  (15.50, 'PA', 'Berks', 'active', 'seed'),
  (16.00, 'PA', 'Berks', 'active', 'seed'),
  (16.25, 'PA', 'Berks', 'active', 'seed'),
  (17.00, 'PA', 'Berks', 'active', 'seed');

-- Cumberland — Metro suburban  adj. median $15.75
-- Rates: 14.50, 15.25, 15.50, 16.00, 16.25, 17.00
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.50, 'PA', 'Cumberland', 'active', 'seed'),
  (15.25, 'PA', 'Cumberland', 'active', 'seed'),
  (15.50, 'PA', 'Cumberland', 'active', 'seed'),
  (16.00, 'PA', 'Cumberland', 'active', 'seed'),
  (16.25, 'PA', 'Cumberland', 'active', 'seed'),
  (17.00, 'PA', 'Cumberland', 'active', 'seed');

-- Lancaster — Metro suburban  adj. median $15.75
-- Rates: 14.50, 15.25, 15.50, 16.00, 16.25, 17.00
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.50, 'PA', 'Lancaster', 'active', 'seed'),
  (15.25, 'PA', 'Lancaster', 'active', 'seed'),
  (15.50, 'PA', 'Lancaster', 'active', 'seed'),
  (16.00, 'PA', 'Lancaster', 'active', 'seed'),
  (16.25, 'PA', 'Lancaster', 'active', 'seed'),
  (17.00, 'PA', 'Lancaster', 'active', 'seed');

-- Lebanon — Metro suburban  adj. median $15.75
-- Rates: 14.50, 15.25, 15.50, 16.00, 16.25, 17.00
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.50, 'PA', 'Lebanon', 'active', 'seed'),
  (15.25, 'PA', 'Lebanon', 'active', 'seed'),
  (15.50, 'PA', 'Lebanon', 'active', 'seed'),
  (16.00, 'PA', 'Lebanon', 'active', 'seed'),
  (16.25, 'PA', 'Lebanon', 'active', 'seed'),
  (17.00, 'PA', 'Lebanon', 'active', 'seed');

-- Northampton — Metro suburban  adj. median $15.75
-- Rates: 14.50, 15.25, 15.50, 16.00, 16.25, 17.00
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.50, 'PA', 'Northampton', 'active', 'seed'),
  (15.25, 'PA', 'Northampton', 'active', 'seed'),
  (15.50, 'PA', 'Northampton', 'active', 'seed'),
  (16.00, 'PA', 'Northampton', 'active', 'seed'),
  (16.25, 'PA', 'Northampton', 'active', 'seed'),
  (17.00, 'PA', 'Northampton', 'active', 'seed');

-- Monroe — Micropolitan (R3)  adj. median $15.50
-- Rates: 14.25, 15.00, 15.25, 15.75, 16.00, 16.75
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (14.25, 'PA', 'Monroe', 'active', 'seed'),
  (15.00, 'PA', 'Monroe', 'active', 'seed'),
  (15.25, 'PA', 'Monroe', 'active', 'seed'),
  (15.75, 'PA', 'Monroe', 'active', 'seed'),
  (16.00, 'PA', 'Monroe', 'active', 'seed'),
  (16.75, 'PA', 'Monroe', 'active', 'seed');


-- ===========================================================================
-- REGION 4 — Philadelphia Area  (Median $16.75, Range $14.50–$18.00)
-- ===========================================================================

-- Philadelphia — Metro core  adj. median $17.25
-- Rates: 16.00, 16.75, 17.00, 17.50, 17.75, 18.00 (18.50 clamped to 18.00)
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (16.00, 'PA', 'Philadelphia', 'active', 'seed'),
  (16.75, 'PA', 'Philadelphia', 'active', 'seed'),
  (17.00, 'PA', 'Philadelphia', 'active', 'seed'),
  (17.50, 'PA', 'Philadelphia', 'active', 'seed'),
  (17.75, 'PA', 'Philadelphia', 'active', 'seed'),
  (18.00, 'PA', 'Philadelphia', 'active', 'seed');

-- Bucks — Metro suburban  adj. median $16.75
-- Rates: 15.50, 16.25, 16.50, 17.00, 17.25, 18.00
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (15.50, 'PA', 'Bucks', 'active', 'seed'),
  (16.25, 'PA', 'Bucks', 'active', 'seed'),
  (16.50, 'PA', 'Bucks', 'active', 'seed'),
  (17.00, 'PA', 'Bucks', 'active', 'seed'),
  (17.25, 'PA', 'Bucks', 'active', 'seed'),
  (18.00, 'PA', 'Bucks', 'active', 'seed');

-- Chester — Metro suburban  adj. median $16.75
-- Rates: 15.50, 16.25, 16.50, 17.00, 17.25, 18.00
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (15.50, 'PA', 'Chester', 'active', 'seed'),
  (16.25, 'PA', 'Chester', 'active', 'seed'),
  (16.50, 'PA', 'Chester', 'active', 'seed'),
  (17.00, 'PA', 'Chester', 'active', 'seed'),
  (17.25, 'PA', 'Chester', 'active', 'seed'),
  (18.00, 'PA', 'Chester', 'active', 'seed');

-- Delaware — Metro suburban  adj. median $16.75
-- Rates: 15.50, 16.25, 16.50, 17.00, 17.25, 18.00
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (15.50, 'PA', 'Delaware', 'active', 'seed'),
  (16.25, 'PA', 'Delaware', 'active', 'seed'),
  (16.50, 'PA', 'Delaware', 'active', 'seed'),
  (17.00, 'PA', 'Delaware', 'active', 'seed'),
  (17.25, 'PA', 'Delaware', 'active', 'seed'),
  (18.00, 'PA', 'Delaware', 'active', 'seed');

-- Montgomery — Metro suburban  adj. median $16.75
-- Rates: 15.50, 16.25, 16.50, 17.00, 17.25, 18.00
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (15.50, 'PA', 'Montgomery', 'active', 'seed'),
  (16.25, 'PA', 'Montgomery', 'active', 'seed'),
  (16.50, 'PA', 'Montgomery', 'active', 'seed'),
  (17.00, 'PA', 'Montgomery', 'active', 'seed'),
  (17.25, 'PA', 'Montgomery', 'active', 'seed'),
  (18.00, 'PA', 'Montgomery', 'active', 'seed');

-- Lackawanna — Micropolitan  adj. median $16.50
-- Rates: 15.25, 16.00, 16.25, 16.75, 17.00, 17.75
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (15.25, 'PA', 'Lackawanna', 'active', 'seed'),
  (16.00, 'PA', 'Lackawanna', 'active', 'seed'),
  (16.25, 'PA', 'Lackawanna', 'active', 'seed'),
  (16.75, 'PA', 'Lackawanna', 'active', 'seed'),
  (17.00, 'PA', 'Lackawanna', 'active', 'seed'),
  (17.75, 'PA', 'Lackawanna', 'active', 'seed');

-- Luzerne — Micropolitan  adj. median $16.50
-- Rates: 15.25, 16.00, 16.25, 16.75, 17.00, 17.75
INSERT INTO submissions (rate, state, county, status, ip_hash) VALUES
  (15.25, 'PA', 'Luzerne', 'active', 'seed'),
  (16.00, 'PA', 'Luzerne', 'active', 'seed'),
  (16.25, 'PA', 'Luzerne', 'active', 'seed'),
  (16.75, 'PA', 'Luzerne', 'active', 'seed'),
  (17.00, 'PA', 'Luzerne', 'active', 'seed'),
  (17.75, 'PA', 'Luzerne', 'active', 'seed');
