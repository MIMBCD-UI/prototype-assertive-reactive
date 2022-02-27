// Assistant Switch 
function assistantSwitch() {

    if ($("#explainBtn").data("executing")) {
        $("#switchInput").prop("checked", true);
        return;
    }

    var assistant_block_width = $('.assistant_block').width();
    if (assistant_block_width < 200) {
        $('.assistant_block')
            .animate({
                width: "270px",
            }, 400, function () {
                assis_animation()
            });

    } else {
        assis_animation();
        if ($(".covariable_n_btn").css("display") != "none") {
            $("#explainBtn").trigger("click");
        }
    }


}

function assis_animation() {
    $(".info_n_btn").slideToggle("slow", "linear", function () {

        if ($("#switchInput").prop("checked") == false) {
            $('.assistant_block').animate({
                width: "70px"
            });
            $(".info_n_btn").css('display', 'none')
        }
    });
}

function assis_explanation_animation_btn() {
    if ($(".covariable_n_btn").css("display") == "none") {
        $('.assistant_block_covariables')
            .animate({
                height: "100%",
                borderWidth: "1px",
                padding: "4px"
            }, 400, function () {
                $(".covariable_n_btn").slideToggle("slow", "linear", $("#explainBtn").removeData("executing"));
            });
        return true;

    } else {
        $(".covariable_n_btn").slideToggle("slow", "linear", function () {
            $('.assistant_block_covariables').animate({
                height: "0px",
                borderWidth: "0px",
                padding: "0px"
            }, 400, function () {
                $("#explainBtn").removeData("executing");
            });
        });
        return false;

    }
}

// Assistant Information Buttons functionality Samad-masamad.sust@gmail.com 
// Accept result
function accept_assistant_result() {
    $.ajax
        ({
            type: "POST",
            url: "/updatebiradsphys",
            crossDomain: true,
            dataType: "json",
            data: JSON.stringify({ patientID: patientID })
        }).done(function (data) {
            alert(data.result)
        })

}
// reject Result
function reject_assistant_rerult() {

}

function rejectPatient() {

    $.ajax
        ({
            type: "POST",
            url: "/rejectbiradsphys",
            crossDomain: true,
            dataType: "json",
            data: JSON.stringify({ patientID: patientID, biradsPhys: $('#selectbiradsPhys').val() })
        }).done(function (data) {
            alert(data.result)
        })
}