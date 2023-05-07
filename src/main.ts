import admin from "firebase-admin";
import { chunk } from "lodash-es";

// import your Firebase project's serviceAccount
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };

// initialize your Firebase project
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});
const db = admin.firestore();

/**
 * Delete all SubCollection Documents
 * @param subCollectionName sub collection name
 * @param batchSize batch size
 */
export const deleteDocumentsSubCollection = async (
  subCollectionName: string,
  batchSize: number = 500
) => {
  const collectionGroupSnapshot = await db
    .collectionGroup(subCollectionName)
    .get();

  for (const docs of chunk(collectionGroupSnapshot.docs, batchSize)) {
    const batch = db.batch();
    docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
};
