# Crime Report Kenya

A comprehensive crime reporting and management system built with React and Node.js.

![Crime Report Kenya](https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)

## Features

- 🔒 Secure Authentication System
- 📱 Responsive Design for All Devices
- 🚨 Anonymous Crime Reporting
- 📊 Real-time Blog Analytics
- 📧 Newsletter Subscription System
- 👮 Admin Dashboard with Case Management
- 📈 Report Statistics and Analytics
- 🗺️ Location-based Reporting
- 📱 Mobile-First Design
- 🔔 Real-time Notifications

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Firebase Authentication
- Framer Motion
- React Router DOM
- React Hot Toast
- Heroicons

### Backend
- Node.js
- Express.js
- Nodemailer
- Firebase Admin SDK
- CORS
- Dotenv

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js >= 14.x
- npm >= 6.x
- Firebase account
- Gmail account (for email notifications)

## Installation

### Frontend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/crimereport-kenya.git
cd crimereport-kenya
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm start
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
ADMIN_EMAIL=admin@crimereportkenya.com
ADMIN_EMAILS=admin1@crimereportkenya.com,admin2@crimereportkenya.com
FRONTEND_URL=http://localhost:3000
```

4. Start the backend server:
```bash
npm start
```

## Docker Deployment

### Frontend Dockerfile
Create a `Dockerfile` in the root directory:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Backend Dockerfile
Create a `Dockerfile` in the backend directory:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Docker Compose
Create a `docker-compose.yml` in the root directory:
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
```

## Deployment

### Frontend Deployment (Render)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Select the repository
4. Configure the build settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variables from your `.env` file

### Backend Deployment (Render)
1. Create a new Web Service for the backend
2. Select the backend directory
3. Configure the build settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables from your backend `.env` file

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - [@yourusername](https://twitter.com/yourusername)
Project Link: [https://github.com/yourusername/crimereport-kenya](https://github.com/yourusername/crimereport-kenya)
