function clickNewPersona() {
  alert("Pulsado el boton");
};
var confDB = {
  db:"",
  initialize:function() {
    // comprobar si existe la base de datos
    var existDB;
    existDB = window.localStorage.getItem("exist_db");
    this.db = window.openDatabase("crmDB", "1.0", "miniCRM Database", 2*(1024*1024));
    if (existDB==null) {
      console.log("No existe la BBDD");
      this.createDB();
    }
  },

  createDB:function() {
    console.log("Creando la BBDD...");
    this.db.transaction(this.dbCreate, this.dbError, this.dbOk);
  },

  dbCreate:function(tx) {
    var juego = "CREATE TABLE IF NOT EXISTS juegos ("+
    "idjuegos INT NOT NULL,"+
    "accion BOOLEAN NOT NULL,"+
    "arcade BOOLEAN NOT NULL,"+
    "aventuras BOOLEAN NOT NULL,"+
    "carreras BOOLEAN NOT NULL,"+
    "casual BOOLEAN NOT NULL,"+
    "estrategia BOOLEAN NOT NULL,"+
    "deportes BOOLEAN NOT NULL,"+
    "puzzles BOOLEAN NOT NULL,"+
    "rol BOOLEAN NOT NULL,"+
    "varios BOOLEAN NOT NULL"+
    ");";
    var persona = "CREATE TABLE IF NOT EXISTS persona ("+
    "idpersona INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "+
    "nombre VARCHAR(32) NOT NULL, "+
    "apellidos VARCHAR(128) NOT NULL, "+
    "edad INTEGER NOT NULL, "+
    "rol VARCHAR(64) NOT NULL, "+
    "email VARCHAR(64) NOT NULL,"+
    "CONSTRAINT fk_persona_juegos "+
    "FOREIGN KEY (idpersona) "+
    "REFERENCES juegos(idjuegos) "+
    "ON DELETE NO ACTION "+
    "ON UPDATE NO ACTION)"
    ");";
    console.log(juego);
    tx.executeSql(juego);
    console.log(persona);
    tx.executeSql(persona);
  },

  dbError:function(e) {
    console.log("Error al crear BBDD: "+ e.code);
  },

  dbOk:function() {
    console.log("BBDD creada correctamente!");
    window.localStorage.setItem("exist_db", true);
  }
};

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
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        confDB.initialize();
    }
};


app.initialize();
