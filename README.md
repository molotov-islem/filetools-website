# FileTools - Traditional Full-Stack Application

A complete file conversion and management tool built with traditional web technologies: HTML5, CSS3, vanilla JavaScript, and PHP.

## 🚀 Features

- **File Conversion Tools**: PDF to Word, Image format conversion, PDF compression
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark/Light Theme**: Toggle between themes with persistent storage
- **Search Functionality**: Find tools quickly with real-time search
- **Secure Processing**: Client-side file processing for maximum security
- **No Dependencies**: Pure vanilla JavaScript, no frameworks required

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Custom CSS with CSS Grid and Flexbox (no frameworks)
- **Vanilla JavaScript**: Modern ES6+ features, no libraries
- **Progressive Enhancement**: Works without JavaScript enabled

### Backend
- **PHP 8.x**: Modern PHP with object-oriented architecture
- **MySQL/SQLite**: Flexible database support
- **RESTful API**: Clean API endpoints for frontend communication
- **MVC Pattern**: Organized code structure with controllers and routing

## 📁 Project Structure

\`\`\`
filetools/
├── index.php                 # Main entry point and router
├── config/
│   └── config.php           # Database and app configuration
├── src/
│   ├── Router.php           # URL routing handler
│   └── controllers/         # PHP controllers
│       ├── HomeController.php
│       └── ApiController.php
├── public/                  # Web-accessible files
│   ├── index.html          # Main HTML template
│   ├── css/
│   │   ├── styles.css      # Main stylesheet
│   │   └── components.css  # Component styles
│   ├── js/
│   │   ├── app.js          # Main application logic
│   │   └── components.js   # Reusable components
│   └── images/             # Static assets
├── database/
│   └── schema.sql          # Database schema and sample data
└── README.md
\`\`\`

## 🚀 Quick Start

### Option 1: PHP Built-in Server (Recommended for Development)

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd filetools
   \`\`\`

2. **Start PHP server**
   \`\`\`bash
   php -S localhost:8000
   \`\`\`

3. **Open in browser**
   \`\`\`
   http://localhost:8000
   \`\`\`

### Option 2: XAMPP/WAMP/MAMP

1. **Copy project to web directory**
   - XAMPP: Copy to `htdocs/filetools/`
   - WAMP: Copy to `www/filetools/`
   - MAMP: Copy to `htdocs/filetools/`

2. **Start Apache and MySQL**

3. **Access the application**
   \`\`\`
   http://localhost/filetools/
   \`\`\`

### Option 3: Laragon (Windows)

1. **Copy project to Laragon www directory**
   \`\`\`
   C:\laragon\www\filetools\
   \`\`\`

2. **Start Laragon services**

3. **Access via**
   \`\`\`
   http://filetools.test
   \`\`\`

## 🗄️ Database Setup

### MySQL Setup

1. **Create database**
   \`\`\`sql
   CREATE DATABASE filetools;
   \`\`\`

2. **Import schema**
   \`\`\`bash
   mysql -u root -p filetools < database/schema.sql
   \`\`\`

3. **Update config**
   Edit `config/config.php` with your database credentials:
   \`\`\`php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'filetools');
   define('DB_USER', 'your_username');
   define('DB_PASS', 'your_password');
   \`\`\`

### SQLite Setup (Alternative)

For a simpler setup, you can use SQLite by modifying the database configuration in `config/config.php`.

## 🌐 Deployment

### Shared Hosting

1. **Upload files** to your hosting provider's public_html directory
2. **Create database** through your hosting control panel
3. **Import schema** using phpMyAdmin or similar tool
4. **Update config** with your hosting database credentials
5. **Set permissions** ensure PHP can write to necessary directories

### VPS/Dedicated Server

1. **Install LAMP stack**
   \`\`\`bash
   sudo apt update
   sudo apt install apache2 mysql-server php php-mysql
   \`\`\`

2. **Configure virtual host**
   ```apache
   <VirtualHost *:80>
       ServerName yourdomain.com
       DocumentRoot /var/www/filetools
       DirectoryIndex index.php
   </VirtualHost>
   \`\`\`

3. **Upload and configure** as described above

## 🔧 Configuration

### Environment Variables

Edit `config/config.php` to customize:

\`\`\`php
// Site configuration
define('SITE_URL', 'https://yourdomain.com');
define('SITE_NAME', 'FileTools');

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'filetools');
define('DB_USER', 'username');
define('DB_PASS', 'password');

// Feature flags
define('ENABLE_USER_ACCOUNTS', false);
define('ENABLE_CONVERSION_HISTORY', false);
\`\`\`

## 🎨 Customization

### Styling
- Edit `public/css/styles.css` for main styles
- Modify CSS custom properties in `:root` for color scheme
- Update `public/css/components.css` for component-specific styles

### Adding New Tools
1. Add tool data to `database/schema.sql`
2. Create tool logic in `src/controllers/ApiController.php`
3. Add frontend handling in `public/js/app.js`

### Theme Customization
Update CSS custom properties in `public/css/styles.css`:
\`\`\`css
:root {
  --color-primary: #04afea;
  --color-secondary: #00efd1;
  --color-dark: #0c3d64;
  /* ... other variables */
}
\`\`\`

## 🔒 Security Features

- **Input Validation**: All user inputs are validated and sanitized
- **SQL Injection Protection**: Prepared statements used throughout
- **XSS Prevention**: Output escaping and Content Security Policy
- **File Upload Security**: Strict file type validation and processing
- **CSRF Protection**: Token-based form protection (can be enabled)

## 📱 Browser Support

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Mobile**: iOS Safari 12+, Chrome Mobile 60+
- **Progressive Enhancement**: Basic functionality works in older browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Community**: Join our discussions for help and feature requests

## 🔄 Migration from Next.js

This project was converted from a Next.js application to traditional web technologies. Key changes:

- **React Components** → **Vanilla JavaScript Classes**
- **Tailwind CSS** → **Custom CSS with CSS Variables**
- **Next.js API Routes** → **PHP Controllers**
- **Server Components** → **PHP Templates**
- **Client State** → **Local Storage + DOM Manipulation**

The design and functionality remain identical to the original Next.js version.
