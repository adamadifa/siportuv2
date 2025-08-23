# 🚀 Panduan Implementasi Push Notifikasi

## 📋 **Daftar Isi**

1. [Setup Dependencies](#1-setup-dependencies)
2. [Konfigurasi Firebase](#2-konfigurasi-firebase)
3. [Setup Expo Notifications](#3-setup-expo-notifications)
4. [Implementasi Backend](#4-implementasi-backend)
5. [Implementasi Frontend](#5-implementasi-frontend)
6. [Testing](#6-testing)

---

## 1. **Setup Dependencies**

### Install Package yang Diperlukan

```bash
# Expo Notifications
npx expo install expo-notifications
npx expo install expo-device
npx expo install expo-constants

# Firebase (jika menggunakan Firebase)
npm install @react-native-firebase/app
npm install @react-native-firebase/messaging

# AsyncStorage untuk menyimpan token
npm install @react-native-async-storage/async-storage
```

### Update app.json

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff",
          "sounds": ["./assets/notification-sound.wav"]
        }
      ]
    ]
  }
}
```

---

## 2. **Konfigurasi Firebase**

### A. Buat Project Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Buat project baru atau gunakan yang ada
3. Aktifkan Cloud Messaging

### B. Download Konfigurasi

1. **Android**: Download `google-services.json`
2. **iOS**: Download `GoogleService-Info.plist`

### C. Setup Firebase di Project

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login ke Firebase
firebase login

# Initialize Firebase
firebase init
```

---

## 3. **Setup Expo Notifications**

### A. Buat Service Notifikasi

```typescript
// services/NotificationService.ts
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Konfigurasi notifikasi
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  // Request permission
  static async requestPermissions() {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Permission untuk notifikasi diperlukan!");
        return false;
      }

      return true;
    } else {
      alert("Push notifications hanya tersedia di device fisik");
      return false;
    }
  }

  // Dapatkan Expo Push Token
  static async getExpoPushToken() {
    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: "your-expo-project-id", // Ganti dengan project ID Anda
      });

      // Simpan token ke AsyncStorage
      await AsyncStorage.setItem("expoPushToken", token.data);

      return token.data;
    } catch (error) {
      console.error("Error getting push token:", error);
      return null;
    }
  }

  // Kirim notifikasi lokal
  static async scheduleLocalNotification(
    title: string,
    body: string,
    data?: any
  ) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
      },
      trigger: null, // Kirim segera
    });
  }

  // Setup notification listener
  static setupNotificationListeners() {
    // Ketika notifikasi diterima saat app terbuka
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      }
    );

    // Ketika user tap notifikasi
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);

        // Handle navigation berdasarkan data notifikasi
        const data = response.notification.request.content.data;
        if (data.type === "pengumuman" && data.id) {
          // Navigate ke detail pengumuman
          // router.push(`/detail-pengumuman?id=${data.id}`);
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }
}
```

---

## 4. **Implementasi Backend**

### A. API Endpoint untuk Kirim Notifikasi

```php
// api/send-notification.php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config/database.php';

// Fungsi untuk kirim notifikasi ke Expo
function sendPushNotification($expoPushToken, $title, $body, $data = []) {
    $message = [
        'to' => $expoPushToken,
        'sound' => 'default',
        'title' => $title,
        'body' => $body,
        'data' => $data,
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://exp.host/--/api/v2/push/send');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'Accept-encoding: gzip, deflate',
        'Content-Type: application/json',
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($message));

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return [
        'success' => $httpCode === 200,
        'response' => $response,
        'httpCode' => $httpCode
    ];
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $title = $input['title'] ?? '';
    $body = $input['body'] ?? '';
    $data = $input['data'] ?? [];
    $userIds = $input['user_ids'] ?? [];

    if (empty($title) || empty($body) || empty($userIds)) {
        echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
        exit;
    }

    try {
        // Ambil token dari database berdasarkan user IDs
        $placeholders = str_repeat('?,', count($userIds) - 1) . '?';
        $stmt = $pdo->prepare("SELECT expo_push_token FROM users WHERE id IN ($placeholders) AND expo_push_token IS NOT NULL");
        $stmt->execute($userIds);
        $tokens = $stmt->fetchAll(PDO::FETCH_COLUMN);

        $results = [];
        foreach ($tokens as $token) {
            $result = sendPushNotification($token, $title, $body, $data);
            $results[] = $result;
        }

        echo json_encode([
            'success' => true,
            'message' => 'Notifikasi berhasil dikirim',
            'results' => $results
        ]);

    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
}
?>
```

### B. API untuk Simpan Token

```php
// api/save-push-token.php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $userId = $input['user_id'] ?? null;
    $expoPushToken = $input['expo_push_token'] ?? null;

    if (!$userId || !$expoPushToken) {
        echo json_encode(['success' => false, 'message' => 'User ID dan token diperlukan']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE users SET expo_push_token = ? WHERE id = ?");
        $result = $stmt->execute([$expoPushToken, $userId]);

        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Token berhasil disimpan']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal menyimpan token']);
        }

    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
}
?>
```

### C. Trigger Notifikasi saat Pengumuman Baru

```php
// api/create-pengumuman.php (modifikasi existing)
<?php
// ... kode existing untuk create pengumuman ...

// Setelah pengumuman berhasil dibuat, kirim notifikasi
if ($pengumumanCreated) {
    // Ambil semua user yang perlu dikirimi notifikasi
    $stmt = $pdo->prepare("SELECT id, expo_push_token FROM users WHERE expo_push_token IS NOT NULL");
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $userIds = array_column($users, 'id');

    // Data notifikasi
    $notificationData = [
        'title' => 'Pengumuman Baru',
        'body' => $judul . ' - ' . substr($isi, 0, 100) . '...',
        'data' => [
            'type' => 'pengumuman',
            'id' => $pengumumanId,
            'title' => $judul
        ],
        'user_ids' => $userIds
    ];

    // Kirim notifikasi
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://your-domain.com/api/send-notification.php');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($notificationData));

    $response = curl_exec($ch);
    curl_close($ch);

    // Log hasil pengiriman notifikasi
    error_log('Notification sent: ' . $response);
}
?>
```

---

## 5. **Implementasi Frontend**

### A. Update API Constants

```typescript
// constants/api.ts
export const API_BASE_URL = "http://your-domain.com/api";

// ... existing API functions ...

// Save push token
export const savePushToken = async (userId: string, expoPushToken: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/save-push-token.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        expo_push_token: expoPushToken,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving push token:", error);
    throw error;
  }
};
```

### B. Update Login Screen

```typescript
// app/login.tsx
import { NotificationService } from "../services/NotificationService";
import { savePushToken } from "../constants/api";

// Di dalam fungsi login yang berhasil
const handleLoginSuccess = async (userData: any) => {
  try {
    // Request permission notifikasi
    const hasPermission = await NotificationService.requestPermissions();

    if (hasPermission) {
      // Dapatkan push token
      const expoPushToken = await NotificationService.getExpoPushToken();

      if (expoPushToken) {
        // Simpan token ke backend
        await savePushToken(userData.id, expoPushToken);
        console.log("Push token saved successfully");
      }
    }

    // Navigate ke home
    router.replace("/home");
  } catch (error) {
    console.error("Error setting up notifications:", error);
    // Tetap navigate ke home meskipun ada error
    router.replace("/home");
  }
};
```

### C. Update \_layout.tsx

```typescript
// app/_layout.tsx
import { NotificationService } from "../services/NotificationService";

export default function RootLayout() {
  // ... existing code ...

  React.useEffect(() => {
    if (loaded && !showSplash && !showIntro) {
      // Setup notification listeners
      const cleanup = NotificationService.setupNotificationListeners();

      return cleanup;
    }
  }, [loaded, showSplash, showIntro]);

  // ... rest of the code ...
}
```

### D. Buat Notification Handler

```typescript
// components/NotificationHandler.tsx
import { useRouter } from "expo-router";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";

export default function NotificationHandler() {
  const router = useRouter();

  useEffect(() => {
    // Handle notification response
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        if (data.type === "pengumuman" && data.id) {
          // Navigate ke detail pengumuman
          router.push({
            pathname: "/detail-pengumuman",
            params: { id: data.id.toString() },
          });
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, [router]);

  return null; // Component ini tidak render apapun
}
```

---

## 6. **Testing**

### A. Test Notifikasi Lokal

```typescript
// Test di development
const testLocalNotification = async () => {
  await NotificationService.scheduleLocalNotification(
    "Test Pengumuman",
    "Ini adalah pengumuman test untuk memastikan notifikasi berfungsi",
    { type: "pengumuman", id: "123" }
  );
};
```

### B. Test Push Notifikasi

```bash
# Menggunakan Expo CLI
npx expo push:android:upload --api-key your-fcm-key
npx expo push:ios:upload --api-key your-apns-key

# Kirim test notification
curl -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -H "Accept-encoding: gzip, deflate" \
     -d '{
       "to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
       "title": "Test Pengumuman",
       "body": "Ini adalah test notifikasi",
       "data": { "type": "pengumuman", "id": "123" }
     }' \
     https://exp.host/--/api/v2/push/send
```

---

## 🔧 **Database Schema Update**

### Tabel Users

```sql
ALTER TABLE users ADD COLUMN expo_push_token TEXT;
ALTER TABLE users ADD COLUMN notification_enabled BOOLEAN DEFAULT TRUE;
```

### Tabel Notification Logs (Optional)

```sql
CREATE TABLE notification_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(255),
    body TEXT,
    data JSON,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('sent', 'failed', 'delivered') DEFAULT 'sent',
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 📱 **Fitur Tambahan**

### A. Settings untuk Notifikasi

```typescript
// app/notification-settings.tsx
import React, { useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NotificationSettings() {
  const [pengumumanEnabled, setPengumumanEnabled] = useState(true);
  const [tagihanEnabled, setTagihanEnabled] = useState(true);
  const [presensiEnabled, setPresensiEnabled] = useState(true);

  const toggleNotification = async (type: string, enabled: boolean) => {
    await AsyncStorage.setItem(`notification_${type}`, enabled.toString());

    // Update backend jika diperlukan
    // await updateNotificationSettings(type, enabled);
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Pengumuman Baru</Text>
        <Switch
          value={pengumumanEnabled}
          onValueChange={(value) => {
            setPengumumanEnabled(value);
            toggleNotification("pengumuman", value);
          }}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Tagihan Baru</Text>
        <Switch
          value={tagihanEnabled}
          onValueChange={(value) => {
            setTagihanEnabled(value);
            toggleNotification("tagihan", value);
          }}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Reminder Presensi</Text>
        <Switch
          value={presensiEnabled}
          onValueChange={(value) => {
            setPresensiEnabled(value);
            toggleNotification("presensi", value);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  settingLabel: {
    fontSize: 16,
    color: "#333",
  },
});
```

---

## 🚀 **Deployment Checklist**

- [ ] Install semua dependencies
- [ ] Setup Firebase project dan download config files
- [ ] Update app.json dengan plugin expo-notifications
- [ ] Implementasi NotificationService
- [ ] Update backend API untuk handle push tokens
- [ ] Update database schema
- [ ] Test notifikasi lokal
- [ ] Test push notifikasi dengan device fisik
- [ ] Setup production environment
- [ ] Monitor notifikasi delivery

---

## 📊 **Monitoring & Analytics**

### A. Track Notification Metrics

```typescript
// services/NotificationAnalytics.ts
export class NotificationAnalytics {
  static async trackNotificationSent(type: string, userId: string) {
    // Log ke analytics service
    console.log(`Notification sent: ${type} to user ${userId}`);
  }

  static async trackNotificationOpened(type: string, userId: string) {
    // Log ketika user buka notifikasi
    console.log(`Notification opened: ${type} by user ${userId}`);
  }
}
```

### B. Error Handling

```typescript
// Error handling untuk failed notifications
const handleNotificationError = (error: any) => {
  console.error("Notification error:", error);

  // Retry logic
  if (error.code === "TOKEN_EXPIRED") {
    // Refresh token
    NotificationService.getExpoPushToken();
  }
};
```

---

**🎯 Dengan implementasi ini, aplikasi Anda akan dapat:**

- ✅ Mengirim notifikasi push saat ada pengumuman baru
- ✅ Handle permission notifikasi
- ✅ Navigate ke halaman yang tepat saat notifikasi di-tap
- ✅ Settings untuk mengontrol jenis notifikasi
- ✅ Monitoring dan analytics
- ✅ Error handling dan retry logic
