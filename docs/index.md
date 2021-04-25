# __Desarrollo de Sistemas Informáticos__
## __Práctica 8 - Aplicación de Procesamiento de Notas de Texto__
## __Yago Pérez Molanes (alu0101254678@ull.edu.es)__
__*Contenidos del informe*__

__*Pasos realizados para el desarrollo de la práctica*__

* Algunas tareas a realizar previamente: 
  * Aceptar la tarea asignada a [GitHub Classroom](https://classroom.github.com/assignment-invitations/906f18610f5e4a289890edf2c0ceb0f4/status)
  * En esta práctica usaremos los módulos [**yargs**](https://www.npmjs.com/package/yargs) y [**chalk**](https://www.npmjs.com/package/chalk),así que
    se proporcionan enlaces acerca de su documentación.
  * Tendremos que familiarizarnos con la [**API síncrona de node.js del sistema de ficheros**](https://nodejs.org/dist/latest-v15.x/docs/api/fs.html#fs_synchronous_api).

## __Introducción y Objetivos__
En esta práctica deberemos de implementar una aplicación que trabajará sobre la línea de comandos, relacionada con el procesamiento de notas
de texto. En ella, un usuario concreto podrá crear, modificar, listar o borrar una nota determinada, y se guardará como un fichero con
extensión *.json* en el directorio del usuario habilitado para ello.

Comentaremos la solución propuesta para esta práctica, y además trataremos aspectos como las GitHub Actions.

## **Requisitos de la Aplicación de Procesamiento de Notas de Texto**

Estos son los requisitos que debe cumplir:

1.  La aplicación permitirá que varios usuarios interactúen con ella, pero no simultáneamente, de ahí que tengamos que usar la API síncrona.
  
2.  Una nota estará formada por un *título*, un *cuerpo*, y un *color* (rojo, verde, azul o amarillo).
   
3.  Cada usuario dispondrá de su propia lista de notas, con la que podrá llevar a cabo las siguientes acciones:
  * Añadir una nota a la lista, antes de añadirla, se debe comprobar si ya existe, en cuyo caso se debe mostrar un mensaje de error.
  * Modificar una nota, tenemos que comprobar si existe una nota con el título a modificar, si es así se procede a su modificación, y si no es
    el caso se deberá informar al usuario con un mensaje de error.
  * Eliminar una nota de la lista. Se deberá comprobar si la nota previamente existe para que pueda ser borrada.
  * Listar los títulos de las notas de la lista, según el color del atributo *color*, esto se hará con el paquete **chalk**.
  * Leer una nota concreta de la lista, se debe mostrar el título y el cuerpo de la nota, pero se debe verificar previamente que existe el título
    de la nota que se está buscando.
  * Los mensajes informativos se mostrarán en color verde, y los mensajes de eror en color rojo.
  * La lista de notas del usuario debe hacerse persistente. Aquí es donde debemos trabajar con la API síncrona de node.js para el sistema de ficheros.
    1.  Guardar una nota de la lista a un fichero con formato *json*. Los ficheros correspondientes a las notas del usuario deben alojarse en un
        directorio que tendrá como nombre el del propio usuario.
    2.  Cargar una nota desde los diferentes ficheros con formato *json* almacenados en el directorio del usuario correspondiente.
   
4.  El usuario solo podrá interactuar con la aplicación a través de la línea de comandos. Los diferentes comandos, opciones de los mismos, así 
    como manejadores asociados a cada uno de ellos deben gestionarse haciendo uso del paquete **yagrs**.

## **API síncrona de Node.js para trabajar con el sistema de ficehros**
Tendremos que instalar el paquete **@types/node** si queremos hacer uso de cualquiera de las APIs proporcionadas por *Node.js* para trabajar
con el sistema de ficheros, nosotros nos basaremos en la API síncrona:

```TypeScript
import * as fs from 'fs';
import path from 'path';
```

En nuestro caso también importamos la librería **path** puesto que las funciones que maneja la API síncrona por defecto no permiten manejar rutas
relativas, de ahí que usemos **path** para solucionar este problema.

## **El paquete chalk**
**Chalk** es un paquete que permite manipular la salida de los datos mostrados en la terminal cambiando los colores de estos, su documentación es
bastante sencilla, a continuación mostramos algunos ejemplos:

```Typescript
import * as chalk from 'chalk';

console.log(chalk.blue('This text is blue');
console.log(chalk.blue.inverse('This text is over a blue background'));
```

Y aquí un ejemplo de como cambian los colores:
```markdown
[~/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101254678(master)]$node ./dist/index.js list --user="yago"
Estas son tus notas, yago: 
nota
[~/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101254678(master)]$
```

## **El paquete yargs**

**Yargs** es un paquete que permite manejar los argumentos pasados por la interfaz de línea de comandos de una manera sencilla, su implementación
se basa en saber que argumentos son los requeridos, los posibles valores que puedan tener, y un manejador que es el que procesa la lógica asociada
al propio comando.

Tendremos que instalar el paquete **yargs**, así como el paquete **@types/yargs** para poder usarlo con TypeScript.

```TypeScript
import * as yargs from 'yargs';
```

A continuación, mostramos un ejemplo de uso, de la propia solución implementada para esta práctica:

```TypeScript
yargs.command({
  command: 'list',
  describe: 'Lista las notas del usuario',
  builder: {
    user: {
      describe: 'Usuario',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      // console.log(argv.user);
      const objetoNotas: Notes = new Notes(argv.user);
      objetoNotas.readNotes();
    }
  },
});
```
Como vemos, estamos manejando en este caso un comando *list*, uno de los que necesitamos en esta práctica, la sección *describe* simplemente
es informativa, mientras que *builder* maneja las distitnas opciones, para este comando solo necesitamos una opción, que es obligatoria, como se indica
en *demandOption*, *user*, que indica el usuario para el cual queremos listar las notas.

Por último, tenemos una función *handler*, que es la que se encarga de manejar la lógica de los comandos, para todos los comandos que usamos en esta práctica
se crea un objeto *objetoNotas*, que tiene un único atributo, que es el usuario, y se llama a un método determinado, lo comentaremos a continuación.

Los comandos que disponemos en esta práctica son los siguientes:
1.  **add**, añade una nota, tiene como opciones, *user*, *title*, *body* y *color*.
2.  **read**, lee una nota determinada en función del título, tiene como opciones, *user* y *title*.
3.  **mod**, modifica una nota dado un título de la misma, tiene como opciones *user*, *title*, *body* y *color*.
4.  **remove**, sirve para eliminar una nota, sus opciones son *user* y *title*.
5.  **list**, lista las notas de un usuario en concreto, solo se necesita como opción *user*.

No olvidemos que para que la ejecución de los comandos funcione adecuadamente se debe emplear la siguiente sentencia

```TypeScript
yargs.parse();
```

que analiza los comandos pasados por la línea de comandos.

## **La clase notes**
Nuestra aplicación se divide en dos partes, una que analiza los comandos recividos en la terminal, *index.ts*, y otra que parte que representa
a una clase que maneja los ficheros y el control de usuarios, *notes.ts*, la primera se comunica con la segunda para pasarle los distintos
argumentos que la clase necesita.

```Typescript
export class Notes {
  /**
   * El único atributo es 'user', y representa al
   * directorio del usuario
   */
  private user: string;

  /**
   * El constructor inicializa el atributo user
   * @param user
   */
  constructor(user: string) {
    this.user = user;
  }
```

Observamos que tenemos un atributo que es *user*, que representa al usuario que en este momento está solicitando alguna operación sobre sus notas.

Los métodos que maneja la clase son los siguientes:
```TypeScript
1.  getUser(); // sirve para acceder al atributo user
2.  addNote(titleAux: string, bodyAux: string, colorAux: string); //añade una nota que tiene un título, un cuerpo y un color
3.  modNote(tituloAux: string, cuerpoAux: string, colorAux:string = 'blue'); //modifica una nota según el título, el color es opcional
4.  readTitle(tituloListar: string); // lista una nota
5.  removeNote(tituloEliminar: string); //elimina una nota, comprobando el título
6.  readNotes(); //lista todas las notas del usuario
```

En todos los métodos se manejan los posibles errores que puedan suceder, como la apertura del directorio, o posiblemente que no haya encontrado
ninguna nota con el título que se le ha proporcionado.

Como la estructura es similar en los métodos, mostramos por ejemplo la función readNotes():

```TypeScript
  readNotes() {
    try {
      const filenames = fs.readdirSync(path.resolve(__dirname, `../users/${this.user}`));

      if (filenames.length === 0) {
        throw new Error(`No se ha encotrado ninguna nota en el directorio ${this.user}`);
      }

      console.log(chalk.green(`Estas son tus notas, ${this.user}: `));

      filenames.forEach((file) => {
        const rawdata = fs.readFileSync(path.resolve(__dirname, `../users/${this.user}/${file}`));
        const note = JSON.parse(rawdata.toString());
        const titulo: string = note.title;
        const color: string = note.color;

        console.log(chalk.keyword(color).bold(titulo));
      });
    } catch (error) {
      console.error(chalk.red('Ha ocurrido un error inseperado: ', error.message));
    }
  }
```

Toda la función se fundamenta en un bloque *try*, *catch*, ya que, recordamos que estamos realizando operaciones sensibles que 
pdorían perjudicar al programa, como la lectura de un directorio, en el cual comprobamos si existe para el usuario.

En el caso de que no sea así se lanza una excepción, posteriormente se recorre el directorio en busca de las notas, haciendo uso de la
llamada a una de las funciones de la API de ficheros:

```TypeScript
const rawdata = fs.readFileSync(path.resolve(__dirname, `../users/${this.user}/${file}`));
```

Aquí es donde entran en juego las rutas relativas, de ahí que usemos *path.resolve()* para el directorio.

Por ejemplo para la escritura de un archivo, para la que se hace en el caso de *addNote()* o *modNote()* la función que usamos es algo
como la siguiente:

```TypeScript
const rawdata = fs.readFileSync(path.resolve(__dirname, `../users/${this.user}/${file}`));
```

Cabe destacar que como estamos trabajando con objetos en formato *json*, es necesario utilizar las funciones *JSON.parse()* y *JSON.stringify()*
para que realicen las conversiones de datos.

Por último, hemos de destacar que en la función *modNote()* lo que realmente se realiza es un borrado previo de la nota que tiene el mismo título, 
y después se crea una nota con el cuerpo y el color que se han pasado como parámetros al propio método, para eliminar un fichero se usa la 
función *unlinkSync()* de la API de nodejs.

```TypeScript
fs.unlinkSync(path.resolve(__dirname, `../users/${this.user}/${file}`));
```

## **Ejemplos de uso de la aplicación**
A continuación mostramos algunos ejemplos de uso de la aplicación puesta a punto con los distintos comandos:
![comando_add](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101254678/blob/master/img/pr8/comando_add.png?raw=true)
![comando_mod](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101254678/blob/master/img/pr8/comando_mod.png?raw=true)
![comando_remove](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101254678/blob/master/img/pr8/comando_remove.png?raw=true)
![comando_list](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101254678/blob/master/img/pr8/comando_list.png?raw=true)

## **GitHub Actions**
Como apunte nuevo relacionado con esta práctica, se ha hecho uso de las GitHubActions, que no son más que, como su nombre indica, acciones que sirven
para automatizar tareas, como en nuestro caso, que hemos creado 3, una para los test, de integración con las distintos entornos de ejecución de node.js, 
otro para las estadísticas de cubrimiento de coveralls, que envía su información de cubrimiento de código, y por último, SonarCloud, que sirve como 
herramienta adicional relacionada con la calidad del código.

En esta práctia no lo mencionamos, pero no debemos olvidar la importancia de realizar los test, que en nuestro caso se encuentran en el repositorio.

Vamos a mostrar un ejemplo de configuración de una de las GitHub Actions usadas para la práctica:

```yml
name: Tests

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [10.x, 12.x, 14.x, 15.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v2
      with:
        node-version: ${{ matrix.node-version }}
    - run: npm install
    - run: npm test
```

Concretamente esta es la que se usa para los test, básicamente se trata de un flujo de trabajo que se va a ejecutar cada vez que se haga un *push* al
repositorio o un *pull request*, tiene un nombre, una sección para saber cuándo se tiene que ejecutar o disparar, y una sección jobs, que contiene los pasos
a seguir, dentro del mismo, diferenciamos entre comandos propios nuestros, *run*, y acciones predefinidas por la comunidad, *uses*.

A continuación, acompañamos una imagen sobre el reporte y la información que nos genera Coveralls, recordamos que se trata de la herramienta que nos dice
cuánto código hemos cubierto con nuestros test.

![captura_Coveralls](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101254678/blob/master/img/pr8/captura_Coveralls.png?raw=true)

Y por otro lado, encontramos la información relativa a SonarCloud, en concreto destacamos un error que no hemos podido solucionar, y es que según
SonarCloud el porcentaje de *Coverage* es 0, aunque esto no es así según Coveralls.

![captura_Sonar_Cloud](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101254678/blob/master/img/pr8/captura_SonarCloud.png?raw=true)

## **Conclusiones**
La realización de la práctica nos ha servido para introducirnos en el mundo de las APIS, en concreto hemos trabajado sobre el sistema de ficheros en
TypeScript, más concretamente de forma síncrona, y nos hemos ayudado de varios paquetes, teniendo como resultado la aplicación.
Posteriormente, hemos llevado un buen uso de buenas prácticas, al haber empleado la documentación de TypeDoc, las pruebas con mocha y chai, el cubrimiento
con instabull y coveralls, y por último hemos introducido en esta práctica por primera vez las GitHub Actions.

El resultado puede verse reflejado plenamente en el [repositorio](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101254678.git), hemos incluido algunos badgets representativos que dan veracidad a lo expuesto
anteriormente.

## **Bibliografía**
1.  Vídeo de ejemplo de integración continua de código fuente TypeScritp ejecutado en Node.js a través de una [GitHub action](https://drive.google.com/file/d/1hwtPovQlGvthaE7e7yYshC4v8rOtLSw0/view)
2.  Vídeo de ejemplo de configuración de workflow de GitHub Actions para enviar información de cubrimiento a [Coveralls](https://drive.google.com/file/d/1yOonmpVbOyvzx3ZbXMQTAPxvA3a7AE7w/view)
3.  Vídeo de ejemplo de configuración de workflow de GitHub Actions para comprobar la calidad y seguridad del código fuente mediante [SonarCloud](https://drive.google.com/file/d/1FLPargdPBX6JaJ_85jNsRzxe34sMi-Z3/view)
4.  API síncrona de NODE.js para trabajar sobre el [sistema de ficheros](https://nodejs.org/dist/latest-v15.x/docs/api/fs.html#fs_synchronous_api)
5.  Documentación de [yargs](https://www.npmjs.com/package/yargs) y [chalk](https://www.npmjs.com/package/chalk).

