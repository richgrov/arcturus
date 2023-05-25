import * as path from 'path';

import * as functions from 'firebase-functions/v2';
import { initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';

import * as musicMetadata from 'music-metadata';

initializeApp();
const db = getFirestore();

// When a song is uploaded, create a new Firestore document and pre-fill it
// with info from the song's metadata
export const createSongRecord = functions.storage.onObjectFinalized(async event => {
	const filePath = event.data.name;
	const [userId, fileId] = filePath.split('/', 2);

	const doc = db.doc(`users/${userId}/songs/${fileId}`);
	if ((await doc.get()).exists) {
		// Only auto-fill the properties on the first upload. If the document is
		// already set, ignore
		return;
	}

	const file = getStorage()
		.bucket(event.data.bucket)
		.file(filePath);

	const metadata = await file.download().then(data => musicMetadata.parseBuffer(data[0]));
	// The client will send a 'fileName' metadata field in the object in case we
	// can't extract the song's name from its metadata
	const fileName = await file.getMetadata().then(meta => {
		// Some browsers prepend "C:\fakepath\" to the file name. Remove that here
		const fullPath = meta[0].metadata.fileName.replaceAll('\\', '/');
		return path.parse(path.basename(fullPath)).name;
	});

	await doc.set({
		name: metadata.common.title || fileName,
		author: metadata.common.artist || '',
	});
});
