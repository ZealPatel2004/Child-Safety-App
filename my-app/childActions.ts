import { auth, db } from "./firebaseService";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function addChildProfile(params: {
  fullName: string;
  age: number;
  physicalDescription?: string;
  emergencyContactPhone?: string;
  features: {
    locationTrackingEnabled: boolean;
    emergencyAlertsEnabled: boolean;
    shareWithAuthorities: boolean;
  };
}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  const childRef = doc(collection(db, "users", user.uid, "children"));

  await setDoc(childRef, {
    fullName: params.fullName.trim(),
    age: Number(params.age),
    physicalDescription: (params.physicalDescription ?? "").trim(),
    emergencyContactPhone: (params.emergencyContactPhone ?? "").trim(),
    features: params.features,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return childRef.id;
}
