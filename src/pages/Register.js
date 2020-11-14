import React, {useContext, useState } from "react";
import { useMutation, gql } from "@apollo/client";

import {AuthContext} from '../context/auth'
import {useForm} from '../hooks/useForm'

import { Form, Button, Message, Icon } from "semantic-ui-react";

export default function Register(props) {
  const context = useContext(AuthContext)
  const [errors, setErrors] = useState({});
  const {values, onChange, onSubmit } = useForm(registerUser, {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(proxy, {data : {register: userData}}) {
      //console.log(result);
      context.login(userData)
      props.history.push('/')
    },
    onError(err) {
      //console.log(err.graphQLErrors[0].extensions.exception.errors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function registerUser(){
    addUser()
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
        <h1>Register</h1>
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
          label="Email"
          placeholder="Email.."
          type="text"
          name="email"
          value={values.email}
          onChange={onChange}
          error={errors.email}
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
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password.."
          type="password"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword}
        />
        <Button onSubmit={onSubmit}>Register</Button>
      </Form>
      <Message attached="bottom" warning style={{marginTop: 20}}>
        <Icon name="help" />
        Already signed up? <a href="/login" > Login here </a> instead.
      </Message>
      {Object.keys(errors).length > 0 && (
        <Message
          error
          header="There was some errors with your submission"
          list={Object.values(errors).map(value => value)
          }
        />
      )}
    </div>
  );
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;
