import React, { useState } from "react";
import { useMutation } from "@apollo/client";

import { useForm } from "../hooks/useForm";
import {CREATE_POST} from '../util/graphql'
import { Grid, Form, Button, Message } from "semantic-ui-react";

export default function UserComment({ user }) {
  const { onChange, onSubmit, values } = useForm(postCallback, {
    body: "",
  });

  const [visible, setVisible] = useState(true);

  function handleDismiss() {
    setVisible(!visible)
  }

  const [createPost, { error }] = useMutation(CREATE_POST, {
    variables: values,
    
    update(cache, { data }) {
      console.log(data);
      const cacheId = cache.identify(data.createPost);
      cache.modify({
        fields: {
          getPosts: (existingFieldData, { toReference }) => {
            return [toReference(cacheId), ...existingFieldData];
          },
        },
      });
      values.body = "";
    },
    onError(error) {
      console.log(error);
    },
  });

  function postCallback() {
    setVisible(!visible)
    createPost();
  }

  return (
    <Grid.Row>
      <h1>Write your post</h1>
      <Form onSubmit={onSubmit} noValidate>
        <Form.Field>
          <Form.Input
            placeholder="Hi world"
            name="body"
            value={values.body}
            onChange={onChange}
            //error={error}
          />
          <Button type="submit" onSubmit={onSubmit}>
            Submit
          </Button>
        </Form.Field>
      </Form>
      
      {error && (
        visible &&
        <Message
          onDismiss={handleDismiss}
          error
          header="Error"
          list={[error.graphQLErrors[0].message]}
        />
      )}
    </Grid.Row>
  );
}


