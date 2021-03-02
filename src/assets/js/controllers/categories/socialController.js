/**
 * Controller responsible for all events in view and setting data
 *
 * @author Pim Meijer
 */
class SocialController extends CategoryController{

    constructor() {
        super();

        $.get("views/home.html")
            .done((data) => this.setup(data))
            .fail(() => this.error());
        this.updateCurrentCategoryColor("--color-category-social");

    }

    //Called when the login.html has been loaded
    setup(data) {
        //Load the login-content into memory
        this.view = $(data);

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.view);
    }
    //Called when the login.html failed to load
    error() {
        $(".content").html("Failed to load content!");
    }
}