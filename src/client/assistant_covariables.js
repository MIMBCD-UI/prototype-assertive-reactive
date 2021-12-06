

var messageUrl = "../common/messages/assistant_msg.json";

var microcalcifications = [];
var microcalcifications_rgb = [];
var nofindings_microcalcifications = null;

var shape = [];
var shape_rgb = [];
var margin = [];
var margin_rgb = [];
var density = [];
var density_rgb = [];

var severity = [];
var severity_percentage = [];
var severity_rgb = [];

var family_history;
var family_history_rgb = [];
var personal_history;
var personal_history_rgb = [];

var n_lesions = 0;

var green = [0, 255, 0];
var red = [255, 0, 0];
var blue = [43, 120, 228];
var purple = [153, 0, 255];


function theTest_covariables(element, data) {                             // this function is being called from line 308 in loadstudy.js
    toolData = cornerstoneTools.getToolState(element, 'stack'); // this is a global variable scope
    // tooldata provides all the data related to the active 
    // image on the screen

    show_assistant_covariables();
}

function show_assistant_covariables() {
    var stack = toolData.data[0];
    var currentlyActiveImageURL = stack.imageIds[0];          // gives the active image of the system (not the json)
    var currentlyActiveImageId = currentlyActiveImageURL.slice(35, -5) // only the image id itself from the sys (not the json file)
    var openPatient = $('#complete-tab > a').attr("href"); // this will fetch the id of open patien with extra 2 latters before actual id
    var openPatientId = openPatient.slice(2) + '.json'      // slice '#x' and add ".json" at the end
    var openPatientUrl = '../../dataset/' + openPatientId;  // full URL of open patient

    resetCovariables();

    //Get Covariables JSON
    $.getJSON(openPatientUrl, function (data) {


        //Get Message JSON
        $.getJSON(messageUrl)
            .done(function (messageText) {

                //Get microcalcifications
                getMicrocalcifications(data, currentlyActiveImageId);

                //Get masses
                getMasses(data, currentlyActiveImageId);

                //Get family and personal history
                getHistory(data);

                //Build message
                buildMessage();

            })



    }).error(function () {                                // alert for no json file availability.
        if (button) {
            alert("No information available for the current patient!");
        }
    })


    $('.assistant_block_covariables').css({ display: "block" });
}


function getMicrocalcifications(data, currentlyActiveImageId) {
    data.rawData.stacks.forEach(arrayOfStacks);

    function arrayOfStacks(item) {
        var openImageId = item.imageIds[0].slice(35, -5);

        if (openImageId.includes(currentlyActiveImageId)) {
            $.each(item.probe, function (index, probe) {
                nofindings_microcalcifications = true;
                $.each(probe.distribution, function (index, distribution) {
                    nofindings_microcalcifications = false;
                    if (!arrayContains(distribution, microcalcifications)) {
                        microcalcifications.push(distribution);
                        microcalcifications_rgb.push(probe.color_rgb[index]);
                        n_lesions++;
                    }
                })
            })
        }

    }

}

function getMasses(data, currentlyActiveImageId) {
    data.rawData.stacks.forEach(arrayOfStacks);

    function arrayOfStacks(item) {
        var openImageId = item.imageIds[0].slice(35, -5);

        if (openImageId.includes(currentlyActiveImageId)) {
            if (item.hasOwnProperty("freehand")) {
                $.each(item.freehand, function (index, mass) {
                    shape.push(mass.shape.type);
                    shape_rgb.push(mass.shape.color_rgb);
                    margin.push(mass.margin.type);
                    margin_rgb.push(mass.margin.color_rgb);
                    density.push(mass.density.type);
                    density_rgb.push(mass.density.color_rgb);

                    n_lesions++;

                    var mass_severity = [];
                    var mass_severity_percentage = [];
                    var mass_severity_rgb = [];

                    $.each(mass.handles, function (index, point) {
                        if (!arrayContains(point.severity.level, mass_severity)) {
                            mass_severity.push(point.severity.level);
                            mass_severity_percentage.push(point.severity.percentage)
                            mass_severity_rgb.push(point.severity.color_rgb);
                        }
                    })

                    severity.push(mass_severity);
                    severity_percentage.push(mass_severity_percentage);
                    severity_rgb.push(mass_severity_rgb);
                })
            }


        }

    }

}

