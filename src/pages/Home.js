import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { FETCH_POSTS_QUERY } from "../util/graphql";

import { AuthContext } from "../context/auth";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";

import { Grid, Transition } from "semantic-ui-react";

export default function Home() {
  const { user } = useContext(AuthContext);
  const { loading, error, data } = useQuery(FETCH_POSTS_QUERY);
  if (loading) return "data not fetched yet";
  if (error) return `Error! ${error.message}`;

  const styles = {
    column: {
      textAlign: "center",
    },
  };

  return (
    <Grid columns={3}>
      <Grid.Row>
        <Grid.Column style={styles.column}>
          {user && <PostForm user={user} />}
        </Grid.Column>
        <Grid.Column>
          <Transition.Group duration={200}>
            {data &&
              data.getPosts.map((post) => (
                <Grid.Row key={post.id}>
                  <PostCard post={post} />
                </Grid.Row>
              ))}
          </Transition.Group>
        </Grid.Column>
        <Grid.Column style={styles.column}>
          {user && <h1>Recent Activity</h1>}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
