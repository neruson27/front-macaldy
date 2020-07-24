import { ApolloClient } from "apollo-client";
import { ApolloLink, split } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { onError } from "apollo-link-error";

// subscriptions
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

import { isAuthenticated } from "@/utils/auth";

import router from "@/router";

import config from "@/config";

const isDev = process.env.NODE_ENV !== "production";

const httpLinkWithUpload = createUploadLink({
  // You should use an absolute URL here
  // uri: config.graphql.url
  uri: config.graphql.url.http
});

// ------------------------------------------------------
// Create the subscription websocket link
const wsLink = new WebSocketLink({
  uri: config.graphql.url.ws,
  options: {
    reconnect: true
    // connectionParams () {
    //   // get the authentication token from local storage if it exists
    //   return {authorization: localStorage.getItem('token')}
    // }
  }
});

// middleware para gestionar los parametros en cada suscripcion
const subscriptionMiddleware = {
  applyMiddleware(options, next) {
    options.variables = {
      ...options.variables,
      authorization: localStorage.getItem("token")
    };
    next();
  }
};
// add the middleware to the web socket link via the Subscription Transport client
wsLink.subscriptionClient.use([subscriptionMiddleware]);
// -----------------------------------------------------------

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLinkWithUpload
);

const middleWareLink = new ApolloLink((operation, forward) => {
  // antes de toda consulta al server se valida si la sesion no ha expirado
  const token = localStorage.getItem("token");
  if (token && !isAuthenticated()) router.push({ path: "/login" });
  operation.setContext(context => ({
    ...context,
    headers: {
      ...context.headers,
      authorization: token || "" // la palabra Bearer sobra, no se hace nada con ella al desencriptar el token
    }
  }));
  return forward(operation);
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) => {
        if (isDev) {
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          );
        }
        if (
          message === "not-authorized-invalid-token" ||
          message === "not-authorized-token-expired" ||
          message === "not-authenticated"
        ) {
          isAuthenticated();
          router.push({ path: "/login" });
        }
        /* switch (message) {
        case 'UNAUTHENTICATED':
          // old token has expired throwing AuthenticationError,
          // one way to handle is to obtain a new token and
          // add it to the operation context
          const headers = operation.getContext().headers
          operation.setContext({
            headers: {
              ...headers,
              authorization: getNewToken(),
            },
          })
          // Now, pass the modified operation to the next link
          // in the chain. This effectively intercepts the old
          // failed request, and retries it with a new token
          return forward(operation)
        // handle other errors
        case 'ANOTHER_ERROR_CODE':
          console.log('otro error')
        } */
      });
    }
  }
);

const apolloClient = new ApolloClient({
  // link: authLink.concat(httpLink),
  // link: authLink.concat(httpLinkWithUpload),
  // link: ApolloLink.from([middleWareLink, errorLink, httpLinkWithUpload]),
  link: ApolloLink.from([middleWareLink, errorLink, link]),
  cache: new InMemoryCache({
    addTypename: false // agregar campo __typename a los documentos
  }),
  connectToDevTools: isDev
});

export default apolloClient;
