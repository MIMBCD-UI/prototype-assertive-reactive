// Assistant color caption

function clamp(num, min, max) {
    return num <= min
        ? min
        : num >= max
            ? max
            : num
}

function biradsaccuracydotposition(value) {
    return (value * 85) / 100 + 7.5;
}

function biradsdotposition(value) {
    return clamp(((value - 1) * 100) / 5 + 7.5, 20, 80);
}

/*
Type:
0 - Benign, malign, neutral, no findings caption
1 - Accuracy caption
2 - BIRADS caption
 */
function caption(type, value) {
    console.log(type + " " + value)
    switch (type) {
        case 0:
            let captionHtml = "<div class=tooltipwidth>" +
                "<div class=row>" +
                "<div class=textblue>" +
                "Neutral" +
                "</div>" +
                "<div class=textpurple>" +
                "No findings" +
                "</div>" +
                "</div>" +
                "<div class=row>" +
                "<div class=gradblue>";

            if (value == 0)
                captionHtml += "<span class=dot style=left:25%;></span>"

            captionHtml += "</div>" +
                "<div class=gradpurple>";

            if (value == -1)
                captionHtml += "<span class=dot style=left:72%;></span>"

            captionHtml += "</div>" +
                "<div class=row>" +
                "<div class=textgreen>" +
                "Benign" +
                "</div>" +
                "<div class=textred>" +
                "Malign" +
                "</div>" +
                "</div>" +
                "<div class=row>" +
                "<div class=grad>";

            if (value != 0 && value != -1)
                captionHtml += "<span class=dot style=left:" + (value * 16) + "%;></span>"

            captionHtml += "</div>" +
                "</div>" +
                "</div>";

            return captionHtml;


        // return "<div class=tooltipwidth>" +
        //     "<div class=row>" +
        //     "<div class=textblue>" +
        //     "Neutral" +
        //     "</div>" +
        //     "<div class=textpurple>" +
        //     "No findings" +
        //     "</div>" +
        //     "</div>" +
        //     "<div class=row>" +
        //     "<div class=gradblue>" +
        //     "</div>" +
        //     "<div class=gradpurple>" +
        //     "</div>" +
        //     "</div>" +
        //     "<div class=row>" +
        //     "<div class=textgreen>" +
        //     "Benign" +
        //     "</div>" +
        //     "<div class=textred>" +
        //     "Malign" +
        //     "</div>" +
        //     "</div>" +
        //     "<div class=row>" +
        //     "<div class=grad>" +
        //     "</div>" +
        //     "</div>" +
        //     "</div>"
        case 1:
            return "<div class=tooltipwidth>" +
                "<div class=row>" +
                " <div class=text0>" +
                "0%" +
                "</div>" +
                "<div class=text100>" +
                "100%" +
                "</div>" +
                " <div class=text85>" +
                "85%" +
                "</div>" +
                "<div class=text50>" +
                "50%" +
                "</div>" +
                "</div>" +
                "<div class=row>" +
                "<div class=gradaccuracy>" +
                "<span class=dot style=left:" + biradsaccuracydotposition(value) + "%;></span>" +
                "</div>" +
                "</div>" +
                "<div class=row>" +
                "<div class=textbiradsaccuracy>" +
                "BIRADS Accuracy" +
                "</div>" +
                "</div>" +
                "</div>";
        case 2:
            return "<div class=tooltipwidth>" +
                "<div class=row>" +
                "<div class=textgreen>" +
                "Benign" +
                "</div>" +
                "<div class=textred>" +
                "Malign" +
                "</div>" +
                "</div>" +
                "<div class=row>" +
                "<div class=grad>" +
                "<span class=dot style=left:" + biradsdotposition(value) + "%;></span>" +
                "</div>" +
                "</div>" +
                "</div>"
    }

}


function textColoredWithCaption(text, color, functions) {
    return "<span style='color: " + rgbToHex(color) + "' " + functions + ">" + text + "</span>";
}

function textColored(text, color, type, value) {
    let captionFuncs = "data-bs-toggle='tooltip' data-html='true' title='" + caption(type, value) + "'";

    return textColoredWithCaption(text, color, captionFuncs);
}