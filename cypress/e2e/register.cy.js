const API = 'http://localhost:3001/api/v1';

describe('Pruebas de Caja Negra - Registro de Usuario (UI)', () => {
  beforeEach(() => {
    // Respuestas simuladas para los selects de Rol y Estado
    cy.intercept('GET', `${API}/role`, {
      body: {
        body: [
          { role_id: 1, role_name: 'Admin' },
          { role_id: 2, role_name: 'Usuario' },
        ]
      }
    }).as('getRoles');

    cy.intercept('GET', `${API}/userStatus`, {
      body: {
        body: [
          { userStatus_id: 1, userStatus_name: 'Activo' },
          { userStatus_id: 2, userStatus_name: 'Inactivo' },
        ]
      }
    }).as('getStatus');

    cy.visit('/register');
    cy.wait(['@getRoles', '@getStatus']);
  });
  it('CP-REG-01: Debe cargar la página de registro', () => {
    cy.url().should('include', '/register');
  });

  it('CP-REG-02: Debe mostrar el título "Registrar Usuario"', () => {
    cy.contains('h2', 'Registrar Usuario').should('be.visible');
  });

  it('CP-REG-03: Debe mostrar todos los campos del formulario', () => {
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]')
      .should('be.visible')
      .and('have.attr', 'placeholder', 'Mínimo 7 caracteres');
    cy.get('select').should('have.length', 2);
    cy.contains('button', 'Registrar Usuario').should('be.visible');
  });

  it('CP-REG-04: Los selects deben cargar roles y estados desde el backend', () => {
    // 1 opción por defecto + 2 opciones simuladas = 3
    cy.get('select').eq(0).find('option').should('have.length', 3);
    cy.get('select').eq(0).should('contain', 'Admin').and('contain', 'Usuario');
    cy.get('select').eq(1).find('option').should('have.length', 3);
  });
  it('CP-REG-05: El botón "Volver" regresa a /login', () => {
    cy.contains('button', 'Volver').click();
    cy.url().should('include', '/login');
  });
});