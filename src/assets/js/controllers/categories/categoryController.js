/**
 * Base class for every category controller.
 *
 * @author Kevin Breurken
 */
class CategoryController {

    constructor() {
        if (new.target === CategoryController)
            throw new TypeError("Cannot construct CategoryController instances directly");
    }

    /**
     * Changes the CSS current category color to the given CSS variable name.
     * @param cssVariableName namve of the css variable e.g. --color-category-default.
     */
    updateCurrentCategoryColor(cssVariableName) {
        let catColor = getComputedStyle(document.documentElement).getPropertyValue(cssVariableName);
        document.body.style.setProperty('--color-category-current', catColor);
    }

    loadView(path) {
        $.get(path)
            .done((data) => this.setup(data))
            .fail(() => this.error());
    }

    setup(data) {
    }

    //Called when the view failed to load.
    error() {
        $(".content").html(`Failed to load ${this.constructor.name} view!`);
    }
}