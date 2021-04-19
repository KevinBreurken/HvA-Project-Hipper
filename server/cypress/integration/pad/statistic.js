// Test for statistics, made by Rick
describe('Statistics', function () {
    beforeEach(() => {
        cy.visit("http://localhost:8080")

        const session = {"username" : "rick"};
        localStorage.setItem("session", JSON.stringify(session));
    })

    it("Go to statistics", () => {
        // Start faker
        cy.server();

        //Find the field for the username and type the text "test".
        cy.get("#exampleInputUsername").type("test");

        //Find the field for the password and type the text "test".
        cy.get("#exampleInputPassword").type("test");

        //Find the button to login and click it.
        cy.get(".login-form button").click();

        // Cy post get data
        cy.route("POST", "/pam", {"id": "0"}).as("pam");

        cy.wait("@pam");

        cy.get("@pam").should((xhr) => {
            alert(xhr);
        })

        // After getting data go to statistics
        cy.get(".nav-link[data-controller='statistics']").click();

        cy.get(".advanced-stats").click();

        cy.get(".normal-stats").click();
    });
});