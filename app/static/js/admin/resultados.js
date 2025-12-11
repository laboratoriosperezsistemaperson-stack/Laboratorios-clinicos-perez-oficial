/**
 * Modales de Resultados - Laboratorio Pérez
 * Versión alternativa con modales creados dinámicamente en JavaScript puro
 * Esto evita conflictos de CSS inyectando directamente en el body
 */

(function () {
    'use strict';

    console.log('resultados.js v2 - modales dinámicos cargando...');

    // CSS para los modales - inyectado directamente
    var modalCSS = `
        .resultado-modal-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0, 0, 0, 0.6) !important;
            z-index: 99999 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease !important;
        }
        
        .resultado-modal-overlay.active {
            opacity: 1 !important;
            visibility: visible !important;
        }
        
        .resultado-modal-box {
            background: white !important;
            border-radius: 20px !important;
            width: 90% !important;
            max-width: 500px !important;
            box-shadow: 0 25px 80px rgba(0,0,0,0.3) !important;
            transform: translateY(-30px);
            transition: all 0.3s ease !important;
            overflow: hidden !important;
        }
        
        .resultado-modal-overlay.active .resultado-modal-box {
            transform: translateY(0) !important;
        }
        
        .resultado-modal-header {
            padding: 25px 30px !important;
            color: white !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
        }
        
        .resultado-modal-header.naranja {
            background: linear-gradient(135deg, #F39C12, #E67E22) !important;
        }
        
        .resultado-modal-header.verde {
            background: linear-gradient(135deg, #27AE60, #229954) !important;
        }
        
        .resultado-modal-header.rojo {
            background: linear-gradient(135deg, #E74C3C, #C0392B) !important;
        }
        
        .resultado-modal-header h3 {
            margin: 0 !important;
            font-size: 1.3rem !important;
            font-weight: 600 !important;
        }
        
        .resultado-modal-close {
            background: rgba(255,255,255,0.2) !important;
            border: none !important;
            color: white !important;
            font-size: 1.5rem !important;
            cursor: pointer !important;
            width: 35px !important;
            height: 35px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.2s !important;
        }
        
        .resultado-modal-close:hover {
            background: rgba(255,255,255,0.4) !important;
        }
        
        .resultado-modal-body {
            padding: 30px !important;
        }
        
        .resultado-modal-body .alert {
            padding: 15px 20px !important;
            border-radius: 10px !important;
            margin-bottom: 20px !important;
        }
        
        .resultado-modal-body .alert-warning {
            background: #FFF3CD !important;
            border: 1px solid #FFEAA7 !important;
            color: #856404 !important;
        }
        
        .resultado-modal-body .alert-danger {
            background: #F8D7DA !important;
            border: 1px solid #F5C6CB !important;
            color: #721C24 !important;
        }
        
        .resultado-modal-body label {
            display: block !important;
            margin-bottom: 8px !important;
            font-weight: 600 !important;
            color: #2C3E50 !important;
        }
        
        .resultado-modal-body input[type="text"],
        .resultado-modal-body input[type="file"] {
            width: 100% !important;
            padding: 12px 15px !important;
            border: 2px solid #E9ECEF !important;
            border-radius: 10px !important;
            font-size: 1rem !important;
            margin-bottom: 15px !important;
            box-sizing: border-box !important;
        }
        
        .resultado-modal-body input[readonly] {
            background: #F8F9FA !important;
        }
        
        .resultado-modal-footer {
            padding: 20px 30px !important;
            display: flex !important;
            gap: 15px !important;
            justify-content: flex-end !important;
            border-top: 1px solid #E9ECEF !important;
        }
        
        .resultado-modal-btn {
            padding: 12px 25px !important;
            border: none !important;
            border-radius: 10px !important;
            font-size: 1rem !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
        }
        
        .resultado-modal-btn-secondary {
            background: #6C757D !important;
            color: white !important;
        }
        
        .resultado-modal-btn-secondary:hover {
            background: #5A6268 !important;
        }
        
        .resultado-modal-btn-naranja {
            background: linear-gradient(135deg, #F39C12, #E67E22) !important;
            color: white !important;
        }
        
        .resultado-modal-btn-naranja:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 5px 20px rgba(243, 156, 18, 0.4) !important;
        }
        
        .resultado-modal-btn-success {
            background: linear-gradient(135deg, #27AE60, #229954) !important;
            color: white !important;
        }
        
        .resultado-modal-btn-success:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 5px 20px rgba(39, 174, 96, 0.4) !important;
        }
        
        .resultado-modal-btn-danger {
            background: linear-gradient(135deg, #E74C3C, #C0392B) !important;
            color: white !important;
        }
        
        .resultado-modal-btn-danger:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 5px 20px rgba(231, 76, 60, 0.4) !important;
        }
        
        .resultado-info-box {
            background: #F8F9FA !important;
            padding: 20px !important;
            border-radius: 10px !important;
            margin: 20px 0 !important;
        }
        
        .resultado-info-box p {
            margin: 8px 0 !important;
        }
    `;

    // Inyectar CSS
    var styleEl = document.createElement('style');
    styleEl.textContent = modalCSS;
    document.head.appendChild(styleEl);

    // Función para crear modal de Reemplazar
    function mostrarModalReemplazar(id, paciente, orden) {
        var overlay = document.createElement('div');
        overlay.className = 'resultado-modal-overlay';
        overlay.innerHTML = `
            <div class="resultado-modal-box">
                <div class="resultado-modal-header naranja">
                    <h3><i class="fas fa-sync-alt"></i> Reemplazar PDF del Resultado</h3>
                    <button class="resultado-modal-close" onclick="this.closest('.resultado-modal-overlay').remove()">&times;</button>
                </div>
                <form action="/resultado/reemplazar/${id}" method="POST" enctype="multipart/form-data">
                    <div class="resultado-modal-body">
                        <div class="alert alert-warning">
                            <strong>⚠ Atención:</strong> El PDF actual será reemplazado permanentemente.
                        </div>
                        <label>👤 Paciente:</label>
                        <input type="text" value="${paciente}" readonly>
                        <label>🔢 Número de Orden:</label>
                        <input type="text" value="${orden}" readonly>
                        <hr style="border: 1px solid #E9ECEF; margin: 20px 0;">
                        <label>📄 Nuevo Archivo PDF *</label>
                        <input type="file" name="archivo_pdf" accept=".pdf" required>
                    </div>
                    <div class="resultado-modal-footer">
                        <button type="button" class="resultado-modal-btn resultado-modal-btn-secondary" onclick="this.closest('.resultado-modal-overlay').remove()">
                            ✕ Cancelar
                        </button>
                        <button type="submit" class="resultado-modal-btn resultado-modal-btn-naranja">
                            🔄 Reemplazar PDF
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(overlay);

        // Forzar reflow para animación
        overlay.offsetHeight;
        overlay.classList.add('active');

        // Cerrar al hacer clic fuera
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    // Función para crear modal de Eliminar (Soft-Delete - Mover a papelera)
    function mostrarModalEliminar(id, paciente, orden) {
        var overlay = document.createElement('div');
        overlay.className = 'resultado-modal-overlay';
        overlay.innerHTML = `
            <div class="resultado-modal-box">
                <div class="resultado-modal-header naranja">
                    <h3><i class="fas fa-trash-alt"></i> Mover a Papelera</h3>
                    <button class="resultado-modal-close" onclick="this.closest('.resultado-modal-overlay').remove()">&times;</button>
                </div>
                <form action="/resultado/eliminar/${id}" method="POST">
                    <div class="resultado-modal-body">
                        <div class="alert alert-warning">
                            <strong>⚠ Atención:</strong> El resultado será movido a la papelera.
                        </div>
                        <p style="font-size: 1.1rem; color: #2C3E50;">El paciente ya no podrá consultar este resultado.</p>
                        <div class="resultado-info-box">
                            <p><strong>👤 Paciente:</strong> ${paciente}</p>
                            <p><strong>🔢 Número de Orden:</strong> ${orden}</p>
                        </div>
                        <p style="color: #27AE60; font-weight: 600;">✓ Puede restaurarlo desde la pestaña "Eliminados"</p>
                    </div>
                    <div class="resultado-modal-footer">
                        <button type="button" class="resultado-modal-btn resultado-modal-btn-secondary" onclick="this.closest('.resultado-modal-overlay').remove()">
                            ✕ Cancelar
                        </button>
                        <button type="submit" class="resultado-modal-btn resultado-modal-btn-naranja">
                            🗑 Mover a Papelera
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(overlay);
        overlay.offsetHeight;
        overlay.classList.add('active');

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    // Función para crear modal de Restaurar
    function mostrarModalRestaurar(id, paciente, orden) {
        var overlay = document.createElement('div');
        overlay.className = 'resultado-modal-overlay';
        overlay.innerHTML = `
            <div class="resultado-modal-box">
                <div class="resultado-modal-header verde">
                    <h3><i class="fas fa-undo"></i> Restaurar Resultado</h3>
                    <button class="resultado-modal-close" onclick="this.closest('.resultado-modal-overlay').remove()">&times;</button>
                </div>
                <form action="/resultado/restaurar/${id}" method="POST">
                    <div class="resultado-modal-body">
                        <div class="alert" style="background: #D4EDDA; border: 1px solid #C3E6CB; color: #155724; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                            <strong>✓ Restaurar resultado</strong>
                        </div>
                        <p style="font-size: 1.1rem; color: #2C3E50;">El resultado volverá a estar disponible para consulta.</p>
                        <div class="resultado-info-box">
                            <p><strong>👤 Paciente:</strong> ${paciente}</p>
                            <p><strong>🔢 Número de Orden:</strong> ${orden}</p>
                        </div>
                        <p style="color: #27AE60; font-weight: 600;">✓ El paciente podrá consultarlo nuevamente con su código de acceso</p>
                    </div>
                    <div class="resultado-modal-footer">
                        <button type="button" class="resultado-modal-btn resultado-modal-btn-secondary" onclick="this.closest('.resultado-modal-overlay').remove()">
                            ✕ Cancelar
                        </button>
                        <button type="submit" class="resultado-modal-btn resultado-modal-btn-success">
                            ↩ Restaurar Resultado
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(overlay);
        overlay.offsetHeight;
        overlay.classList.add('active');

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    // Función para crear modal de Eliminar Permanente
    function mostrarModalEliminarPermanente(id, paciente, orden) {
        var overlay = document.createElement('div');
        overlay.className = 'resultado-modal-overlay';
        overlay.innerHTML = `
            <div class="resultado-modal-box">
                <div class="resultado-modal-header rojo">
                    <h3><i class="fas fa-times-circle"></i> Eliminar Permanentemente</h3>
                    <button class="resultado-modal-close" onclick="this.closest('.resultado-modal-overlay').remove()">&times;</button>
                </div>
                <form action="/resultado/eliminar-permanente/${id}" method="POST">
                    <div class="resultado-modal-body">
                        <div class="alert alert-danger">
                            <strong>⚠ ¡ADVERTENCIA!</strong> Esta acción NO se puede deshacer.
                        </div>
                        <p style="font-size: 1.1rem; color: #2C3E50;">¿Está seguro que desea eliminar permanentemente este resultado?</p>
                        <div class="resultado-info-box">
                            <p><strong>👤 Paciente:</strong> ${paciente}</p>
                            <p><strong>🔢 Número de Orden:</strong> ${orden}</p>
                        </div>
                        <p style="color: #E74C3C; font-weight: 600;">🚫 Se eliminarán:</p>
                        <ul style="color: #7F8C8D; margin-left: 20px;">
                            <li>El registro del resultado de la base de datos</li>
                            <li>El archivo PDF principal</li>
                            <li>El archivo PDF de backup</li>
                            <li>El código de acceso del paciente</li>
                        </ul>
                    </div>
                    <div class="resultado-modal-footer">
                        <button type="button" class="resultado-modal-btn resultado-modal-btn-secondary" onclick="this.closest('.resultado-modal-overlay').remove()">
                            ✕ Cancelar
                        </button>
                        <button type="submit" class="resultado-modal-btn resultado-modal-btn-danger">
                            ❌ Sí, Eliminar Permanentemente
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(overlay);
        overlay.offsetHeight;
        overlay.classList.add('active');

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    // Inicializar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', function () {
        console.log('Inicializando modales dinámicos...');

        // Botones de reemplazar
        var replaceButtons = document.querySelectorAll('.btn-replace');
        console.log('Botones btn-replace encontrados:', replaceButtons.length);

        replaceButtons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var id = this.dataset.id;
                var paciente = this.dataset.paciente || 'N/A';
                var orden = this.dataset.orden || 'N/A';
                console.log('Abriendo modal reemplazar para ID:', id);
                mostrarModalReemplazar(id, paciente, orden);
            });
        });

        // Botones de eliminar (soft-delete)
        var deleteButtons = document.querySelectorAll('.btn-delete');
        console.log('Botones btn-delete encontrados:', deleteButtons.length);

        deleteButtons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var id = this.dataset.id;
                var paciente = this.dataset.paciente || 'N/A';
                var orden = this.dataset.orden || 'N/A';
                console.log('Abriendo modal eliminar para ID:', id);
                mostrarModalEliminar(id, paciente, orden);
            });
        });

        // Botones de restaurar (desde papelera)
        var restoreButtons = document.querySelectorAll('.btn-restore');
        console.log('Botones btn-restore encontrados:', restoreButtons.length);

        restoreButtons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var id = this.dataset.id;
                var paciente = this.dataset.paciente || 'N/A';
                var orden = this.dataset.orden || 'N/A';
                console.log('Abriendo modal restaurar para ID:', id);
                mostrarModalRestaurar(id, paciente, orden);
            });
        });

        // Botones de eliminar permanente
        var deletePermanentButtons = document.querySelectorAll('.btn-delete-permanent');
        console.log('Botones btn-delete-permanent encontrados:', deletePermanentButtons.length);

        deletePermanentButtons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var id = this.dataset.id;
                var paciente = this.dataset.paciente || 'N/A';
                var orden = this.dataset.orden || 'N/A';
                console.log('Abriendo modal eliminar permanente para ID:', id);
                mostrarModalEliminarPermanente(id, paciente, orden);
            });
        });

        // Búsqueda en tabla de eliminados
        var searchEliminados = document.getElementById('searchEliminados');
        if (searchEliminados) {
            searchEliminados.addEventListener('keyup', function (e) {
                var searchTerm = e.target.value.toLowerCase();
                var rows = document.querySelectorAll('#tablaEliminados tr');
                rows.forEach(function (row) {
                    var text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            });
        }

        // Modal de confirmación post-redirect
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('nuevo_exito')) {
            var pacienteNombre = urlParams.get('paciente_nombre') || 'Paciente';

            var overlay = document.createElement('div');
            overlay.className = 'resultado-modal-overlay active';
            overlay.innerHTML = `
                <div class="resultado-modal-box">
                    <div class="resultado-modal-header naranja">
                        <h3>✓ ¡Resultado Subido!</h3>
                        <button class="resultado-modal-close" onclick="window.location.href='/resultados'">&times;</button>
                    </div>
                    <div class="resultado-modal-body" style="text-align: center;">
                        <p style="font-size: 1.2rem;">El resultado para <strong>${pacienteNombre}</strong> se guardó correctamente.</p>
                        <p style="color: #7F8C8D;">¿Desea agregar otro resultado para este paciente?</p>
                    </div>
                    <div class="resultado-modal-footer" style="justify-content: center;">
                        <button type="button" class="resultado-modal-btn resultado-modal-btn-naranja" onclick="window.location.href='/resultados'">
                            ← Finalizar
                        </button>
                        <button type="button" class="resultado-modal-btn resultado-modal-btn-naranja" id="btnAgregarOtroDinamico">
                            + Agregar Otro
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            // Limpiar URL primero
            window.history.replaceState({}, document.title, window.location.pathname);

            // Agregar evento al botón "Agregar Otro"
            var btnAgregarOtro = document.getElementById('btnAgregarOtroDinamico');
            if (btnAgregarOtro) {
                btnAgregarOtro.addEventListener('click', function () {
                    // Cerrar este modal
                    overlay.remove();

                    // Abrir el modal de Nuevo Resultado
                    setTimeout(function () {
                        var modalNuevo = document.getElementById('modalNuevo');
                        if (modalNuevo) {
                            // Pre-seleccionar el mismo paciente
                            var pacienteId = urlParams.get('paciente_id');
                            var selectPaciente = document.getElementById('selectPaciente');
                            if (selectPaciente && pacienteId) {
                                selectPaciente.value = pacienteId;
                                selectPaciente.dispatchEvent(new Event('change'));
                            }

                            // Mostrar el modal Bootstrap
                            var bsModal = new bootstrap.Modal(modalNuevo);
                            bsModal.show();

                            // Agregar listener para limpiar backdrop cuando se cierre
                            modalNuevo.addEventListener('hidden.bs.modal', function () {
                                // Limpiar cualquier backdrop residual
                                document.querySelectorAll('.modal-backdrop').forEach(function (el) {
                                    el.remove();
                                });
                                // Quitar clase modal-open del body
                                document.body.classList.remove('modal-open');
                                document.body.style.overflow = '';
                                document.body.style.paddingRight = '';
                            }, { once: true });
                        }
                    }, 200);
                });
            }
        }

        console.log('Modales dinámicos inicializados correctamente');
    });
})();
