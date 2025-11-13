/// <reference types="cypress" />

describe('Test para solicitar visita', () => {
  beforeEach(() => {
  // ir al login
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

  cy.intercept('GET', '/barrios', { fixture: 'barrios.json' }).as('getBarrios');
  cy.intercept('GET', '/medicos', { fixture: 'medicos.json' }).as('getMedicos');
  cy.intercept('GET', '/pacientes', { fixture: 'pacientes.json' }).as('getPacientes');

  // solicitar visita
  cy.visit('http://localhost:5173/solicitar-visita');
  cy.wait(['@getBarrios', '@getMedicos', '@getPacientes']);
  });

  it('mostrar el formulario correctamente', () => {
    cy.get('h1').should('contain', 'Solicitud de Visita Médica');
    cy.get('input[name="descripcion"]').should('exist');
    cy.get('input[name="direccion"]').should('exist');
    cy.get('input[name="fecha_visita"]').should('exist');
    cy.get('input[name="telefono"]').should('exist');
    cy.get('button[type="submit"]').should('contain', 'Solicitar Visita');
  });

  it('mostrar alertas de campos obligatorios', () => {
    cy.get('button[type="submit"]').click();
    
    cy.contains('La dirección es requerida').should('be.visible');
    //cy.contains('Fecha de visita requerida').should('be.visible');
    cy.contains('El teléfono es requerido').should('be.visible');
    cy.contains('Campo obligatorio').should('be.visible');
  });

  it('validar que se seleccione un paciente', () => {
    cy.get('input[name="descripcion"]').type('Consulta médica general');
    cy.get('input[name="direccion"]').type('Cra 10 # 20 - 30');
    cy.get('input[name="fecha_visita"]').type('2025-11-15');
    cy.get('input[name="telefono"]').type('3001234567');
    
    cy.get('[name="medico_id"]').parent().click();
    cy.contains('Juan Pérez').click();
    
    cy.get('[name="barrio_id"]').parent().click();
    cy.contains('La Paz').click();
    
    cy.get('button[type="submit"]').click();
    
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('validar que la fecha no sea anterior a hoy', () => {
    const fechaAnterior = new Date();
    fechaAnterior.setDate(fechaAnterior.getDate() - 1);
    const fechaFormateada = fechaAnterior.toISOString().split('T')[0];
    
    cy.get('input[name="fecha_visita"]').clear().type(fechaFormateada);
    cy.get('input[name="direccion"]').click();
    
    cy.contains('La fecha de la visita no puede ser inferior a hoy').should('be.visible');
  });

  it('crear visita correctamente', () => {
    cy.intercept('POST', '/visitas', {
      statusCode: 201,
      body: { id: 1, message: 'Visita creada exitosamente' }
    }).as('createVisita');

    cy.get('input[name="descripcion"]').type('Consulta médica domiciliaria por dolor de espalda');
    
    cy.get('[name="paciente_id"]').parent().click();
    cy.contains('María García').click();
    
    cy.get('[name="medico_id"]').parent().click();
    cy.contains('Dr. Juan Pérez').click();
    
    cy.get('[name="barrio_id"]').parent().click();
    cy.contains('Centro').click();
    
    cy.get('input[name="direccion"]').type('Cra 15 # 25 - 40');
    cy.get('input[name="fecha_visita"]').type('2025-11-20');
    cy.get('input[name="telefono"]').type('3001234567');
    
    cy.get('button[type="submit"]').click();
    
    cy.wait('@createVisita');
    
    cy.contains('Solicitud de visita exitosa').should('be.visible');
    
    cy.url().should('include', '/home/paciente');
  });

  it('mostrar error al generar la visita', () => {
    cy.intercept('POST', '**/visitas', {
      statusCode: 500,
      body: { error: 'Error interno del servidor' }
    }).as('createVisitaError');

    cy.get('input[name="descripcion"]').type('Consulta general');
    
    cy.get('[name="paciente_id"]').parent().click();
    cy.get('[name="paciente_id"]').parent().find('[role="option"]').first().click();
    
    cy.get('[name="medico_id"]').parent().click();
    cy.get('[name="medico_id"]').parent().find('[role="option"]').first().click();
    
    cy.get('[name="barrio_id"]').parent().click();
    cy.get('[name="barrio_id"]').parent().find('[role="option"]').first().click();
    
    cy.get('input[name="direccion"]').type('Cra 10 # 20 - 30');
    cy.get('input[name="fecha_visita"]').type('2025-11-20');
    cy.get('input[name="telefono"]').type('3001234567');
    
    cy.get('button[type="submit"]').click();
    
    cy.wait('@createVisitaError');
    
    cy.contains('Ocurrió un problema en la solicitud de la visita').should('be.visible');
  });

  it('mostrar mensaje cuando no hay opciones disponibles', () => {
    cy.intercept('GET', '**/medicos/read', { body: [] }).as('getMedicosVacio');
    
    cy.visit('http://localhost:5173/solicitar-visita');
    cy.wait('@getMedicosVacio');
    
    cy.get('[name="medico_id"]').parent().click();
    cy.contains('No hay médicos disponibles').should('be.visible');
  });

  it('mostrar la fecha actual por defecto', () => {
    const fechaHoy = new Date().toISOString().split('T')[0];
    cy.get('input[name="fecha_visita"]').should('have.value', fechaHoy);
  });

  it('evitar múltiples envíos del formulario', () => {
    cy.intercept('POST', '**/visitas', {
      statusCode: 201,
      body: { id: 1 }
    }).as('createVisita');

    cy.get('input[name="descripcion"]').type('Test');
    cy.get('[name="paciente_id"]').parent().click();
    cy.get('[name="paciente_id"]').parent().find('[role="option"]').first().click();
    cy.get('[name="medico_id"]').parent().click();
    cy.get('[name="medico_id"]').parent().find('[role="option"]').first().click();
    cy.get('[name="barrio_id"]').parent().click();
    cy.get('[name="barrio_id"]').parent().find('[role="option"]').first().click();
    cy.get('input[name="direccion"]').type('Cra 10 # 20 - 30');
    cy.get('input[name="fecha_visita"]').type('2025-11-20');
    cy.get('input[name="telefono"]').type('3001234567');

    cy.get('button[type="submit"]').click();
    cy.get('button[type="submit"]').click();
    
    cy.get('@createVisita.all').should('have.length', 1);
  });
});