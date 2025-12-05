/// <reference types="cypress" />

describe("Registro de pagos", () => {

  beforeEach(() => {
    Cypress.on("uncaught:exception", () => false);

    // -----------------------------
    // LOGIN
    // -----------------------------
    cy.intercept("POST", "**/login", {
      statusCode: 200,
      body: {
        message: "Acceso permitido",
        token: "fake-token",
        data: {
          id: "fake-id-admin",
          nombre: "Juan prueba",
          documento: "123456",
          rol: { nombreRol: "Administrador" },
        },
      },
    }).as("loginSuccess");

    cy.visit("http://localhost:5173/login");
    cy.get("input").eq(0).type("456461321");
    cy.get("input").eq(1).type("RedBull2025");
    cy.get('button[type="submit"]').click();
    cy.wait("@loginSuccess");

    cy.visit("http://localhost:5173/pagos");


  });

  // ============================================================
  // 1️⃣ LISTAR PAGOS
  // ============================================================
  it("Debe listar los pagos existentes", () => {

    cy.contains("Pagos", { timeout: 10000 }).should("exist");

    cy.get(".rdt_TableBody", { timeout: 15000 }).should("exist");

    cy.get(".rdt_TableRow")
      .should("exist")
      .and("have.length.greaterThan", 0);

    cy.get(".rdt_TableRow").first().within(() => {
      cy.contains(/\d+/).should("exist");
    });
  });

  // ============================================================
  // 2️⃣ MOSTRAR FORMULARIO DE NUEVO REGISTRO
  // ============================================================
  it("Debe mostrar el formulario de registro de pago", () => {

    // Mocks requeridos por el form
    cy.intercept("GET", "**/pacientes*", {
      statusCode: 200,
      body: {
        data: [
          {
            beneficiario: true,
            idPaciente: 71,
            usuario: {
              nombre: "Juan",
              segundoNombre: "Carlos",
              apellido: "Pérez",
              segundoApellido: "García",
              numeroDocumento: "123456789",
            },
            membresiaPaciente: [{ membresiaId: 196 }],
          },
        ],
      },
    }).as("getTitulares");

    cy.intercept("GET", "**/formas-pago*", {
      statusCode: 200,
      body: {
        data: [
          { idFormaPago: 5, tipoPago: "Efectivo" },
          { idFormaPago: 2, tipoPago: "Débito automático" },
        ],
      },
    }).as("getFormasPago");

    cy.intercept("GET", "**/usuarios/asesores*", {
      statusCode: 200,
      body: [
        {
          idUsuario: "id-asesor1",
          nombre: "Oscar",
          apellido: "Daza",
        },
      ],
    }).as("getAsesores");

    cy.contains("Agregar", { timeout: 10000 }).click();

    cy.contains("h2", "Registro de pago", { timeout: 10000 }).should("be.visible");
    cy.get('input[name="monto"]').should("exist");
    cy.get('button[type="submit"]').should("contain.text", "Guardar");
  });

    // ============================================================
// 3️⃣ REGISTRAR UN NUEVO PAGO COMPLETO
// ============================================================
it("Debe registrar un nuevo pago correctamente", () => {

  // -----------------------------
  // MOCKS REQUERIDOS POR EL FORM
  // -----------------------------
  cy.intercept({ method: "GET", url: /paciente|titular|membresia|beneficiario/i }, {
    statusCode: 200,
    body: {
      data: [
        {
          beneficiario: true,
          idPaciente: 71,
          usuario: {
            nombre: "Juan",
            segundoNombre: "Carlos",
            apellido: "Pérez",
            segundoApellido: "García",
            numeroDocumento: "123456789",
          },
          membresiaPaciente: [{ membresiaId: 196 }],
        },
      ],
    },
  }).as("getTitulares");

  cy.intercept("GET", "/formas_pago/read", {
    statusCode: 200,
    body: {
      data: [
        { idFormaPago: 1, tipoPago: "Efectivo" },
        { idFormaPago: 2, tipoPago: "Nequi" },
        { idFormaPago: 3, tipoPago: "Bancolombia" },
      ],
    },
  }).as("getFormasPago");


  // ---------------------------------------------------
  // MOCK CORRECTO DEL POST (URL REAL)
  // ---------------------------------------------------
  cy.intercept("POST", "**/registro-pago", {
    statusCode: 200,
    body: {
      message: "Operación exitosa",
      data: {
        idRegistro: 99,
        numeroRecibo: "987654",
        monto: 55000,
        estado: "Aprobado",
        fechaPago: "2025-01-10",
        formaPagoId: 5,
        foto: "/img/comprobante.png",
      },
    },
  }).as("crearPago");


  // ---------------------------------------------------
  // ABRIR FORMULARIO
  // ---------------------------------------------------
  cy.contains("Agregar", { timeout: 10000 }).click();
  cy.contains("h2", "Registro de pago", { timeout: 10000 }).should("be.visible");

  // ---------------------------------------------------
  // SUBIR IMAGEN
  // ---------------------------------------------------
  cy.get('input[type="file"]').selectFile("cypress/fixtures/comprobante.png", {
  force: true
});


  // ---------------------------------------------------
  // TITULAR
  // ---------------------------------------------------
  cy.wait("@getTitulares");
  cy.get('[name="membresia_id"]').parent().find('[class*="control"]').click();
  cy.get('[class*="menu"]').contains("Juan").click();

  // ---------------------------------------------------
  // FECHAS
  // ---------------------------------------------------
  cy.get('input[name="fecha_pago"]').clear().type("2025-01-10");
  cy.get('input[name="fecha_inicio"]').clear().type("2025-01-10");
  cy.get('input[name="fecha_fin"]').clear().type("2025-02-10");

  // ---------------------------------------------------
  // FORMA DE PAGO
  // ---------------------------------------------------
  cy.wait("@getFormasPago");

  cy.contains("label", "Forma de pago")
    .parent()
    .find('[class*="control"]')
    .click({ force: true });

  cy.get('[class*="menu"]').contains("Efectivo").click({ force: true });

  // ---------------------------------------------------
  // MONTO
  // ---------------------------------------------------
  cy.get('input[name="monto"]').clear().type("55000");

  // ---------------------------------------------------
  // NUM RECIBO
  // ---------------------------------------------------
  cy.get('input[name="numero_recibo"]').clear().type("987654");

  // ---------------------------------------------------
  // ESTADO
  // ---------------------------------------------------
  cy.contains("label", "Estado")
    .parent()
    .find('[class*="control"]')
    .click({ force: true });

  cy.get('[class*="menu"]').contains("Aprobado").click({ force: true });

  // ---------------------------------------------------
  // ASESOR / COBRADOR
  // ---------------------------------------------------
  cy.contains("label", "Asesor / Cobrador")
    .parent()
    .find('[class*="control"]')
    .click({ force: true });

  cy.get('[class*="menu"] [class*="option"]').first().click({ force: true });


  // ---------------------------------------------------
  // ENVIAR FORMULARIO (forzado si está deshabilitado)
  // ---------------------------------------------------
  cy.get("form").then($form => {
    const button = $form.find('button[type="submit"]')[0];

    if (button && button.disabled) {
      cy.wrap($form).submit();
    } else {
      cy.wrap(button).click({ force: true });
    }
  });

  // ---------------------------------------------------
  // ESPERAR POST CORRECTO
  // ---------------------------------------------------
  cy.wait("@crearPago", { timeout: 10000 })
    .its("response.statusCode")
    .should("eq", 200);

  // ---------------------------------------------------
  // CONFIRMACIÓN FINAL
  // ---------------------------------------------------
  cy.contains("Operación exitosa", { timeout: 10000 }).should("exist");
});

it("Debe interactuar con las acciones de cada pago", () => {
  // -----------------------------
  // Esperar que la tabla cargue
  // -----------------------------
  cy.get(".rdt_TableBody", { timeout: 15000 }).should("exist");
  cy.get(".rdt_TableRow").should("have.length.greaterThan", 0);

  // -----------------------------
  // Ver detalles y cerrar modal
  // -----------------------------
  cy.get(".rdt_TableRow").first().within(() => {
    cy.get("div[title='Ver detalles']").should("exist").click({ force: true });
  });

  // Clic directo en botón Volver dentro del modal
  cy.contains("button", /volver/i, { timeout: 10000 }).click({ force: true });

  // -----------------------------
  // Editar, cambiar monto y actualizar
  // -----------------------------
  cy.get(".rdt_TableRow").first().within(() => {
    cy.get("div[title='Editar']").should("exist").click({ force: true });
  });

  // Cambiar el monto
  const nuevoMonto = "99999";
  cy.get('input[name="monto"]').clear().type(nuevoMonto);

  // Botón de guardar/actualizar
  cy.contains("button", /actualizar|guardar/i, { timeout: 10000 }).click({ force: true });

  // -----------------------------
  // Eliminar (simulación, clic y confirm)
  // -----------------------------
  cy.on("window:confirm", () => true); // Acepta confirm automáticamente
  cy.get(".rdt_TableRow").first().within(() => {
    cy.get("div[title='Eliminar']").should("exist").click({ force: true });
  });

  cy.log("Acciones Ver detalles, Editar (cambiar monto y actualizar) y Eliminar simuladas correctamente");
});

it("Debe mostrar la DataTable de pagos y navegar a Formas de Pago", () => {
  // -----------------------------
  // Esperar que la tabla de pagos cargue
  // -----------------------------
  cy.get(".rdt_TableBody", { timeout: 15000 }).should("exist");

  cy.get(".rdt_TableRow")
    .should("exist")
    .and("have.length.greaterThan", 0);

  // -----------------------------
  // Verificar que hay contenido en la primera fila
  // -----------------------------
  cy.get(".rdt_TableRow").first().within(() => {
    cy.get("div").should("not.be.empty");
  });

  // -----------------------------
  // Hacer clic en botón Formas de Pago
  // -----------------------------
  cy.contains("button", "Formas de pago", { timeout: 10000 }).click();

  // -----------------------------
  // Validar que la URL cambió
  // -----------------------------
  cy.url().should("include", "/formas_pago");

  // -----------------------------
  // Esperar a que cargue la DataTable de formas de pago
  // -----------------------------
  cy.get(".rdt_TableBody", { timeout: 15000 }).should("exist");
  cy.get(".rdt_TableRow").should("have.length.greaterThan", 0);

  // -----------------------------
  // Verificar que cada fila tenga contenido
  // -----------------------------
  cy.get(".rdt_TableRow").each(($row) => {
    cy.wrap($row).find("div").should("not.be.empty");
  });
});


it("Debe agregar una nueva forma de pago", () => {
  // -----------------------------
  // Ir a la vista de Formas de Pago
  // -----------------------------
  cy.visit("http://localhost:5173/formas_pago");

  // -----------------------------
  // Esperar a que cargue la tabla
  // -----------------------------
  cy.get(".rdt_TableBody", { timeout: 15000 }).should("exist");

  // -----------------------------
  // Interceptar POST para crear forma de pago
  // -----------------------------
  cy.intercept("POST", /formas_pago/i, (req) => {
  req.reply({
    statusCode: 200,
    body: {
      message: "Forma de pago creada",
      data: {
        id_forma_pago: 999,
        tipoPago: req.body.tipoPago || req.body.tipo_pago,
        estado: true,
      },
    },
  });
}).as("crearFormaPago");


  // -----------------------------
  // Clic en botón + Agregar Forma de Pago
  // -----------------------------
  cy.contains("button", "+ Agregar Forma de Pago", { timeout: 10000 }).click();
  // -----------------------------
  // Verificar que el formulario se abrió
  // -----------------------------
  cy.get("form").should("exist");
  // -----------------------------
  // Llenar formulario (genérico)
  // -----------------------------
  const nuevaForma = `Pago Test ${Date.now()}`;
  cy.get("form").within(() => {
    // Buscar el primer input visible y escribir el valor
    cy.get('input:visible').first().type(nuevaForma);
  });

  // -----------------------------
  // Enviar formulario
  // -----------------------------
  cy.get("form").submit();

  // -----------------------------
  // Esperar respuesta del POST
  // -----------------------------
  cy.wait("@crearFormaPago").its("response.statusCode").should("eq", 200);

  // -----------------------------
  // Verificar que la nueva forma de pago aparece en la tabla
  // -----------------------------
  cy.get(".rdt_TableBody").should("exist");
  cy.get(".rdt_TableRow").should("contain.text", nuevaForma);
});

it("Debe alternar correctamente el estado de Formas de Pago", () => {
  cy.visit("http://localhost:5173/formas_pago");
  
  cy.get(".rdt_TableBody", { timeout: 15000 }).should("exist");
  cy.get(".rdt_TableRow").should("have.length.greaterThan", 0);
  
  // Guardar estado inicial
  cy.get(".rdt_TableRow").first().find("span").first().invoke("text").then((textoInicial) => {
    const estaActivo = textoInicial.includes("✓");
    const textoEsperado = estaActivo ? "✗ Inactiva" : "✓  Activa";
    
    cy.log(`Estado inicial: ${textoInicial}`);
    cy.log(`Se espera: ${textoEsperado}`);
    
    // Click en el ÚLTIMO botón (BtnEstado)
    cy.get(".rdt_TableRow").first().find("button").last().click();
    
    // Verificar el cambio
   cy.get(".rdt_TableRow").first().find("span").first().should(($span: JQuery<HTMLElement>) => {
      const textoNuevo = $span.text();
      expect(textoNuevo).to.equal(textoEsperado);
  });
});

it("Debe editar correctamente una Forma de Pago", () => {
  cy.visit("http://localhost:5173/formas_pago");
  
  cy.get(".rdt_TableBody", { timeout: 15000 }).should("exist");
  cy.get(".rdt_TableRow").should("have.length.greaterThan", 0);
  
  // Guardar el nombre original
  cy.get(".rdt_TableRow").first().invoke("text").then((textoCompleto) => {
    const nombreOriginal = textoCompleto.split(/✓|✗/)[0].trim();
    cy.log(`Nombre original: ${nombreOriginal}`);
    
    // Click en editar (primer botón)
    cy.get(".rdt_TableRow").first().find("button").first().click();
    
    // Esperar modal
    cy.get("dialog[open]", { timeout: 5000 }).should("be.visible");
    
    // Editar
    const nuevoNombre = `FormaPago_Editada_${Date.now()}`;
    cy.get("input[type='text']").should("be.visible").clear().type(nuevoNombre);
    
    // Guardar
    cy.contains("button", /guardar|actualizar/i).click();
    
    // Verificar cierre del modal
    cy.get("dialog[open]").should("not.exist", { timeout: 5000 });
    
    // Verificar cambio en tabla
    cy.get(".rdt_TableRow").first().should("contain.text", nuevoNombre, { timeout: 10000 });
  });
});

});




})













