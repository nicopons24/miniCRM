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
        document.getElementById("buttonAdd").addEventListener("click", clickNewPersona);

        createDB.initialize(); // comprobacion DDBB

        console.log('Received Event: ' + id);
    }
};
//control de creacion de la bbdd
var createDB = {
  db:"",
  initialize:function() {
    // comprobar si existe la base de datos
    var existDB;
    existDB = window.localStorage.getItem("exist_db");
    this.db = window.openDatabase("crmDB", "1.0", "miniCRM Database", 2*(1024*1024));
    if (existDB == null || existDB == false) {
      console.log("No existe la BBDD");
      this.createDB();
      useDB.initialize();
    }
    else {
      useDB.initialize();
    }
  },

  createDB:function() {
    this.db.transaction(this.dbCreate, this.dbError, this.dbOk);
  },

  dbCreate:function(tx) {
    var persona = "CREATE TABLE IF NOT EXISTS persona (idpersona INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, nombre VARCHAR(32) NOT NULL, apellidos VARCHAR(128) NOT NULL, edad INTEGER NOT NULL, "+
    "ciudad VARCHAR(64) NOT NULL, rol VARCHAR(64) NOT NULL, email VARCHAR(64) NOT NULL, telefono INTEGER NOT NULL, juegos VARCHAR(512));";
    tx.executeSql(persona);
    console.log("tabla persona creada");

    var insert = "INSERT INTO persona(nombre, apellidos, edad, ciudad, rol, email, telefono, juegos) VALUES('pepet', 'guapo', 16, 'Valencia', 'Estudiante', 'pepetelguapet@gmail.com', 684201897, 'accion, aventuras, deportes, rol')"
    tx.executeSql(insert);
    console.log("pepet insertado");
    window.localStorage.setItem("exist_db", true);
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
// recuperacion e insercion de datos
var useDB = {
  db:"",
  consultaId:"",
  initialize: function() {
    this.db = window.openDatabase("crmDB", "1.0", "miniCRM Database", 2*(1024*1024));
    this.db.transaction(this.rellenaLista, this.dbLoadError);
  },

  rellenaLista: function(tx) {
    var sql = "SELECT * FROM persona;";
    tx.executeSql(sql,[],
        function(tx,result) {
          console.log("consulta exitosa!");
          var rows = result.rows.length;
          console.log(rows);
          if (rows > 0) {
            console.log("leyendo consulta");
            for (var i = 0; i < rows; i++) {
              var persona = result.rows.item(i);
              $("#lista_personas ul").append(
                "<li data-id='"+persona.idpersona+"'><a href='#persona'><img src='./img/user.png' class='iconoLista'/>"+
                "<div><h2>"+persona.nombre+"</h2><p>"+persona.rol+"</p></div></a></li>"
              ).listview("refresh");
              console.log(+i+". "+persona.nombre+" cargada");
            }
          }
          $('#home li a').click(muestraPersona);
        },
        function(tx,e) { console.log("error en la consulta n: "+e.code); }
    );
  },

  consultaDatos: function(idpersona) {
    this.consultaId = idpersona;
    console.log("consultaId = "+this.consultaId);
    this.db.transaction(this.rellenaUsuario, this.dbLoadError);
  },

  rellenaUsuario: function(tx) {
    var sql = "SELECT * FROM persona WHERE idpersona = "+useDB.consultaId+";";
    tx.executeSql(sql, [],
      function(tx,result) {
        var rows = result.rows.length;
        console.log(rows);
          if (rows > 0) {
            console.log("leyendo consulta");
            var persona = result.rows.item(0);
            $("#datos").append("<h2>"+persona.nombre+" "+persona.apellidos+"</h2><p>"+persona.rol+"</p><p>"+
            persona.ciudad+"</p><p>"+persona.edad+" años </p>");
            $('#correo').append("<p>"+persona.email+"<p>");
            $('#telefono').append("<p>"+persona.telefono+"<p>");
            $('#juegos').append("<p>"+persona.juegos+"<p>");
          }
      },
      function(tx,e) { console.log("error en la consulta n: "+e.code); }
    );
  },

  dbLoadError:function(e) {
    console.log("Error al cargar la BBDD: "+e.code);
  }
};

function muestraPersona() {
  var id = $(this).parent().attr("data-id");
  useDB.consultaDatos(id);
};

function clickNewPersona() {
  location.href="#nuevo";
};

app.initialize();
