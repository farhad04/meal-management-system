
FIREBASE SETUP

1. Open Firebase Console
https://console.firebase.google.com/

2. Create Project

3. Create Web App

4. Enable Firestore Database

5. Firestore Rules:

rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

6. Copy Firebase Config

7. Paste Config in firebase-config.js

8. Run with Live Server

DEFAULT PASSWORDS

Admin = admin123
Members = 1234
