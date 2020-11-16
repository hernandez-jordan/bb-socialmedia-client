import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import App from "./App";


const link = createHttpLink({ 
  uri: "https://glacial-shore-48971.herokuapp.com/" 
});

const authHeader = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authHeader.concat(link),
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
