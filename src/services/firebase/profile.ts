import { updateProfile as updateAuthProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { firebaseAuth, firebaseStorage, firestore } from './config';

export type CompleteProfileInput = { name:string; cpf:string; birthDate:string; phone:string; bio:string; city:string };

export async function completeProfile(input:CompleteProfileInput):Promise<void>{
  const user=firebaseAuth.currentUser;
  if(!user) throw new Error('Sua sessão expirou. Entre novamente.');
  if(!input.name.trim()) throw new Error('Informe seu nome.');
  if(!input.cpf.trim()) throw new Error('Informe seu CPF.');
  if(!input.birthDate) throw new Error('Informe sua data de nascimento.');
  await updateAuthProfile(user,{displayName:input.name.trim()});
  await setDoc(doc(firestore,'users',user.uid),{name:input.name.trim(),email:user.email,cpf:input.cpf.replace(/\D/g,''),birthDate:input.birthDate,phone:input.phone.trim()||null,bio:input.bio.trim()||null,city:input.city.trim()||null,photoURL:user.photoURL??null,profileComplete:true,updatedAt:serverTimestamp()},{merge:true});
}

export async function uploadProfilePhoto(file:File):Promise<string>{
  const user=firebaseAuth.currentUser;
  if(!user) throw new Error('Sua sessão expirou. Entre novamente.');
  if(!file.type.startsWith('image/')) throw new Error('Escolha uma imagem válida.');
  if(file.size>5*1024*1024) throw new Error('A foto deve ter no máximo 5 MB.');
  const objectRef=ref(firebaseStorage,`users/${user.uid}/profile/avatar-${Date.now()}`);
  await uploadBytes(objectRef,file,{contentType:file.type});
  const url=await getDownloadURL(objectRef);
  await updateAuthProfile(user,{photoURL:url});
  await setDoc(doc(firestore,'users',user.uid),{photoURL:url,updatedAt:serverTimestamp()},{merge:true});
  return url;
}
