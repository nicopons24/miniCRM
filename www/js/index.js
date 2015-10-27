function clickEditPersona() {
  location.href="./nuevaPersona.html";
};
function clickNewPersona() {
  location.href="./nuevaPersona.html";
};
// inicializacion de la app
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
      // añadir los eventos a los iconos flotantes
        document.getElementById("buttonAdd").addEventListener("click", clickNewPersona, false);
        document.getElementById("buttonEdit").addEventListener("click", clickEditPersona, false);

      //  confDB.initialize(); // comprobacion DDBB

        console.log('Received Event: ' + id);
    }
};
// carga BBDD para hacer consultas
var loadDB = {
  db:"",
  initialize:function() {
      // conector BBDD
      this.db = window.openDatabase("crmDB", "1.0", "miniCRM Database", 2*(1024*1024));
      this.loadDatabase();
  },

  loadDatabase:function() {
    this.db.transaction(this.dbLoad, this.dbLoadError);
  },

  dbLoad:function(tx) {
    var sql = "SELECT * FROM persona;";
    tx.executeSql(sql,[],
        function(tx,result) {
          console.log("consulta exitosa!");
          var rows = result.rows.length;
          if (rows > 0) {
            for (var i = 0; i < rows; i++) {
              var persona = result.rows.item(i)
              $("#lista_personas ul").append(
                "<li><a href='./persona.html'><img src='./img/user.png' class='iconoLista'/>"+
                "<div><h2>"+persona.nombre+"</h2><p>"+persona.rol+"</p></div></a></li>"
              ).listview("refresh");

              console.console.log(+i+". "+persona.nombre+" cargada");
            }
          }
        },
        function(tx,e) { console.log("error en la consulta n: "+e.code); }
    );
  },

  dbLoadError:function(e) {
    console.log("Error al cargar la BBDD: "+e.code);
  }
};
//control de creacion de la bbdd
var confDB = {
  db:"",
  initialize:function() {
    // comprobar si existe la base de datos
    var existDB;
    existDB = window.localStorage.getItem("exist_db");
    this.db = window.openDatabase("crmDB", "1.0", "miniCRM Database", 2*(1024*1024));
    if (existDB==null || existDB==false) {
      console.log("No existe la BBDD");
      this.createDB();
    }
    else {
      console.log("La BBDD ya existe");
      loadDB.initialize();
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
    "varios BOOLEAN NOT NULL,"+
    "CONSTRAINT fk_persona_juegos "+
    "FOREIGN KEY (idjuegos) "+
    "REFERENCES persona(idpersona) "+
    "ON DELETE NO ACTION "+
    "ON UPDATE NO ACTION)"+
    ");";
    var persona = "CREATE TABLE IF NOT EXISTS persona ("+
    "idpersona INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "+
    "nombre VARCHAR(32) NOT NULL, "+
    "apellidos VARCHAR(128) NOT NULL, "+
    "edad INTEGER NOT NULL, "+
    "rol VARCHAR(64) NOT NULL, "+
    "email VARCHAR(64) NOT NULL"+
    ");";
    tx.executeSql(persona);
    tx.executeSql(juego);
  },

  dbError:function(e) {
    console.log("Error al crear BBDD: "+ e.code);
    window.localStorage.setItem("exist_db", false);
  },

  dbOk:function() {
    console.log("BBDD creada correctamente!");
    window.localStorage.setItem("exist_db", true);
  }
};

app.initialize();
