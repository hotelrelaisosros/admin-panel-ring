import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
// import { useDispatch } from "react-redux";
// import { setAppToken } from "./store/currentAppToken/currentAppToken";
// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyCEVn5slB3vo6S3mNafYFqi5cQEqWwtoSM",
  authDomain: "rings-a4af2.firebaseapp.com",
  projectId: "rings-a4af2",
  storageBucket: "rings-a4af2.firebasestorage.app",
  messagingSenderId: "305046284195",
  appId: "1:305046284195:web:f318c34f554f90600f1c16",
  measurementId: "G-7DR09S34VB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);
// Add the public key generated from the console here.
// messaging.getToken({
//   vapidKey:
//     "",
// });

export default function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      getToken(messaging, {
        vapidKey:
          "",
      })
        .then((currentToken) => {
          // const dispatch = useDispatch();
          if (currentToken) {
            // dispatch(setAppToken(currentToken));
            localStorage.setItem("appToken", currentToken);
            console.log("currentToken: ", currentToken);
          } else {
            console.log("Can not get token");
          }
        });
    } else {
      console.log("Do not have permission!");
    }
  });
}

requestPermission();