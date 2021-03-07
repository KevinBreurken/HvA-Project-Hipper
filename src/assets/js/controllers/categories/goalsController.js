/**
 * Controller responsible for all events in view and setting data
 *
 * @author Pim Meijer
 */
class GoalsController extends CategoryController {

    constructor() {
        super();

        $.get("views/goals.html")
            .done((data) => this.setup(data))
            .fail(() => super.error());

        this.updateCurrentCategoryColor("--color-category-goals");
    }

    //Called when the login.html has been loaded
    setup(data) {
        //Load the login-content into memory
        this.view = $(data);

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.view);
    }

}