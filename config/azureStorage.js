const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');
const path = require('path');

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'resumes';

let blobServiceClient = null;
let containerClient = null;
let useAzure = false;

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

const initStorage = async () => {
  if (connectionString && connectionString.includes('AccountName=')) {
    try {
      blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
      containerClient = blobServiceClient.getContainerClient(containerName);
      await containerClient.createIfNotExists({ access: 'blob' });
      useAzure = true;
      console.log(`[Azure Storage] Connected successfully. Container: "${containerName}"`);
      return;
    } catch (error) {
      console.warn(`[Azure Storage Warning] Azure connection failed: ${error.message}. Falling back to local storage.`);
    }
  } else {
    console.log(`[Azure Storage] Connection string not set. Operating in local storage mode.`);
  }

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  useAzure = false;
};

const uploadFile = async (fileBuffer, originalName, mimeType) => {
  const fileExt = path.extname(originalName);
  const baseName = path.basename(originalName, fileExt).replace(/[^a-zA-Z0-9]/g, '_');
  const uniqueName = `${baseName}_${Date.now()}${fileExt}`;

  if (useAzure && containerClient) {
    const blockBlobClient = containerClient.getBlockBlobClient(uniqueName);
    await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
      blobHTTPHeaders: { blobContentType: mimeType }
    });
    return {
      storageName: uniqueName,
      fileUrl: blockBlobClient.url,
      provider: 'azure'
    };
  } else {
    const filePath = path.join(uploadsDir, uniqueName);
    fs.writeFileSync(filePath, fileBuffer);
    return {
      storageName: uniqueName,
      fileUrl: `/uploads/${uniqueName}`,
      provider: 'local'
    };
  }
};

const deleteFile = async (storageName, provider = 'azure') => {
  try {
    if (provider === 'azure' && useAzure && containerClient) {
      const blockBlobClient = containerClient.getBlockBlobClient(storageName);
      await blockBlobClient.deleteIfExists();
    } else {
      const filePath = path.join(uploadsDir, storageName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    return true;
  } catch (error) {
    console.error(`[Storage Error] Failed to delete ${storageName}:`, error.message);
    return false;
  }
};

const getStorageStatus = () => ({
  provider: useAzure ? 'azure' : 'local',
  containerName: useAzure ? containerName : 'public/uploads'
});

module.exports = {
  initStorage,
  uploadFile,
  deleteFile,
  getStorageStatus
};
