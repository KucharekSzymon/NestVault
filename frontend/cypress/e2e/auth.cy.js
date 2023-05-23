describe("Auth test", () => {
  it("Auth test", () => {
    cy.visit("/files");
    cy.url().should("include", "login");
    cy.visit("/user");
    cy.url().should("include", "login");
    cy.visit("/admin");
    cy.url().should("include", "login");
  });
});
