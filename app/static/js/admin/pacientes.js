/**
 * Modales de Pacientes - Laboratorio Pérez
 * Versión con modales dinámicos en JavaScript puro
 * Doctor Mauricio - Modal de éxito al agregar paciente
 */

(function () {
    'use strict';

    console.log('pacientes.js v2 - modales dinámicos cargando...');

    // CSS para los modales - inyectado directamente
    var modalCSS = `
        .paciente-modal-overlay {
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
        
        .paciente-modal-overlay.active {
            opacity: 1 !important;
            visibility: visible !important;
        }
        
        .paciente-modal-box {
            background: white !important;
            border-radius: 20px !important;
            width: 90% !important;
            max-width: 500px !important;
            box-shadow: 0 25px 80px rgba(0,0,0,0.3) !important;
            transform: translateY(-30px);
            transition: all 0.3s ease !important;
            overflow: hidden !important;
        }
        
        .paciente-modal-overlay.active .paciente-modal-box {
            transform: translateY(0) !important;
        }
        
        .paciente-modal-header {
            padding: 25px 30px !important;
            color: white !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
        }
        
        .paciente-modal-header.naranja {
            background: linear-gradient(135deg, #F39C12, #E67E22) !important;
        }
        
        .paciente-modal-header.azul {
            background: linear-gradient(135deg, #3498DB, #2980B9) !important;
        }
        
        .paciente-modal-header.verde {
            background: linear-gradient(135deg, #27AE60, #229954) !important;
        }
        
        .paciente-modal-header.rojo {
            background: linear-gradient(135deg, #E74C3C, #C0392B) !important;
        }
        
        .paciente-modal-header h3 {
            margin: 0 !important;
            font-size: 1.3rem !important;
            font-weight: 600 !important;
        }
        
        .paciente-modal-close {
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
        
        .paciente-modal-close:hover {
            background: rgba(255,255,255,0.4) !important;
        }
        
        .paciente-modal-body {
            padding: 30px !important;
        }
        
        .paciente-modal-body label {
            display: block !important;
            margin-bottom: 8px !important;
            font-weight: 600 !important;
            color: #2C3E50 !important;
        }
        
        .paciente-modal-body input[type="text"],
        .paciente-modal-body input[type="email"] {
            width: 100% !important;
            padding: 12px 15px !important;
            border: 2px solid #E9ECEF !important;
            border-radius: 10px !important;
            font-size: 1rem !important;
            margin-bottom: 15px !important;
            box-sizing: border-box !important;
        }
        
        .paciente-modal-body input:focus {
            border-color: #F39C12 !important;
            outline: none !important;
        }
        
        .paciente-modal-body input[readonly] {
            background: #F8F9FA !important;
        }
        
        .paciente-modal-footer {
            padding: 20px 30px !important;
            display: flex !important;
            gap: 15px !important;
            justify-content: flex-end !important;
            border-top: 1px solid #E9ECEF !important;
        }
        
        .paciente-modal-btn {
            padding: 12px 25px !important;
            border: none !important;
            border-radius: 10px !important;
            font-size: 1rem !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
        }
        
        .paciente-modal-btn-secondary {
            background: #6C757D !important;
            color: white !important;
        }
        
        .paciente-modal-btn-secondary:hover {
            background: #5A6268 !important;
        }
        
        .paciente-modal-btn-naranja {
            background: linear-gradient(135deg, #F39C12, #E67E22) !important;
            color: white !important;
        }
        
        .paciente-modal-btn-naranja:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 5px 20px rgba(243, 156, 18, 0.4) !important;
        }
        
        .paciente-modal-btn-success {
            background: linear-gradient(135deg, #27AE60, #229954) !important;
            color: white !important;
        }
        
        .paciente-modal-btn-success:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 5px 20px rgba(39, 174, 96, 0.4) !important;
        }
        
        .paciente-modal-btn-danger {
            background: linear-gradient(135deg, #E74C3C, #C0392B) !important;
            color: white !important;
        }
        
        .paciente-modal-btn-danger:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 5px 20px rgba(231, 76, 60, 0.4) !important;
        }
        
        .paciente-info-box {
            background: #F8F9FA !important;
            padding: 20px !important;
            border-radius: 10px !important;
            margin: 15px 0 !important;
        }
        
        .paciente-info-box p {
            margin: 8px 0 !important;
        }
        
        .paciente-success-icon {
            font-size: 4rem !important;
            color: #27AE60 !important;
            margin-bottom: 20px !important;
        }
        
        .alert-danger-custom {
            background: #F8D7DA !important;
            border: 1px solid #F5C6CB !important;
            color: #721C24 !important;
            padding: 15px 20px !important;
            border-radius: 10px !important;
            margin-bottom: 20px !important;
        }
    `;

    // Inyectar CSS
    var styleEl = document.createElement('style');
    styleEl.textContent = modalCSS;
    document.head.appendChild(styleEl);

    // Función para cerrar modal
    function cerrarModal(overlay) {
        overlay.classList.remove('active');
        setTimeout(function () {
            overlay.remove();
        }, 300);
    }

    // Función para mostrar modal de Ver Paciente
    function mostrarModalVer(id) {
        fetch('/paciente/' + id)
            .then(function (response) { return response.json(); })
            .then(function (data) {
                var overlay = document.createElement('div');
                overlay.className = 'paciente-modal-overlay';
                overlay.innerHTML = `
                    <div class="paciente-modal-box">
                        <div class="paciente-modal-header azul">
                            <h3>ℹ️ Información del Paciente</h3>
                            <button class="paciente-modal-close">&times;</button>
                        </div>
                        <div class="paciente-modal-body">
                            <div class="paciente-info-box">
                                <p><strong>#️⃣ ID:</strong> ${data.id}</p>
                                <p><strong>👤 Nombre:</strong> ${data.nombre}</p>
                                <p><strong>🪪 CI:</strong> ${data.ci}</p>
                                <p><strong>📞 Teléfono:</strong> ${data.telefono || '-'}</p>
                                <p><strong>📧 Email:</strong> ${data.email || '-'}</p>
                                <p><strong>📅 Registro:</strong> ${data.fecha_registro}</p>
                            </div>
                        </div>
                        <div class="paciente-modal-footer">
                            <button type="button" class="paciente-modal-btn paciente-modal-btn-secondary btn-cerrar">
                                ✕ Cerrar
                            </button>
                        </div>
                    </div>
                `;

                document.body.appendChild(overlay);
                overlay.offsetHeight;
                overlay.classList.add('active');

                overlay.querySelector('.paciente-modal-close').onclick = function () { cerrarModal(overlay); };
                overlay.querySelector('.btn-cerrar').onclick = function () { cerrarModal(overlay); };
                overlay.addEventListener('click', function (e) { if (e.target === overlay) cerrarModal(overlay); });
            })
            .catch(function (error) {
                console.error('Error al cargar datos:', error);
                alert('Error al cargar los datos del paciente');
            });
    }

    // Función para mostrar modal de Editar
    function mostrarModalEditar(id, nombre, ci, telefono, email) {
        var overlay = document.createElement('div');
        overlay.className = 'paciente-modal-overlay';
        overlay.innerHTML = `
            <div class="paciente-modal-box">
                <div class="paciente-modal-header naranja">
                    <h3>✏️ Editar Paciente</h3>
                    <button class="paciente-modal-close">&times;</button>
                </div>
                <form action="/paciente/editar/${id}" method="POST">
                    <div class="paciente-modal-body">
                        <label>👤 Nombre Completo *</label>
                        <input type="text" name="nombre" value="${nombre}" required>
                        <label>🪪 CI *</label>
                        <input type="text" name="ci" value="${ci}" required>
                        <label>📞 Teléfono</label>
                        <input type="text" name="telefono" value="${telefono}">
                        <label>📧 Email</label>
                        <input type="email" name="email" value="${email}">
                    </div>
                    <div class="paciente-modal-footer">
                        <button type="button" class="paciente-modal-btn paciente-modal-btn-secondary btn-cerrar">
                            ✕ Cancelar
                        </button>
                        <button type="submit" class="paciente-modal-btn paciente-modal-btn-naranja">
                            💾 Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(overlay);
        overlay.offsetHeight;
        overlay.classList.add('active');

        overlay.querySelector('.paciente-modal-close').onclick = function () { cerrarModal(overlay); };
        overlay.querySelector('.btn-cerrar').onclick = function () { cerrarModal(overlay); };
        overlay.addEventListener('click', function (e) { if (e.target === overlay) cerrarModal(overlay); });
    }

    // Función para mostrar modal de Eliminar
    function mostrarModalEliminar(id, nombre) {
        var overlay = document.createElement('div');
        overlay.className = 'paciente-modal-overlay';
        overlay.innerHTML = `
            <div class="paciente-modal-box">
                <div class="paciente-modal-header rojo">
                    <h3>🗑️ Confirmar Eliminación</h3>
                    <button class="paciente-modal-close">&times;</button>
                </div>
                <form action="/paciente/eliminar/${id}" method="POST">
                    <div class="paciente-modal-body">
                        <div class="alert-danger-custom">
                            <strong>⚠️ ¡ADVERTENCIA!</strong><br>
                            Esta acción es <strong>IRREVERSIBLE</strong> y eliminará:
                        </div>
                        <ul style="color: #7F8C8D; margin-left: 20px; margin-bottom: 20px;">
                            <li>👤 El paciente: <strong>${nombre}</strong></li>
                            <li>📄 Todos sus resultados y archivos PDF</li>
                            <li>💾 Todos los registros de la base de datos</li>
                        </ul>
                        <div style="background: #FFF3CD; padding: 15px; border-radius: 10px;">
                            <strong>❓ ¿Está seguro de continuar?</strong>
                        </div>
                    </div>
                    <div class="paciente-modal-footer">
                        <button type="button" class="paciente-modal-btn paciente-modal-btn-secondary btn-cerrar">
                            ✕ Cancelar
                        </button>
                        <button type="submit" class="paciente-modal-btn paciente-modal-btn-danger">
                            🗑️ Sí, Eliminar
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(overlay);
        overlay.offsetHeight;
        overlay.classList.add('active');

        overlay.querySelector('.paciente-modal-close').onclick = function () { cerrarModal(overlay); };
        overlay.querySelector('.btn-cerrar').onclick = function () { cerrarModal(overlay); };
        overlay.addEventListener('click', function (e) { if (e.target === overlay) cerrarModal(overlay); });
    }

    // Función para mostrar modal de Éxito
    function mostrarModalExito(nombre) {
        var overlay = document.createElement('div');
        overlay.className = 'paciente-modal-overlay';
        overlay.innerHTML = `
            <div class="paciente-modal-box">
                <div class="paciente-modal-header naranja">
                    <h3>✅ ¡Paciente Agregado!</h3>
                    <button class="paciente-modal-close">&times;</button>
                </div>
                <div class="paciente-modal-body" style="text-align: center;">
                    <div class="paciente-success-icon" style="color: #F39C12 !important;">✓</div>
                    <p style="font-size: 1.3rem; color: #F39C12; font-weight: 600; margin-bottom: 15px;">
                        ¡Se agregó exitosamente al paciente!
                    </p>
                    <p style="font-size: 1.1rem; color: #2C3E50; margin-bottom: 20px;">
                        <strong>${nombre}</strong>
                    </p>
                    <p style="color: #7F8C8D; font-size: 1.1rem;">
                        ¿Desea seguir agregando pacientes, <strong>Doctor Mauricio</strong>?
                    </p>
                </div>
                <div class="paciente-modal-footer" style="justify-content: center;">
                    <button type="button" class="paciente-modal-btn paciente-modal-btn-naranja btn-volver">
                        ← Volver
                    </button>
                    <button type="button" class="paciente-modal-btn paciente-modal-btn-naranja btn-agregar-otro">
                        + Agregar Otro Paciente
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        overlay.offsetHeight;
        overlay.classList.add('active');

        overlay.querySelector('.paciente-modal-close').onclick = function () { window.location.href = '/pacientes'; };
        overlay.querySelector('.btn-volver').onclick = function () { window.location.href = '/pacientes'; };
        overlay.querySelector('.btn-agregar-otro').onclick = function () {
            // Cerrar modal y abrir el formulario de nuevo paciente
            cerrarModal(overlay);
            setTimeout(function () {
                // Abrir el modal de Bootstrap #modalNuevo
                var modalNuevo = document.getElementById('modalNuevo');
                if (modalNuevo && typeof bootstrap !== 'undefined') {
                    var bsModal = new bootstrap.Modal(modalNuevo);
                    bsModal.show();
                } else {
                    // Fallback: hacer clic en el botón que abre el modal
                    var btnNuevo = document.querySelector('[data-bs-target="#modalNuevo"]');
                    if (btnNuevo) btnNuevo.click();
                }
            }, 350);
        };
        overlay.addEventListener('click', function (e) { if (e.target === overlay) window.location.href = '/pacientes'; });
    }

    // Inicializar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', function () {
        console.log('Inicializando modales de pacientes...');

        // Botones de Ver
        document.querySelectorAll('.btn-ver').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                mostrarModalVer(this.dataset.id);
            });
        });

        // Botones de Editar
        document.querySelectorAll('.btn-editar').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                mostrarModalEditar(
                    this.dataset.id,
                    this.dataset.nombre || '',
                    this.dataset.ci || '',
                    this.dataset.telefono || '',
                    this.dataset.email || ''
                );
            });
        });

        // Botones de Eliminar
        document.querySelectorAll('.btn-eliminar').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                mostrarModalEliminar(this.dataset.id, this.dataset.nombre || 'Paciente');
            });
        });

        // Verificar si se agregó un paciente exitosamente (vía URL params)
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('nuevo_exito')) {
            var nombrePaciente = urlParams.get('paciente_nombre') || 'Paciente';
            mostrarModalExito(nombrePaciente);

            // Limpiar URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        console.log('Modales de pacientes inicializados correctamente');
    });
})();
