/**
 * Controller responsible for all events in view and setting data
 *
 * @author Pim Meijer
 */
class GoalsController extends CategoryController{

    constructor() {
        super();

        $.get("views/home.html")
            .done((data) => this.setup(data))
            .fail(() => this.error());

        this.updateCurrentCategoryColor("--color-category-goals");

    }

    //Called when the login.html has been loaded
    setup(data) {

    }
    //Called when the login.html failed to load
    error() {
        $(".content").html("Failed to load content!");
    }
}