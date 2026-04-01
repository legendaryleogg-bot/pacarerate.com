# DNS Cutover Runbook — GoDaddy to Cloudflare

**Domain:** pacarerate.com
**Registrar:** GoDaddy (until 5/26/2026 transfer)
**DNS Provider:** Cloudflare (current + post-cutover)
**Risk Level:** HIGH — Breaking the GHL funnel breaks active paid ad spend
**Domains in Scope:**
- pacarerate.com (transparency platform landing page)
- go.pacarerate.com (GHL marketing funnel with Facebook ad traffic)

---

## Overview

This runbook moves DNS nameserver authority from GoDaddy to Cloudflare. Domain registration remains at GoDaddy until the scheduled 5/26/2026 registrar transfer. This migration gives Cloudflare full DNS control over both the main site and the GHL funnel subdomain.

**Why Cloudflare?** Centralized DNS management, DDoS protection, faster global propagation, and cleaner setup for the transparency platform and funnel operations.

**Critical Constraint:** The `go.pacarerate.com` subdomain points to a GHL funnel with active Facebook ad traffic. Any DNS misconfiguration immediately breaks the funnel and ad spend.

---

## Pre-Cutover Checklist

### Phase 1: Audit Current DNS at GoDaddy

**Time Required:** 15 minutes
**Risk:** Information gathering only — no changes made

**Steps:**

1. Log in to GoDaddy account (credentials in secure storage)
2. Navigate to **Domains** → **pacarerate.com** → **DNS**
3. Export or screenshot **every DNS record** on file:
   - **A records** (IPv4 addresses)
   - **AAAA records** (IPv6 addresses)
   - **CNAME records** (especially `go` → GHL funnel URL)
   - **MX records** (mail routing, if any)
   - **TXT records** (SPF, DKIM, verification strings)
   - **NS records** (current nameservers)
   - Any other record types present
4. Save screenshots/export to `docs/godaddy-dns-backup/` in the repo with timestamp: `godaddy-dns-export-[YYYY-MM-DD].txt` or `.png`
5. Document the **current TTL (Time To Live)** values for each record — note which records use non-default TTLs

**Why this matters:** You need an exact copy of all records before touching anything. If the Cloudflare import misses records, you have this as reference.

---

### Phase 2: Add pacarerate.com to Cloudflare

**Time Required:** 10 minutes
**Risk:** Low — records imported but nameservers not yet changed at GoDaddy

**Steps:**

1. Log in to Cloudflare (credentials in secure storage)
2. Go to **Add a Site** and enter `pacarerate.com`
3. Select **Free plan** (sufficient for this use case)
4. Cloudflare auto-scans GoDaddy's DNS and imports records
5. Review the imported records against your GoDaddy screenshot:
   - [ ] All A records present
   - [ ] All AAAA records present
   - [ ] **CRITICAL:** Verify `go.pacarerate.com` CNAME points to GHL funnel URL (from GoDaddy export)
   - [ ] All MX records present (if any)
   - [ ] All TXT records present (SPF, DKIM, etc.)
   - [ ] No unexpected records added
6. If a record is missing or wrong, manually add/correct it in Cloudflare before proceeding
7. Note Cloudflare's **assigned nameservers** (usually two NS records like `ns1.cloudflare.com` and `ns2.cloudflare.com`)

**Critical Validation:** The `go` subdomain MUST resolve to the correct GHL funnel URL. Test with:
```bash
dig go.pacarerate.com CNAME @ns1.cloudflare.com
```

Expected output should show the GHL funnel CNAME (e.g., `funnel.gohighlevel.com` or similar).

---

### Phase 3: Lower TTLs at GoDaddy

**Time Required:** 10 minutes + wait time
**Risk:** Low — prepares for fast cutover

**Steps:**

1. Log in to GoDaddy, navigate to **pacarerate.com** DNS settings
2. For **each record** (A, AAAA, CNAME, MX, TXT):
   - Check current TTL value
   - If TTL > 600 seconds (10 minutes), lower it to **600 seconds**
   - Note which records had their TTL lowered (log in `docs/ttl-changes.md`)
3. **Wait for propagation:** Before proceeding to the cutover, wait at least as long as the **longest previous TTL** (e.g., if a record had TTL 3600, wait 1 hour)
   - This ensures old DNS caches expire before the nameserver change
   - Shorten propagation time when the cutover happens

**Why lower TTLs?** If something breaks after the nameserver cutover, lower TTLs mean rollback propagates within 10 minutes instead of hours.

---

## Cutover Execution

