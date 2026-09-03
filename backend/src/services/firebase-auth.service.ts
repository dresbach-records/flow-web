import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, type UserCredential } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { firebaseAuth, firestore } from '../infrastructure/firebase/firebase-admin.js';

function clientAuth(){
  const app=getApps()[0] ?? initializeApp({apiKey:process.env.FIREBASE_API_KEY,authDomain:process.env.FIREBASE_AUTH_DOMAIN,projectId:process.env.FIREBASE_PROJECT_ID});
  return getAuth(app);
}

export async function registerUser(email:string,password:string,profile:Record<string,unknown>={}){
  const credential=await createUserWithEmailAndPassword(clientAuth(),email,password);
  await firestore().collection('users').doc(credential.user.uid).set({uid:credential.user.uid,email,accountType:'personal',status:'active',...profile,createdAt:new Date(),updatedAt:new Date()},{merge:true});
  const token=await credential.user.getIdToken();
  return {uid:credential.user.uid,token};
}

export async function loginUser(email:string,password:string){
  const credential:UserCredential=await signInWithEmailAndPassword(clientAuth(),email,password);
  const token=await credential.user.getIdToken(true);
  return {uid:credential.user.uid,token};
}

export async function logoutUser(idToken:string){
  const decoded=await firebaseAuth().verifyIdToken(idToken,true);
  await firebaseAuth().revokeRefreshTokens(decoded.uid);
  await signOut(clientAuth()).catch(()=>undefined);
  return {ok:true};
}
