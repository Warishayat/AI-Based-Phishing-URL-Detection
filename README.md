<h1 align="center">🛡️ Phishing URL Detector</h1>

<p align="center">
  <b>Detect malicious links. Stay safe. Browse smart.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-Backend-green?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python" />
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
</p>

---

## 🚀 About The Project

A **modern phishing detection system** that analyzes URLs and tells whether they are:

* ✅ Safe
* ⚠️ Suspicious
* ❌ Dangerous

Built with performance and security in mind, this tool helps users avoid **phishing attacks and malicious websites**.

---

## ✨ Features

<div align="center">

| Feature                  | Description                          |
| ------------------------ | ------------------------------------ |
| 🔍 Smart Scan            | Analyze any URL instantly            |
| 🤖 Intelligent Detection | Detect phishing patterns             |
| ⚡ Fast API               | Built with FastAPI                   |
| 📊 Clear Results         | Easy-to-understand output            |
| 🔐 Secure                | Designed with security-first mindset |

</div>

---

## 🧠 Detection Logic

The system checks:

✔ Suspicious keywords (login, verify, secure)
✔ Fake domain patterns
✔ Too many subdomains
✔ Typosquatting (e.g., gooogle.com)
✔ Suspicious TLDs (.xyz, .click, .top)
✔ Brand impersonation

---

## 🏗️ Tech Stack

<div align="center">

### ⚙️ Backend

* 🐍 Python
* ⚡ FastAPI
* 🗄️ SQLAlchemy

### 🌐 Frontend (Optional)

* ⚛️ React.js
* 🎨 HTML5 + CSS3
* 💡 JavaScript

### 🧰 Tools & Services

* 🔐 JWT Authentication
* 📧 Email Integration (Alerts)
* 🐳 Docker (optional)
* ☁️ Deployment (Render / AWS)

</div>

---

## 📦 Installation

```bash
# Clone repo
git clone https://github.com/your-username/phishing-url-detector.git

# Go to folder
cd phishing-url-detector

# Create virtual environment
python -m venv venv

# Activate
source venv/bin/activate
venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt
```

---

## ▶️ Run Project

```bash
uvicorn main:app --reload
```

📍 Open in browser:
[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 📡 API Example

### Request

```json
{
  "url": "https://paypal-secure-login-verification.com"
}
```

### Response

```json
{
  "status": "Dangerous",
  "reason": "Detected phishing keywords and fake domain structure"
}
```

---

## 🧪 Test URLs

* [https://paypal-secure-login-verification.com](https://paypal-secure-login-verification.com)
* [https://amaz0n-account-update.net](https://amaz0n-account-update.net)
* [https://facebook.com.security-check.login-alert.net](https://facebook.com.security-check.login-alert.net)

---

## 📈 Future Enhancements

* 🧠 AI/ML based detection
* 🌍 Browser Extension
* 📱 Mobile App
* 🔗 Real-time threat intelligence APIs

---

## 🤝 Contributing

Pull requests are welcome!

```bash
# Fork → Clone → Code → Push → PR 🚀
```

---

## 👨‍💻 Author

**Waris Hayat**

---

## ⭐ Show Some Love

If you like this project:

👉 Give it a ⭐ on GitHub
👉 Share with friends
👉 Improve & contribute

---

<p align="center">
  ❤️ Built with passion & security in mind
</p>
