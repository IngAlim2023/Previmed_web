/// <reference types="cypress" />

describe('Formulario de Registro de Pacientes - E2E', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
    cy.intercept('POST', '/login', {
      statusCode: 200,
      body: {
        message: 'Acceso permitido',
        token: 'fake-token',
        data: {
          id: 1,
          nombre: 'Juan',
          apellido: 'Pérez',
          numero_documento: '123456',
          rol: { nombreRol: 'paciente' },
        },
      },
    }).as('loginSuccess');

    cy.get('input[placeholder="Número de documento"]').type('1063807932 ');
    cy.get('input[placeholder="Contraseña"]').type('123456');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginSuccess');
    // Visitar la página directamente
    cy.visit('http://localhost:5173/formularioPacientes');
  });

  // Llenar datos del titular
  const llenarDatosTitular = () => {
    cy.get('input[name="titular.usuario.nombre"]').type('Juan');
    cy.get('input[name="titular.usuario.apellido"]').type('Pérez');
    cy.get('select[name="titular.usuario.tipo_documento"]').select('CC');
    cy.get('input[name="titular.usuario.numero_documento"]').type('1234567890');
    cy.get('input[name="titular.usuario.fecha_nacimiento"]').type('1990-01-15');
    cy.get('input[name="titular.usuario.email"]').type(`juan.perez${Date.now()}@email.com`);
    cy.get('input[name="titular.usuario.password"]').type('password123');
    cy.get('input[name="titular.usuario.direccion"]').type('Cra 10 # 20-30, Centro');
    cy.get('input[name="titular.usuario.autorizacion_datos"]').check({ force: true });
  };

  //  Llenar datos del contrato
  const llenarDatosContrato = () => {
    // La fecha de inicio ya viene por defecto
    cy.get('input[name="contrato.fecha_fin"]').clear().type('2026-12-31');
    
    // React-Select para forma de pago
    cy.get('[name="contrato.forma_pago"]').parent().parent().click();
    cy.get('.css-26l3qy-menu').first().contains('li', 'Mensual', { timeout: 5000 }).click({ force: true });
    
    // React-Select para plan
    cy.get('[name="contrato.plan_id"]').parent().parent().click();
    cy.get('.css-26l3qy-menu').contains('Básico', { timeout: 5000 }).click({ force: true });
  };

  //  Llenar datos de pago
  const llenarDatosPago = () => {
    cy.get('input[name="pago.fecha_fin"]').clear().type('2026-01-31');
    
    // React-Select para forma de pago
    cy.get('[name="pago.forma_pago_id"]').parent().parent().click();
    cy.get('.css-26l3qy-menu').contains('Efectivo', { timeout: 5000 }).click({ force: true });
  };

  it('Caso 1: Registro exitoso de titular sin beneficiarios', () => {
    // Paso 1: Llenar datos del titular
    cy.contains('h1', 'Titular').should('be.visible');
    llenarDatosTitular();
    
    cy.contains('button', 'Siguiente').click();

    // Paso 2: Llenar datos del contrato
    cy.contains('Datos del Contrato', { timeout: 5000 }).should('be.visible');
    llenarDatosContrato();
    cy.contains('button', 'Siguiente').click();

    // Paso 3: Saltar beneficiarios
    cy.contains('Beneficiarios', { timeout: 5000 }).should('be.visible');
    cy.contains('button', 'Siguiente').click();

    // Paso 4: Llenar datos de pago y enviar
    cy.contains('Detalles de pago', { timeout: 5000 }).should('be.visible');
    llenarDatosPago();
    
    cy.contains('button', 'Enviar').click();
    
    // Verificar redirección o mensaje de éxito
    cy.contains('Registro exitoso', { timeout: 10000 }).should('be.visible');
  });

  it('Caso 2: Validación de campos requeridos en paso 1', () => {
    // Intentar avanzar sin llenar campos requeridos
    cy.contains('button', 'Siguiente').click();
    
    // Verificar que aparezca el toast de error o mensajes de validación
    cy.get('body').then($body => {
      const hasToast = $body.text().includes('Por favor llena') || $body.text().includes('campos');
      const hasError = $body.find('span.text-red-500').length > 0;
      expect(hasToast || hasError).to.be.true;
    });
    
    // Verificar que sigue en paso 1
    cy.contains('Paso 1 de 4').should('be.visible');
  });

  it('Caso 3: Navegación entre pasos (Anterior/Siguiente)', () => {
    // Llenar paso 1 y avanzar
    llenarDatosTitular();
    cy.contains('button', 'Siguiente').click();
    cy.contains('Paso 2 de 4', { timeout: 3000 }).should('be.visible');
    
    // Regresar al paso 1
    cy.contains('button', 'Anterior').click();
    cy.contains('Paso 1 de 4', { timeout: 3000 }).should('be.visible');
    
    // Los datos deben persistir
    cy.get('input[name="titular.usuario.nombre"]').should('have.value', 'Juan');
    cy.get('input[name="titular.usuario.apellido"]').should('have.value', 'Pérez');
    
    // Avanzar nuevamente
    cy.contains('button', 'Siguiente').click();
    cy.contains('Paso 2 de 4', { timeout: 3000 }).should('be.visible');
  });

  it('Caso 4: Agregar y eliminar beneficiarios', () => {
    // Completar pasos 1 y 2
    llenarDatosTitular();
    cy.contains('button', 'Siguiente').click();
    
    cy.contains('Datos del Contrato', { timeout: 3000 }).should('be.visible');
    llenarDatosContrato();
    cy.contains('button', 'Siguiente').click();
    
    // Paso 3: Beneficiarios
    cy.contains('Beneficiarios', { timeout: 3000 }).should('be.visible');
    
    // Verificar contador inicial
    cy.contains(/0\/\d+/).should('be.visible');
    
    // Agregar primer beneficiario
    cy.contains('button', 'Agregar beneficiario').should('be.visible').click();
    cy.get('input[name="beneficiarios.0.usuario.nombre"]', { timeout: 3000 }).should('be.visible');
    
    // Llenar datos mínimos del beneficiario
    cy.get('input[name="beneficiarios.0.usuario.nombre"]').type('María');
    cy.get('input[name="beneficiarios.0.usuario.apellido"]').type('López');
    cy.get('select[name="beneficiarios.0.usuario.tipo_documento"]').select('CC');
    cy.get('input[name="beneficiarios.0.usuario.numero_documento"]').type('9876543210');
    cy.get('input[name="beneficiarios.0.usuario.fecha_nacimiento"]').type('1995-05-20');
    cy.get('input[name="beneficiarios.0.usuario.email"]').type(`maria.lopez${Date.now()}@email.com`);
    cy.get('input[name="beneficiarios.0.usuario.password"]').type('password456');
    cy.get('input[name="beneficiarios.0.usuario.direccion"]').type('Cra 15 # 30-40');
    cy.get('input[name="beneficiarios.0.usuario.autorizacion_datos"]').check({ force: true });
    
    // Verificar contador actualizado
    cy.contains(/1\/\d+/).should('be.visible');
    
    // Eliminar beneficiario
    cy.contains('button', 'Eliminar beneficiario').first().click();
    cy.get('input[name="beneficiarios.0.usuario.nombre"]').should('not.exist');
  });

  it('Caso 5: Validación de fechas en el contrato', () => {
    // Completar paso 1
    llenarDatosTitular();
    cy.contains('button', 'Siguiente').click();
    
    cy.contains('Datos del Contrato', { timeout: 3000 }).should('be.visible');
    
    // Intentar poner fecha de fin anterior a fecha de inicio
    cy.get('input[name="contrato.fecha_inicio"]').clear().type('2025-12-01');
    cy.get('input[name="contrato.fecha_fin"]').clear().type('2025-11-01');
    
    // Seleccionar otros campos requeridos
    cy.get('[name="contrato.forma_pago"]').parent().parent().click();
    cy.get('.css-26l3qy-menu').first().contains('Mensual', { timeout: 5000 }).click({ force: true });
    
    cy.get('[name="contrato.plan_id"]').parent().parent().click();
    cy.get('.css-26l3qy-menu').contains('Básico', { timeout: 5000 }).click({ force: true });
    
    // Intentar avanzar
    cy.contains('button', 'Siguiente').click();
    
    // Debe permanecer en paso 2 por el error
    cy.contains('Paso 2 de 4').should('be.visible');
    
    // Verificar que hay un mensaje de error (toast o campo)
    cy.get('body').should('contain.text', 'fecha');
  });

  it('Caso 6: Límite de beneficiarios según plan seleccionado', () => {
    // Completar pasos 1 y 2
    llenarDatosTitular();
    cy.contains('button', 'Siguiente').click();
    
    cy.contains('Datos del Contrato', { timeout: 3000 }).should('be.visible');
    
    // Seleccionar un plan
    cy.get('input[name="contrato.fecha_fin"]').clear().type('2026-12-31');
    cy.get('[name="contrato.forma_pago"]').parent().parent().click();
    cy.get('.css-26l3qy-menu').first().contains('Mensual', { timeout: 5000 }).click({ force: true });
    
    cy.get('[name="contrato.plan_id"]').parent().parent().click();
    cy.get('.css-26l3qy-menu').contains('Básico', { timeout: 5000 }).click({ force: true });
    
    cy.contains('button', 'Siguiente').click();
    
    cy.contains('Beneficiarios', { timeout: 3000 }).should('be.visible');
    
    // Obtener el límite del contador
    cy.get('body').invoke('text').then(text => {
      const match = text.match(/0\/(\d+)/);
      if (match) {
        const limite = parseInt(match[1]);
        
        // Agregar beneficiarios hasta el límite
        for (let i = 0; i < limite; i++) {
          cy.contains('button', 'Agregar beneficiario').click();
          cy.get(`input[name="beneficiarios.${i}.usuario.nombre"]`).type(`Beneficiario${i}`);
          cy.get(`input[name="beneficiarios.${i}.usuario.apellido"]`).type('Test');
          cy.get(`select[name="beneficiarios.${i}.usuario.tipo_documento"]`).select('CC');
          cy.get(`input[name="beneficiarios.${i}.usuario.numero_documento"]`).type(`${1000000000 + i}`);
          cy.get(`input[name="beneficiarios.${i}.usuario.fecha_nacimiento"]`).type('1995-05-20');
          cy.get(`input[name="beneficiarios.${i}.usuario.email"]`).type(`ben${i}${Date.now()}@test.com`);
          cy.get(`input[name="beneficiarios.${i}.usuario.password"]`).type('pass123');
          cy.get(`input[name="beneficiarios.${i}.usuario.direccion"]`).type('Calle 123');
          cy.get(`input[name="beneficiarios.${i}.usuario.autorizacion_datos"]`).check({ force: true });
        }
        
        // Verificar que el botón esté deshabilitado
        cy.contains('button', 'Agregar beneficiario').should('be.disabled');
      }
    });
  });

});