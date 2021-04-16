class motivationalController {
    static titlesMotivational = ["De eerste stap", "Een goed begin", "Einde is in zicht", "De nieuwe jij"];
    static motvivationalContent = ["Het kan misschien wat intimiderend zijn, maar de eerste stappen zijn altijd het lastigst. Hoewel er nog genoeg te doen staat komt de voortgang vanzelf. Probeer jezelf te focussen op de eerste stappen, het zullen er vanzelf meer worden.",
        "Je hebt al een hele goede start gemaakt naar een gezonde heup. Probeer dit vol te houden, vind vrienden en familie om je te helpen. Je staat er niet alleen voor. Uiteidelijk komt deze balk helemaal naar het einde.",
        "Je bent er bijna! Kijk terug op hoe het in het begin ging, en bewonder de vooruitgang die je al hebt gemaakt. Binnenkort zal je weer door het leven kunnen huppelen, alleen de laatste meters nog.",
        "De laatste stappen en je hebt je doel behaald. Je mag trots zijn op jezelf. Ga met iemand een rondje fietsen, of maak een leuke wandeling. Dat heb je na deze revalidatie zeker wel verdient."];

    static fillMotivationalContent(total, current){
        const progresionIndex = this.calculateProgress(total, current);
        $('#motivational-title').empty().append(this.titlesMotivational[progresionIndex]);
        $('#motivational-description').empty().append(this.motvivationalContent[progresionIndex]);
    }

    static calculateProgress(total, current){
        const progression = Math.floor((current / total)*100);
        if (progression < 10){
            return 0;
        } else if (progression < 50){
            return 1;
        } else if (progression < 80){
            return 2;
        } else if (progression < 100){
            return 3;
        } else {
            return 4;
        }
    }
}