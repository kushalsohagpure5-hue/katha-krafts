import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { CATALOG_PRODUCTS } from '../data/catalog';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Order, Product, UserPreference } from '../types';

export async function seedInitialCatalogIfEmpty(): Promise<void> {
  try {
    const productSnap = await getDocs(collection(db, 'products'));
    if (productSnap.empty) {
      await Promise.all(
        CATALOG_PRODUCTS.map((p) =>
          setDoc(doc(db, 'products', p.id), {
            id: p.id,
            name: p.name.slice(0, 200),
            characterId: p.characterId.slice(0, 64),
            characterName: p.characterName.slice(0, 100),
            price: p.price,
            category: p.category.slice(0, 100),
            ageRange: p.ageRange.slice(0, 50),
            stock: p.stock,
          })
        )
      );
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'products', true);
  }
}

export function subscribeToProducts(
  onUpdate: (stockMap: Map<string, number>) => void
): () => void {
  return onSnapshot(
    collection(db, 'products'),
    (snapshot) => {
      const stockMap = new Map<string, number>();
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (typeof data.stock === 'number') {
          stockMap.set(docSnap.id, data.stock);
        }
      });
      onUpdate(stockMap);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'products', true);
    }
  );
}

export async function updateProductStockInFirestore(
  productId: string,
  newStock: number
): Promise<void> {
  const safeStock = Math.max(0, Math.floor(newStock));
  const ref = doc(db, 'products', productId);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, { stock: safeStock });
    } else {
      const base = CATALOG_PRODUCTS.find((p) => p.id === productId);
      if (base) {
        await setDoc(ref, {
          id: base.id,
          name: base.name.slice(0, 200),
          characterId: base.characterId.slice(0, 64),
          characterName: base.characterName.slice(0, 100),
          price: base.price,
          category: base.category.slice(0, 100),
          ageRange: base.ageRange.slice(0, 50),
          stock: safeStock,
        });
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `products/${productId}`, true);
  }
}

export function subscribeToUserOrders(
  userId: string,
  onUpdate: (orders: Order[]) => void
): () => void {
  const q = query(collection(db, 'orders'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Order[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Order);
      });
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      onUpdate(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'orders', true);
    }
  );
}

export async function saveUserPreferencesToFirestore(
  userId: string,
  prefs: UserPreference
): Promise<void> {
  try {
    await setDoc(doc(db, 'user_preferences', userId), prefs);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `user_preferences/${userId}`, true);
  }
}

export async function saveWishlistToFirestore(
  userId: string,
  productIds: string[]
): Promise<void> {
  try {
    await setDoc(doc(db, 'wishlists', userId), {
      userId,
      productIds: productIds.slice(0, 100),
      updatedAt: new Date().toISOString().slice(0, 64),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `wishlists/${userId}`, true);
  }
}

export function mergeProductStock(
  baseProducts: Product[],
  stockMap: Map<string, number>
): Product[] {
  if (stockMap.size === 0) return baseProducts;
  return baseProducts.map((p) => ({
    ...p,
    stock: stockMap.has(p.id) ? (stockMap.get(p.id) as number) : p.stock,
  }));
}
