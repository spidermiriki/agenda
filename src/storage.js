import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

const EVENTS_COLLECTION = 'events';

function toEvent(docSnap) {
  return { id: docSnap.id, ...docSnap.data() };
}

export function subscribeToDay(dateKey, callback) {
  const q = query(collection(db, EVENTS_COLLECTION), where('date', '==', dateKey));
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(toEvent)));
}

export function subscribeToMonth(startKey, endKey, callback) {
  const q = query(
    collection(db, EVENTS_COLLECTION),
    where('date', '>=', startKey),
    where('date', '<=', endKey)
  );
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(toEvent)));
}

export function addEvent(dateKey, { title, assignedTo, schedule }) {
  return addDoc(collection(db, EVENTS_COLLECTION), { date: dateKey, title, assignedTo, schedule });
}

export function updateEvent(id, { title, assignedTo, schedule }) {
  return updateDoc(doc(db, EVENTS_COLLECTION, id), { title, assignedTo, schedule });
}

export function deleteEvent(id) {
  return deleteDoc(doc(db, EVENTS_COLLECTION, id));
}
