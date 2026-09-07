# ⚡ CV Vault - Backend REST API Service

**CV Vault Backend** is a production-ready, pure REST API microservice built with Node.js, Express, MongoDB Atlas, Azure Blob Storage, Docker, and Azure Container Apps.

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```powershell
cd "C:\Users\praja\Downloads\Azure Project\cv-vault"
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```

### 3. Run the Backend API
```powershell
npm start
```
The REST API will start at **`http://localhost:5000`**.

---

## 🧪 REST API Endpoints & Postman Guide

| Method | Endpoint | Description | Payload / Params |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | API Documentation & Welcome JSON | None |
| **GET** | `/api/health` | Health Check Endpoint | None |
| **POST** | `/api/resumes/upload` | Upload resume file & save metadata | `multipart/form-data` (`resume` file, `candidateName`, `category`, `tags`, `notes`) |
| **GET** | `/api/resumes` | Retrieve list of resumes | `?search=keyword` & `?category=Frontend` |
| **GET** | `/api/resumes/stats/summary` | Get storage size, candidate count, & top categories | None |
| **GET** | `/api/resumes/:id` | Get single resume details | URL Parameter `:id` |
| **DELETE** | `/api/resumes/:id` | Delete resume from storage and database | URL Parameter `:id` |

---

## 🛠 Azure Cloud & Docker Commands

### 1. Azure Blob Storage Setup
```powershell
az login
az group create --name rg-cv-vault --location eastus
az storage account create --name stcvvault$((Get-Random -Maximum 9999)) --resource-group rg-cv-vault --location eastus --sku Standard_LRS
$STORAGE_CONN = az storage account show-connection-string --resource-group rg-cv-vault --name stcvvault... --query connectionString --output tsv
az storage container create --name resumes --connection-string $STORAGE_CONN --public-access blob
```

### 2. Docker Build & ACR Push
```powershell
docker build -t cv-vault-api .
docker run -p 5000:5000 --env-file .env cv-vault-api
```

### 3. Azure Container Apps Deployment
```powershell
az containerapp env create --name env-cv-vault --resource-group rg-cv-vault --location eastus
az containerapp create --name app-cv-vault-api --resource-group rg-cv-vault --environment env-cv-vault --image acrcvvault....azurecr.io/cv-vault-api:v1 --target-port 5000 --ingress external
```
