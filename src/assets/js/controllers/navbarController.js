const navState = {
    None: 0,
    User: 1,
    Caretaker: 2
};

/**
 * Responsible for handling the actions happening on sidebar view
 *
 * @author Lennard Fonteijn, Pim Meijer
 */
class NavbarController {
    constructor() {

        $.get("views/navbar.html")
            .done((data) => this.setup(data))
            .fail(() => this.error());
    }

    //Called when the navbar.html has been loaded
    setup(data) {
        //Load the sidebar-content into memory
        const sidebarView = $(data);
        //Find all anchors and register the click-event
        sidebarView.find("button").on("click", this.handleClickMenuItem);
        //Empty the sidebar-div and add the resulting view to the page
        $(".sidebar").empty().append(sidebarView);
    }

    async handleClickMenuItem() {
        //Get the data-controller from the clicked element (this)
        const controller = $(this).attr("data-controller");

        //Pass the action to a new function for further processing
        await app.loadController(controller);
        //Select the clicked button
        // $('.bottom-nav-element').attr("selected", false);
        // $(this).attr("selected", true)


        console.log($('.bottom-nav-element').attr("data-controller"))
        //Return false to prevent reloading the page
        return false;
    }

    setSelectedCategory(controllerName) {
        $('.bottom-nav-element').attr("selected", false);
        $(`.bottom-nav-element[data-controller="${controllerName}"]`).attr("selected", true);
    }

    setNavState(stateEnum) {
        $('#right-nav').toggle(stateEnum === navState.User || stateEnum === navState.Caretaker);
        $('.nav-type-user').toggle(stateEnum === navState.User);
    }

    //Called when the login.html failed to load
    error() {
        $(".content").html("Failed to load the sidebar!");
    }
}
