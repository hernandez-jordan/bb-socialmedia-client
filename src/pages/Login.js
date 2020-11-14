import React, { useContext, useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useForm } from "../hooks/useForm";
import { AuthContext } from "../context/auth";

import { Form, Button, Message } from "semantic-ui-react";

export default function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const { values, onChange, onSubmit } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(proxy, { data: { login: userData } }) {
      //console.log(userData);
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      //console.log(err.graphQLErrors[0].extensions.exception.errors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }

  const styles = {
    container: {
      width: 400,
      margin: "auto",
    },
  };

  return (
    <div style={styles.container}>
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <Form.Input
          label="Username"
          placeholder="Username.."
          type="text"
          name="username"
          value={values.username}
          onChange={onChange}
          error={errors.username}
        />
        <Form.Input
          label="Password"
          placeholder="Password.."
          type="password"
          name="password"
          value={values.password}
          onChange={onChange}
          error={errors.password}
        />
        <Button onSubmit={onSubmit}>Login</Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <Message
          error
          header="There was some errors with your submission"
          list={Object.values(errors).map((value) => value)}
        />
      )}
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;