### Phase 4: Change Nameservers at GoDaddy

**Time Required:** 5 minutes
**Risk:** CRITICAL — This is the point of no return

**Pre-Cutover Checklist:**
- [ ] GoDaddy DNS records backed up (Phase 1)
- [ ] All records imported to Cloudflare and verified (Phase 2)
- [ ] TTLs lowered at GoDaddy (Phase 3)
- [ ] Waited for TTL propagation
- [ ] Cloudflare nameservers noted
- [ ] Team notified that cutover is starting
- [ ] You have rollback instructions ready (see Rollback section)

**Steps:**

1. Log in to GoDaddy, navigate to **pacarerate.com** → **Domain Settings** → **Nameservers**
2. Select **Custom Nameservers** option
3. Enter Cloudflare's two nameservers (from Phase 2):
   - Example: `ns1.cloudflare.com`, `ns2.cloudflare.com`
   - (Exact names will vary; use the ones Cloudflare assigned)
4. Remove or deactivate GoDaddy's default nameservers
5. Save changes
6. **Record the time of change** — note it in `docs/cutover-log.md` with timestamp and who initiated
7. Do **not** turn off your computer or disconnect — you need to monitor propagation immediately

---

### Phase 5: Wait for DNS Propagation

**Time Required:** 1–48 hours (typically 1–4 hours)
**Risk:** Medium — Domain briefly unreachable; old caches may still point to old IPs

**Steps:**

