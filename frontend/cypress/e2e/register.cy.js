describe("Sign up", () => {
  it("Sign up", () => {
    cy.visit("/");
    cy.get(".fixed-top-right").click();
    cy.get(".v-navigation-drawer").should("be.visible");
    cy.get('a[href="/register"]').click();
    cy.url().should("include", "register");

    cy.get('input[name="Email"]').type("test@test.com");
    cy.get(".v-alert").should("not.exist");
    cy.get("button").eq(1).click();

    cy.get('input[name="firstName"]').type("Test");
    cy.get('input[name="lastName"]').type("User");
    cy.get(".v-alert").should("not.exist");
    cy.get("button").eq(2).click();

    cy.get('input[type="password"]').type("test123");
    cy.get(".v-alert").should("not.exist");
    cy.get("button").eq(2).click();
    cy.url().should("include", "login");
  });
});
