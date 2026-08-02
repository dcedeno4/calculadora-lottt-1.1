let currentTrabajadorId = null;
let currentCalculoId = null;

function td(html) {
  const x = document.createElement("td");
  x.innerHTML = html;
  return x;
}

function btn(label, cls, onClick) {
  const b = document.createElement("button");
  b.className = `btn ${cls}`;
  b.style.width = "auto";
  b.style.padding = "8px 10px";
  b.innerHTML = label;
  b.addEventListener("click", (e) => { e.preventDefault(); onClick(); });
  return b;
}

function parseNumberFromText(id) {
  const t = el(id)?.textContent || "";
  const raw = t.replace(/^[A-Z]{2,3}\s+/i, "").trim();
  const normalized = raw.replace(/\./g, "").replace(/,/g, ".");
  const v = Number(normalized);
  return Number.isFinite(v) ? v : 0;
}

function getMesesInteresesPayload() {
  const meses = [];
  for (let i = 1; i <= 12; i++) {
    const label = document.querySelector(`.mes-label[data-i="${i - 1}"]`)?.textContent || `MES ${i}`;
    const salario_mes = parseNumber(`salario_mes_${i}`);
    meses.push({ idx: i, label, salario_mes: salario_mes || null, tasa_anual: tasa_anual || null });
  }
  return meses;
}

