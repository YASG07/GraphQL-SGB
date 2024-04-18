import React from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

/*
    1. Creamos el cliente de Apollo que será usado por el Proveedor
    1.1 Le suministramos el endpoint al cual queremos conectarnos
    1.2 Le pasamos un módulo que se encargue de manejar la caché
   */
const client = new ApolloClient({
  uri: "http://localhost:3001",
  cache: new InMemoryCache(),
});

/*
    2. Usamos ApolloProvider que crear un contexto del cliente de Apollo
    2.1 ApolloProvider requiere el cliente que creamos previamente
    2.2 Todos los elementos/componentes hijos de ApolloProvider
    podrán hacer uso del cliente de Apollo
  */

function App() {
  return (
    <ApolloProvider client={client}>
      <h1>¡Hola Escuela Frontend!</h1>
    </ApolloProvider>
  );
}