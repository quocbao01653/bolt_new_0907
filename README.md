# ShopFlow - Full-Stack E-commerce Application

A modern, production-ready e-commerce application built with Next.js 13+, TypeScript, Prisma, and PostgreSQL, fully containerized with Docker.

## 🚀 Quick Start with Docker Compose

To start the entire project (app, database, Redis, MailHog) with one command:

```sh
docker-compose up --build
```

- The app will be available at http://localhost:3000
- PostgreSQL at localhost:5432 (user: postgres, password: password123)
- Redis at localhost:6379
- MailHog at http://localhost:8025

This will automatically run database migrations and seed the database with demo data.

---

## 🚀 Features

### Customer Features
- **Product Catalog**: Browse products with advanced filtering and search
- **Shopping Cart**: Add/remove items with persistent cart
- **User Authentication**: Email/password and OAuth (Google) login
- **Order Management**: Place orders and track order history
- **Product Reviews**: Rate and review products
- **Responsive Design**: Mobile-first design with Tailwind CSS

### Admin Features
- **Dashboard**: Overview of sales, orders, and customers
- **Product Management**: CRUD operations for products
- **Order Management**: Process and update order status
- **User Management**: Manage customer accounts
- **Analytics**: Sales reports and insights

### Technical Features
- **Full-Stack TypeScript**: End-to-end type safety
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with multiple providers
- **Caching**: Redis for session and data caching
- **File Upload**: Image upload for products
- **Payment Processing**: Stripe integration ready
- **Docker**: Fully containerized application
- **API Routes**: RESTful API with Next.js App Router

## 🛠️ Tech Stack

- **Frontend**: Next.js 13+, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui, Lucide React
- **Containerization**: Docker, Docker Compose

## 🐳 Docker Setup

### Prerequisites
- Docker and Docker Compose installed
- Git

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shopflow
   ```

2. **Start Docker services**
   ```bash
   npm run docker:up
   ```

3. **Setup database and seed data**
   ```bash
   npm run setup
   ```

4. **Start the Next.js development server**
   ```bash
   npm run dev
   ```

5. **Access the services**
   - Application: http://localhost:3000
   - Database: localhost:5432
   - Redis: localhost:6379
   - Email UI (MailHog): http://localhost:8025
   - Database Admin (Adminer): http://localhost:8080

### Docker Commands

```bash
# Start all Docker services
npm run docker:up

# Stop all Docker services
npm run docker:down

# View service logs
npm run docker:logs

# Restart services
npm run docker:restart

# Complete setup (start services + setup database)
npm run setup
```

## 💻 Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis (optional)

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Setup database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Create and run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── [categorySlug]/    # Category pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   └── home/             # Homepage components
├── lib/                  # Utility libraries
│   ├── prisma.ts         # Database client
│   ├── auth.ts           # Authentication config
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema and migrations
├── scripts/              # Database scripts
├── types/                # TypeScript type definitions
├── docker-compose.yml    # Docker services
├── Dockerfile           # Application container
└── README.md
```

## 🔐 Authentication

The application supports multiple authentication methods:

- **Email/Password**: Traditional registration and login
- **Google OAuth**: Social login with Google
- **Role-based Access**: Customer and Admin roles

### Default Admin Account
- Email: `admin@shopflow.com`
- Password: `admin123`

## 🛒 API Endpoints

### Products
- `GET /api/products` - List products with filtering
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/[id]` - Update product (Admin)
- `DELETE /api/products/[id]` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/[id]` - Update cart item
- `DELETE /api/cart/[id]` - Remove cart item

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order details

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category (Admin)

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Production

```bash
# Build production image
docker build -t shopflow-prod .

# Run with production environment
docker run -p 3000:3000 --env-file .env.production shopflow-prod
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |
| `REDIS_URL` | Redis connection string | No |
| `STRIPE_SECRET_KEY` | Stripe secret key | No |

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

## 📈 Performance

- **Image Optimization**: Next.js automatic image optimization
- **Caching**: Redis caching for frequently accessed data
- **Database**: Optimized queries with Prisma
- **Static Generation**: Pre-rendered pages where possible
- **Code Splitting**: Automatic code splitting with Next.js

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the FAQ section

## 🔄 Updates

Stay updated with the latest changes:
- Watch the repository for updates
- Check the CHANGELOG.md for version history
- Follow the project roadmap