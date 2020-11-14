import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_COMMENT, DELETE_POST } from "../util/graphql";

import { Button, Confirm, Icon, Popup } from "semantic-ui-react";

export default function DeleteButton({ postId, commentId, callback }) {
  const [confirm, setConfirm] = useState(false);
  //console.log({ postId, commentId, callback });
  const mutation = commentId ? DELETE_COMMENT : DELETE_POST;
  const [deletePostOrComment] = useMutation(mutation, {
    update(cache) {
      //console.log(cache);
      setConfirm(false);

      if (!commentId) {
        cache.modify({
          fields: {
            getPosts: (existingFieldData, { readField }) => {
              return existingFieldData.filter(
                (fieldData) => postId !== readField("id", fieldData)
              );
            },
          },
        });
      }
      if (callback) callback();
    },
    variables: {
      postId,
      commentId,
    },
  });

  return (
    <>
      <Popup
        inverted
        content={commentId ? "Delete comment": "Delete post"}
        trigger={
          <Button as="div" onClick={() => setConfirm(true)} floated="right">
            <Icon name="trash" style={{ margin: "auto" }} />
          </Button>
        }
      />
      <Confirm
        open={confirm}
        onCancel={() => setConfirm(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  );
}
