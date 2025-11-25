/// <reference types="cypress" />

describe('Registro de pagos', () => {
  
  beforeEach(() => {
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
          rol: { nombreRol: 'Administrador' },
        },
      },
    }).as('loginSuccess');

    cy.get('input').eq(0).type('456461321');
    cy.get('input').eq(1).type('RedBull2025');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginSuccess');
    cy.visit('http://localhost:5173/pagos');
  
  });

  it('Debe listar los pagos existentes', () => {
    // tabla con los pagos, mayor a a dos filas
    cy.get('table').should('exist');
    cy.get('table').find('tr').should('have.length.greaterThan', 2);
  });

  it('Debe mostrar el formulario de registro de pago', () => {
    cy.get('button').contains('Agregar').click();
    cy.get('form').should('exist');
    cy.get('input[name="monto"]').should('exist');
    cy.get('input[name="fecha_pago"]').should('exist');
    cy.get('select[name="metodo_pago"]').should('exist');
    cy.get('button[type="submit"]').should('contain', 'Guardar Pago');
  });
 
});