const {ApolloServer, gql} = require('apollo-server');
const fs = require('fs');
const { url } = require('inspector');

const schema = fs.readFileSync("./schema.graphql", "utf-8");

const autores = [
  { id: "1", nombre: "Douglas Adams", nacionalidad: "British" },
  { id: "2", nombre: "George Orwell", nacionalidad: "British" },
  { id: "3", nombre: "Boris Natanovich Strugatski", nacionalidad: "Russian" },
  { id: "4", nombre: "Arkadi Strugatski", nacionalidad: "Russian" },
  { id: "5", nombre: "H.G Wells", nacionalidad: "British" }
];

const libros = [
    { id: "1", titulo: "1984", autor: autores[1], isbn: "1920ABC", publicacion: "1928"},
    { id: "2", titulo: "La Máquina del Tiempo", autor: autores[4], isbn: "1920ABD", publicacion: "1887"},
    { id: "3", titulo: "Picnic Extraterrestre", autor: autores[3], isbn: "1920ACD", publicacion: "1976"},
    { id: "4", titulo: "La Guerra de los Mundos", autor: autores[4], isbn: "192CDF0", publicacion: "1883"},
];

const prestamos = [
    { id: "1", libro: libros[1], usuario: "20400824", fechaPrestamo: "2022-03-01", fechaDevolucion: "2022-04-12"},
    { id: "2", libro: libros[2], usuario: "20400724", fechaPrestamo: "2024-03-01", fechaDevolucion: "2024-04-12"}
];

const resolvers = {
    Query: {
        allLibros: () => {
            return libros;
        },
        getLibro: (_, { id }) => {
            console.log(id);
            const libro = libros.find((element) => element.id === id);
            return libro;
        },
        allAutores: () => {
            return autores;
        },
        allPrestamos: () => {
            return prestamos; 
        }
    },
    Mutation: {
        createLibro: (parent, {titulo, autor, isbn, publicacion}) => {
            const newLibro = {
                id: libros.length + 1,
                titulo: titulo,
                autor: autor,
                isbn: isbn,
                publicacion: publicacion
            };
            libros.push(newLibro);
            return newLibro;
        },
        createAutor: (parent, {nombre, nacionalidad}) => {
            const newAutor = {
                id: autores.length + 1,
                nombre: nombre,
                nacionalidad: nacionalidad
            };
            autores.push(newAutor);
            return newAutor;
        },
        createPrestamo: (parent, {libro, usuario, fechaPrestamo, fechaDevolucion}) => {
            const newPrestamo = {
                id: prestamos.length + 1,
                libro: libro,
                usuario: usuario,
                fechaPrestamo: fechaPrestamo,
                fechaDevolucion: fechaDevolucion
            };
            prestamos.push(newPrestamo);
            return newPrestamo;
        },
        // Mutaciones para eliminar
        removeLibro: (parent, { id }) => {
            const libroIndex = libros.findIndex(libro => libro.id === id);
            if (libroIndex === -1) {
              throw new Error('El libro no se encontró');
            }
            const libroEliminado = libros.splice(libroIndex, 1)[0];
            return libroEliminado;
        },
        removeAutor: (parent, { id }) => {
            const autorIndex = autores.findIndex(autor => autor.id === id);
            if (autorIndex === -1) {
              throw new Error('El autor no se encontró');
            }
            const autorEliminado = autores.splice(autorIndex, 1)[0];
            return autorEliminado;
        },
        removePrestamo: (parent, { id }) => {
            const prestamoIndex = prestamos.findIndex(prestamo => prestamo.id === id);
            if (prestamoIndex === -1) {
              throw new Error('El prestamo no se encontró');
            }
            const prestamoEliminado = prestamos.splice(prestamoIndex, 1)[0];
            return prestamoEliminado;
        },
        // Mutaciones para actualizar
        // Creo que hace faltan falta ciertas comprobaciones
        updateLibro: (parent, {id, titulo, autor, isbn, publicacion}) => {
            const libroIndex = libros.findIndex(libro => libro.id === id);

            if (libroIndex === -1) {
              throw new Error('El libro no se encontró');
            }

            if(autor === undefined){
                autor = libros[libroIndex].autor
            }
            
            const updatedLibro = {
                id: id,
                titulo: titulo,
                autor: autor,
                isbn: isbn,
                publicacion: publicacion
            };

            // Esta bien culero esto, perdon :c
            libros[libroIndex] = updatedLibro;
            
            return updatedLibro;
        },
        // Solo funciona este :c
        updateAutor: (parent, {id, nombre, nacionalidad}) => {
            const autorIndex = autores.findIndex(autor => autor.id === id);
            
            if (autorIndex === -1) {
              throw new Error('El autor no se encontró');
            }
            
            const updatedAutor = {
                id: id,
                nombre: nombre,
                nacionalidad: nacionalidad
            };
            
            autores[autorIndex] = updatedAutor;
            
            return updatedAutor;
        },
        // Lo mismo de updateLibro
        updatePrestamo: (parent, {id, libro, usuario, fechaPrestamo, fechaDevolucion}) => {
            const prestamoIndex = prestamos.findIndex(prestamo => prestamo.id === id);
            
            if (prestamoIndex === -1) {
              throw new Error('El prestamo no se encontró');
            }

            if(libro === undefined){
                libro = prestamos[prestamoIndex].libro
            }
            
            const updatedPrestamo = {
                id: id,
                libro: libro,
                usuario: usuario,
                fechaPrestamo: fechaPrestamo,
                fechaDevolucion: fechaDevolucion
            };
            
            prestamos[prestamoIndex] = updatedPrestamo
            
            return updatedPrestamo;
        },
    }
}

const server = new ApolloServer({
    typeDefs: gql(schema),
    resolvers
});

server.listen().then(({ url }) => {
    console.log(`Server running on: ${url}`);
})