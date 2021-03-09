/**
 * Responsible for handling the actions happening on welcome view
 * For now it uses the roomExampleRepository to get some example data from server
 *
 * @author Lennard Fonteijn & Pim Meijer
 */
class CaretakerController {

    constructor() {
        console.log(sessionManager.get("role"));
        $.get("views/caretaker/home.html")
            .done((data) => this.setup(data))
            .fail(() => this.error());
    }

    //Called when the welcome.html has been loaded
    setup(data) {
        //Load the welcome-content into memory
        this.caretakerView = $(data);

        //Set the name in the view from the session
        this.caretakerView.find(".name").html(sessionManager.get("username"));

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.caretakerView);

    }

    //Called when the login.html fails to load
    error() {
        $(".content").html("Failed to load content!");
    }
}