import express from "express";
import { createServer as createViteServer } from "vite";
import admin from "firebase-admin";
import fetch from "node-fetch";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// In Node.js (CJS and tsx ESM), __dirname is available.
// If it's not (pure ESM), we'd need a fallback, but tsx and tsc-to-cjs handle it.
declare const __dirname: string;
const _dirname = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

// Initialize Firebase Admin safely
let db: admin.firestore.Firestore | null = null;
try {
  if (!admin.apps.length) {
    // If we have VITE_FIREBASE_PROJECT_ID, we can try to initialize with it
    // but usually firebase-admin needs a service account or ADC.
    // We'll try default initialization first.
    admin.initializeApp();
  }
  db = admin.firestore();
} catch (error) {
  console.error("Firebase Admin initialization failed:", error);
}

async function startServer() {
  const app = express();
  app.use(express.json());
  
  // Use process.env.PORT for Hostinger
  const PORT = process.env.PORT || 3000;

  // Helper to get API settings
  async function getApiSettings() {
    // First try Firebase
    if (db) {
      try {
        const configDoc = await db.collection('config').doc('apiSettings').get();
        if (configDoc.exists) {
          const data = configDoc.data();
          // If no apiKey in Firebase, use environment variable
          if (!data?.apiKey) {
            data.apiKey = process.env.VITE_ACTIVATION_API_KEY || '';
            data.panelBaseUrl = process.env.VITE_ACTIVATION_API_URL || 'https://activationpanel.net/api/api.php';
          }
          return data;
        }
      } catch (e) {
        console.log("Firebase not available, using environment variables");
      }
    }
    
    // Fallback to environment variables
    return {
      panelBaseUrl: process.env.VITE_ACTIVATION_API_URL || 'https://activationpanel.net/api/api.php',
      apiKey: process.env.VITE_ACTIVATION_API_KEY || '',
      panelUsername: '',
      panelPassword: ''
    };
  }

  // API routes
  app.post("/api/provision", async (req, res) => {
    try {
      const { type, identifier, sub, pack, resellerUid } = req.body;
      const settings = await getApiSettings();
      
      if (!settings?.apiKey) throw new Error("API Key not configured");

      // Get reseller's API key from Firebase based on resellerUid
      let apiKey = settings.apiKey;
      if (resellerUid) {
        try {
          const resellerDoc = await db.collection('users').doc(resellerUid).get();
          if (resellerDoc.exists() && resellerDoc.data()?.apiKey) {
            apiKey = resellerDoc.data().apiKey;
          }
        } catch (e) {
          console.log("Using master API key");
        }
      }

      const params = new URLSearchParams({
        action: 'new',
        type: type,
        sub: sub,
        pack: pack,
        api_key: apiKey
      });

      // Add MAC for MAG devices
      if (type === 'mag') {
        params.set('mac', identifier);
      }

      const response = await fetch(`${settings.panelBaseUrl}?${params.toString()}`);
      const data = await response.json();
      res.json(Array.isArray(data) ? data[0] : data);
    } catch (error: any) {
      res.status(500).json({ status: "false", message: error.message });
    }
  });

  app.post("/api/renew", async (req, res) => {
    try {
      const { type, identifier, sub, resellerUid } = req.body;
      const settings = await getApiSettings();
      
      if (!settings?.apiKey) throw new Error("API Key not configured");

      // Get reseller's API key from Firebase based on resellerUid
      let apiKey = settings.apiKey;
      if (resellerUid) {
        try {
          const resellerDoc = await db.collection('users').doc(resellerUid).get();
          if (resellerDoc.exists() && resellerDoc.data()?.apiKey) {
            apiKey = resellerDoc.data().apiKey;
          }
        } catch (e) {
          console.log("Using master API key");
        }
      }

      const params = new URLSearchParams({
        action: 'renew',
        type: type,
        api_key: apiKey
      });

      if (type === 'mag') {
        params.set('mac', identifier);
      } else {
        // For M3U, identifier is username:password format
        const [username, password] = identifier.split(':');
        params.set('username', username);
        params.set('password', password);
      }
      params.set('sub', sub);

      const response = await fetch(`${settings.panelBaseUrl}?${params.toString()}`);
      const data = await response.json();
      res.json(Array.isArray(data) ? data[0] : data);
    } catch (error: any) {
      res.status(500).json({ status: "false", message: error.message });
    }
  });

  app.post("/api/packages", async (req, res) => {
    try {
      const settings = await getApiSettings();
      if (!settings?.apiKey) throw new Error("API Key not configured");

      const params = new URLSearchParams({
        action: 'bouquet',
        api_key: settings.apiKey
      });

      const response = await fetch(`${settings.panelBaseUrl}?${params.toString()}`);
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ status: "false", message: error.message });
    }
  });

  app.post("/api/reseller-info", async (req, res) => {
    try {
      const { resellerUid } = req.body;
      const settings = await getApiSettings();
      if (!settings?.apiKey) throw new Error("API Key not configured");

      // Get reseller's API key from Firebase based on resellerUid
      let apiKey = settings.apiKey;
      if (resellerUid) {
        try {
          const resellerDoc = await db.collection('users').doc(resellerUid).get();
          if (resellerDoc.exists() && resellerDoc.data()?.apiKey) {
            apiKey = resellerDoc.data().apiKey;
          }
        } catch (e) {
          console.log("Using master API key");
        }
      }

      const params = new URLSearchParams({
        action: 'reseller_info',
        api_key: apiKey
      });

      const response = await fetch(`${settings.panelBaseUrl}?${params.toString()}`);
      const data = await response.json();
      res.json(Array.isArray(data) ? data[0] : data);
    } catch (error: any) {
      res.status(500).json({ status: "false", message: error.message });
    }
  });

  // New endpoint: Get device info
  app.post("/api/device-info", async (req, res) => {
    try {
      const { type, identifier, password, resellerUid } = req.body;
      const settings = await getApiSettings();
      if (!settings?.apiKey) throw new Error("API Key not configured");

      // Get reseller's API key from Firebase based on resellerUid
      let apiKey = settings.apiKey;
      if (resellerUid) {
        try {
          const resellerDoc = await db.collection('users').doc(resellerUid).get();
          if (resellerDoc.exists() && resellerDoc.data()?.apiKey) {
            apiKey = resellerDoc.data().apiKey;
          }
        } catch (e) {
          console.log("Using master API key");
        }
      }

      const params = new URLSearchParams({
        action: 'device_info',
        api_key: apiKey
      });

      if (type === 'mag') {
        params.set('mac', identifier);
      } else {
        // For M3U, need both username and password
        params.set('username', identifier);
        if (password) {
          params.set('password', password);
        }
      }

      const response = await fetch(`${settings.panelBaseUrl}?${params.toString()}`);
      const data = await response.json();
      res.json(Array.isArray(data) ? data[0] : data);
    } catch (error: any) {
      res.status(500).json({ status: "false", message: error.message });
    }
  });

  // Sync reseller data from IPTV API (real-time credits, lines, etc.)
  app.post("/api/sync", async (req, res) => {
    try {
      const { resellerUid } = req.body;
      const settings = await getApiSettings();
      
      if (!settings?.apiKey) throw new Error("API Key not configured");

      // Get reseller's API key
      let apiKey = settings.apiKey;
      let resellerDoc = null;
      
      if (resellerUid && db) {
        try {
          resellerDoc = await db.collection('users').doc(resellerUid).get();
          if (resellerDoc.exists() && resellerDoc.data()?.apiKey) {
            apiKey = resellerDoc.data().apiKey;
          }
        } catch (e) {
          console.log("Using master API key");
        }
      }

      // Fetch reseller info from IPTV API
      const params = new URLSearchParams({
        action: 'get_reseller',
        api_key: apiKey
      });
      
      const response = await fetch(`${settings.panelBaseUrl}?${params.toString()}`);
      const data = await response.json();
      
      const apiData = Array.isArray(data) ? data[0] : data;
      
      // Update Firestore with real-time data if reseller exists
      if (resellerDoc && resellerDoc.exists() && db) {
        await db.collection('users').doc(resellerUid).update({
          credits: parseInt(apiData.credits) || 0,
          linesCount: parseInt(apiData.lines_count) || 0,
          activeLines: parseInt(apiData.active_lines) || 0,
          expiresAt: apiData.exp_date || null,
          lastSync: new Date().toISOString()
        });
      }
      
      res.json({
        status: "true",
        credits: apiData.credits,
        linesCount: apiData.lines_count,
        activeLines: apiData.active_lines,
        expDate: apiData.exp_date,
        message: "Data synced successfully"
      });
    } catch (error: any) {
      res.status(500).json({ status: "false", message: error.message });
    }
  });

  // Get all resellers data (admin only)
  app.post("/api/sync-all-resellers", async (req, res) => {
    try {
      const settings = await getApiSettings();
      if (!settings?.apiKey) throw new Error("API Key not configured");

      // Get all resellers from Firestore
      if (!db) throw new Error("Database not available");

      const usersSnapshot = await db.collection('users').where('role', '==', 'RESELLER').get();
      const results = [];

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const apiKey = userData.apiKey || settings.apiKey;

        try {
          const params = new URLSearchParams({
            action: 'get_reseller',
            api_key: apiKey
          });
          
          const response = await fetch(`${settings.panelBaseUrl}?${params.toString()}`);
          const data = await response.json();
          const apiData = Array.isArray(data) ? data[0] : data;

          // Update Firestore
          await db.collection('users').doc(userDoc.id).update({
            credits: parseInt(apiData.credits) || 0,
            linesCount: parseInt(apiData.lines_count) || 0,
            activeLines: parseInt(apiData.active_lines) || 0,
            expiresAt: apiData.exp_date || null,
            lastSync: new Date().toISOString()
          });

          results.push({ uid: userDoc.id, email: userData.email, status: 'synced' });
        } catch (e) {
          results.push({ uid: userDoc.id, email: userData.email, status: 'error' });
        }
      }

      res.json({ status: "true", results });
    } catch (error: any) {
      res.status(500).json({ status: "false", message: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(_dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(_dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
