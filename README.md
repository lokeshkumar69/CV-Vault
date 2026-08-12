# ⚡ CV Vault - Complete Cloud Resume Storage & Vault Project

**CV Vault** is a full-stack resume management application built with Node.js, Express, MongoDB, Azure Blob Storage, Docker, and Azure Container Apps.

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

### 3. Run the Server
```powershell
npm start
```
Open your browser at **`http://localhost:5000`**.

---

## 🛠 Azure & Production Deployment Commands

### Azure Blob Storage Setup
```powershell
az login
az group create --name rg-cv-vault --location eastus
az storage account create --name stcvvault$((Get-Random -Maximum 9999)) --resource-group rg-cv-vault --location eastus --sku Standard_LRS
$STORAGE_CONN = az storage account show-connection-string --resource-group rg-cv-vault --name stcvvault... --query connectionString --output tsv
az storage container create --name resumes --connection-string $STORAGE_CONN --public-access blob
```

### Azure Key Vault Setup
```powershell
az keyvault create --name kv-cvvault-$((Get-Random -Maximum 999)) --resource-group rg-cv-vault --location eastus
az keyvault secret set --vault-name kv-cvvault-... --name "MongoDBUri" --value "mongodb+srv://..."
az keyvault secret set --vault-name kv-cvvault-... --name "AzureStorageConn" --value "$STORAGE_CONN"
```

### Docker & Azure Container Apps Deployment
```powershell
# Local Docker Build & Test
docker build -t cv-vault .
docker run -p 5000:5000 --env-file .env cv-vault

# ACR Push
az acr create --resource-group rg-cv-vault --name acrcvvault$((Get-Random -Maximum 999)) --sku Basic --admin-enabled true
az acr login --name acrcvvault...
docker tag cv-vault acrcvvault....azurecr.io/cv-vault:v1
docker push acrcvvault....azurecr.io/cv-vault:v1

# Container App Deployment
az containerapp env create --name env-cv-vault --resource-group rg-cv-vault --location eastus
az containerapp create --name app-cv-vault --resource-group rg-cv-vault --environment env-cv-vault --image acrcvvault....azurecr.io/cv-vault:v1 --target-port 5000 --ingress external
```
