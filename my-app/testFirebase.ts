// Test Firebase connection by writing and reading a test value
import { db } from './firebaseService';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export async function testFirebase() {
  try {
    // Add a test document
    const docRef = await addDoc(collection(db, 'testCollection'), {
      testField: 'Hello from Firebase!',
      timestamp: new Date(),
    });
    console.log('Document written with ID: ', docRef.id);

    // Read documents
    const querySnapshot = await getDocs(collection(db, 'testCollection'));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} =>`, doc.data());
    });
    return true;
  } catch (e) {
    console.error('Error testing Firebase:', e);
    return false;
  }
}
