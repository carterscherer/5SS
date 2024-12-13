import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const user = result.user;

  // Add user to Firestore 'members' collection
  await setDoc(doc(db, "members", user.uid), {
    email: user.email,
    firstName: "", // Optional: could collect from a form input
    isApproved: false, // Default to not approved
    createdAt: new Date(), // Timestamp for when the user was created
  });

  return user;
};

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Add user to Firestore 'members' collection if they don't already exist
  const userDoc = doc(db, "members", user.uid);
  await setDoc(
    userDoc,
    {
      email: user.email,
      firstName: user.displayName || "", // Using Google displayName if available
      isApproved: false,
      createdAt: new Date(),
    },
    { merge: true } // This will only create if the document doesn't exist
  );

  return user;
};


export const doSignOut = () => {
  return auth.signOut();
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};

export const handleForgotPassword = async (email, setErrorMessage) => {
  if (!email) {
    setErrorMessage("Please enter your email address.");
    return;
  }

  try {
    await doPasswordReset(email);
    setErrorMessage("Password reset email sent. Please check your inbox.");
  } catch (error) {
    setErrorMessage(error.message || "Failed to send password reset email.");
  }
};
