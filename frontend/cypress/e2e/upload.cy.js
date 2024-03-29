describe("File upload", () => {
  it("File upload", () => {
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
    cy.get(".Vue-Toastification__toast--success").should("be.visible");
    cy.get(".Vue-Toastification__toast--success").click();

    cy.url().should("include", "user");

    cy.get(".fixed-top-right").click();
    cy.get('a[href="/files/mine"]').click();
    let files;

    cy.get(".v-card-title")
      .its("length")
      .then((length) => {
        files = length;
      });
    cy.get('a[href="/files/upload"]').click();
    cy.url().should("include", "upload");

    cy.get("input").selectFile({
      contents: Cypress.Buffer.from(""),
      fileName: "test.txt",
      lastModified: Date.now(),
    });

    cy.get('button[type="submit"]').click();
    cy.get(".fixed-top-right").click();
    cy.get('a[href="/files/mine"]').click();

    let filesAfter;
    cy.get(".v-card-title")
      .its("length")
      .then((length) => {
        const filesAfter = length;
        expect(filesAfter).to.be.greaterThan(files);
      });
  });
});
