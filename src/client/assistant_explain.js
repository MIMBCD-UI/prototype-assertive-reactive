var global_var_explain = false;
var list_of_cs = [];
var global_image_id = "";
var palette_pastel = ["f67280"];
var list_image_ID_viewPort = ["","","",""];
var list_zoom_viewPort = [0.1,0.1,0.1,0.1];
var list_places = ["first", "second", "third", "fourth"];


function theTest(element, data) {                             // this function is being called from line 308 in loadstudy.js
  toolData = cornerstoneTools.getToolState(element, 'stack'); // this is a global variable scope
                                                              // tooldata provides all the data related to the active 
                                                              // image on the screen
                                                              
}

function disableXAITools() {
  forEachViewport(function(element) {
    //cornerstoneTools.wwwc.disable(element);
    //cornerstoneTools.pan.activate(element, 2); // 2 is middle mouse button
    //cornerstoneTools.zoom.activate(element, 4); // 4 is right mouse button
    cornerstoneTools.probe.deactivate(element, 1);
    cornerstoneTools.length.deactivate(element, 1);
    cornerstoneTools.angle.deactivate(element, 1);
    cornerstoneTools.ellipticalRoi.deactivate(element, 1);
    cornerstoneTools.rectangleRoi.deactivate(element, 1);
    cornerstoneTools.freehand.deactivate(element, 1);
    //cornerstoneTools.stackScroll.deactivate(element, 1);
    //cornerstoneTools.wwwcTouchDrag.deactivate(element);
    //cornerstoneTools.zoomTouchDrag.deactivate(element);
    //cornerstoneTools.panTouchDrag.deactivate(element);
    //cornerstoneTools.stackScrollTouchDrag.deactivate(element);
  });
}

function explain_assistant_rerult(button = true) { 

  if ($("#explainBtn").data("executing")) return;

  $("#explainBtn").data("executing", true);

  var stack = toolData.data[0];
  var currentlyActiveImageURL = stack.imageIds[0];          // gives the active image of the system (not the json)
  var currentlyActiveImageId = currentlyActiveImageURL.slice(35, -5) // only the image id itself from the sys (not the json file)
  var openPatient = $('#complete-tab > a').attr("href") ; // this will fetch the id of open patien with extra 2 latters before actual id
  var openPatientId = openPatient.slice(2) + '.json'      // slice '#x' and add ".json" at the end
  var openPatientUrl = '../../dataset/' + openPatientId;  // full URL of open patient

  /*if(currentlyActiveImageId != global_image_id){
    list_of_cs = [];
  }*/

  if ((list_of_cs.length == 0 && button == false)|| (list_of_cs.length != 0 && button == true)){
    global_image_id = currentlyActiveImageId;
    list_of_cs = [];
    global_var_explain = false;
    disableXAITools();

    assis_explanation_animation_btn();
  }
  else{
    global_var_explain = true;
    disableXAITools();
    list_of_cs = [];
    global_image_id = currentlyActiveImageId;
    
    var canvas = document.querySelectorAll('.viewport > canvas');

    for (var i = 0; i < canvas.length; i++) {
      if(list_image_ID_viewPort[i] == ""){
        continue;
      }
      bounding_box(openPatientUrl, list_image_ID_viewPort[i], canvas[i], Math.max(list_zoom_viewPort[i],0.1), button, list_places[i]);
    }

    assis_explanation_animation_btn();
  }
}

function bounding_box(openPatientUrl,currentlyActiveImageId,canvas, scale, button, pos){
  
  $.ajaxSetup({
    async: false
  });

  $.getJSON( openPatientUrl, function(data) {             // getting the exact json file(dataset/...json) for the active image
    data.rawData.stacks.forEach(arrayOfStacks)            // getting all the stacked image for the patient
    function arrayOfStacks(item) {                        // checking which image is open of all stacked images
      
      var openImageId = item.imageIds[0].slice(35, -5);
      
      //if (openImageId == currentlyActiveImageId ) {           // checking which image is open of all stacked images by condition modifiedImageURL---line:13
      if (openImageId.includes(currentlyActiveImageId )) {           // checking which image is open of all stacked images by condition modifiedImageURL---line:13
        
        //var canvas = document.querySelector('.viewport > canvas:first-child');  // Make the canvas for freehand and probe-----
        //var canvas = document.querySelectorAll('.viewport > canvas')[0];
        var c = canvas.getContext('2d');                  // c (= context) for both freehand and probe
            c.strokeStyle = '#ffd31d';                     // this styles are valid for both freehand and probe.
            c.lineWidth = Math.min((1/scale)*4,10);
            c.beginPath();
            c.setLineDash([Math.min((1/scale)*4,10)]);

        var freehand = item.freehand;                     // freehand values of the open image by the image id freehand contains x-y values # freehand contains x-y values
        var probe = item.probe;                           // every probe of the associated image------
        if (typeof(probe) == 'undefined' && typeof(freehand) == 'undefined') {
          if (button){
            global_alert = 'No information available for the ' + pos + ' image!'
            alert('No information available for the ' + pos + ' image!');
          }
        }
        if (typeof(probe) != 'undefined') {
          probe.forEach(singleProbe => {
            var singleProbe_x = singleProbe.handles.end.x;
            var singleProbe_y = singleProbe.handles.end.y;
            c.beginPath();
            c.arc(singleProbe_x,singleProbe_y,10,0, 2 * Math.PI);
            c.stroke();
            list_of_cs.push(c);
          });
        }

        if ( typeof(freehand) != 'undefined') {            // check wheather freehand is null or not

          global_var_explain = true;
          freehand.forEach(iterateFreehand);            // iterate for all 1st freehand of the freelands
          function iterateFreehand(freehandItem) {
            var handles = freehandItem.handles;   
            var min_x = 9999;                           // left value of the point 
            var min_y = 9999;                           // top value of the point
            var max_x = 0;                              // right value of the point
            var max_y = 0;                              // 
            
              handles.forEach(getXYvalues)                  // for every freehand - get the x and y values.
              function getXYvalues(handleItem) {
                var hand_x = handleItem.x;              // x coordinate of a freehand
                var hand_y = handleItem.y;              // y coordinate of a freehand
                if (hand_x < min_x) {
                  min_x = hand_x;
                }
                if (hand_y < min_y) {
                  min_y = hand_y;
                }
                if (hand_x > max_x) {
                  max_x = hand_x;
                }
                if (hand_y > max_y) {
                  max_y = hand_y;
                }
              }                                             // first freehand iteration done here
              c.moveTo(min_x - 15, min_y - 15);
              c.lineTo(max_x + 15, min_y - 15);
              c.lineTo(max_x + 15, max_y + 15);
              c.lineTo(min_x - 15, max_y + 15);
              c.lineTo(min_x - 15, min_y - 15);
              c.stroke();
              list_of_cs.push(c);
          }
        }
      }
    }
  }
  ).error(function () {                                // alert for no json file availability.
    if (button){
      alert("No information available for the current patient!");
    }
  })
  $.ajaxSetup({
    async: true
  });
}