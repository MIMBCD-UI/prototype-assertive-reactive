var global_var_explain = false;
var list_of_cs = [];
var global_image_id = "";
var palette_pastel = ["f67280"];
var list_image_ID_viewPort = ["", "", "", ""];
var list_zoom_viewPort = [0.1, 0.1, 0.1, 0.1];
var list_places = ["first", "second", "third", "fourth"];

var circles = {};
var explanationOpen = false;


function theTest(element, data) {                             // this function is being called from line 308 in loadstudy.js
  toolData = cornerstoneTools.getToolState(element, 'stack'); // this is a global variable scope
  // tooldata provides all the data related to the active 
  // image on the screen

}

function disableXAITools() {
  forEachViewport(function (element) {
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
  var openPatient = $('#complete-tab > a').attr("href"); // this will fetch the id of open patien with extra 2 latters before actual id
  var openPatientId = openPatient.slice(2) + '.json'      // slice '#x' and add ".json" at the end
  var openPatientUrl = '../../dataset/' + openPatientId;  // full URL of open patient

  circles = {};
  if (currentlyActiveImageId != global_image_id) {
    list_of_cs = [];
  }

  if ((list_of_cs.length == 0 && button == false) || (list_of_cs.length != 0 && button == true)) {
    global_image_id = currentlyActiveImageId;
    list_of_cs = [];
    global_var_explain = false;
    disableXAITools();

    if (explanationOpen)
      explanationOpen = assis_explanation_animation_btn();
    else
      $("#explainBtn").removeData("executing");
  }
  else {
    global_var_explain = true;
    disableXAITools();
    list_of_cs = [];
    global_image_id = currentlyActiveImageId;

    var canvas = document.querySelectorAll('.viewport > canvas');

    for (var i = 0; i < canvas.length; i++) {
      if (list_image_ID_viewPort[i] == "") {
        continue;
      }
      bounding_box(openPatientUrl, list_image_ID_viewPort[i], canvas[i], Math.max(list_zoom_viewPort[i], 0.1), button, list_places[i]);
    }

    if (!explanationOpen)
      explanationOpen = assis_explanation_animation_btn();
    else
      $("#explainBtn").removeData("executing");
  }
}

function bounding_box(openPatientUrl, currentlyActiveImageId, canvas, scale, button, pos) {

  $.ajaxSetup({
    async: false
  });

  $.getJSON(openPatientUrl, function (data) {             // getting the exact json file(dataset/...json) for the active image
    data.rawData.stacks.forEach(arrayOfStacks)            // getting all the stacked image for the patient
    function arrayOfStacks(item) {                        // checking which image is open of all stacked images

      var openImageId = item.imageIds[0].slice(35, -5);

      //if (openImageId == currentlyActiveImageId ) {           // checking which image is open of all stacked images by condition modifiedImageURL---line:13
      if (openImageId.includes(currentlyActiveImageId)) {           // checking which image is open of all stacked images by condition modifiedImageURL---line:13

        //var canvas = document.querySelector('.viewport > canvas:first-child');  // Make the canvas for freehand and probe-----
        //var canvas = document.querySelectorAll('.viewport > canvas')[0];
        var c = canvas.getContext('2d');                  // c (= context) for both freehand and probe
        c.strokeStyle = '#ffd31d';                     // this styles are valid for both freehand and probe.
        c.lineWidth = Math.min((1 / scale) * 4, 10);
        c.beginPath();
        c.setLineDash([Math.min((1 / scale) * 4, 10)]);

        var freehand = item.freehand;                     // freehand values of the open image by the image id freehand contains x-y values # freehand contains x-y values
        var probe = item.probe;                           // every probe of the associated image------
        if (typeof (probe) == 'undefined' && typeof (freehand) == 'undefined') {
          if (button) {
            global_alert = 'No information available for the ' + pos + ' image!'
            alert('No information available for the ' + pos + ' image!');
          }
        }
        if (typeof (probe) != 'undefined') {
          probe.forEach(singleProbe => {
            var singleProbe_x = singleProbe.handles.end.x;
            var singleProbe_y = singleProbe.handles.end.y;
            c.beginPath();
            c.arc(singleProbe_x, singleProbe_y, 10, 0, 2 * Math.PI);
            c.stroke();

            //Save ellipses for distributions
            addPointsToEllipse([singleProbe_x, singleProbe_y], singleProbe.distribution);

            //Distribution text
            var distributionArray = [];
            var distributionRGBArray = [];
            if (singleProbe.distribution != null && singleProbe.distribution.length > 0) {
              singleProbe.distribution.forEach(d => {
                distributionArray.push(d);
                distributionRGBArray.push(singleProbe.color_rgb[singleProbe.distribution.indexOf(d)]);
              });
            }
            else {
              distributionArray.push("no findings");
              distributionRGBArray.push([153, 0, 255]);
            }

            c.font = "100px Arial";
            // writeText(c, distributionArray, distributionRGBArray, singleProbe_x, singleProbe_y)

            list_of_cs.push(c);
          });
        }

        //Draw ellipses
        $.each(circles, function (index, value) {

          var P = math.transpose(value);

          // Dimension of the points
          var d = 2;
          // Number of points
          var N = value.length;

          // Add a row of 1s to the 2xN matrix P - so Q is 3xN now.
          // var Q = $.each(P, function (index, array) {
          //   array.push(1);
          // });
          var Q = P.slice();
          Q.push(Array(N).fill(1))

          // Initialize
          var count = 1;
          var err = 1;
          //u is an Nx1 vector where each element is 1/N
          var u = Array(N).fill(1 / N);

          // Khachiyan Algorithm
          while (err > 0.0001) {
            // Matrix multiplication: 
            // diag(u) : if u is a vector, places the elements of u 
            // in the diagonal of an NxN matrix of zeros
            var X = math.multiply(math.multiply(Q, math.diag(u)), math.transpose(Q));

            // inv(X) returns the matrix inverse of X
            // diag(M) when M is a matrix returns the diagonal vector of M
            var M = math.diag(math.multiply(math.multiply(math.transpose(Q), math.inv(X)), Q));

            // Find the value and location of the maximum element in the vector M
            var maximum = Math.max(...M);
            var j = M.indexOf(maximum);


            // Calculate the step size for the ascent
            var step_size = (maximum - d - 1) / ((d + 1) * (maximum - 1));

            // Calculate the new_u:
            // Take the vector u, and multiply all the elements in it by (1-step_size)
            var new_u = math.multiply((1 - step_size), u);

            // Increment the jth element of new_u by step_size
            new_u[j] = new_u[j] + step_size;

            // Store the error by taking finding the square root of the SSD 
            // between new_u and u
            // The SSD or sum-of-square-differences, takes two vectors 
            // of the same size, creates a new vector by finding the 
            // difference between corresponding elements, squaring 
            // each difference and adding them all together. 

            // So if the vectors were: a = [1 2 3] and b = [5 4 6], then:
            // SSD = (1-5)^2 + (2-4)^2 + (3-6)^2;
            // And the norm(a-b) = sqrt(SSD);
            var err = new_u.map((x, i) => Math.pow(new_u[i] - u[i], 2)).reduce((m, n) => m + n, 0);


            // Increment count and replace u
            count = count + 1;
            u = new_u;

          }

          // Put the elements of the vector u into the diagonal of a matrix
          // U with the rest of the elements as 0
          var U = math.diag(u);


          // Compute the A-matrix
          var A = math.multiply(1 / d, math.inv(math.subtract(math.multiply(math.multiply(P, U), math.transpose(P)), math.multiply(math.multiply(P, u), math.transpose(math.multiply(P, u))))));


          var leftSide = math.multiply(math.multiply(P, U), math.transpose(P));
          var rightSideTmp = math.multiply(P, u);
          var rightSide = math.multiply(math.transpose([rightSideTmp]), [rightSideTmp]);
          var Atmp = math.inv(math.subtract(leftSide, rightSide));
          A = math.multiply(1 / d, Atmp);

          // And the center,
          var center = math.multiply(P, u);

          var centerX = center[0];
          var centerY = center[1];

          var { u, v, q } = SVDJS.SVD(A);

          var radiusX = 1 / Math.sqrt(q[0]);
          var radiusY = 1 / Math.sqrt(q[1]);

          var rotationAngle = Math.acos(v[0][0]);
          if (v[0][1] < 0)
            rotationAngle = - rotationAngle;

          c.beginPath();
          c.ellipse(centerX, centerY, radiusX + 50, radiusY + 50, -rotationAngle, 0, 2 * Math.PI);
          c.stroke();

        });

        if (typeof (freehand) != 'undefined') {            // check wheather freehand is null or not

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

            massArray = [freehandItem.shape.type, freehandItem.margin.type, freehandItem.density.type]
            massColorArray = [freehandItem.shape.color_rgb, freehandItem.margin.color_rgb, freehandItem.density.color_rgb]
            c.font = "100px Arial";
            writeText(c, massArray, massColorArray, max_x, min_y)

            list_of_cs.push(c);
          }
        }
      }
    }
  }
  ).error(function () {                                // alert for no json file availability.
    if (button) {
      alert("No information available for the current patient!");
    }
  })
  $.ajaxSetup({
    async: true
  });
}

function writeText(ctx, texts, colors, initX, initY) {
  for (var i = 0; i < texts.length; ++i) {
    var text = texts[i];
    ctx.fillStyle = convertColor(colors[i]);
    ctx.fillText(text, initX, initY);
    initX += ctx.measureText(text).width;
  }
}

function convertColor(color) {
  return "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
}

function addPointsToEllipse(calcification, distributions) {
  if (distributions != null && distributions.length > 0) {
    distributions.forEach(d => {
      if (d in circles) {
        circles[d].push(calcification);
      } else {
        circles[d] = [calcification];
      }
    });
  }
  else {
    if ("no findings" in circles) {
      circles["no findings"].push(calcification);
    } else {
      circles["no findings"] = [calcification];
    }
  }

}