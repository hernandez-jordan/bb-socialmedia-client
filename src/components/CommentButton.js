import React from 'react'
import {Button, Icon, Label, Popup} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
export default function CommentButton({user, post:{commentCount, id}}) {

  return (
    <Popup
          content="Comment on post"
          inverted
          trigger={
            <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
              <Button icon>
                <Icon name="comments" />
              </Button>
              <Label basic pointing="left">
                {commentCount}
              </Label>
            </Button>
          }
        />
  )
}
