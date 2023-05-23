describe("Sign in", () => {
  it("Sign in", () => {
    cy.visit("/");
    cy.get(".fixed-top-right").click();
    cy.get(".v-navigation-drawer").should("be.visible");
    cy.get('a[href="/login"]').click();
    cy.url().should("include", "login");

    cy.get('input[name="Email"]').type("test@test.com");
    cy.get(".v-alert").should("not.exist");
    cy.get("button").eq(1).click();

    cy.get('input[type="password"]').type("test123");
    cy.get(".v-alert").should("not.exist");
    cy.get("button").eq(2).click();
    cy.get(".Vue-Toastification__toast--success ").should("be.visible");

    cy.url().should("include", "user");
  });
});
