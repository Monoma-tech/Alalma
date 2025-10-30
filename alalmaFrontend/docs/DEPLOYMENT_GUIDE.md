# 🚀 Deployment Guide - AlAlma Platform

## 📋 Overview

Esta guía completa cubre todos los aspectos del deployment de la plataforma AlAlma en producción, incluyendo configuraciones de infraestructura, variables de entorno, servicios de terceros y mejores prácticas de DevOps.

---

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Services      │
│   (Next.js)     │    │   (Node.js)     │    │                 │
│                 │    │                 │    │  • PostgreSQL   │
│  • Static Site  │◄──►│  • REST API     │◄──►│  • Redis        │
│  • Client Side  │    │  • WebSocket    │    │  • Agora.io     │
│  • Edge Functions│   │  • Auth Server  │    │  • Stripe       │
└─────────────────┘    └─────────────────┘    │  • AWS S3       │
                                               └─────────────────┘
```

---

## 🌐 Frontend Deployment (Next.js)

### Recommended Platform: **Vercel**

#### 1. Vercel Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Initialize project
vercel

# Deploy to production
vercel --prod
```

#### 2. Environment Variables (Vercel)
```bash
# Required Environment Variables
NEXT_PUBLIC_API_URL=https://api.alalma.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_AGORA_APP_ID=your_agora_app_id
NEXT_PUBLIC_WS_URL=wss://api.alalma.com
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://alalma.com

# Analytics (Optional)
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=your_hotjar_id

# Feature Flags (Optional)
NEXT_PUBLIC_ENABLE_LIVE_STREAMING=true
NEXT_PUBLIC_ENABLE_PAYMENTS=true
```

#### 3. Build Configuration
```javascript
// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: true, // Enable Turbopack for faster builds
  },
  images: {
    domains: [
      'api.alalma.com',
      'alalma-storage.s3.amazonaws.com',
      'lh3.googleusercontent.com', // For Google OAuth avatars
    ],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/login',
        permanent: false,
        has: [
          {
            type: 'cookie',
            key: 'auth-token',
            value: undefined,
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

#### 4. Performance Optimizations
```javascript
// package.json - Production dependencies only
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "analyze": "ANALYZE=true next build"
  },
  "dependencies": {
    // Only production dependencies
  }
}
```

### Alternative: **Netlify**

#### Netlify Configuration
```toml
# netlify.toml
[build]
  publish = ".next"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NEXT_TELEMETRY_DISABLED = "1"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "origin-when-cross-origin"

[[redirects]]
  from = "/api/*"
  to = "https://api.alalma.com/api/:splat"
  status = 200
  force = true
```

---

## 🖥️ Backend Deployment (Node.js)

### Recommended Platform: **Railway** / **DigitalOcean App Platform**

#### 1. Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### 2. Backend Environment Variables
```bash
# Database
DATABASE_URL=postgresql://username:password@host:5432/alalma_prod
REDIS_URL=redis://username:password@host:6379

# Authentication
JWT_SECRET=your_super_secure_jwt_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
BCRYPT_ROUNDS=12

# Third-party Services
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_certificate

# File Storage
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=alalma-storage
AWS_REGION=us-east-1

# Email Service
SENDGRID_API_KEY=SG.your_sendgrid_key
FROM_EMAIL=noreply@alalma.com

# Monitoring
SENTRY_DSN=https://your_sentry_dsn

# Feature Flags
ENABLE_LIVE_STREAMING=true
ENABLE_PAYMENTS=true
ENABLE_REGISTRATION=true

# CORS
ALLOWED_ORIGINS=https://alalma.com,https://www.alalma.com
```

#### 3. Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Builder
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./

USER nodejs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]
```

#### 4. Docker Compose (Development/Staging)
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: alalma
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

---

## 🗄️ Database Setup (PostgreSQL)

### Recommended Service: **Supabase** / **AWS RDS**

#### 1. Database Schema Migration
```sql
-- Production database setup
CREATE DATABASE alalma_prod;

-- Run migrations
psql -h your-host -U username -d alalma_prod -f migrations/001_initial.sql
psql -h your-host -U username -d alalma_prod -f migrations/002_live_streaming.sql
psql -h your-host -U username -d alalma_prod -f migrations/003_instructors.sql
```

#### 2. Database Indexes for Performance
```sql
-- Critical indexes for production
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_products_category ON products(category);
CREATE INDEX CONCURRENTLY idx_live_sessions_is_live ON live_sessions(is_live);
CREATE INDEX CONCURRENTLY idx_live_sessions_start_time ON live_sessions(start_time);
CREATE INDEX CONCURRENTLY idx_instructors_rating ON instructors(rating DESC);
CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);
CREATE INDEX CONCURRENTLY idx_cart_items_user_id ON cart_items(user_id);
```