async function cargarListaTrabajadores() {
  const q = el("dbSearch")?.value || "";
  console.log('cargarListaTrabajadores - Búsqueda:', q, 'PatronoID:', currentPatronoId);
  
  const rows = await window.dbapi.trabajadorList(q, currentPatronoId);
  console.log('Trabajadores encontrados:', rows.length, rows);

  const tb = el("tbodyTrabajadores");
  if (!tb) {
    console.error('No se encontró tbodyTrabajadores');
    return;
  }
  console.log('tbody encontrado, limpiando...');
  tb.innerHTML = "";
  
  if(rows.length === 0) {
    console.log('No hay trabajadores, mostrando mensaje');
    const tr = document.createElement("tr");
    tr.innerHTML = '<td colspan="5" style="text-align:center;padding:20px">No se encontraron trabajadores para esta empresa.</td>';
    tb.appendChild(tr);
    return;
  }

  console.log('Renderizando', rows.length, 'trabajadores...');
  rows.forEach((r, index) => {
    console.log(`Renderizando trabajador ${index + 1}:`, r.nombre);
    const tr = document.createElement("tr");
    tr.style.display = ''; // Asegurar que no esté oculto
    tr.appendChild(td(`${r.tipo_doc}-${r.doc}`));
    tr.appendChild(td(r.nombre || ""));
    tr.appendChild(td(r.cargo || ""));
    tr.appendChild(td(r.fecha_ingreso || ""));

    const actions = document.createElement("td");
    actions.style.textAlign = "center";

    actions.appendChild(btn(`<i class="fa-solid fa-download"></i> Cargar`, "gray", async () => {
      el("trabajador_tipo_doc").value = r.tipo_doc;
      el("trabajador_doc").value = r.doc;
      el("trabajador_nombre").value = r.nombre || "";
      el("trabajador_cargo").value = r.cargo || "";
      el("fecha_ingreso").value = r.fecha_ingreso || "";
      
      // Cargar salario si existe
      if(r.salario_mensual && r.salario_mensual > 0){
        el("S_NM").value = r.salario_mensual;
      }
      
      // Cargar datos del patrono si existe
      console.log('Trabajador patrono_id:', r.patrono_id);
      if(r.patrono_id){
        try {
          const patrono = await window.dbapi.patronoGetById(r.patrono_id);
          console.log('Patrono cargado:', patrono);
          if(patrono){
            el("patrono_tipo_doc").value = patrono.tipo_doc || "";
            el("patrono_doc").value = patrono.doc || "";
            el("patrono_nombre").value = patrono.nombre || "";
            console.log('Datos del patrono asignados a los campos');
          } else {
            console.log('No se encontró patrono con ID:', r.patrono_id);
          }
        } catch(err){
          console.error("Error cargando patrono:", err);
        }
      } else {
        console.log('El trabajador no tiene patrono_id asociado');
      }

      currentTrabajadorId = r.id;
      
      // Mostrar información del trabajador en los campos de display
      if(el('trabajador_nombre_display')) {
        el('trabajador_nombre_display').value = r.nombre || "";
      }
      if(el('trabajador_info_display')) {
        el('trabajador_info_display').value = `${r.tipo_doc}-${r.doc} / ${r.cargo || 'Sin cargo'}`;
      }
      
      // Cerrar lista de trabajadores
      el('listaTrabajadores').style.display = 'none';
      el('iconListaTrabajadores').className = 'fa-solid fa-chevron-down';
      
      // Ocultar cards de selección
      el('cardSeleccionEmpresa').style.display = 'none';
      el('cardSeleccionTrabajador').style.display = 'none';
      
      // Mostrar card de datos seleccionados
      el('cardDatosSeleccionados').style.display = 'block';
      
      // Mostrar formulario de cálculo
      el('cardFormularioCalculo').style.display = 'block';
      
      recalcularTiempoServicio();
      await cargarHistorial();
    }));

    actions.appendChild(document.createTextNode(" "));
    actions.appendChild(btn(`<i class="fa-solid fa-clock-rotate-left"></i> Historial`, "gray", async () => {
      currentTrabajadorId = r.id;
      await cargarHistorial();
      alert("Historial actualizado.");
    }));

    tr.appendChild(actions);
    tb.appendChild(tr);
    console.log(`Trabajador ${index + 1} agregado a la tabla`);
  });
  
  console.log('Total de filas en tbody:', tb.children.length);
  
  // Verificar visibilidad de los contenedores
  const listaTrabajadores = el('listaTrabajadores');
  const cardSeleccionTrabajador = el('cardSeleccionTrabajador');
  const tabla = tb.parentElement;
  
  console.log('listaTrabajadores display:', listaTrabajadores?.style.display);
  console.log('cardSeleccionTrabajador display:', cardSeleccionTrabajador?.style.display);
  console.log('Tabla display:', tabla?.style.display);
  console.log('Tabla offsetHeight:', tabla?.offsetHeight);
  console.log('tbody offsetHeight:', tb?.offsetHeight);
  
  // Forzar que estén visibles
  if(listaTrabajadores) {
    listaTrabajadores.style.display = 'block';
    console.log('Forzando listaTrabajadores a block');
  }
  if(cardSeleccionTrabajador) {
    cardSeleccionTrabajador.style.display = 'block';
    console.log('Forzando cardSeleccionTrabajador a block');
  }
  if(tabla) {
    tabla.style.display = 'table';
    tabla.style.visibility = 'visible';
    tabla.style.width = '100%';
    tabla.style.borderCollapse = 'collapse';
    console.log('Forzando tabla visible');
  }
  
  // Forzar que las filas sean visibles
  Array.from(tb.children).forEach((row, i) => {
    row.style.display = 'table-row';
    row.style.height = 'auto';
    
    // Forzar estilos en las celdas
    Array.from(row.children).forEach((cell, j) => {
      cell.style.display = 'table-cell';
      cell.style.padding = '8px';
      cell.style.border = '1px solid #ddd';
      console.log(`Fila ${i + 1}, Celda ${j + 1}:`, cell.innerHTML, 'offsetHeight:', cell.offsetHeight);
    });
    
    console.log(`Fila ${i + 1} display:`, row.style.display, 'offsetHeight:', row.offsetHeight, 'children:', row.children.length);
  });
  
  // Verificar todos los contenedores padres
  let parent = tabla;
  let level = 0;
  while(parent && level < 10) {
    console.log(`Padre nivel ${level}:`, parent.tagName, parent.id || parent.className, 
                'display:', window.getComputedStyle(parent).display,
                'height:', window.getComputedStyle(parent).height,
                'maxHeight:', window.getComputedStyle(parent).maxHeight,
                'overflow:', window.getComputedStyle(parent).overflow,
                'offsetHeight:', parent.offsetHeight);
    parent = parent.parentElement;
    level++;
  }
  
  // Verificar después de forzar estilos
  setTimeout(() => {
    console.log('DESPUÉS DE FORZAR - Tabla offsetHeight:', tabla?.offsetHeight);
    console.log('DESPUÉS DE FORZAR - tbody offsetHeight:', tb?.offsetHeight);
  }, 100);
}