function getHistory(data) {
    family_history = data.rawData.familyHistory.value;
    family_history_rgb = data.rawData.familyHistory.color_rgb;

    personal_history = data.rawData.personalHistory.value;
    personal_history_rgb = data.rawData.personalHistory.color_rgb;
}

function buildMessage() {
    $.getJSON(messageUrl, function (messageText) {

        let msg01 = messageText.assisCovariable[0].covariable_001;
        let msg02 = messageText.assisCovariable[0].covariable_002;
        let msg03 = messageText.assisCovariable[0].covariable_003;
        let msg04 = messageText.assisCovariable[0].covariable_004;
        let msg05 = messageText.assisCovariable[0].covariable_005;
        let msg06 = messageText.assisCovariable[0].covariable_006;
        let msg07 = messageText.assisCovariable[0].covariable_007;
        let msg08 = messageText.assisCovariable[0].covariable_008;
        let msg09 = messageText.assisCovariable[0].covariable_009;
        let msg10 = messageText.assisCovariable[0].covariable_010;
        let msg11 = messageText.assisCovariable[0].covariable_011;
        let msg12 = messageText.assisCovariable[0].covariable_012;
        let msg13 = messageText.assisCovariable[0].covariable_013;
        let msg14 = messageText.assisCovariable[0].covariable_014;
        let msg15 = messageText.assisCovariable[0].covariable_015;
        let msg16 = messageText.assisCovariable[0].covariable_016;
        let msg17 = messageText.assisCovariable[0].covariable_017;
        let msg18 = messageText.assisCovariable[0].covariable_018;
        let msg19 = messageText.assisCovariable[0].covariable_019;

        let n_lesions_msg = "";
        if(n_lesions == 0)
            n_lesions_msg = msg01 + textColored(msg14 + msg02[2], purple,0, -1);
        else
            n_lesions_msg = msg01 + textColored(n_lesions, blue,0, 0) + msg02[pluralOrSingular(n_lesions)];
            

        var n_lesion = 0;
        var lesions_msg = "";
        $.each(microcalcifications, function (index, microcalcification) {

            if (n_lesion == 0)
                var lesion_msg = msg03[n_lesion][pluralOrSingular(n_lesions)] + msg04[1] + msg05[1] + msg06 + textColored(microcalcification, microcalcifications_rgb[index], 0,getLesionValue(microcalcifications_rgb[index])) + msg07[3];
            else
                var lesion_msg = msg03[n_lesion] + msg04[1] + msg05[1] + msg06 + textColored(microcalcification, microcalcifications_rgb[index], 0,getLesionValue(microcalcifications_rgb[index])) + msg07[3];

            lesions_msg += lesion_msg;
            n_lesion++;
        })

        if(nofindings_microcalcifications != null && nofindings_microcalcifications){
            if (n_lesion == 0)
                var lesion_msg = msg03[n_lesion][pluralOrSingular(n_lesions)];
            else
                var lesion_msg = msg03[n_lesion];
            
            lesion_msg += msg04[1] + msg05[1] + msg06 + textColored(msg18, purple, 0, -1);

            lesions_msg += lesion_msg;
            n_lesion++;
        }


        $.each(shape, function (index, mass) {

            if (n_lesion == 0)
                var lesion_msg = msg03[n_lesion][pluralOrSingular(n_lesions)] + msg04[0] + msg05[0] + msg06;
            else
                var lesion_msg = msg03[n_lesion] + msg04[0] + msg05[0] + msg06;


            var mass_type_lesions = [];
            if (shape[index] != "")
                mass_type_lesions.push(textColored(shape[index] + msg07[0], shape_rgb[index], 0,getLesionValue(shape_rgb[index])))
            if (margin[index] != "")
                mass_type_lesions.push(textColored(margin[index] + msg07[1], margin_rgb[index], 0,getLesionValue(margin_rgb[index])))
            if (density[index] != "")
                mass_type_lesions.push(textColored(density[index] + msg07[2], density_rgb[index], 0,getLesionValue(density_rgb[index])))

            if (mass_type_lesions.length == 1)
                lesion_msg += mass_type_lesions[0];
            else if (mass_type_lesions.length == 2)
                lesion_msg += mass_type_lesions[0] + msg08[1] + mass_type_lesions[1];
            else if(mass_type_lesions.length == 3)
                lesion_msg += mass_type_lesions[0] + msg08[0] + mass_type_lesions[1] + msg08[1] + mass_type_lesions[2];
            else
                lesion_msg += textColored(msg18, purple, 0, -1);

            lesions_msg += lesion_msg;
            n_lesion++;
        })

        let history_msg = "";

        if(family_history == null || personal_history == null){
            history_msg += msg17 + textColored(msg18, purple, 0, -1) + msg19;
            if(family_history == null){
                history_msg += textColored(msg10, purple, 0, -1);
                if(personal_history == null)
                    history_msg += msg13 + textColored(msg11, purple, 0, -1);
            }
            else if(personal_history == null)
                history_msg += textColored(msg11, purple, 0, -1);    
        }

        if ((!family_history && family_history != null) || (!personal_history && personal_history != null)) {
            history_msg += msg09;

            if ((!family_history && family_history != null) && (!personal_history && personal_history != null))
                history_msg += msg12 + textColored(msg10, family_history_rgb,0, getLesionValue(personal_history_rgb)) + msg13 + textColored(msg11, personal_history_rgb, 0,getLesionValue(personal_history_rgb));
            else {
                if ((!family_history && family_history != null))
                    history_msg += msg12 + textColored(msg10, family_history_rgb, 0,getLesionValue(family_history_rgb));
                else if ((!personal_history && personal_history != null))
                    history_msg += msg12 + textColored(msg11, personal_history_rgb, 0,getLesionValue(personal_history_rgb));
            }

        }

        let assis_msg_covariable = n_lesions_msg + lesions_msg + history_msg + ".";

        document.getElementById("assistant_information_test").innerHTML = assis_msg_covariable;

        // var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
        // var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        // return new bootstrap.Popover(popoverTriggerEl)
        // })

        $("[data-bs-toggle='tooltip']").tooltip();

    }).error(function () {
        if (button) {
            alert("No information available for the current patient!");
        }
    })
}

function pluralOrSingular(n) {
    if (n == 1)
        return 0;
    return 1;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(color) {
    return "#" + componentToHex(color[0]) + componentToHex(color[1]) + componentToHex(color[2]);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
     ] : null;
}

function getLesionValue(color) {
    const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    if (equals(color,hexToRgb("#2B78E4")))
        return 0;
    if (equals(color,hexToRgb("#9900FF")))
        return -1;
    if (equals(color,hexToRgb("#009E0F")))
        return 1;
    if (equals(color, hexToRgb("#FFFF00")))
        return 2;
    if (equals(color, hexToRgb("#FF9900")))
        return 4;
    if (equals(color,hexToRgb("#CF2A27")))
        return 5;
    return 3;

}

function resetCovariables() {
    microcalcifications = [];
    microcalcifications_rgb = [];

    shape = [];
    shape_rgb = [];
    margin = [];
    margin_rgb = [];
    density = [];
    density_rgb = [];

    severity = [];
    severity_percentage = [];
    severity_rgb = [];

    n_lesions = 0;
}

function arrayContains(needle, arrhaystack) {
    return (arrhaystack.indexOf(needle) > -1);
}
