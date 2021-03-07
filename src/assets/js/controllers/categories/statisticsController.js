/**
 * Controller responsible for all events in view and setting data
 *
 * @author Pim Meijer
 */
class StatisticsController extends CategoryController {

    constructor() {
        super();

        $.get("views/statistics.html")
            .done((data) => this.setup(data))
            .fail(() => super.error());

        this.updateCurrentCategoryColor("--color-category-statistics");
    }

    //Called when the login.html has been loaded
    setup(data) {
        //Load the login-content into memory
        this.view = $(data);

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.view);
    }
}