#### 3. Database Configuration
```bash
# PostgreSQL Production Settings
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
```

---

## 🚀 CDN & Storage Setup

### AWS S3 + CloudFront Configuration

#### 1. S3 Bucket Setup
```bash
# Create S3 bucket
aws s3 mb s3://alalma-storage --region us-east-1

# Set bucket policy
aws s3api put-bucket-policy --bucket alalma-storage --policy file://bucket-policy.json
```

```json
// bucket-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::alalma-storage/public/*"
    }
  ]
}
```

#### 2. CloudFront Distribution
```json
// cloudfront-config.json
{
  "CallerReference": "alalma-cdn-2024",
  "Origins": [
    {
      "Id": "S3Origin",
      "DomainName": "alalma-storage.s3.amazonaws.com",
      "S3OriginConfig": {
        "OriginAccessIdentity": ""
      }
    }
  ],
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3Origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "Compress": true,
    "CachePolicyId": "managed-caching-optimized"
  }
}
```

---

## 🔴 Redis Setup

### Recommended Service: **Redis Cloud** / **AWS ElastiCache**

#### Redis Configuration
```bash
# Redis production settings
maxmemory 512mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

#### Redis Connection (Node.js)
```javascript
// redis.config.js
const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL,
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('Redis server refused connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  },
});

module.exports = client;
```

---

## 💳 Third-Party Services Integration

### 1. Stripe Configuration

#### Production Setup
```javascript
// stripe.config.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Webhook endpoint security
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.post('/webhook/stripe', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Handle successful payment
      break;
    case 'customer.subscription.updated':
      // Handle subscription changes
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});
```

### 2. Agora.io Configuration

#### Token Server Setup
```javascript
// agora.config.js
const { RtcTokenBuilder, RtcRole } = require('agora-token');

class AgoraTokenService {
  constructor() {
    this.appId = process.env.AGORA_APP_ID;
    this.appCertificate = process.env.AGORA_APP_CERTIFICATE;
  }

  generateToken(channelName, uid, role = 'audience') {
    const expirationTimeInSeconds = 3600; // 1 hour
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    
    const roleType = role === 'host' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    
    return RtcTokenBuilder.buildTokenWithUid(
      this.appId,
      this.appCertificate,
      channelName,
      uid,
      roleType,
      privilegeExpiredTs
    );
  }
}

module.exports = new AgoraTokenService();
```

### 3. Email Service (SendGrid)

#### Email Configuration
```javascript
// email.config.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
  async sendWelcomeEmail(userEmail, userName) {
    const msg = {
      to: userEmail,
      from: process.env.FROM_EMAIL,
      templateId: 'd-welcome-template-id',
      dynamicTemplateData: {
        name: userName,
        loginUrl: 'https://alalma.com/login'
      }
    };
    
    return sgMail.send(msg);
  }

  async sendLiveSessionNotification(userEmail, sessionTitle, sessionUrl) {
    const msg = {
      to: userEmail,
      from: process.env.FROM_EMAIL,
      templateId: 'd-live-session-template-id',
      dynamicTemplateData: {
        sessionTitle,
        sessionUrl,
        unsubscribeUrl: 'https://alalma.com/unsubscribe'
      }
    };
    
    return sgMail.send(msg);
  }
}

module.exports = new EmailService();
```

---

## 🔒 Security Configuration

### 1. SSL/TLS Setup

#### Let's Encrypt with Nginx
```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name alalma.com www.alalma.com;
    
    ssl_certificate /etc/letsencrypt/live/alalma.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/alalma.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name alalma.com www.alalma.com;
    return 301 https://$server_name$request_uri;
}
```

### 2. Rate Limiting
```javascript
// rate-limiting.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // stricter limit for auth endpoints
  message: 'Too many authentication attempts',
});

module.exports = { limiter, strictLimiter };
```

### 3. Environment Security
```bash
# Use secrets management
# AWS Secrets Manager / HashiCorp Vault

# Example: Accessing secrets in production
export DATABASE_URL=$(aws secretsmanager get-secret-value --secret-id alalma/database --query SecretString --output text | jq -r .DATABASE_URL)
```

---

## 📊 Monitoring & Analytics

### 1. Application Monitoring (Sentry)

#### Sentry Setup
```javascript
// sentry.config.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

