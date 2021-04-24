import {Notes} from './notes';
import * as yargs from 'yargs'; // yargs es una librería que permite
// trabajar con argumentos del programa

/**
 * Comando que sirve para añadir una nota,
 * tiene como parámetros el usuario, el título,
 * el cuerpo de la nota y el color
 */
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: 'Usuario',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Título de la nota',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Cuerpo de la nota',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color que se aplica',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.body === 'string' &&
    typeof argv.color === 'string') {
      const objetoNotas: Notes = new Notes(argv.user);
      objetoNotas.addNote(argv.title, argv.body, argv.color);
    }
  },
});

/**
 * Comando que sirve para leer una nota en
 * función del título, tiene como parámetros
 * el usuario, y el título para la nota que se
 * quiere leer
 */
yargs.command({
  command: 'read',
  describe: 'Lee las notas del usuario según el nombre del título',
  builder: {
    user: {
      describe: 'Usuario',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Título a eliminar de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      const objetoNotas: Notes = new Notes(argv.user);
      objetoNotas.readTitle(argv.title);
    }
  },
});

/**
 * Comando que sirve para eliminar una nota, según
 * el título de la nota, tiene como parámetros el
 * usuario, y el título de la nota que se desea eliminar
 */
yargs.command({
  command: 'remove',
  describe: 'Lista las notas del usuario',
  builder: {
    user: {
      describe: 'Usuario',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Título a eliminar de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      const objetoNotas: Notes = new Notes(argv.user);
      objetoNotas.removeNote(argv.title);
    }
  },
});

/**
 * Comando que sirve para listar las notas del usuario,
 * únicamente tiene como parámetro el usuario
 */
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

/**
 * Esta sentencia sirve para que el programa
 * analice los argumentos que se reciben desde la
 * líne de comandos
 */
yargs.parse();
