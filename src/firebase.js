import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCx_Vq_zKMa4S7ekAlfG6_2RECC2eBzaJo",
  authDomain: "bandhan-matrimony-29d7d.firebaseapp.com",
  projectId: "bandhan-matrimony-29d7d",
  storageBucket: "bandhan-matrimony-29d7d.firebasestorage.app",
  messagingSenderId: "881089672923",
  appId: "1:881089672923:web:b75194e6fe89d5d4dfbefe",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
