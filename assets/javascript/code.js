  var config = {
      apiKey: "AIzaSyAH_lhKKhySuj6TY0M0YkrGQmSyr2f1XfE",
      authDomain: "navcool-8cf67.firebaseapp.com",
      databaseURL: "https://navcool-8cf67.firebaseio.com",
      projectId: "navcool-8cf67",
      storageBucket: "navcool-8cf67.appspot.com",
      messagingSenderId: "877353884538"
  };
  firebase.initializeApp(config);
  var db = firebase.database();

  var startTime = '13:00';
  var timenow;
  timenow = moment().format('hh:mm');
  console.log(timenow);
  startTimeMnt = moment(startTime, 'HH:mm');

  console.log(moment(startTimeMnt).format('HH:mm'));
  console.log(moment(startTimeMnt).toNow());
  console.log(moment(startTimeMnt).diff(moment(), "hours"));

  // console.log(getNextArrivalTime('13:00','30'))

  $('#submit').on('click', function() {
      event.preventDefault();

      // Get user input values for Train addition
      var trainName = $('#trainNameInput').val().trim();
      var destination = $('#destInput').val().trim();
      var firstTrainTime = $('#firstTrainTimeInput').val().trim();
      var frequency = $('#frequencyInput').val().trim();
      var nextArrival = "";
      var minutesAway = "";
      console.log(trainName, destination, firstTrainTime, frequency);

      db.ref().push({
          trainName: trainName,
          destination: destination,
          firstTrainTime: firstTrainTime,
          frequency: frequency
      });
      var nextArrTimeAndMinsAway = getNextArrivalTimeAndMinsAway(firstTrainTime, frequency);
      nextArrival = nextArrTimeAndMinsAway[0];
      minutesAway = nextArrTimeAndMinsAway[1];
      $('#trainNameInput').val("");
      $('#destInput').val("");
      $('#firstTrainTimeInput').val("");
      $('#frequencyInput').val("");
      
  });

  function getNextArrivalTimeAndMinsAway(firstTrainTime, frequency) {
      var firstTrainTimefmtd = moment(firstTrainTime, 'HH:mm').subtract(1, "years");
      var firstTrainAndNowinMins = Math.abs(moment(firstTrainTimefmtd).diff(moment(), "minutes"));
      var diffInMinsNextTrain = frequency - (firstTrainAndNowinMins % frequency);
      var nextTrainTime = moment().add(diffInMinsNextTrain, 'm');
      var nextTrainTimefmtd = moment(nextTrainTime).format('hh:mm A');
      return [nextTrainTimefmtd, diffInMinsNextTrain];
  }

  db.ref().on('child_added', function(child) {
      var trainName = child.val().trainName;
      var destination = child.val().destination;
      var firstTrainTime = child.val().firstTrainTime;
      var frequency = child.val().frequency;
      var nextArrival = "";
      var minutesAway = "";
      var nextArrTimeAndMinsAway = getNextArrivalTimeAndMinsAway(firstTrainTime, frequency);
      nextArrival = nextArrTimeAndMinsAway[0];
      minutesAway = nextArrTimeAndMinsAway[1]

      if (trainName !== undefined) {
          var markup = "<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>";
          $("table tbody").append(markup);
      }

  })