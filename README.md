<div align="center">

# 💰 SavEarn
### Smart Money-Saving Tracker with AWS Cloud Integration

*Transform your spending decisions into visible earnings with psychology-driven design*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_App-brightgreen?style=for-the-badge)](https://your-cloudfront-url.com)
[![GitHub Stars](https://img.shields.io/github/stars/rajathverse/SavEarn?style=for-the-badge&logo=github)](https://github.com/rajathverse/SavEarn)
[![AWS Powered](https://img.shields.io/badge/⚡_AWS-Powered-orange?style=for-the-badge)](https://aws.amazon.com/)

![SavEarn Dashboard Preview](https://via.placeholder.com/800x400/1f2937/ffffff?text=SavEarn+Dashboard+Preview)

</div>

---

## 🎯 What is SavEarn?

**SavEarn** is a revolutionary web application that reframes money-saving as money-earning through positive psychology. Instead of focusing on what you *didn't spend*, celebrate what you *earned* by making smart financial choices.

### ✨ The Psychology Behind It
- 🧠 **Positive Reinforcement**: Every smart choice becomes an "earning"
- 🎮 **Gamification**: Streaks, progress tracking, and achievement mindset
- 📊 **Visual Progress**: See your smart decisions compound over time
- 💪 **Habit Building**: Transform spending into a conscious, rewarding practice

---

## 🚀 Live Features

| Feature | Description | Status |
|---------|-------------|---------|
| 🔐 **Secure Authentication** | AWS Cognito login/signup | ✅ Live |
| 💰 **Smart Tracking** | Log expensive vs. chosen alternatives | ✅ Live |
| 📊 **Beautiful Analytics** | Interactive charts with Chart.js | ✅ Live |
| ☁️ **Cloud Storage** | DynamoDB data persistence | ✅ Live |
| 📱 **Mobile Responsive** | Perfect on all devices | ✅ Live |
| ⚡ **Instant Loading** | Smart caching system | ✅ Live |

---

## 🏗️ Architecture

```mermaid
graph TB
    A[👤 User] --> B[🌐 CloudFront CDN]
    B --> C[📁 S3 Static Site]
    C --> D[🔒 AWS Cognito]
    C --> E[🌉 API Gateway]
    E --> F[⚡ Lambda Functions]
    F --> G[📊 DynamoDB]
    
    style A fill:#e1f5fe
    style C fill:#f3e5f5
    style G fill:#e8f5e8
```

---

## 💡 How It Works

### 1. **Log Smart Choices**
```
❌ Expensive Option: Restaurant dinner - ₹800
✅ Smart Choice: Home cooking - ₹150
💰 You Earned: ₹650
```

### 2. **Watch Your Earnings Grow**
- Real-time dashboard updates
- Daily and monthly trends
- Category-wise insights
- Streak tracking

### 3. **Stay Motivated**
- Visual progress charts
- Achievement milestones
- Positive reinforcement UI
- Mobile-friendly interface

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)

### Backend & Cloud
![AWS Lambda](https://img.shields.io/badge/AWS_Lambda-FF9900?style=for-the-badge&logo=aws-lambda&logoColor=white)
![Amazon DynamoDB](https://img.shields.io/badge/Amazon%20DynamoDB-4053D6?style=for-the-badge&logo=Amazon%20DynamoDB&logoColor=white)
![AWS Cognito](https://img.shields.io/badge/AWS_Cognito-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![API Gateway](https://img.shields.io/badge/API_Gateway-FF4B4B?style=for-the-badge&logo=amazon-aws&logoColor=white)

</div>

---

## 🚀 Quick Start

### Option 1: Try Locally (30 seconds)
```bash
# Clone the repository
git clone https://github.com/rajathverse/SavEarn.git
cd SavEarn

# Open in browser
start index.html  # Windows
open index.html   # macOS
```

### Option 2: Full AWS Deployment
```bash
# 1. Setup AWS
./setup-aws.bat

# 2. Deploy backend
cd backend
npm install
npm run deploy

# 3. Update config and deploy frontend
# Edit aws-config.js with your API endpoints
# Upload to S3 via AWS Console or CLI
```

---

## 📊 Screenshots

<div align="center">

### 🖥️ Desktop Dashboard
![Desktop View](https://via.placeholder.com/600x350/1f2937/ffffff?text=Desktop+Dashboard+View)

### 📱 Mobile Interface
![Mobile View](https://via.placeholder.com/300x600/1f2937/ffffff?text=Mobile+Responsive+Design)

### 📈 Analytics Charts
![Analytics](https://via.placeholder.com/600x350/1f2937/ffffff?text=Beautiful+Analytics+Charts)

</div>

---

## 💰 Real-World Examples

| Scenario | Expensive Option | Smart Choice | Earnings |
|----------|------------------|--------------|----------|
| 🍕 Lunch | Restaurant pizza (₹450) | Home sandwich (₹80) | **₹370** |
| 🚗 Transport | Uber ride (₹300) | Metro (₹25) | **₹275** |
| 👕 Shopping | Brand shirt (₹2000) | Similar quality (₹800) | **₹1200** |
| ☕ Coffee | Café latte (₹250) | Home coffee (₹15) | **₹235** |

**Daily Potential Earnings: ₹2080+**

---

## 🏆 Key Benefits

- **🎯 Psychological Edge**: Positive reinforcement over restriction
- **📈 Data-Driven**: Visual insights into spending patterns  
- **🔒 Secure**: Enterprise-grade AWS security
- **📱 Accessible**: Works perfectly on all devices
- **⚡ Fast**: Instant loading with smart caching
- **💵 Cost-Effective**: Runs on AWS free tier

---

## 🛠️ Development

### Local Development
```bash
# No build process needed - pure HTML/CSS/JS
open index.html
```

### Backend Development  
```bash
cd backend
npm install
npm test          # Run tests
npm run deploy    # Deploy to AWS
```

### Project Structure
```
SavEarn/
├── 📄 index.html              # Main application
├── ⚙️ aws-config.js          # AWS configuration
├── 📚 backend/               # Serverless backend
│   ├── src/handlers/         # Lambda functions
│   ├── serverless.yml        # Infrastructure
│   └── package.json
├── 📋 DEPLOYMENT.md          # Deployment guide
└── 🔧 setup-aws.bat         # Setup helper
```

---

## 🌟 Performance

- **⚡ Loading**: < 1 second with smart caching
- **📱 Mobile**: Perfect lighthouse scores
- **🔄 Sync**: Real-time data synchronization  
- **💾 Storage**: Efficient DynamoDB queries
- **🌐 CDN**: Global CloudFront distribution

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📞 Support & Contact

<div align="center">

**Built by [Rajath Chowdhury](https://github.com/rajathverse)**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rajathverse)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:rjrajathm06@gmail.com)

</div>

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### 🌟 Star this repo if SavEarn helped you save money! 

**Transform every smart choice into visible progress** 💰📈

*Made with ❤️ using AWS serverless architecture*

</div>