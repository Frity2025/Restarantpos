# የባህል ምግብ ቤት POS ስርዓት (Restaurant POS System)

A comprehensive Point of Sale (POS) system designed specifically for Ethiopian restaurants, featuring bilingual support (English/Amharic), inventory management, automatic reordering, reporting, and notification systems.

## 🌟 Features

### 🏪 **Core POS Functionality**
- **Multi-role Support**: Admin, Cashier, Kitchen staff roles
- **Order Management**: Create, modify, and track orders
- **Table Management**: Table reservations and waitlist
- **Payment Processing**: Multiple payment methods support
- **Kitchen Display**: Real-time order tracking for kitchen staff

### 📦 **Inventory Management**
- **Real-time Stock Tracking**: Monitor inventory levels
- **Automatic Reordering**: Smart reorder points and automated purchase orders
- **Supplier Management**: Comprehensive supplier database
- **Barcode Scanning**: Product identification and inventory updates
- **Low Stock Alerts**: Automated notifications for low inventory

### 📊 **Reporting & Analytics**
- **Sales Reports**: Daily, weekly, monthly sales analysis
- **Inventory Reports**: Stock levels, movements, and valuations
- **Financial Reports**: Revenue, costs, and profit analysis
- **Operational Reports**: Kitchen efficiency and performance metrics

### 🔔 **Notification System**
- **Multi-channel Notifications**: Email, SMS, and Push notifications
- **Automated Alerts**: Order confirmations, low stock, shift reminders
- **Template Management**: Customizable notification templates
- **Delivery Tracking**: Real-time notification status

### 🌐 **Bilingual Support**
- **English/Amharic Interface**: Complete bilingual support
- **Cultural Adaptation**: Ethiopian restaurant-specific features
- **Local Currency**: Ethiopian Birr (ETB) support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker and Docker Compose (for production)
- Modern web browser

### Development Setup

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/restaurant-pos.git
   cd restaurant-pos
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Deployment

1. **Using Docker Compose**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

2. **Manual Deployment**
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Context API
- **Charts**: Recharts
- **Barcode**: JsBarcode
- **Deployment**: Docker, Nginx

### Project Structure
\`\`\`
restaurant-pos/
├── app/                    # Next.js app directory
├── components/             # Reusable UI components
├── contexts/              # React contexts
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries and services
├── types/                 # TypeScript type definitions
├── public/                # Static assets
├── styles/                # Global styles
└── config/                # Configuration files
\`\`\`

## 📱 User Roles & Permissions

### 👨‍💼 **Admin**
- Full system access
- Employee management
- Inventory and supplier management
- Reports and analytics
- System configuration

### 💰 **Cashier**
- Order creation and payment processing
- Table management
- Customer service
- Basic inventory viewing

### 👨‍🍳 **Kitchen Staff**
- Kitchen display system
- Order status updates
- Inventory usage tracking
- Recipe management

## 🔧 Configuration

### Environment Variables
\`\`\`env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
DATABASE_URL=your_database_url
SMTP_HOST=your_smtp_host
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMS_API_KEY=your_sms_api_key
\`\`\`

### Notification Setup
1. Configure SMTP settings for email notifications
2. Set up SMS provider (Twilio, AWS SNS, or local provider)
3. Configure push notification keys for web push

### SSL Certificate
For production deployment, place your SSL certificates in the `ssl/` directory:
- `cert.pem` - SSL certificate
- `key.pem` - Private key

## 📊 Key Features Deep Dive

### Automatic Inventory Reordering
- **Smart Reorder Points**: Configurable minimum stock levels
- **Consumption Analysis**: AI-powered demand forecasting
- **Supplier Integration**: Automated purchase order generation
- **Approval Workflows**: Configurable approval thresholds

### Comprehensive Reporting
- **Real-time Dashboards**: Live business metrics
- **Export Capabilities**: PDF and CSV report generation
- **Custom Date Ranges**: Flexible reporting periods
- **Visual Analytics**: Charts and graphs for data visualization

### Multi-language Support
- **Complete Translation**: All UI elements in English and Amharic
- **Cultural Adaptation**: Ethiopian business practices integration
- **Local Formatting**: Date, time, and currency formatting

## 🔒 Security Features

- **Role-based Access Control**: Granular permissions system
- **HTTPS Enforcement**: SSL/TLS encryption
- **Rate Limiting**: API protection against abuse
- **Input Validation**: XSS and injection protection
- **Session Management**: Secure authentication

## 🚀 Performance Optimizations

- **Server-side Rendering**: Fast initial page loads
- **Image Optimization**: Automatic image compression
- **Code Splitting**: Lazy loading for better performance
- **Caching Strategy**: Static asset caching
- **Database Optimization**: Efficient data queries

## 📱 Mobile Responsiveness

- **Responsive Design**: Works on all device sizes
- **Touch-friendly Interface**: Optimized for tablets and phones
- **Offline Capabilities**: Basic functionality without internet
- **PWA Support**: Progressive Web App features

## 🧪 Testing

\`\`\`bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@restaurant-pos.com
- Documentation: [Wiki](https://github.com/your-username/restaurant-pos/wiki)

## 🎯 Roadmap

- [ ] Mobile app development (React Native)
- [ ] Advanced analytics and ML predictions
- [ ] Multi-location support
- [ ] Integration with accounting software
- [ ] Customer loyalty program
- [ ] Online ordering system

---

**የባህል ምግብ ቤት POS ስርዓት** - Empowering Ethiopian restaurants with modern technology! 🇪🇹
