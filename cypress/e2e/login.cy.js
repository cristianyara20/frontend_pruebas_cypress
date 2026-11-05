const API ='http://localhost:3001/api/v1';
describe("Pruebas de Caja Negra - Login (UI)", () => {
  // Ignorar errores no controlados de la aplicación para que no rompan la prueba de Cypress
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/login");
  });

  it("CP-LOGIN-01: Debe cargar la página de login", () => {
    cy.url().should("include", "/login");
  });

  it("CP-LOGIN-02: Debe mostrar el título 'Iniciar Sesión'", () => {
    cy.contains("h2", "Iniciar Sesión").should("be.visible");
  });

  it("CP-LOGIN-03: Debe mostrar los campos de correo, contraseña y el botón Ingresar", () => {
    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.contains("button", "Ingresar").should("be.visible");
  });

  it('CP-LOGIN-04: Login correcto redirige a /users y guarda el token', () => {
    cy.intercept('POST', `${API}/user/login`, {
      statusCode: 200,
      body: { token: 'token-de-prueba' }
    }).as('login');
    
    cy.intercept('GET', `${API}/user`, { 
      statusCode: 200, 
      body: [] 
    }).as('getUsers');
    
    cy.get('input[type="email"]').type('admin@correo.com');
    cy.get('input[type="password"]').type('1234567');
    cy.contains('button', 'Ingresar').click();
    
    cy.wait('@login').its('request.body').should('deep.equal', {
      email: 'admin@correo.com',
      password: '1234567',
    });
    
    cy.url().should('include', '/users');
    cy.window().its('localStorage.token').should('eq', 'token-de-prueba');
  });

  it('CP-LOGIN-05: Credenciales incorrectas muestran mensaje de error', () => {
    cy.intercept('POST', `${API}/user/login`, {
      statusCode: 401,
      body: { message: 'Unauthorized' },
    }).as('loginFail');
    
    cy.get('input[type="email"]').type('malo@correo.com');
    cy.get('input[type="password"]').type('incorrecta');
    cy.contains('button', 'Ingresar').click();
    
    cy.wait('@loginFail');
    cy.contains('Correo o contraseña incorrectos').should('be.visible');
    cy.url().should('include', '/login');
  });
  it('CP-LOGIN-06: El enlace "Regístrate aquí" lleva a /register', () => {
    cy.intercept("GET", `${API}/role`, { body: { body: [] } });
    cy.intercept("GET", `${API}/userStatus`, { body: { body: [] } });
    cy.contains("Regístrate aquí").click();
    cy.url().should("include", "/register");
  });

  it("CP-LOGIN-07: Con campos vacíos no debe permitir el acceso", () => {
    cy.intercept("POST", `${API}/user/login`, {
      statusCode: 400,
      body: { message: "Bad request" },
    }).as("loginVacio");
    cy.contains("button", "Ingresar").click();
    cy.wait("@loginVacio");
    cy.contains("Correo o contraseña incorrectos").should("be.visible");
    cy.url().should("include", "/login");
  });
  it('CP-LOGIN-08: El botón muestra "Ingresando..." y se deshabilita mientras carga', () => {
    cy.intercept("POST", `${API}/user/login`, {
      statusCode: 401,
      body: {},
      delay: 1000,
    });
    cy.get('input[type="email"]').type("admin@correo.com");
    cy.get('input[type="password"]').type("1234567");
    cy.contains("button", "Ingresar").click();
    cy.contains("button", "Ingresando...").should("be.disabled");
  });
});
