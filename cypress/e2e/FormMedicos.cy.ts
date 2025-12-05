/// <reference types="cypress" />

describe("Gestión de Médicos", () => {

  beforeEach(() => {
    cy.visit("http://localhost:5173/login");

    // Mock login
    cy.intercept("POST", "/login", {
      statusCode: 200,
      body: {
        message: "Acceso permitido",
        token: "fake-token",
        data: {
          id: 1,
          nombre: "Dani",
          apellido: "Herrera",
          numero_documento: "10578452635",
          rol: { nombreRol: "Administrador" },
        },
      },
    }).as("loginAdmin");

    cy.get('input[placeholder="Ingresa tu número de documento"]').type("999999");
    cy.get('input[placeholder="Ingresa tu contraseña"]').type("12345678");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginAdmin");
    cy.url().should("include", "/home/admin");

    cy.visit("http://localhost:5173/medicos");
  });

  it("Debe crear un médico correctamente", () => {

    // 1) Intercept: crear usuario médico
    cy.intercept("POST", "**/medicos/usuarioM", {
      statusCode: 200,
      body: { data: { id_usuario: "fake-id-123" } }
    }).as("crearUsuarioMedico");

    // 2) Intercept: crear médico final
    cy.intercept("POST", "**/medicos", {
      statusCode: 200,
      body: { message: "Médico creado exitosamente" }
    }).as("crearMedico");


    // Abrir modal
    cy.contains("button", "Agregar").click();

    // FORM
    cy.contains("label", "Nombre *").parent().find("input").type("Juan");
    cy.contains("label", "Segundo Nombre").parent().find("input").type("Carlos");
    cy.contains("label", "Apellido *").parent().find("input").type("Pérez");
    cy.contains("label", "Segundo Apellido").parent().find("input").type("Gómez");
    cy.contains("label", "Número Documento *").parent().find("input").type("1234567890");

    cy.contains("label", "Tipo Documento").parent().find("select").select("Cédula de Ciudadanía");

    cy.contains("label", "Email *").parent().find("input").type("jperez@example.com");
    cy.contains("label", "Contraseña *").parent().find("input").type("12345678");
    cy.contains("label", "Dirección").parent().find("input").type("Calle 123");

    cy.contains("label", "Fecha Nacimiento *").parent().find("input").type("1990-05-10");

    cy.contains("label", "Estado Civil").parent().find("select").select("Soltero");
    cy.contains("label", "Número de Hijos").parent().find("input").type("2");
    cy.contains("label", "Estrato").parent().find("input").type("3");
    cy.contains("label", "Género").parent().find("select").select("Masculino");

    cy.contains("label", "EPS (opcional)").parent().find("select").select(1);

    cy.contains("label", "Autorización Datos").find("input").check();
    cy.contains("label", "Habilitado").find("input").check();
    cy.contains("label", "Disponible").find("input").check();
    cy.contains("label", "Activo").find("input").check();

    // Enviar formulario
    cy.get("form button[type='submit']").click({ force: true });


    // Esperar ambas llamadas en orden correcto
    cy.wait("@crearUsuarioMedico");
    cy.wait("@crearMedico");

    // Validar mensaje final
    cy.contains("Médico creado exitosamente").should("exist");
  });
});
