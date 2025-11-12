describe('Prueba de Login', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
  });

  it('Debe mostrar los campos de login y permitir escribir', () => {
    cy.get('input[placeholder="Número de documento"]').should('be.visible');
    cy.get('input[placeholder="Contraseña"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'INGRESAR');
  });

  it('Debe mostrar error con credenciales incorrectas', () => {
    cy.intercept('POST', '/api/login', {
      statusCode: 401,
      body: { message: 'Credenciales incorrectas.' },
    }).as('loginFail');

    cy.get('input[placeholder="Número de documento"]').type('106380');
    cy.get('input[placeholder="Contraseña"]').type('1234566876');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginFail');
    cy.contains('Credenciales incorrectas.').should('exist');
  });

  it('Debe redirigir al home según el rol si el login es exitoso', () => {
    cy.intercept('POST', '/api/login', {
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

    // Verificamos redirección (ajusta según tu ruta real)
    cy.url().should('include', '/home/paciente');

    // Verificamos que se guarde el usuario
    cy.window().then((win) => {
      const user = JSON.parse(win.localStorage.getItem('user'));
      expect(user.nombre).to.equal('Juan Pérez');
      expect(user.rol.nombreRol).to.equal('paciente');
    });
  });
});
