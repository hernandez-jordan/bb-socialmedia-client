import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";

import moment from "moment";
import LikeButton from "./LikeButton.js";
import { Card, Image } from "semantic-ui-react";
import DeleteButton from "./DeleteButton";
import CommentButton from "./CommentButton";

export default function PostCard({
  post: {
    id,
    createdAt,
    username,
    body,
    likes,
    likeCount,
    comments,
    commentCount,
  },
}) {
  const styles = {
    marginTop: 20,
  };

  const { user } = useContext(AuthContext);

  return (
    <Card fluid style={styles}>
      <Card.Content>
        <Image
          floated="left"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <CommentButton post={{ id, commentCount }} />
        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
}
