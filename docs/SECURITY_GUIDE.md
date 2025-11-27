# Web Application Security Guide - OWASP Best Practices
**Pérola do Vouga - Restaurant Management System**

---

## Table of Contents
1. [OWASP Top 10 Overview](#owasp-top-10-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Data Protection](#data-protection)
4. [Input Validation](#input-validation)
5. [Session Management](#session-management)
6. [API Security](#api-security)
7. [Database Security](#database-security)
8. [Deployment Security](#deployment-security)
9. [Monitoring & Logging](#monitoring--logging)
10. [Security Checklist](#security-checklist)

---

## OWASP Top 10 Overview

The OWASP (Open Web Application Security Project) Top 10 represents the most critical web application security risks:

1. **Broken Access Control** - Users acting outside their intended permissions
2. **Cryptographic Failures** - Failures related to cryptography leading to sensitive data exposure
3. **Injection** - Untrusted data sent to an interpreter as part of a command or query
4. **Insecure Design** - Missing or ineffective security controls
5. **Security Misconfiguration** - Missing security hardening or improperly configured permissions
6. **Vulnerable and Outdated Components** - Using components with known vulnerabilities
7. **Identification and Authentication Failures** - Broken authentication and session management
8. **Software and Data Integrity Failures** - Code and infrastructure that does not protect against integrity violations
9. **Security Logging and Monitoring Failures** - Insufficient logging and monitoring
10. **Server-Side Request Forgery (SSRF)** - Fetching a remote resource without validating the user-supplied URL

---

## Authentication & Authorization

### ✅ Current Implementation
- **Supabase Authentication**: Using industry-standard JWT tokens
- **Row Level Security (RLS)**: Database-level access control
- **Middleware Protection**: All admin routes protected

### 🔒 Best Practices

#### 1. Password Security
```typescript
// ✅ GOOD: Delegate to Supabase (handles hashing with bcrypt)
await supabase.auth.signInWithPassword({ email, password })

// ❌ BAD: Never store passwords in plain text
// ❌ BAD: Never use weak hashing algorithms (MD5, SHA1)
```

**Recommendations:**
- Enforce minimum password length (8+ characters)
- Require password complexity (letters, numbers, special chars)
- Implement password reset functionality
- Use rate limiting on login attempts

#### 2. Multi-Factor Authentication (MFA)
```typescript
// TODO: Implement MFA for admin accounts
// Supabase supports MFA out of the box
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp',
})
```

#### 3. Session Management
```typescript
// ✅ CURRENT: Sessions managed by Supabase
// Sessions expire after inactivity
// Tokens are stored in HTTP-only cookies (secure)

// RECOMMENDATION: Add session timeout
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes
```

#### 4. Access Control
```sql
-- ✅ IMPLEMENT: Row Level Security Policies
-- Example for orders table:
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all orders"
ON orders FOR SELECT
TO authenticated
USING (auth.role() = 'admin');

CREATE POLICY "Customers can view their own orders"
ON orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
```

---

## Data Protection

### 🔒 Encryption

#### 1. Data in Transit
```typescript
// ✅ IMPLEMENTED: HTTPS enforced via headers
// Strict-Transport-Security: max-age=63072000

// PRODUCTION CHECKLIST:
// [ ] SSL/TLS certificate installed
// [ ] HTTP redirects to HTTPS
// [ ] HSTS header enabled
```

#### 2. Data at Rest
```sql
-- Supabase encrypts data at rest by default
-- For extra sensitive data, use application-level encryption

-- Example: Encrypt customer phone numbers
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO customers (phone_encrypted)
VALUES (pgp_sym_encrypt('912345678', 'encryption-key'));
```

#### 3. Environment Variables
```bash
# ✅ GOOD: Store in .env.local (never commit)
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
RESEND_API_KEY=your-resend-key

# ❌ BAD: Hard-coding secrets
const apiKey = "re_123abc..." // NEVER DO THIS
```

**Best Practices:**
- Use `.env.local` for local development
- Use environment variables in production (Vercel, etc.)
- Rotate API keys regularly
- Never commit `.env` files to Git
- Use different keys for dev/staging/production

---

## Input Validation

### 🛡️ Prevent Injection Attacks

#### 1. SQL Injection Protection
```typescript
// ✅ GOOD: Supabase client uses parameterized queries
const { data } = await supabase
  .from('orders')
  .select('*')
  .eq('id', orderId) // Automatically sanitized

// ❌ BAD: Never concatenate user input into SQL
// const sql = `SELECT * FROM orders WHERE id = ${orderId}` // VULNERABLE!
```

#### 2. XSS (Cross-Site Scripting) Prevention
```typescript
// ✅ GOOD: React automatically escapes output
<p>{userInput}</p> // Safe

// ✅ GOOD: Sanitize HTML if needed
import DOMPurify from 'dompurify'
const cleanHtml = DOMPurify.sanitize(userInput)

// ❌ BAD: Using dangerouslySetInnerHTML without sanitization
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // VULNERABLE!
```

#### 3. Command Injection Prevention
```typescript
// ❌ BAD: Never execute shell commands with user input
import { exec } from 'child_process'
exec(`convert ${userFilename}.jpg output.png`) // VULNERABLE!

// ✅ GOOD: Use libraries and validate input
import sharp from 'sharp'
await sharp(validatedFilePath).resize(300, 300).toFile('output.png')
```

#### 4. Input Validation Schema
```typescript
// ✅ IMPLEMENT: Zod for runtime validation
import { z } from 'zod'

const orderSchema = z.object({
  items: z.array(z.object({
    menu_item_id: z.string().uuid(),
    quantity: z.number().int().positive().max(99),
  })).min(1).max(50),
  customer_name: z.string().min(2).max(100).trim(),
  phone: z.string().regex(/^[0-9]{9}$/),
  email: z.string().email().optional(),
  notes: z.string().max(500).optional(),
})

// Validate before processing
const validationResult = orderSchema.safeParse(requestData)
if (!validationResult.success) {
  return res.status(400).json({ error: 'Invalid input' })
}
```

---

## Session Management

### 🔐 Secure Session Handling

#### 1. Cookie Security
```typescript
// ✅ CURRENT: Supabase sets secure cookies
// Properties:
// - HttpOnly: true (prevents JS access)
// - Secure: true (HTTPS only)
// - SameSite: 'lax' (CSRF protection)

// Additional recommendation for custom cookies:
res.setHeader('Set-Cookie', [
  `custom_cookie=value; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`
])
```

#### 2. CSRF Protection
```typescript
// ✅ CURRENT: Next.js + Supabase provide CSRF protection
// - SameSite cookies
// - Origin/Referer validation

// For forms, implement CSRF tokens:
import { generateToken, verifyToken } from '@/lib/csrf'

// In page:
const csrfToken = await generateToken()

// In API route:
const isValid = await verifyToken(request.headers.get('x-csrf-token'))
```

#### 3. Session Timeout
```typescript
// RECOMMENDATION: Implement absolute and idle timeouts
const SESSION_CONFIG = {
  absoluteTimeout: 8 * 60 * 60 * 1000,  // 8 hours
  idleTimeout: 30 * 60 * 1000,          // 30 minutes
}

// Track last activity
useEffect(() => {
  const updateActivity = () => {
    localStorage.setItem('lastActivity', Date.now().toString())
  }
  
  window.addEventListener('mousemove', updateActivity)
  window.addEventListener('keypress', updateActivity)
  
  // Check for timeout
  const checkTimeout = setInterval(() => {
    const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0')
    if (Date.now() - lastActivity > SESSION_CONFIG.idleTimeout) {
      // Auto logout
      supabase.auth.signOut()
    }
  }, 60000) // Check every minute
  
  return () => clearInterval(checkTimeout)
}, [])
```

---

## API Security

### 🔒 Secure API Endpoints

#### 1. Rate Limiting
```typescript
// RECOMMENDATION: Implement rate limiting
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
})

// For Next.js API routes, use:
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 })
  }
  
  // Process request...
}
```

#### 2. API Authentication
```typescript
// ✅ CURRENT: Supabase RLS policies
// RECOMMENDATION: Add API key for public endpoints

export async function GET(request: Request) {
  // Verify API key for public API
  const apiKey = request.headers.get('x-api-key')
  if (apiKey !== process.env.PUBLIC_API_KEY) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // OR check Supabase session for admin endpoints
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Process request...
}
```

#### 3. CORS Configuration
```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'https://peroladovouga.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}
```

---

## Database Security

### 🗄️ Supabase Security Best Practices

#### 1. Row Level Security (RLS)
```sql
-- CRITICAL: Enable RLS on all tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Public read for menu items
CREATE POLICY "Anyone can view published menu items"
ON menu_items FOR SELECT
USING (is_available = true);

-- Admin-only write
CREATE POLICY "Only admins can modify menu"
ON menu_items FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

-- Customer can only see their own orders
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');
```

#### 2. Database Roles & Permissions
```sql
-- Create custom roles
CREATE ROLE admin_role;
CREATE ROLE customer_role;

-- Grant minimal permissions
GRANT SELECT, INSERT ON orders TO customer_role;
GRANT ALL ON ALL TABLES TO admin_role;

-- Revoke unnecessary permissions
REVOKE ALL ON sensitive_table FROM PUBLIC;
```

#### 3. Sensitive Data Protection
```sql
-- Don't store credit card numbers
-- Use payment processor tokens instead

-- For phone numbers and emails:
CREATE POLICY "Mask customer contact info"
ON orders FOR SELECT
USING (
  CASE 
    WHEN auth.jwt() ->> 'role' = 'admin' 
    THEN true
    ELSE auth.uid() = user_id
  END
);

-- Return masked data for non-admins
SELECT 
  id,
  CASE 
    WHEN current_user_is_admin() 
    THEN phone 
    ELSE '***' || RIGHT(phone, 3)
  END AS phone
FROM customers;
```

---

## Deployment Security

### 🚀 Production Deployment Checklist

#### 1. Environment Configuration
```bash
# Production .env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://peroladovouga.com

# Use different Supabase projects for dev/prod
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (production key)

# Separate API keys
RESEND_API_KEY=re_prod_...
RESEND_TO_EMAIL=admin@peroladovouga.com
```

#### 2. Security Headers (Already Implemented)
```typescript
// ✅ CURRENT: Security headers in next.config.ts
// - HSTS
// - X-Frame-Options
// - X-Content-Type-Options
// - X-XSS-Protection
// - Referrer-Policy

// TODO: Add Content Security Policy (CSP)
{
  key: '
-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co https://api.resend.com",
    "frame-ancestors 'none'",
  ].join('; '),
}
```

#### 3. SSL/TLS Configuration
```bash
# Vercel automatically provides SSL
# For custom server:

# Use Let's Encrypt
sudo certbot --nginx -d peroladovouga.com -d www.peroladovouga.com

# Force HTTPS redirect in nginx
server {
    listen 80;
    server_name peroladovouga.com;
    return 301 https://$server_name$request_uri;
}
```

#### 4. Error Handling
```typescript
// ❌ BAD: Exposing stack traces
catch (error) {
  console.error(error.stack)
  return res.status(500).json({ error: error.message })
}

// ✅ GOOD: Generic error messages
catch (error) {
  console.error('Order creation failed:', error) // Log internally
  return res.status(500).json({ 
    error: 'An error occurred processing your order' 
  })
}
```

---

## Monitoring & Logging

### 📊 Security Monitoring

#### 1. Logging Best Practices
```typescript
// ✅ IMPLEMENT: Structured logging
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['password', 'apiKey', 'token'], // Don't log sensitive data
})

// Log security events
logger.info({ userId, action: 'login', ip }, 'User logged in')
logger.warn({ userId, action: 'failed_login', ip }, 'Failed login attempt')
logger.error({ userId, action: 'unauthorized_access', resource }, 'Unauthorized access attempt')
```

#### 2. Audit Trail
```sql
-- Create audit log table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Log important actions
INSERT INTO audit_logs (user_id, action, resource, ip_address)
VALUES (auth.uid(), 'order_created', 'orders', inet_client_addr());
```

#### 3. Failed Login Monitoring
```typescript
// Track failed attempts
const FAILED_LOGIN_THRESHOLD = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

async function checkFailedAttempts(email: string) {
  const attempts = await getFailedAttempts(email)
  
  if (attempts >= FAILED_LOGIN_THRESHOLD) {
    const lastAttempt = await getLastFailedAttempt(email)
    if (Date.now() - lastAttempt < LOCKOUT_DURATION) {
      throw new Error('Account temporarily locked due to failed login attempts')
    }
  }
}
```

#### 4. Real-time Alerts
```typescript
// Set up alerts for suspicious activity
async function checkSuspiciousActivity(userId: string) {
  const recentOrders = await getRecentOrders(userId, '1 hour')
  
  // Alert if too many orders in short time
  if (recentOrders.length > 10) {
    await sendAlert({
      type: 'suspicious_activity',
      message: `User ${userId} created ${recentOrders.length} orders in 1 hour`,
      severity: 'high'
    })
  }
}
```

---

## Security Checklist

### 🔒 Pre-Launch Security Audit

#### Authentication & Authorization
- [ ] Strong password policy enforced (8+ chars, complexity)
- [ ] MFA enabled for admin accounts
- [ ] Session timeout configured (30 min idle, 8h absolute)
- [ ] Rate limiting on login endpoint (5 attempts per 15 min)
- [ ] Account lockout after failed attempts
- [ ] Password reset functionality with secure tokens
- [ ] Remember me functionality (if needed) with secure tokens
- [ ] Logout invalidates all sessions

#### Data Protection
- [ ] All sensitive data encrypted in transit (HTTPS)
- [ ] Environment variables secured (.env not committed)
- [ ] Different keys for dev/staging/production
- [ ] API keys rotated regularly
- [ ] No hardcoded secrets in code
- [ ] Sensitive data encrypted at rest (if applicable)
- [ ] PII data minimized (only collect what's needed)

#### Input Validation
- [ ] All user inputs validated (Zod schemas)
- [ ] XSS prevention (React auto-escaping verified)
- [ ] SQL injection prevented (Supabase parameterized queries)
- [ ] File upload validation (type, size limits)
- [ ] Command injection prevented (no shell execution)
- [ ] LDAP injection prevented (if applicable)
- [ ] XML injection prevented (if applicable)

#### API Security
- [ ] Rate limiting implemented on all endpoints
- [ ] Authentication required for sensitive endpoints
- [ ] Authorization checks on all protected resources
- [ ] CORS properly configured
- [ ] API versioning implemented
- [ ] Error messages don't leak sensitive info
- [ ] Request size limits enforced

#### Database Security
- [ ] Row Level Security (RLS) enabled on all tables
- [ ] Least privilege principle applied
- [ ] Sensitive queries use parameterized statements
- [ ] Database backups automated and encrypted
- [ ] Connection strings secured (env variables)
- [ ] Database user has minimal required permissions

#### Infrastructure
- [ ] SSL/TLS certificate valid and auto-renewing
- [ ] Security headers configured (HSTS, CSP, etc.)
- [ ] robots.txt prevents indexing of admin pages
- [ ] Admin routes have noindex meta tags
- [ ] Dependencies updated to latest secure versions
- [ ] Unused dependencies removed
- [ ] Subresource Integrity (SRI) for CDN resources

#### Monitoring & Logging
- [ ] Security events logged (login, logout, failures)
- [ ] Audit trail for sensitive operations
- [ ] Error logging configured (no sensitive data)
- [ ] Monitoring alerts configured
- [ ] Log retention policy defined
- [ ] Logs protected from unauthorized access

#### Incident Response
- [ ] Security incident response plan documented
- [ ] Contact information for security issues published
- [ ] Backup and recovery procedures tested
- [ ] Rollback procedures documented
- [ ] Security team contact defined

---

## Additional Recommendations

### 1. Regular Security Updates
```bash
# Check for vulnerabilities weekly
npm audit

# Update dependencies
npm update

# For critical security updates:
npm audit fix
```

### 2. Security Testing
```bash
# Install OWASP ZAP or Burp Suite for penetration testing
# Run automated security scans before each deployment

# Test common attacks:
# - SQL Injection
# - XSS
# - CSRF
# - Authentication bypass
# - Authorization bypass
```

### 3. Third-Party Services Security
```typescript
// Review all third-party services:
// - Supabase: Managed, SOC 2 compliant
// - Resend: Email service, GDPR compliant
// - Vercel: Hosting, secure by default

// Regularly review:
// - Service status pages
// - Security advisories
// - Terms of service updates
```

### 4. Compliance
- **GDPR**: If serving EU customers
  - [ ] Privacy policy published
  - [ ] Cookie consent implemented
  - [ ] Data deletion process defined
  - [ ] Data export functionality
  
- **Portuguese Data Protection Law**: Comply with local regulations
  - [ ] CNPD registration (if required)
  - [ ] Data processing agreements with vendors

### 5. Security Training
- Train all team members on:
  - Phishing awareness
  - Social engineering
  - Password security
  - Secure coding practices
  - Incident reporting

---

## Quick Reference

### Emergency Contacts
```
Security Issue: [security@peroladovouga.com]
Supabase Support: support@supabase.io
Hosting Support: [Vercel/your hosting]
```

### Useful Commands
```bash
# Check for security issues
npm audit

# Update all dependencies
npm update

# Check environment variables
cat .env.local | grep -v "^#"

# Test SSL certificate
curl -vI https://peroladovouga.com 2>&1 | grep -A 10 "SSL connection"

# Check security headers
curl -I https://peroladovouga.com
```

### Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/platform/going-into-prod#security)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/deploying/production-checklist#security)
- [Web Security Cheat Sheet](https://cheatsheetseries.owasp.org/)

---

**Last Updated**: November 26, 2024
**Review Schedule**: Monthly
**Next Review**: December 26, 2024