async function cargarHistorial() {
  const tb = el("tbodyHistorial");
  if (!tb) return;
  tb.innerHTML = "";

  if (!currentTrabajadorId) return;

  const rows = await window.dbapi.calculoListarPorTrabajador(currentTrabajadorId);
  rows.forEach(r => {
    const tr = document.createElement("tr");
    tr.appendChild(td(r.id));
    tr.appendChild(td(r.created_at));
    tr.appendChild(td(r.fecha_ingreso));
    tr.appendChild(td(r.fecha_calculo));
    tr.appendChild(td(r.moneda));
    tr.appendChild(td(Number(r.total_general || 0).toFixed(2)));

    const actions = document.createElement("td");
    actions.style.textAlign = "center";

    actions.appendChild(btn(`<i class="fa-solid fa-eye"></i> Ver/Rehacer`, "gray", async () => {
      const pack = await window.dbapi.calculoGet(r.id);
      if (!pack) return alert("No se pudo cargar el cálculo.");

      const c = pack.calc;
      currentCalculoId = c.id;

      el("fecha_ingreso").value = c.fecha_ingreso || "";
      el("fecha_calculo").value = c.fecha_calculo || "";
      el("S_NM").value = c.S_NM ?? 0;
      el("DUA").value = c.DUA ?? 30;
      el("SDI_FINAL").value = c.SDI_FINAL ?? 0;
      el("DAA").value = c.DAA ?? 0;
      el("DV").value = c.DV ?? "";
      el("DBV").value = c.DBV ?? "";
      el("capital_intereses").value = c.capital_intereses ?? 0;

      setCurrency(c.moneda || "USD");

      (pack.meses || []).forEach((m, i) => {
        const idx = i + 1;
        if (el(`salario_mes_${idx}`)) el(`salario_mes_${idx}`).value = m.salario_mes ?? "";
        if (el(`tasa_mes_${idx}`)) el(`tasa_mes_${idx}`).value = m.tasa_anual ?? "";
      });

      recalcularTiempoServicio();
      calcularNomina();
      alert("Cálculo cargado en pantalla.");
    }));

    tr.appendChild(actions);
    tb.appendChild(tr);
  });
}

async function guardarTodoEnBD() {
  const patrono = {
    nombre: normalize(el("patrono_nombre")?.value),
    tipo_doc: el("patrono_tipo_doc")?.value || "J",
    doc: normalize(el("patrono_doc")?.value),
  };

  let patronoRow = null;
  if (patrono.nombre && patrono.doc) {
    patronoRow = await window.dbapi.patronoUpsert(patrono);
  }

  const trabajador = {
    patrono_id: patronoRow?.id ?? null,
    nombre: normalize(el("trabajador_nombre")?.value),
    tipo_doc: el("trabajador_tipo_doc")?.value || "V",
    doc: normalize(el("trabajador_doc")?.value),
    cargo: normalize(el("trabajador_cargo")?.value),
    fecha_ingreso: el("fecha_ingreso")?.value || "",
    salario_mensual: parseNumber("S_NM"),
  };

  if (!trabajador.doc || !trabajador.nombre || !trabajador.fecha_ingreso) {
    alert("Faltan datos del trabajador (doc, nombre o fecha de ingreso).");
    return;
  }

  const trabajadorRow = await window.dbapi.trabajadorUpsert(trabajador);
  currentTrabajadorId = trabajadorRow.id;

  recalcularTiempoServicio();
  calcularNomina();

  const payload = {
    moneda: state.currency,
    patrono_id: patronoRow?.id ?? null,
    trabajador_id: trabajadorRow.id,

    fechas: {
      fecha_ingreso: el("fecha_ingreso")?.value || "",
      fecha_calculo: el("fecha_calculo")?.value || "",
      tiempo_servicio: el("tiempo_servicio_texto")?.textContent || "",
    },

    inputs: {
      S_NM: parseNumber("S_NM"),
      DUA: parseNumber("DUA"),
      SDI_FINAL: parseNumber("SDI_FINAL"),
      DAA: parseNumber("DAA"),
      DV: parseNumber("DV"),
      DBV: parseNumber("DBV"),
      capital_intereses: parseNumber("capital_intereses"),
    },

    base: { SDN: state.SDN, AUD: state.AUD, ABVD: state.ABVD, SDI: state.SDI },

    montos: { CPV: state.CPV, CBV: state.CBV, UTIL: state.UTIL, PS: state.PS, INTERESES: state.INTERESES },

    totales: {
      total_capital: parseNumberFromText("r_TOTAL_CAPITAL"),
      total_general: parseNumberFromText("r_TOTAL_GENERAL"),
    },

    interesesMeses: getMesesInteresesPayload(),
  };

  const res = await window.dbapi.calculoGuardar(payload);
  await cargarListaTrabajadores();
  await cargarHistorial();
  alert(`Guardado OK. ID cálculo: ${res.id}`);
}

