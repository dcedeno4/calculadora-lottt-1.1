const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

let db;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, "index.html"));
}

function initDb() {
  const dbPath = path.join(app.getPath("userData"), "data.sqlite");
  db = new Database(dbPath);

  db.exec(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS patronos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      tipo_doc TEXT NOT NULL,
      doc TEXT NOT NULL,
      UNIQUE(tipo_doc, doc)
    );

    CREATE TABLE IF NOT EXISTS trabajadores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patrono_id INTEGER,
      nombre TEXT NOT NULL,
      tipo_doc TEXT NOT NULL,
      doc TEXT NOT NULL,
      cargo TEXT,
      fecha_ingreso TEXT NOT NULL,
      salario_mensual REAL DEFAULT 0,
      UNIQUE(tipo_doc, doc),
      FOREIGN KEY(patrono_id) REFERENCES patronos(id)
    );
    
    -- Migración: Agregar columna salario_mensual si no existe
    PRAGMA table_info(trabajadores);
  `);

  // Verificar si la columna salario_mensual existe
  const columns = db.prepare(`PRAGMA table_info(trabajadores)`).all();
  const hasSalarioColumn = columns.some(col => col.name === 'salario_mensual');
  
  if (!hasSalarioColumn) {
    console.log('Agregando columna salario_mensual a tabla trabajadores...');
    db.prepare(`ALTER TABLE trabajadores ADD COLUMN salario_mensual REAL DEFAULT 0`).run();
  }

  db.exec(`

    CREATE TABLE IF NOT EXISTS calculos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT DEFAULT (datetime('now')),
      moneda TEXT NOT NULL,

      patrono_id INTEGER,
      trabajador_id INTEGER,

      fecha_ingreso TEXT NOT NULL,
      fecha_calculo TEXT NOT NULL,
      tiempo_servicio TEXT,

      S_NM REAL,
      DUA REAL,
      SDI_FINAL REAL,
      DAA REAL,
      DV REAL,
      DBV REAL,
      capital_intereses REAL,

      SDN REAL,
      AUD REAL,
      ABVD REAL,
      SDI REAL,

      CPV REAL,
      CBV REAL,
      UTIL REAL,
      PS REAL,
      INTERESES REAL,

      total_capital REAL,
      total_general REAL,

      FOREIGN KEY(patrono_id) REFERENCES patronos(id),
      FOREIGN KEY(trabajador_id) REFERENCES trabajadores(id)
    );

    CREATE TABLE IF NOT EXISTS intereses_meses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      calculo_id INTEGER NOT NULL,
      idx INTEGER NOT NULL,
      label TEXT,
      salario_mes REAL,
      tasa_anual REAL,
      FOREIGN KEY(calculo_id) REFERENCES calculos(id) ON DELETE CASCADE
    );
  `);
}

function up(s) {
  return String(s ?? "").trim().toUpperCase();
}

app.whenReady().then(() => {
  initDb();
  createWindow();
});

ipcMain.handle("app:quit", () => {
  app.quit();
  return { ok: true };
});

ipcMain.handle("app:showSaveDialog", async (e, options) => {
  const { dialog } = require("electron");
  const result = await dialog.showSaveDialog(options);
  return result;
});

/* ===== Patrono/Trabajador ===== */
ipcMain.handle("patrono:upsert", (e, p) => {
  const nombre = up(p.nombre);
  const tipo_doc = up(p.tipo_doc);
  const doc = up(p.doc);

  db.prepare(`
    INSERT INTO patronos (nombre, tipo_doc, doc)
    VALUES (?, ?, ?)
    ON CONFLICT(tipo_doc, doc) DO UPDATE SET nombre=excluded.nombre
  `).run(nombre, tipo_doc, doc);

  return db.prepare(`SELECT id FROM patronos WHERE tipo_doc=? AND doc=?`).get(tipo_doc, doc);
});

ipcMain.handle("patrono:getById", (e, id) => {
  return db.prepare(`SELECT * FROM patronos WHERE id=?`).get(id);
});

ipcMain.handle("patrono:getByDoc", (e, tipo_doc, doc) => {
  return db.prepare(`SELECT * FROM patronos WHERE tipo_doc=? AND doc=?`).get(tipo_doc, doc);
});

ipcMain.handle("patrono:list", (e, q) => {
  const term = `%${String(q || "").trim()}%`;
  return db.prepare(`
    SELECT * FROM patronos
    WHERE nombre LIKE ? OR doc LIKE ?
    ORDER BY nombre
    LIMIT 200
  `).all(term, term);
});

ipcMain.handle("trabajador:upsert", (e, t) => {
  const patrono_id = t.patrono_id ?? null;
  const nombre = up(t.nombre);
  const tipo_doc = up(t.tipo_doc);
  const doc = up(t.doc);
  const cargo = up(t.cargo);
  const fecha_ingreso = String(t.fecha_ingreso || "").trim();
  const salario_mensual = parseFloat(t.salario_mensual) || 0;

  db.prepare(`
    INSERT INTO trabajadores (patrono_id, nombre, tipo_doc, doc, cargo, fecha_ingreso, salario_mensual)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(tipo_doc, doc) DO UPDATE SET
      patrono_id=excluded.patrono_id,
      nombre=excluded.nombre,
      cargo=excluded.cargo,
      fecha_ingreso=excluded.fecha_ingreso,
      salario_mensual=excluded.salario_mensual
  `).run(patrono_id, nombre, tipo_doc, doc, cargo, fecha_ingreso, salario_mensual);

  return db.prepare(`SELECT * FROM trabajadores WHERE tipo_doc=? AND doc=?`).get(tipo_doc, doc);
});

ipcMain.handle("trabajador:list", (e, q, patronoId) => {
  const term = `%${String(q || "").trim()}%`;
  
  if (patronoId) {
    // Filtrar por patrono específico
    return db.prepare(`
      SELECT * FROM trabajadores
      WHERE (nombre LIKE ? OR doc LIKE ?) AND patrono_id = ?
      ORDER BY nombre
      LIMIT 200
    `).all(term, term, patronoId);
  } else {
    // Todos los trabajadores
    return db.prepare(`
      SELECT * FROM trabajadores
      WHERE nombre LIKE ? OR doc LIKE ?
      ORDER BY nombre
      LIMIT 200
    `).all(term, term);
  }
});

/* ===== Guardar cálculo ===== */
ipcMain.handle("calculo:guardar", (e, payload) => {
  const {
    moneda, patrono_id, trabajador_id,
    fechas, inputs, base, montos, totales,
    interesesMeses
  } = payload;

  const insert = db.prepare(`
    INSERT INTO calculos (
      moneda, patrono_id, trabajador_id,
      fecha_ingreso, fecha_calculo, tiempo_servicio,
      S_NM, DUA, SDI_FINAL, DAA, DV, DBV, capital_intereses,
      SDN, AUD, ABVD, SDI,
      CPV, CBV, UTIL, PS, INTERESES,
      total_capital, total_general
    ) VALUES (
      @moneda, @patrono_id, @trabajador_id,
      @fecha_ingreso, @fecha_calculo, @tiempo_servicio,
      @S_NM, @DUA, @SDI_FINAL, @DAA, @DV, @DBV, @capital_intereses,
      @SDN, @AUD, @ABVD, @SDI,
      @CPV, @CBV, @UTIL, @PS, @INTERESES,
      @total_capital, @total_general
    )
  `);

  const tx = db.transaction(() => {
    const info = insert.run({
      moneda,
      patrono_id: patrono_id ?? null,
      trabajador_id: trabajador_id ?? null,

      fecha_ingreso: fechas.fecha_ingreso,
      fecha_calculo: fechas.fecha_calculo,
      tiempo_servicio: fechas.tiempo_servicio,

      S_NM: inputs.S_NM,
      DUA: inputs.DUA,
      SDI_FINAL: inputs.SDI_FINAL,
      DAA: inputs.DAA,
      DV: inputs.DV,
      DBV: inputs.DBV,
      capital_intereses: inputs.capital_intereses,

      SDN: base.SDN,
      AUD: base.AUD,
      ABVD: base.ABVD,
      SDI: base.SDI,

      CPV: montos.CPV,
      CBV: montos.CBV,
      UTIL: montos.UTIL,
      PS: montos.PS,
      INTERESES: montos.INTERESES,

      total_capital: totales.total_capital,
      total_general: totales.total_general,
    });

    const calculo_id = info.lastInsertRowid;

    const insMes = db.prepare(`
      INSERT INTO intereses_meses (calculo_id, idx, label, salario_mes, tasa_anual)
      VALUES (?, ?, ?, ?, ?)
    `);

    (interesesMeses || []).forEach((m) => {
      insMes.run(calculo_id, m.idx, m.label, m.salario_mes ?? null, m.tasa_anual ?? null);
    });

    return calculo_id;
  });

  const id = tx();
  return { ok: true, id };
});

ipcMain.handle("calculo:listarPorTrabajador", (e, trabajador_id) => {
  return db.prepare(`
    SELECT id, created_at, fecha_ingreso, fecha_calculo, moneda, total_general
    FROM calculos
    WHERE trabajador_id = ?
    ORDER BY id DESC
    LIMIT 200
  `).all(trabajador_id);
});

ipcMain.handle("calculo:get", (e, id) => {
  const calc = db.prepare(`SELECT * FROM calculos WHERE id=?`).get(id);
  if (!calc) return null;
  const meses = db.prepare(`SELECT * FROM intereses_meses WHERE calculo_id=? ORDER BY idx`).all(id);
  return { calc, meses };
});

/* ===== Export Excel detallado ===== */
ipcMain.handle("export:excelCalculoDetallado", async (e, calculo_id, outPath) => {
  const pack = db.prepare(`SELECT * FROM calculos WHERE id=?`).get(calculo_id);
  if (!pack) return { ok: false, error: "Calculo no existe" };

  const t = pack.trabajador_id
    ? db.prepare(`SELECT * FROM trabajadores WHERE id=?`).get(pack.trabajador_id)
    : null;

  const p = pack.patrono_id
    ? db.prepare(`SELECT * FROM patronos WHERE id=?`).get(pack.patrono_id)
    : null;

  const meses = db.prepare(`SELECT * FROM intereses_meses WHERE calculo_id=? ORDER BY idx`).all(calculo_id);

  const wb = new ExcelJS.Workbook();

  const ws = wb.addWorksheet("Detalle_Calculo");
  ws.columns = [
    { header: "Campo", key: "k", width: 28 },
    { header: "Valor", key: "v", width: 40 },
  ];
  ws.getRow(1).font = { bold: true };

  const add = (k, v) => ws.addRow({ k, v: (v ?? "") });

  add("ID Cálculo", pack.id);
  add("Fecha registro", pack.created_at);
  add("Moneda", pack.moneda);
  add("Patrono", p ? `${p.nombre} (${p.tipo_doc}-${p.doc})` : "");
  add("Trabajador", t ? `${t.nombre} (${t.tipo_doc}-${t.doc})` : "");
  add("Cargo", t?.cargo || "");
  add("Fecha ingreso", pack.fecha_ingreso);
  add("Fecha cálculo/egreso", pack.fecha_calculo);
  add("Tiempo servicio", pack.tiempo_servicio);

  ws.addRow({});
  add("INPUT S_NM", pack.S_NM);
  add("INPUT DUA", pack.DUA);
  add("INPUT SDI_FINAL", pack.SDI_FINAL);
  add("INPUT DAA", pack.DAA);
  add("INPUT DV", pack.DV);
  add("INPUT DBV", pack.DBV);
  add("INPUT Capital intereses", pack.capital_intereses);

  ws.addRow({});
  add("Base SDN", pack.SDN);
  add("Base AUD", pack.AUD);
  add("Base ABVD", pack.ABVD);
  add("Base SDI", pack.SDI);

  ws.addRow({});
  add("Monto Vacaciones (CPV)", pack.CPV);
  add("Monto Bono Vacacional (CBV)", pack.CBV);
  add("Monto Utilidades", pack.UTIL);
  add("Prestaciones Sociales (PS)", pack.PS);
  add("Intereses PS", pack.INTERESES);

  ws.addRow({});
  add("Total capital", pack.total_capital);
  add("Total general", pack.total_general);

  const wi = wb.addWorksheet("Intereses_12M");
  wi.columns = [
    { header: "Idx", key: "idx", width: 6 },
    { header: "Mes/Año", key: "label", width: 18 },
    { header: "Salario mensual", key: "salario_mes", width: 16 },
    { header: "Tasa anual %", key: "tasa_anual", width: 12 },
  ];
  wi.getRow(1).font = { bold: true };
  meses.forEach(m => wi.addRow(m));

  await wb.xlsx.writeFile(outPath);
  return { ok: true, outPath };
});

/* ===== Export PDF del recibo (desde HTML) ===== */
ipcMain.handle("export:pdfReciboDesdeHTML", async (e, html, outPath) => {
  const win = new BrowserWindow({
    show: false,
    webPreferences: { offscreen: true }
  });

  await win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(html));
  await new Promise(r => setTimeout(r, 200));

  const pdf = await win.webContents.printToPDF({
    printBackground: true,
    pageSize: "A4",
    marginsType: 1
  });

  fs.writeFileSync(outPath, pdf);
  win.close();

  return { ok: true, outPath };
});

// Manejador para cerrar la aplicación
ipcMain.handle("app:quit", async () => {
  app.quit();
});
