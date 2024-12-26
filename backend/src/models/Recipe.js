const { db } = require('../config/firebase');

const COLLECTION_NAME = 'recipes';

class Recipe {
  static async find() {
    const snapshot = await db.collection(COLLECTION_NAME).get();
    return snapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data()
    }));
  }

  static async create(recipe) {
    const docRef = await db.collection(COLLECTION_NAME).add(recipe);
    return {
      _id: docRef.id,
      ...recipe
    };
  }

  static async findById(id) {
    const doc = await db.collection(COLLECTION_NAME).doc(id).get();
    if (!doc.exists) return null;
    return {
      _id: doc.id,
      ...doc.data()
    };
  }
}

module.exports = Recipe; 