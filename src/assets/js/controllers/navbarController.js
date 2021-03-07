const navState = {
    None: 0,
    User: 1,
    Caretaker: 2
};

/**
 * Responsible for handling the actions happening on sidebar view
 *
 * @author Lennard Fonteijn, Pim Meijer, Kevin Breurken
 */
class NavbarController {
    constructor() {

        $.get("views/navbar.html")
            .done((data) => this.setup(data))
            .fail(() => super.error());
    }

    //Called when the navbar.html has been loaded
    setup(data) {
        //Load the sidebar-content into memory
        const sidebarView = $(data);
        //Find all anchors and register the click-event
        sidebarView.find("button").on("click", this.handleClickMenuItem);
        sidebarView.find("p").on("click", this.handleClickMenuItem);

        //Empty the sidebar-div and add the resulting view to the page
        $(".sidebar").empty().append(sidebarView);
        $(".home-back-element").click(this.handleClickMenuItem)
    }

    async handleClickMenuItem() {
        //Get the data-controller from the clicked element (this)
        const controller = $(this).attr("data-controller");

        //Pass the action to a new function for further processing
        await app.loadController(controller);

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

}
