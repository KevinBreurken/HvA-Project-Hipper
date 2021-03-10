/**
 * Controller responsible for all events in view and setting data
 *
 * @author Pim Meijer
 */
class ProfileController extends CategoryController {

    constructor() {
        super();
        this.loadView("views/profile.html");
    }

    //Called when the login.html has been loaded.
    setup(data) {
        //Set the navigation color to the correct CSS variable.
        this.updateCurrentCategoryColor("--color-category-profile");
        //Set the navigation to the correct state.
        nav.setNavigationState(navState.User)
        //Load the login-content into memory.
        this.view = $(data);

        //Empty the content-div and add the resulting view to the page.
        $(".content").empty().append(this.view);
    }
}