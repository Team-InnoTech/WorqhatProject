// src/lib/auth.ts

import { auth, googleProvider } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth';

/**
 * Registers a new user using email and password
 */
export async function signUp(email: string, password: string) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Logs in an existing user using email and password
 */
export async function login(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

/**
 * Logs in a user using Google OAuth popup
 */
export async function loginWithGoogle() {
  return await signInWithPopup(auth, googleProvider);
}

/**
 * Logs out the currently authenticated user
 */
export async function logout() {
  return await signOut(auth);
}
