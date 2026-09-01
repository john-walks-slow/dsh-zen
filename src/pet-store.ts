/**
 * PetStore — manages the active pet spritesheet.
 *
 * Default: host-served `/dsh-zen-tracker/spritesheet.webp` (Codex v2, 8×11).
 * Custom: user-imported image stored in IndexedDB, served as a blob URL.
 *
 * @module dsh-zen-tracker/pet-store
 */

const DB_NAME = "dsh-zen-tracker";
const STORE_NAME = "pet-assets";
const KEY_SPRITESHEET = "spritesheet";
const KEY_META = "meta";

export interface PetMeta {
	/** Original file name. */
	name: string;
	/** Sprite columns (always 8 for Codex format). */
	cols: number;
	/** Sprite rows (9 for v1, 11 for v2). */
	rows: number;
	/** Cell width in px. */
	cellW: number;
	/** Cell height in px. */
	cellH: number;
}

export const DEFAULT_META: PetMeta = {
	name: "DeepSeek 娘 (默认)",
	cols: 8,
	rows: 11,
	cellW: 192,
	cellH: 208,
};

const DEFAULT_URL = "/dsh-zen-tracker/spritesheet.webp";

type Listener = () => void;

// ── IndexedDB helpers ────────────────────────────────────────────────────────

function openDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, 1);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME);
			}
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

async function idbGet<T>(key: string): Promise<T | undefined> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, "readonly");
		const req = tx.objectStore(STORE_NAME).get(key);
		req.onsuccess = () => resolve(req.result as T);
		req.onerror = () => reject(req.error);
	});
}

async function idbPut(key: string, value: any): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, "readwrite");
		tx.objectStore(STORE_NAME).put(value, key);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
}

async function idbDelete(key: string): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, "readwrite");
		tx.objectStore(STORE_NAME).delete(key);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
}

// ── dimension detection ──────────────────────────────────────────────────────

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error("Failed to load image"));
		img.src = src;
	});
}

function detectMeta(img: HTMLImageElement, fileName: string): PetMeta {
	const w = img.naturalWidth;
	const h = img.naturalHeight;
	// Codex format: 8 columns, 192px per cell
	const cols = 8;
	const cellW = Math.round(w / cols);
	const rows = Math.round(h / cellW);
	return { name: fileName, cols, rows, cellW, cellH: cellW };
}

// ── store ────────────────────────────────────────────────────────────────────

export function createPetStore() {
	let blobUrl: string | null = null;
	let meta: PetMeta = { ...DEFAULT_META };
	let usingCustom = false;
	const listeners = new Set<Listener>();

	async function init() {
		try {
			const blob = await idbGet<Blob>(KEY_SPRITESHEET);
			if (blob) {
				blobUrl = URL.createObjectURL(blob);
				const storedMeta = await idbGet<PetMeta>(KEY_META);
				if (storedMeta) meta = storedMeta;
				usingCustom = true;
			}
		} catch { /* ignore */ }
		notify();
	}

	function notify() {
		for (const fn of listeners) fn();
	}

	async function importSprite(file: File): Promise<PetMeta> {
		const url = URL.createObjectURL(file);
		const img = await loadImage(url);
		const detected = detectMeta(img, file.name);
		URL.revokeObjectURL(url);

		await idbPut(KEY_SPRITESHEET, file);
		await idbPut(KEY_META, detected);

		if (blobUrl) URL.revokeObjectURL(blobUrl);
		blobUrl = URL.createObjectURL(file);
		meta = detected;
		usingCustom = true;
		notify();
		return detected;
	}

	async function resetSprite() {
		await idbDelete(KEY_SPRITESHEET);
		await idbDelete(KEY_META);
		if (blobUrl) { URL.revokeObjectURL(blobUrl); blobUrl = null; }
		meta = { ...DEFAULT_META };
		usingCustom = false;
		notify();
	}

	function getSpriteUrl(): string {
		return blobUrl ?? DEFAULT_URL;
	}

	function getMeta(): PetMeta {
		return meta;
	}

	function isCustom(): boolean {
		return usingCustom;
	}

	return {
		init,
		importSprite,
		resetSprite,
		getSpriteUrl,
		getMeta,
		isCustom,
		subscribe: (fn: Listener) => {
			listeners.add(fn);
			return () => { listeners.delete(fn); };
		},
	};
}

export type PetStore = ReturnType<typeof createPetStore>;
