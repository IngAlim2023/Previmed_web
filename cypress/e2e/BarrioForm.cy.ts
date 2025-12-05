/// <reference types="cypress" />

describe("Gestión de Barrios", () => {

  beforeEach(() => {
    cy.visit("http://localhost:5173/login");

    cy.intercept("POST", "**/login", {
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

    cy.intercept("GET", "**/barrios").as("listarBarrios");

    cy.visit("http://localhost:5173/barrios");
    cy.wait("@listarBarrios");
  });

  it("muestra error al intentar enviar sin nombre", () => {
    cy.contains("Agregar").click();

    cy.get("button[type='submit']").click();

    cy.contains("El nombre es obligatorio").should("be.visible");
  });

  it("crea un barrio correctamente", () => {
    cy.contains("Agregar").click();

    cy.intercept("POST", "**/barrios", {
      statusCode: 201,
      body: { ok: true, idBarrio: 99 },
    }).as("crearBarrio");

    // Llenado del formulario
    cy.get('input[placeholder="Ej. San José"]').type("Barrio Cypress");
    cy.get('input[placeholder="Ej. 2.4460"]').type("2.123");
    cy.get('input[placeholder="Ej. -76.6060"]').type("-76.123");
    cy.get('input[type="checkbox"]').check({ force: true });

    // Enviar
    cy.get("button[type='submit']").click();

    // ---- VALIDACIÓN ----
    cy.wait("@crearBarrio")
      .its("request.body")
      .should((body) => {
        expect(body.nombre_barrio).to.eq("Barrio Cypress");
        expect(Number(body.latitud)).to.eq(2.123);
        expect(Number(body.longitud)).to.eq(-76.123);
        expect(body.habilitar).to.be.true;
      });
  });

  it("cancela el formulario y regresa a la tabla", () => {
  cy.contains("Agregar").click();

  // CLIC SOLO AL BOTÓN REAL
  cy.contains("button", "Cerrar").click({ force: true });

  // asegurar que el modal desaparece
  cy.get(".fixed.inset-0").should("not.exist");

  // verificar que seguimos en /barrios
  cy.url().should("include", "/barrios");

  // verificar que la tabla existe
  cy.contains("h2", "Barrios", { timeout: 8000 }).should("be.visible");
});




});
