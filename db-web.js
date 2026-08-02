// Base de datos IndexedDB para versión web
const DB_NAME = 'calculadora-lottt-db';
const DB_VERSION = 1;

let db = null;

// Inicializar base de datos
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Crear tabla de patronos (empresas)
      if (!db.objectStoreNames.contains('patronos')) {
        const patronoStore = db.createObjectStore('patronos', { keyPath: 'id', autoIncrement: true });
        patronoStore.createIndex('doc', 'doc', { unique: false });
        patronoStore.createIndex('nombre', 'nombre', { unique: false });
      }
      
      // Crear tabla de trabajadores
      if (!db.objectStoreNames.contains('trabajadores')) {
        const trabajadorStore = db.createObjectStore('trabajadores', { keyPath: 'id', autoIncrement: true });
        trabajadorStore.createIndex('patrono_id', 'patrono_id', { unique: false });
        trabajadorStore.createIndex('doc', 'doc', { unique: false });
      }
      
      // Crear tabla de cálculos
      if (!db.objectStoreNames.contains('calculos')) {
        const calculoStore = db.createObjectStore('calculos', { keyPath: 'id', autoIncrement: true });
        calculoStore.createIndex('trabajador_id', 'trabajador_id', { unique: false });
      }
    };
  });
}

// API compatible con Electron
window.dbapi = {
  // Guardar patrono
  patronoUpsert: async (data) => {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['patronos'], 'readwrite');
      const store = transaction.objectStore('patronos');
      
      const request = data.id ? store.put(data) : store.add(data);
      
      request.onsuccess = () => resolve({ id: request.result });
      request.onerror = () => reject(request.error);
    });
  },
  
  // Listar patronos
  patronoList: async (query = '') => {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['patronos'], 'readonly');
      const store = transaction.objectStore('patronos');
      const request = store.getAll();
      
      request.onsuccess = () => {
        let results = request.result;
        
        // Filtrar por query si existe
        if (query) {
          const q = query.toLowerCase();
          results = results.filter(p => 
            (p.nombre && p.nombre.toLowerCase().includes(q)) ||
            (p.doc && p.doc.includes(q))
          );
        }
        
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  },
  
  // Guardar trabajador
  trabajadorUpsert: async (data) => {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['trabajadores'], 'readwrite');
      const store = transaction.objectStore('trabajadores');
      
      const request = data.id ? store.put(data) : store.add(data);
      
      request.onsuccess = () => resolve({ id: request.result });
      request.onerror = () => reject(request.error);
    });
  },
  
  // Listar trabajadores
  trabajadorList: async (query = '', patronoId = null) => {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['trabajadores'], 'readonly');
      const store = transaction.objectStore('trabajadores');
      const request = store.getAll();
      
      request.onsuccess = () => {
        let results = request.result;
        
        // Filtrar por patrono_id
        if (patronoId) {
          results = results.filter(t => t.patrono_id === patronoId);
        }
        
        // Filtrar por query si existe
        if (query) {
          const q = query.toLowerCase();
          results = results.filter(t => 
            (t.nombre && t.nombre.toLowerCase().includes(q)) ||
            (t.doc && t.doc.includes(q))
          );
        }
        
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  },
  
  // Guardar cálculo
  calculoGuardar: async (data) => {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['calculos'], 'readwrite');
      const store = transaction.objectStore('calculos');
      
      // Agregar timestamp
      data.timestamp = new Date().toISOString();
      
      const request = data.id ? store.put(data) : store.add(data);
      
      request.onsuccess = () => resolve({ id: request.result });
      request.onerror = () => reject(request.error);
    });
  },
  
  // Listar cálculos de un trabajador
  calculoListarPorTrabajador: async (trabajadorId) => {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['calculos'], 'readonly');
      const store = transaction.objectStore('calculos');
      const index = store.index('trabajador_id');
      const request = index.getAll(trabajadorId);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
};

// Inicializar al cargar
if (typeof window !== 'undefined' && !window.dbapi) {
  initDB().then(() => {
    console.log('✅ Base de datos IndexedDB inicializada');
  }).catch(err => {
    console.error('❌ Error al inicializar base de datos:', err);
  });
}
