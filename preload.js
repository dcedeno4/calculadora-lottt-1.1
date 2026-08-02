const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dbapi", {
  patronoUpsert: (p) => ipcRenderer.invoke("patrono:upsert", p),
  patronoGetById: (id) => ipcRenderer.invoke("patrono:getById", id),
  patronoGetByDoc: (tipo_doc, doc) => ipcRenderer.invoke("patrono:getByDoc", tipo_doc, doc),
  patronoList: (q) => ipcRenderer.invoke("patrono:list", q),
  trabajadorUpsert: (t) => ipcRenderer.invoke("trabajador:upsert", t),
  trabajadorList: (q, patronoId) => ipcRenderer.invoke("trabajador:list", q, patronoId),

  calculoGuardar: (payload) => ipcRenderer.invoke("calculo:guardar", payload),
  calculoGet: (id) => ipcRenderer.invoke("calculo:get", id),
  calculoListarPorTrabajador: (id) => ipcRenderer.invoke("calculo:listarPorTrabajador", id),

  exportExcelCalculoDetallado: (calculoId, outPath) =>
    ipcRenderer.invoke("export:excelCalculoDetallado", calculoId, outPath),

  exportPdfReciboDesdeHTML: (html, outPath) =>
    ipcRenderer.invoke("export:pdfReciboDesdeHTML", html, outPath),
});

contextBridge.exposeInMainWorld("appapi", {
  quit: () => ipcRenderer.invoke("app:quit"),
  showSaveDialog: (options) => ipcRenderer.invoke("app:showSaveDialog", options),
});
