//Imports
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
//Styling Imports 
import { Paper, Box, Button, Container, ListItemAvatar, Avatar, Typography, Divider, ListItem, TextField, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Swal from 'sweetalert2';



function CommentItem({ comment, postId }) {
    const user = useSelector(store => store.user);
    const dispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams();
    const editComment = useSelector(store => store.editCommentReducer);
    console.log('USER:', user, 'POST ID:', id, 'COMMENT TO EDIT:', editComment);

    const [editMode, setEditMode] = useState(true);

    const handleSubmit = () => {
        console.log('save clicked');

        editComment.post_id = id;

        dispatch({
            type: 'PUT_COMMENT',
            payload: editComment
        })
        dispatch({ type: 'CLEAR_EDIT' });
        setEditMode(!editMode);
    }

    const handleChange = (event) => {
        dispatch({
            type: 'EDIT_COMMENT_ON_CHANGE',
            payload: {
                property: 'comment',
                value: event.target.value
            }
        })
    }

    const handleCommentEdit = () => {
        //switch to edit mode "form"
        console.log('clicked update profile');
        dispatch({
            type: 'SET_COMMENT_TO_EDIT',
            payload: comment
        })
        setEditMode(!editMode);
    }

    // Delete the post
    const deleteComment = () => {

        Swal.fire({
            title: `Are you sure you want to delete this comment?`,
            text: `This action cannot be undone.`,
            icon: 'warning',
            background: 'white',
            color: 'black',
            showCancelButton: true,
            confirmButtonColor: '#4E9BB9',
            cancelButtonColor: 'red',
            confirmButtonText: 'Delete'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch({ type: 'DELETE_COMMENT', payload: { id: comment.id, post_id: postId } })
                history.push(`/postDetail/${id}`)
                Swal.fire({
                    background: 'white',
                    color: 'black',
                    confirmButtonColor: '#4E9BB9',
                    title: 'Deleted!',
                    text: `Comment has been deleted.`,
                    icon: 'success'
                })
            }
        })
    }

    console.log('COMMENT:', comment.comment);

    return (
        <ListItem alignItems="flex-start">
            <Container>
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    spacing={2}
                >
                    <ListItemAvatar> {comment.profile_picture == '' ?
                        <Avatar alt="profile picture" src="https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg" /> :
                        <Avatar alt="profile picture" src={comment.profile_picture} />}
                    </ListItemAvatar>
                    </Stack>
                    {/* </Box> */}
                    <React.Fragment>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body1"
                            color="text.primary"
                        >
                            {comment.username}
                            {/* <br /> */}
                        </Typography>
                        <Box
                            sx={{
                                justifyContent: 'space-evenly',
                                display: 'flex-start'
                            }}
                        >

                            <Typography sx={{ display: 'flex-start', marginLeft: '75px', textAlign: 'left', marginBottom: '25px' }}>
                                <p>{comment.date} {comment.time}</p>

                                {editMode ?
                                    <p>"{comment.comment}"</p> :
                                    <Box component={Paper}
                                        sx={{
                                            border: '1px solid black',
                                            borderRadius: '7px',
                                            padding: '15px',
                                        }}>
                                        <Paper elevation={5}>
                                            <Container className="commentContainer">
                                                <Box>
                                                    <TextField
                                                        elevation={15}
                                                        fullWidth
                                                        className="textField"
                                                        id="outlined-multiline-flexible"
                                                        label="Edit Your Comment"
                                                        multiline
                                                        maxRows={20}
                                                        value={editComment.comment}
                                                        onChange={(event) => handleChange(event)} type="text" placeholder="Comments"
                                                    />
                                                </Box>
                                            </Container>
                                        </Paper>
                                        <Button onClick={handleSubmit}
                                            sx={{
                                                backgroundColor: '#4E9BB9',
                                                margin: '2px',
                                            }}
                                            variant="contained"
                                            className='buttons'
                                        ><SendIcon /> Submit </Button>
                                    </Box>}
                            </Typography>
                        </Box>
                        <Box className="btn-holder">
                            {user.id === comment.user_id ?
                                <Button
                                    sx={{
                                        backgroundColor: '#4E9BB9',
                                        margin: '2px',
                                        marginBottom: '5px',
                                    }}
                                    variant="contained"
                                    className='buttons'
                                    onClick={handleCommentEdit}
                                ><EditIcon /> Edit </Button> : <div></div>}
                            {user.id === comment.user_id &&
                                <Button
                                    variant="contained"
                                    className='buttons'
                                    onClick={deleteComment}
                                    sx={{
                                        backgroundColor: 'red',
                                        margin: '2px',
                                        marginBottom: '5px'
                                    }}
                                ><DeleteIcon /> Delete </Button>}
                        </Box>
                    </React.Fragment>

                    {/* <p>Comment: "{comment.comment}" </p> */}
                    <br />

                    <Divider variant="inset" />
            </Container>
        </ListItem>
    )
}

export default CommentItem;