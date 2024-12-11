
import dotenv from "dotenv";
dotenv.config();

import { MongoClient, ObjectId }  from "mongodb";


/*----------------------------------*/


//Conectamos con la base de datos de Mongo a través del fichero .env
function conectar(){
    return MongoClient.connect(process.env.MONGO_URL);
}


//Leemos las tareas
export function leerTareas(){
    return new Promise(async (ok,ko) => {

        //Modificamos la variable conexión para que esté disponible en todo el scope y le damos el valor para que corte la navegación
        let conexion = null; 
    
        try{

            conexion = await conectar();
    
            let coleccion = conexion.db("tareas").collection("tareas"); //Pasamos la función tareas que hay que crearTarea

            let tareas = await coleccion.find({}).toArray();

            //Creamos un nuevo objeto para cambiar el _id por id
            tareas = tareas.map(({_id,tarea,estado}) => {
                return {id : _id, tarea, estado}
            });
    
            ok(tareas); //Retorna los id que se hayan creado
    
        }
        catch(error){
    
            ko({ error : "error en la base de datos" });
    
        } finally{
            conexion.close(); //Cerramos la conexión, esta vez con .close() porque estamos en Mongo
        }   
    });
}

/*
leerTareas()
.then(x => console.log(x))
.catch(x => console.log(x))
*/



//Creamos las tareas
export function crearTareas(tarea){
    return new Promise(async (ok,ko) => {

        //Modificamos la variable conexión para que esté disponible en todo el scope y le damos el valor para que corte la navegación
        let conexion = null; 
    
        try{

            conexion = await conectar(); //Si la conexión falla, aterrizaremos en el error

            let coleccion = conexion.db("tareas").collection("tareas"); //Pasamos la función tareas que hay que crearTarea

            /*
            //Creamos una variable para el id para ver el estado de la tarea y hacemos una prueba en node db en la terminal
            let id = await coleccion.insertOne({ tarea, estado : false });
            */

            //Como nos retorna un objeto, tenemos que poner la variable entre {}
            let {insertedId} = await coleccion.insertOne({ tarea, estado : false }); 
    
            ok(insertedId); //Nos retorna un new ObjectId en la terminal
    
        }
        catch(error){
    
            ko({ error : "error en la base de datos" });
    
        } finally{
            conexion.close(); //Cerramos la conexión, esta vez con .close() porque estamos en Mongo
        }  
    });
}

/*
//Hacemos una prueba para comprobar que todo funciona bien el terminal
crearTareas("prueba")
.then(x => console.log(x))
.catch(x => console.log(x))
*/



//Creamos una función para borrar las tareas
export function borrarTarea(id){
    return new Promise(async (ok,ko) => {

        //Modificamos la variable conexión para que esté disponible en todo el scope y le damos el valor para que corte la navegación
        let conexion = null; 

        try{
            conexion = await conectar();
    
            let coleccion = conexion.db("tareas").collection("tareas"); //Pasamos la función tareas que hay que crearTarea

            /*
            //Le pasamos el _id ya que Mongo te lo retorna en la terminal del ObjectId
            let borrar = await coleccion.deleteOne({ _id : new ObjectId(id) }); 
            */

            //Como nos retorna un objeto, tenemos que poner la variable entre {}
            let {deletedCount} = await coleccion.deleteOne({ _id : new ObjectId(id) });
    
            ok(deletedCount); //Retorna los id que se hayan creado

        }catch(error){

            ko({error: "error en base de datos"});

        }finally{
            conexion.close(); //Cerramos la conexión de todo
        }
    });
}

/*
borrarTarea('675049662a8e70426bc305b1')
.then(x => console.log(x))
.catch(x => console.log(x))
*/


//Creamos una función para editar las tareas
export function editarTarea(id,texto){
    return new Promise(async (ok,ko) => {

        //Modificamos la variable conexión para que esté disponible en todo el scope y le damos el valor para que corte la navegación
        let conexion = null; 

        try{
            conexion = await conectar();
    
            let coleccion = conexion.db("tareas").collection("tareas"); //Pasamos la función tareas que hay que crearTarea

            /*
            //Ponemos el $set y le pasamos la tarea y el texto
            let editar = await coleccion.updateOne({ _id : new ObjectId(id) }, {$set : { tarea : texto } }); 
            */
            
            //Como nos retorna un objeto, tenemos que poner la variable entre {}, en este caso el que nos interesa es modifiedCount
            let {modifiedCount} = await coleccion.updateOne({ _id : new ObjectId(id) }, {$set : { tarea : texto } });
    
            ok(modifiedCount); 

        }catch(error){

            ko({error: "error en base de datos"});

        } finally{
            conexion.close(); //Cerramos la conexión de todo
        }
    });
}

/*
editarTarea('675049662a8e70426bc305b1', "editamos tarea")
.then(x => console.log(x))
.catch(x => console.log(x))
*/


//Creamos una función para editar el estado de las tareas (id)
export function editarEstado(id){
    return new Promise(async (ok,ko) => {

        //Modificamos la variable conexión para que esté disponible en todo el scope y le damos el valor para que corte la navegación
        let conexion = null; 

        try{
            conexion = await conectar();
    
            let coleccion = conexion.db("tareas").collection("tareas"); //Pasamos la función tareas que hay que crearTarea

            //Desustructuramos el estado dela tarea
            let {estado} = await coleccion.findOne({ _id : new ObjectId(id) })
            
            //En este caso, hacemos un toggle en el $set para averiguar el estado principal de la tarea
            let {modifiedCount} = await coleccion.updateOne({ _id : new ObjectId(id) }, { $set : { estado : !estado } });
    
            ok(modifiedCount);

        }catch(error){

            ko({error: "error en base de datos"});

        } finally{
            conexion.close(); //Cerramos la conexión de todo
        }
    });
}

/*
editarEstado('675048face29a047f16e0b8f')
.then(x => console.log(x))
.catch(x => console.log(x))
*/