1. Immediately after changing nameservers, start monitoring propagation using one or both tools:

   **Option A: Command-line check**
   ```bash
   dig pacarerate.com NS
   ```
   Look for Cloudflare nameservers in the answer section (should appear within 5–15 minutes)

   **Option B: Online propagation checker**
   - Visit [whatsmydns.net](https://whatsmydns.net)
   - Enter `pacarerate.com`
   - Select **NS** record type
   - Watch the global map — green = propagated, red = not yet
   - Repeat checks every 5 minutes for the first 15 minutes, then every 15 minutes

2. **Propagation timeline:**
   - **5–15 minutes:** Nameservers begin updating globally
   - **30–60 minutes:** Most ISPs have picked up the change
   - **1–4 hours:** 99% of the internet knows about the change
   - **Up to 48 hours:** Rare stragglers (usually corporate networks with stale caches)

3. **During propagation:**
   - [ ] Do **not** make additional DNS changes at GoDaddy (creates race conditions)
   - [ ] Do **not** panic if propagation is slow — this is normal
   - [ ] If a critical issue emerges (see Rollback section), you have instructions ready

---

## Post-Cutover Validation

### Phase 6: Verify Everything Works

**Time Required:** 10 minutes
**Risk:** Low — validation only

**Steps:**

1. **Wait for propagation to complete** (Phase 5) — Cloudflare nameservers should show on whatsmydns.net globally

2. **Verify pacarerate.com loads:**
   ```bash
   curl -I https://pacarerate.com
   ```
   Expected: HTTP 200 or 301/302 (redirect is OK)

3. **Verify go.pacarerate.com loads (GHL funnel):**
   ```bash
   curl -I https://go.pacarerate.com
   ```
   Expected: HTTP 200 or 301/302 (the funnel should be live)

4. **Test the GHL funnel in a browser:**
   - Open https://go.pacarerate.com in an incognito/private window
   - Verify the funnel form appears (not a DNS error page)
   - Attempt a test funnel submission if possible
   - Confirm form submission works and sends to GHL

5. **Check email deliverability** (if MX records exist):
   - Send a test email to a monitored mailbox
   - Verify it arrives (not bounced or delayed)
   - Check spam folder if delivery is slow

6. **Verify Cloudflare shows "Active" status:**
   - Log in to Cloudflare
   - Navigate to pacarerate.com
   - Check the **Status** bar at the top
   - Should display "Active nameservers detected"

7. **Document the results:**
   - Record verification results in `docs/cutover-log.md`
   - Note any issues and resolution (if any)
   - Take final screenshot of Cloudflare dashboard showing "Active" status

**If all checks pass:** Cutover is complete. Monitor for 24 hours for unexpected issues.

---

## Rollback Plan

### If Something Breaks

**Time Window:** Rollback must happen **within 10 minutes** of detecting the issue (due to TTL 600 seconds at GoDaddy). After 10 minutes, old caches will have expired and rollback propagation will be slower.

**Symptoms of a critical issue:**
- pacarerate.com returns DNS error (NXDOMAIN, SERVFAIL, or timeout)
- go.pacarerate.com funnel is down or unreachable
- Funnel form submissions fail with DNS errors
- Email bounces due to DNS issues

**Rollback steps:**

1. Log in to GoDaddy immediately
2. Navigate to **pacarerate.com** → **Domain Settings** → **Nameservers**
3. Switch **back to GoDaddy default nameservers** (or the previous nameservers you noted)
4. Save changes and record the rollback time in `docs/cutover-log.md`
5. Monitor propagation using the same tools (dig, whatsmydns.net) — should complete in 5–15 minutes
6. Verify pacarerate.com and go.pacarerate.com are accessible again
7. **Do not attempt cutover again until** you have investigated what broke and fixed it in Cloudflare's settings

**Post-rollback investigation:**
- Compare Cloudflare's DNS records against the GoDaddy backup (Phase 1)
- Check if any record was missing or misconfigured
- Verify TTL settings in Cloudflare
- If the issue is found and fixed, wait 24 hours before retrying cutover

---

## Rollback Checklist During Cutover

Print or bookmark this section if cutover happens:

- [ ] Issue detected (describe): ________________________
- [ ] Time of detection: ________________________
- [ ] Logged in to GoDaddy: ________________________
- [ ] Reverted to previous nameservers: ________________________
- [ ] Time of rollback: ________________________
- [ ] Verified pacarerate.com accessible: ________________________
- [ ] Verified go.pacarerate.com accessible: ________________________
- [ ] Investigation notes: ________________________

---

## Success Criteria

The cutover is **complete and successful** when:

- [ ] Cloudflare shows "Active nameservers detected"
- [ ] `dig pacarerate.com NS` returns Cloudflare nameservers globally
- [ ] pacarerate.com loads and serves content (HTTP 200)
- [ ] go.pacarerate.com loads and funnel form is visible
- [ ] GHL funnel submissions work end-to-end
- [ ] Email deliverability is unaffected (if MX records exist)
- [ ] No DNS errors or timeouts in any browser
- [ ] Monitoring shows no spikes in error rates for 24 hours post-cutover

---

## Appendix: Reference Commands

### Check nameserver propagation

```bash
# Query Cloudflare's nameserver directly
dig pacarerate.com NS @ns1.cloudflare.com

# Query a random public nameserver (shows global propagation)
dig pacarerate.com NS @8.8.8.8

# Check a specific record (e.g., A record)
dig pacarerate.com A

# Check the GHL funnel CNAME
dig go.pacarerate.com CNAME
```

### Clear local DNS cache (if needed)

**macOS:**
```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

**Linux (systemd-resolved):**
```bash
sudo systemctl restart systemd-resolved
```

**Windows (PowerShell as admin):**
```powershell
Clear-DnsClientCache
```

---

## Escalation & Support

**If cutover fails or rollback is needed:**
- Contact GoDaddy support (pacarerate.com registrar contact) — might need to revert DNS settings if there's a registrar-level issue
- Check Cloudflare status page: https://www.cloudflarestatus.com/ — verify no global outages
- Verify Cloudflare DNS records one more time against the GoDaddy backup

**Team communication:**
- Notify stakeholders of cutover window before starting
- Update them on propagation status if cutover extends beyond 1 hour
- Confirm cutover completion to team once validation (Phase 6) passes

---

## Document History

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0 | [DATE OF EXECUTION] | [YOUR NAME] | Initial cutover execution |

Update this table each time you execute the runbook.

---

## Quick Reference — Cutover Timeline

```
T+0:00   — Start Phase 1 (GoDaddy audit)
T+0:15   — Phase 1 complete
T+0:15   — Start Phase 2 (Cloudflare import + validation)
T+0:25   — Phase 2 complete
T+0:25   — Start Phase 3 (lower TTLs at GoDaddy)
T+0:35   — Phase 3 complete
T+0:35   — WAIT: at least as long as the longest previous TTL
T+1:35   — (example: after 1 hour wait for TTL 3600)
T+1:35   — Start Phase 4 (change nameservers)
T+1:40   — Phase 4 complete — NAMESERVERS CHANGED
T+1:40   — Start Phase 5 (monitor propagation)
T+2:40   — (example: 1 hour later, most should be propagated)
T+2:45   — Start Phase 6 (validation checks)
T+2:55   — Phase 6 complete — CUTOVER DONE
T+2:55   — Document results, monitor for 24 hours
```

---

## Document Control

**Owner:** PA CareRate Project Lead
**Last Updated:** [DATE]
**Next Review:** [DATE + 30 DAYS]
**Related Docs:** `docs/godaddy-dns-backup/`, `docs/cutover-log.md`
