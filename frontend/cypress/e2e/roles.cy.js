describe("Role check", () => {
  it("Role check", () => {
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

    cy.get("h3")
      .invoke("text")
      .then((text) => {
        cy.visit("/admin");
        if (text.split(": ")[1] == "Administrator")
          cy.url().should("include", "admin");
        else cy.url().should("not.include", "admin");
      });
  });
});
