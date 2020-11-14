import React, { useContext } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Button,
  Card,
  Form,
  Grid,
  Image,
  Transition,
} from "semantic-ui-react";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import moment from "moment";
import { AuthContext } from "../context/auth";
import { FETCH_POST_QUERY, CREATE_COMMENT } from "../util/graphql";
import { useForm } from "../hooks/useForm";
import CommentButton from "./CommentButton";

export default function SinglePost(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  //console.log(postId);
  const { values, onChange, onSubmit } = useForm(postCommentCallback, {
    body: "",
  });
  const { data, loading, error } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const [createComment] = useMutation(CREATE_COMMENT, {
    update() {
      values.body = "";
    },
    variables: {
      postId,
      body: values.body,
    },
  });

  function postCommentCallback() {
    createComment();
  }

  if (loading) return "data not fetched yet";
  if (error) return `Error! ${error.message}`;

  let postMarkup;
  if (!data.getPost) {
    //TODO:put spinner
    postMarkup = loading;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = data.getPost;

    function deletePostCallback() {
      props.history.push("/");
    }

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                <CommentButton post={{ id, commentCount }} />
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <Form onSubmit={onSubmit} noValidate>
                    <Form.Input
                      placeholder="post comment.."
                      name="body"
                      value={values.body}
                      onChange={onChange}
                      //error={errors.username}
                    />
                    <Button floated="right" onSubmit={onSubmit}>Submit</Button>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Transition.Group duration={200} key={comment.id}>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>{comment.username}</Card.Header>
                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                    <Card.Description>{comment.body}</Card.Description>
                    {user && user.username === comment.username && (
                      <DeleteButton postId={id} commentId={comment.id} />
                    )}
                  </Card.Content>
                </Card>
              </Transition.Group>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
}