// Express error handler
app.use(Sentry.Handlers.errorHandler());
```

### 2. Analytics (Google Analytics 4)

#### GA4 Implementation
```javascript
// analytics.js
export const gtag = {
  GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  
  pageview: (url) => {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  },
  
  event: ({ action, category, label, value }) => {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  },
};
```

### 3. Performance Monitoring

#### APM Configuration
```javascript
// apm.config.js
const apm = require('elastic-apm-node').start({
  serviceName: 'alalma-backend',
  secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
  serverUrl: process.env.ELASTIC_APM_SERVER_URL,
  environment: process.env.NODE_ENV,
});

module.exports = apm;
```

---

## 🚨 Health Checks & Logging

### 1. Health Check Endpoints
```javascript
// health.js
app.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      external_apis: await checkExternalAPIs(),
    }
  };
  
  const isHealthy = Object.values(health.checks).every(check => check.status === 'ok');
  
  res.status(isHealthy ? 200 : 503).json(health);
});
```

### 2. Structured Logging
```javascript
// logger.config.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test
      - run: npm run build
      
  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
  
  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        uses: railway-deploy@v1
        with:
          token: ${{ secrets.RAILWAY_TOKEN }}
          service: alalma-backend
```

---

## 📋 Deployment Checklist

### Pre-Deployment ✅
- [ ] All environment variables configured
- [ ] Database migrations tested
- [ ] SSL certificates valid
- [ ] Domain DNS configured
- [ ] Third-party service limits checked
- [ ] Backup strategies in place

### Post-Deployment ✅
- [ ] Health checks passing
- [ ] SSL/HTTPS working
- [ ] Database connections stable
- [ ] Redis cache functioning
- [ ] Email sending tested
- [ ] Payment processing tested
- [ ] Live streaming tested
- [ ] Performance monitoring active
- [ ] Error tracking configured

### Go-Live ✅
- [ ] Domain propagation complete
- [ ] CDN caching optimized
- [ ] Analytics tracking verified
- [ ] User registration tested
- [ ] Complete user flow tested
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility checked

---

## 🆘 Troubleshooting Guide

### Common Issues & Solutions

#### 1. Build Failures
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check Node.js version
node --version  # Should be 18+

# Memory issues during build
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

#### 2. Database Connection Issues
```bash
# Test database connection
psql -h your-host -U username -d database_name -c "SELECT version();"

# Check connection pool
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';
```

#### 3. Redis Connection Issues
```bash
# Test Redis connection
redis-cli -h your-host -p 6379 ping

# Check Redis memory usage
redis-cli info memory
```

#### 4. SSL Certificate Issues
```bash
# Check certificate expiration
echo | openssl s_client -connect alalma.com:443 | openssl x509 -noout -dates

# Renew Let's Encrypt certificate
certbot renew --dry-run
```

---

## 📈 Performance Optimization

### 1. Frontend Optimizations
- **Image Optimization**: Use Next.js Image component with proper sizing
- **Code Splitting**: Route-based and component-based splitting
- **Caching**: Implement proper cache headers
- **Bundle Analysis**: Regular bundle size monitoring

### 2. Backend Optimizations
- **Database Indexing**: Proper indexes on frequently queried columns
- **Redis Caching**: Cache frequently accessed data
- **API Rate Limiting**: Prevent API abuse
- **Query Optimization**: Use database query analyzers

### 3. Infrastructure Optimizations
- **CDN Usage**: Serve static assets via CDN
- **Database Connection Pooling**: Optimize database connections
- **Horizontal Scaling**: Scale based on traffic patterns
- **Load Balancing**: Distribute traffic across multiple servers

---

## 💰 Cost Optimization

### Monthly Cost Estimates (1000 active users)

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| Vercel (Frontend) | Pro | $20 |
| Railway (Backend) | Pro | $20 |
| Supabase (Database) | Pro | $25 |
| Redis Cloud | 30MB | $5 |
| AWS S3 + CloudFront | Standard | $10 |
| Stripe | Transaction fees | ~2.9% |
| Agora.io | Video minutes | $6-10 |
| SendGrid | Email | $15 |
| **Total** | | **~$101-105/month** |

### Scaling Costs (10,000 users)
- Estimated monthly cost: $300-400
- Additional infrastructure needed
- More robust monitoring required

---

**🎉 ¡La plataforma AlAlma está lista para producción con esta configuración de deployment!**

Esta guía cubre todos los aspectos críticos para un deployment exitoso y escalable. Recuerda mantener la documentación actualizada conforme evoluciona la infraestructura.