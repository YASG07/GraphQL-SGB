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
    { id:"1", titulo: "1984", autor: autores[1].nombre, isbn: "1920ABC", publicacion: "1928"},
    { id:"2", titulo: "La Máquina del Tiempo", autor: autores[4].nombre, isbn: "1920ABD", publicacion: "1887"},
    { id:"3", titulo: "Picnic Extraterrestre", autor: autores[3].nombre, isbn: "1920ACD", publicacion: "1976"},
    { id:"4", titulo: "La Guerra de los Mundos", autor: autores[4].nombre, isbn: "192CDF0", publicacion: "1883"},
];

const prestamos = [
    { id: "1", libro: libros[1].titulo, usuario: "20400824", fechaPrestamo: "2022-03-01", fechaDevolucion: "2022-04-12"},
    { id: "2", libro: libros[2].titulo, usuario: "20400724", fechaPrestamo: "2024-03-01", fechaDevolucion: "2024-04-12"}
];

const resolvers = {
    Query: {
        allLibros: () => libros,
        getLibro: (id) => libros[id],
        allAutores: () => autores,
        allPrestamos: () => prestamos 
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
        }
    }
}

const server = new ApolloServer({
    typeDefs: gql(schema),
    resolvers
});

server.listen().then(({ url }) => {
    console.log(`Server running on: ${url}`);
})