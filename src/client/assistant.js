// Assistant Switch 
function assistantSwitch() {

    var assistant_block_width = $('.assistant_block').width();
    if (assistant_block_width < 200) {
        $('.assistant_block')
            .animate({
                width: "270px",
            }, 400, function () {
                assis_animation()
            });
        $('.assistant_block_covariables')
            .animate({
                height: "100%",
                borderWidth: "1px",
                padding: "4px"
            }, 400, function () {
                assis_explanation_animation()
            })
    } else {
        assis_animation();
        assis_explanation_animation();
    }

    function assis_animation() {
        $(".info_n_btn").slideToggle("slow", "linear", function () {
                
            if ($("#switchInput").prop("checked") == false) {
                $('.assistant_block').animate({
                    width: "70px"
                });
                $(".info_n_btn").css('display','none')
            }
        });    
    }

    function assis_explanation_animation(){
        $(".covariable_n_btn").slideToggle("slow", "linear", function () {

            if ($("#switchInput").prop("checked") == false) {
                $('.assistant_block_covariables').animate({
                    height: "0px",
                    borderWidth:"0px",
                    padding: "0px"
                })
            }
        });
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