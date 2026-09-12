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
const TAGS_COLLECTION = 'tags';

function toDoc(docSnap) {
  return { id: docSnap.id, ...docSnap.data() };
}

// --- Tags ---

export function subscribeToTags(callback) {
  return onSnapshot(collection(db, TAGS_COLLECTION), (snapshot) =>
    callback(snapshot.docs.map(toDoc))
  );
}

export function addTag({ label, color }) {
  return addDoc(collection(db, TAGS_COLLECTION), { label, color });
}

export function deleteTag(id) {
  return deleteDoc(doc(db, TAGS_COLLECTION, id));
}

// --- Événements ---

export function subscribeToDay(dateKey, callback) {
  const q = query(collection(db, EVENTS_COLLECTION), where('date', '==', dateKey));
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(toDoc)));
}

export function subscribeToMonth(startKey, endKey, callback) {
  const q = query(
    collection(db, EVENTS_COLLECTION),
    where('date', '>=', startKey),
    where('date', '<=', endKey)
  );
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(toDoc)));
}

export function addEvent(dateKey, { title, tagId, schedule }) {
  return addDoc(collection(db, EVENTS_COLLECTION), {
    date: dateKey,
    title,
    tagId: tagId || null,
    schedule,
  });
}

export function updateEvent(id, { title, tagId, schedule }) {
  return updateDoc(doc(db, EVENTS_COLLECTION, id), {
    title,
    tagId: tagId || null,
    schedule,
  });
}

export function deleteEvent(id) {
  return deleteDoc(doc(db, EVENTS_COLLECTION, id));
}
