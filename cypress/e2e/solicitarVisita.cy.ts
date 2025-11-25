/// <reference types="cypress" />

describe('Test para solicitar visita', () => {
  beforeEach(() => {
  // ir al login
  cy.visit('http://localhost:5173/login');
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: {
        message: 'Acceso permitido',
        token: 'fake-token',
        data: {
          id: 'jhdkncknlkjljhvcz34334tdw',
          nombre: 'Juan prueba',
          documento: '123456',
          rol: { nombreRol: 'Paciente' },
        },
      },
    }).as('loginSuccess');

    cy.get('input').eq(0).type('5454515544');
    cy.get('input').eq(1).type('123456');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginSuccess');

  // solicitar visita
  cy.visit('http://localhost:5173/solicitar-visita');
  //cy.wait(['@getBarrios', '@getMedicos', '@getPacientes']);
  });

  it('mostrar el formulario correctamente', () => {
    cy.get('input[name="descripcion"]').should('exist');
    cy.get('input[name="direccion"]').should('exist');
    cy.get('input[name="fecha_visita"]').should('exist');
    cy.get('input[name="telefono"]').should('exist');
    cy.get('button[type="submit"]').should('contain', 'Solicitar Visita');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('crear visita correctamente', () => {
    cy.intercept('POST', '**/visitas', {
      statusCode: 201,
      body: { id: 1, message: 'Visita creada exitosamente' }
    }).as('createVisita');

    cy.get('input[name="descripcion"]').type('Consulta médica domiciliaria por dolor de espalda');
    
    cy.get('[name="paciente_id"]').parent().click();
    cy.contains('María García').click();
    
    cy.get('[name="medico_id"]').parent().click();
    cy.contains('Juan Pérez').click();
    
    cy.get('[name="barrio_id"]').parent().click();
    cy.contains('Centro').click();
    
    cy.get('input[name="direccion"]').type('Cra 15 # 25 - 40');
    cy.get('input[name="fecha_visita"]').type('2025-11-20');
    cy.get('input[name="telefono"]').type('3001234567');
    
    cy.get('button[type="submit"]').click();
    
    cy.wait('@createVisita');
    
    cy.contains('Solicitud de visita exitosa').should('be.visible');
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
    cy.get('input[name="fecha_visita"]').clear().type('2025-11-20');
    cy.get('input[name="telefono"]').type('3001234567');
    
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    
    cy.wait('@createVisitaError');
    
    cy.contains('Ocurrió un problema en la solicitud de la visita').should('be.visible');
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
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    
    cy.get('@createVisita.all').should('have.length', 1);
  });
});