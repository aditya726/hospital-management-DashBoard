# 🏥 Hospital Management Dashboard

A modern full-stack **Hospital Management System** with a built-in **AI Health Assistant** powered by [Ollama Gemma3](https://ollama.com/library/gemma), designed to streamline the administration of doctors, patients, and appointments.

## 🚀 Tech Stack

- **Frontend:** React, [Lucide React](https://lucide.dev/)
- **Backend:** FastAPI
- **Authentication:** JWT (JSON Web Tokens)
- **Database:** MongoDB Atlas (Cloud)
- **AI Assistant:** Ollama - Gemma3 Model

---

## ✨ Features

### 🧠 AI Health Assistant
- Powered by **Ollama Gemma3**
- Integrated into the dashboard for basic health-related Q&A and suggestions

### 👨‍⚕️ Doctors Management
- Add new doctors
- Edit doctor details
- Delete doctors
- View doctor list

### 🧑‍🤝‍🧑 Patients Management
- Add patient profiles
- Edit patient information
- Delete patients
- View patient database

### 📅 Appointments Management
- Schedule appointments
- Modify appointment details
- Cancel appointments
- View appointment history

---

## 🔐 Authentication

- Secure login system using **JWT**
- Role-based access support (can be extended to Admin, Doctor, Staff)

---

## 🌐 MongoDB Atlas Integration

- Cloud-based storage for all doctors, patients, and appointment data
- Fast and scalable NoSQL database integration with FastAPI using PyMongo or ODM libraries

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hospital-management-dashboard.git
```
cd hospital-management-dashboard
## 2. Backend (FastAPI)
```
bash
Copy
Edit
cd backend
python -m venv env
source env/bin/activate  # or `env\Scripts\activate` on Windows
pip install -r requirements.txt
Create a .env file and add your environment variables:

env
Copy
Edit
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
ALGORITHM = "YOUR ALGO(FOR JWT)"
Run the server:

bash
Copy
Edit
uvicorn main:app --reload
```
## 3. Frontend (React)
```
bash
Copy
Edit
cd frontend
npm install
npm run dev
```
## 🤖 Ollama AI Assistant (Gemma3)
```
Make sure Ollama is installed locally and running the gemma:3b model.

API integrated with the backend to respond to health-related queries.

bash
Copy
Edit
ollama run gemma:3b
You can modify the assistant behavior or swap models by updating the backend's interaction logic.
```
## 📸 Screenshots
- Uploaded in ProjectImages file
  
## 🧪 Future Improvements
- Role-based dashboards (Admin, Doctor, Receptionist)
- PDF report generation
- Real-time notifications using WebSockets
- Advanced health analytics from AI assistant
- Integration with wearable/health data APIs


##🧑‍💻 Author
  - Made with ❤️ by Aditya.



