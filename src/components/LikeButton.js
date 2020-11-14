import React, { useState, useEffect } from "react";
//import { useMutation } from '@apollo/client';
import { useMutation } from "@apollo/client";
import { LIKE_POST } from "../util/graphql";

import { Button, Icon, Label, Popup } from "semantic-ui-react";

export default function LikeButton({ user, post: { id, likes, likeCount } }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const likeButton = user ? (
    liked ? (
      <Button color="black">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button basic>
      <Icon name="heart" />
    </Button>
  );

  const [likePost] = useMutation(LIKE_POST, {
    variables: { postId: id },
  });

  const userGuest = () => {
    alert("login to like post");
  };

  return (
    <Popup
      content="Like this post"
      inverted
      trigger={
        <Button
          as="div"
          labelPosition="right"
          onClick={user ? likePost : userGuest}
        >
          {likeButton}
          <Label as="a" basic pointing="left">
            {likeCount}
          </Label>
        </Button>
      }
    />
  );
}
