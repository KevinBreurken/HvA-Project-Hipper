const testUsername = 'caretaker';
const testPassword = 'PBCgTizI2/MGff5FncLvE1QnZE8cWGnHsXAUR2EHfMU=';

// Test for statistics, made by Kevin
describe('Patients', function () {
    beforeEach(() => {
        cy.visit("http://localhost:8080")

        const session = {"username" : "kevin"};
        localStorage.setItem("session", JSON.stringify(session));
    })

    it("Check pagination", () => {
        // Start faker
        cy.server();

        //Find the field for the username and type the text "test".
        cy.get("#exampleInputUsername").type(testUsername);

        //Find the field for the password and type the text "test".
        cy.get("#exampleInputPassword").type(testPassword);

        //Find the button to login and click it.
        cy.get(".login-form button").click();

        //Find the nav button to enter patient view.
        cy.get(".nav-link[data-controller=patients]").click();

        //Check if an pagination element exists.
        expect(cy.get(".page-item[data-page=1]"))

        //Try to go the second page of the pagination if possible.
        if(cy.get(".page-item[data-page=2]")){
            cy.get(".page-item[data-page=2]").click();
        }
                
    });
});