/* ===== Export Excel/PDF ===== */
async function exportarExcelCalculo() {
  if (!currentCalculoId) return alert("Primero abre un cálculo (Ver/Rehacer).");
  
  const result = await window.appapi.showSaveDialog({
    title: 'Guardar archivo Excel',
    defaultPath: `calculo_${currentCalculoId}.xlsx`,
    filters: [
      { name: 'Excel', extensions: ['xlsx'] },
      { name: 'Todos los archivos', extensions: ['*'] }
    ]
  });
  
  if (result.canceled || !result.filePath) return;

  const res = await window.dbapi.exportExcelCalculoDetallado(currentCalculoId, result.filePath);
  alert("Excel exportado: " + res.outPath);
}

async function exportarReciboPDF() {
  const result = await window.appapi.showSaveDialog({
    title: 'Guardar recibo PDF',
    defaultPath: 'recibo.pdf',
    filters: [
      { name: 'PDF', extensions: ['pdf'] },
      { name: 'Todos los archivos', extensions: ['*'] }
    ]
  });
  
  if (result.canceled || !result.filePath) return;

  const receipt = document.getElementById("receiptContainer");
  if (!receipt) return alert("No se encontró el recibo.");

  const styles = Array.from(document.querySelectorAll("style")).map(s => s.innerHTML).join("\n");

  const html = `
  <!doctype html>
  <html lang="es">
  <head><meta charset="utf-8"/><style>${styles}</style></head>
  <body>${receipt.outerHTML}</body></html>`;

  const res = await window.dbapi.exportPdfReciboDesdeHTML(html, result.filePath);
  alert("PDF exportado: " + res.outPath);
}

/* ===== Búsqueda de Patronos ===== */
let currentPatronoId = null;

async function cargarListaEmpresas() {
  const q = el("empresaSearch")?.value || "";
  const rows = await window.dbapi.patronoList(q);

  const tb = el("tbodyEmpresas");
  if (!tb) return;
  tb.innerHTML = "";

  rows.forEach(r => {
    const tr = document.createElement("tr");
    tr.appendChild(td(`${r.tipo_doc}-${r.doc}`));
    tr.appendChild(td(r.nombre || ""));

    const actions = document.createElement("td");
    actions.style.textAlign = "center";

    actions.appendChild(btn(`<i class="fa-solid fa-check-circle"></i> Seleccionar`, "primary", async () => {
      // Guardar datos de la empresa
      el("patrono_nombre").value = r.nombre || "";
      el("patrono_tipo_doc").value = r.tipo_doc || "J";
      el("patrono_doc").value = r.doc || "";
      currentPatronoId = r.id;
      
      console.log('Empresa seleccionada:', r.nombre, 'ID:', r.id);
      
      // Mostrar nombre de empresa seleccionada
      const spanEmpresa = el('empresaSeleccionadaNombre');
      if(spanEmpresa) spanEmpresa.textContent = `${r.tipo_doc}-${r.doc} - ${r.nombre}`;
      
      // Cerrar lista de empresas
      el('listaEmpresas').style.display = 'none';
      el('iconListaEmpresas').className = 'fa-solid fa-chevron-down';
      
      // Mostrar card de selección de trabajador
      el('cardSeleccionTrabajador').style.display = 'block';
      
      // Abrir automáticamente lista de trabajadores
      el('listaTrabajadores').style.display = 'block';
      el('iconListaTrabajadores').className = 'fa-solid fa-chevron-up';
      
      // Esperar un momento para que el DOM se actualice
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Filtrar trabajadores de esta empresa
      console.log('Cargando trabajadores para patrono_id:', currentPatronoId);
      await cargarListaTrabajadores();
    }));

    tr.appendChild(actions);
    tb.appendChild(tr);
  });
}

