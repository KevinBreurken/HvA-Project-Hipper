/**
 * Controller responsible for all events in view and setting data
 *
 * @author Pim Meijer
 */
class CategoryController {

    updateCurrentCategoryColor(cssVariableName) {
        let catColor = getComputedStyle(document.documentElement).getPropertyValue(cssVariableName);
        document.body.style.setProperty('--color-category-current', catColor);
    }

    //Called when the login.html failed to load
    error() {
        $(".content").html("Failed to load content!");
    }
}