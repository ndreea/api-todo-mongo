
import dotenv from "dotenv";
dotenv.config(); //lee el fichero .env y crea las variables de entorno

import express from "express";
import cors from "cors";
import { leerTareas,crearTareas,borrarTarea,editarTarea,editarEstado } from "./db.js"; //Importamos las funciones de la base de datos

const servidor = express();

servidor.use(cors());
servidor.use(express.json());

//Asociamos el index.html para que aparezca una vez que se carga la página
if(process.env.PRUEBAS){
    servidor.use(express.static("./pruebas")); //Middleware
}


/*---------------------------*/


servidor.get("/tareas", async (peticion,respuesta) => {

    try{    
        let tareas = await leerTareas();

        respuesta.json(tareas);
    }
    catch(error){
        respuesta.status(500);

        respuesta.json({ error : "error en el servidor" });
    }

});


//Crear tareas
servidor.post("/tareas/nueva", async (peticion,respuesta,siguiente) => {
    let {tarea} = peticion.body;

    if(!tarea || tarea.trim() == ""){
        return siguiente(true);
    }

    try{

        let id = await crearTareas(tarea);

        respuesta.json({id});
    }
    catch(error){
        respuesta.status(500);

        respuesta.json({ error : "error en el servidor" });
    }

});


//Borrar tareas
servidor.delete("/tareas/borrar/:id([0-9a-f]{24})", async (peticion,respuesta) => {
    try{
        let {id} = peticion.params;

        let cantidad = await borrarTarea(id);

        respuesta.json({ resultado : cantidad ? "ok" : "ko" });
    }
    catch(error){
        respuesta.status(500);

        respuesta.json({ error : "error en el servidor" });
    }

});


//Actualizar el texto de la tarea (tenemos que validarla a través de JSON, index.html)
servidor.put("/tareas/actualizar/:id([0-9a-f]{24})/1", async (peticion,respuesta,siguiente) => {

    let {id} = peticion.params; //Estraemos el id

    let {tarea} = peticion.body; //Estraemos la tarea

    if(!tarea || tarea.trim() == ""){
        return siguiente(true);
    }

    try{

        let cantidad = await editarTarea(id,tarea);

        respuesta.json({ resultado : cantidad ? "ok" : "ko" });
    }
    catch(error){
        respuesta.status(500);

        respuesta.json({ error : "error en el servidor" });
    }
});



//Editar el estado de la tarea
servidor.put("/tareas/actualizar/:id([0-9a-f]{24})/2", async (peticion,respuesta) => {

    let {id} = peticion.params; //Estraemos el id

    try{

        let cantidad = await editarEstado(id);

        respuesta.json({ resultado : cantidad ? "ok" : "ko" });
    }
    catch(error){
        respuesta.status(500);

        respuesta.json({ error : "error en el servidor" });
    }
});



//Middleware de gestión de errores, solo se usa para la petición errónea (400)
servidor.use((error,peticion,respuesta,siguiente) => {
    respuesta.status(400);
    respuesta.json({ error : "error en la petición" });
});

//Middleware de opción por defecto (404) - si se pone una url que no existe, sale un error
servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({ error : "página no encontrada" });
});

servidor.listen(process.env.PORT); //Puerto 4000 del .env