function mostrarFormularioNuevaEmpresa() {
  // Crear formulario modal simple
  const formHtml = `
    <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center" id="modalNuevaEmpresa">
      <div style="background:white;padding:30px;border-radius:10px;max-width:500px;width:90%">
        <h3 style="margin-top:0">Nueva Empresa / Patrono</h3>
        <div style="margin-bottom:15px">
          <label style="display:block;margin-bottom:5px;font-weight:bold">Nombre o Razón Social:</label>
          <input type="text" id="nuevaEmpresaNombre" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px" />
        </div>
        <div style="margin-bottom:15px">
          <label style="display:block;margin-bottom:5px;font-weight:bold">Tipo de documento:</label>
          <select id="nuevaEmpresaTipoDoc" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px">
            <option value="J">J - Jurídico</option>
            <option value="G">G - Gubernamental</option>
            <option value="V">V - Venezolano</option>
            <option value="E">E - Extranjero</option>
          </select>
        </div>
        <div style="margin-bottom:20px">
          <label style="display:block;margin-bottom:5px;font-weight:bold">Número de documento (sin guiones):</label>
          <input type="text" id="nuevaEmpresaDoc" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px" />
        </div>
        <div style="display:flex;gap:10px;justify-content:flex-end">
          <button onclick="cerrarModalNuevaEmpresa()" style="padding:10px 20px;background:#ccc;border:none;border-radius:4px;cursor:pointer">Cancelar</button>
          <button onclick="guardarNuevaEmpresa()" style="padding:10px 20px;background:#5a8c69;color:white;border:none;border-radius:4px;cursor:pointer">Guardar</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', formHtml);
  document.getElementById('nuevaEmpresaNombre').focus();
}

window.cerrarModalNuevaEmpresa = function() {
  const modal = document.getElementById('modalNuevaEmpresa');
  if (modal) modal.remove();
}

window.guardarNuevaEmpresa = async function() {
  const nombre = document.getElementById('nuevaEmpresaNombre').value.trim();
  const tipoDoc = document.getElementById('nuevaEmpresaTipoDoc').value;
  const doc = document.getElementById('nuevaEmpresaDoc').value.trim();
  
  if (!nombre) {
    alert('Por favor ingresa el nombre de la empresa');
    return;
  }
  
  if (!doc) {
    alert('Por favor ingresa el número de documento');
    return;
  }
  
  try {
    await window.dbapi.patronoUpsert({
      tipo_doc: tipoDoc.toUpperCase(),
      doc: doc,
      nombre: nombre
    });
    
    alert(`✅ Empresa "${nombre}" agregada exitosamente!`);
    cerrarModalNuevaEmpresa();
    await cargarListaEmpresas();
  } catch (err) {
    alert(`❌ Error al guardar empresa: ${err.message}`);
  }
}

function mostrarFormularioNuevoTrabajador() {
  // Ocultar lista de trabajadores
  el('cardSeleccionTrabajador').style.display = 'none';
  
  // Mostrar formulario de nuevo trabajador
  el('cardNuevoTrabajador').style.display = 'block';
  
  // Limpiar campos
  el('nuevo_trabajador_nombre').value = '';
  el('nuevo_trabajador_doc').value = '';
  el('nuevo_trabajador_cargo').value = '';
  el('nuevo_trabajador_fecha_ingreso').value = '';
  el('nuevo_trabajador_salario').value = '';
}

function cancelarNuevoTrabajador() {
  // Ocultar formulario
  el('cardNuevoTrabajador').style.display = 'none';
  
  // Mostrar lista de trabajadores
  el('cardSeleccionTrabajador').style.display = 'block';
}

async function guardarNuevoTrabajador(continuar = false) {
  const nombre = el('nuevo_trabajador_nombre')?.value?.trim();
  const doc = el('nuevo_trabajador_doc')?.value?.trim();
  const cargo = el('nuevo_trabajador_cargo')?.value?.trim();
  const fechaIngreso = el('nuevo_trabajador_fecha_ingreso')?.value;
  const salario = parseFloat(el('nuevo_trabajador_salario')?.value) || 0;
  
  if (!nombre || !doc || !fechaIngreso) {
    return alert('Debes ingresar al menos: Nombre, Documento y Fecha de Ingreso');
  }
  
  if (!currentPatronoId) {
    return alert('Error: No hay empresa seleccionada');
  }
  
  const trabajador = {
    patrono_id: currentPatronoId,
    nombre: nombre,
    tipo_doc: el('nuevo_trabajador_tipo_doc')?.value || 'V',
    doc: doc,
    cargo: cargo,
    fecha_ingreso: fechaIngreso,
    salario_mensual: salario
  };
  
  try {
    const trabajadorRow = await window.dbapi.trabajadorUpsert(trabajador);
    
    if (continuar) {
      // Cargar datos del trabajador y continuar al cálculo
      el('trabajador_nombre').value = nombre;
      el('trabajador_doc').value = doc;
      el('trabajador_tipo_doc').value = trabajador.tipo_doc;
      el('trabajador_cargo').value = cargo;
      el('fecha_ingreso').value = fechaIngreso;
      if (salario > 0) el('S_NM').value = salario;
      
      currentTrabajadorId = trabajadorRow.id;
      
      // Mostrar en campos de display
      el('trabajador_nombre_display').value = nombre;
      el('trabajador_info_display').value = `${trabajador.tipo_doc}-${doc} / ${cargo || 'Sin cargo'}`;
      
      // Ocultar formulario y cards de selección
      el('cardNuevoTrabajador').style.display = 'none';
      el('cardSeleccionEmpresa').style.display = 'none';
      el('cardSeleccionTrabajador').style.display = 'none';
      
      // Mostrar datos seleccionados y formulario de cálculo
      el('cardDatosSeleccionados').style.display = 'block';
      el('cardFormularioCalculo').style.display = 'block';
      
      recalcularTiempoServicio();
      await cargarHistorial();
    } else {
      // Solo guardar y volver a la lista
      alert('Trabajador guardado exitosamente');
      el('cardNuevoTrabajador').style.display = 'none';
      el('cardSeleccionTrabajador').style.display = 'block';
      await cargarListaTrabajadores();
    }
  } catch (err) {
    console.error('Error guardando trabajador:', err);
    alert('Error al guardar el trabajador: ' + err.message);
  }
}

function cambiarSeleccion() {
  // Limpiar datos
  el("patrono_nombre").value = "";
  el("patrono_doc").value = "";
  el("patrono_tipo_doc").value = "J";
  el("trabajador_nombre").value = "";
  el("trabajador_doc").value = "";
  el("trabajador_cargo").value = "";
  currentPatronoId = null;
  currentTrabajadorId = null;
  
  // Ocultar cards de datos y formulario
  el('cardDatosSeleccionados').style.display = 'none';
  el('cardFormularioCalculo').style.display = 'none';
  el('cardNuevoTrabajador').style.display = 'none';
  
  // Mostrar card de selección de empresa
  el('cardSeleccionEmpresa').style.display = 'block';
  el('cardSeleccionTrabajador').style.display = 'none';
  
  // Abrir lista de empresas
  el('listaEmpresas').style.display = 'block';
  el('iconListaEmpresas').className = 'fa-solid fa-chevron-up';
  
  cargarListaEmpresas();
}

document.addEventListener("DOMContentLoaded", () => {
  el("dbSearch")?.addEventListener("input", cargarListaTrabajadores);
  el("btnHistRefresh")?.addEventListener("click", cargarHistorial);
  el("btnGuardarTodo")?.addEventListener("click", guardarTodoEnBD);

  el("btnExportExcelCalculo")?.addEventListener("click", exportarExcelCalculo);
  el("btnExportReciboPdf")?.addEventListener("click", exportarReciboPDF);
  
  el("empresaSearch")?.addEventListener("input", cargarListaEmpresas);
  el("btnCambiarSeleccion")?.addEventListener("click", cambiarSeleccion);
  el("btnNuevaEmpresa")?.addEventListener("click", mostrarFormularioNuevaEmpresa);
  
  el("btnNuevoTrabajador")?.addEventListener("click", mostrarFormularioNuevoTrabajador);
  el("btnCancelarNuevoTrabajador")?.addEventListener("click", cancelarNuevoTrabajador);
  el("btnGuardarNuevoTrabajador")?.addEventListener("click", () => guardarNuevoTrabajador(false));
  el("btnGuardarYCalcular")?.addEventListener("click", () => guardarNuevoTrabajador(true));

  // Cargar listas iniciales
  cargarListaEmpresas();
  
  // La sección de empresas empieza CERRADA
  el('listaEmpresas').style.display = 'none';
  el('iconListaEmpresas').className = 'fa-solid fa-chevron-down';
});
