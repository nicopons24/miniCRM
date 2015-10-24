var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        confDB.initialize();
        console.log('Received Event: ' + id);
    }
};

var confDB = {
  initialize:function() {
    // comprobar si existe la base de datos
    var existDB;
    existDB = window.localStorage.getItem("exist_db");
    if (existDB == null) {
      // pregunta al usuario
      navigator.notification.confirm (
        "La BBDD no existe",
        this.onConfirm,
        "Data Base"
        ["Crear", "Salir"]
      );
    }
  }

  onConfirm:function(buttonIndex) {
    if (buttonIndex == 1) {
      window.localStorage.setItem("existe_db", 1);
    }
  }

};

app.initialize();
