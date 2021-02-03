import axios from 'axios';
import React, {useEffect, useState, useContext } from 'react'
import styled from "styled-components";
import { globalStateStore } from "../../stores/globalStateStore";

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { spacing } from '@material-ui/core';


export default function SignUpModal({onClose, setUpdateCountLogin}) {


    const [updateCount, setUpdateCount] = useState(0);


    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [Name, setName] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");

    const [userId, setUserId] = useState("");
    const [userPw, setUserPw] = useState("");
    const [userPwConfirm, setUserPwCofirm] = useState("");
    const [userDpt, setUserDpt] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userNm, setUserNm] = useState("");
    const [userPhone, setUserPhone] = useState("");



  
    




    useEffect(()=>{

    }, [updateCount])


    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

   

 
    const onconfirmPasswordHandler = (event) => {
        setconfirmPassword(event.currentTarget.value)
    }

    const hasError = passwordEntered =>
        userPw.length < 5 ? true : false;
    
    const hasNotSameError = passwordEntered =>
        userPw != userPwConfirm ? true : false;    

    
    const save = async (e) => {
        e.preventDefault();

        const url = "/user/join";

        try {
            const response = await axios.post(url, {
                "userId" : userId,
                "userPw" : userPwConfirm,
                "userDpt" : userDpt,
                "userEmail" : userEmail,
                "userNm" : userNm,
                "userPhone" : userPhone,
                
            }, {headers : {
                "Content-Type" : "application/json",
                "x-auth-token" : localStorage.getItem('jwtToken')
            }});

            if (response.data.status === "OK") {
                alert(response.data.message);
                setUpdateCount(updateCount+1);
                setUpdateCountLogin();
                onClose();
                
                
            } else if(response.data.status === "NOT_FOUND") {
                localStorage.removeItem('jwtToken');
                alert(response.message);

            }

        } catch(err) {
            console.log(err);
            alert("서버와의 연결이 불안정합니다.");

        }
    }


    

    
    return(
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className="asd">
                <Avatar className="asd">
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Messenger Sign Up
                </Typography>
                <form className="jonForm" onSubmit={save} >
                    
                    <Grid item xs={12}>
                        <TextField
                            autoComplete="fname"
                            name="userNm"
                            variant="filled"
                            value={userNm}
                            onChange={(e) => {setUserNm(e.target.value)}}
                            required
                            fullWidth
                            id="userNm"
                            label="이름"
                        />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="filled"
                        required
                        fullWidth
                        value={userEmail}
                        onChange={(e) => {setUserEmail(e.target.value)}}
                        id="userEmail"
                        label="Email Address"
                        name="userEmail"
                        autoComplete="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            autoComplete="userDpt"
                            name="userDpt"
                            variant="filled"
                            value={userDpt}
                            onChange={(e) => {setUserDpt(e.target.value)}}
                            required
                            fullWidth
                            id="userDpt"
                            label="부서명"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            autoComplete="userPhone"
                            name="userPhone"
                            variant="filled"
                            value={userPhone}
                            onChange={(e) => {setUserPhone(e.target.value)}}
                            required
                            fullWidth
                            id="userPhone"
                            label="Phoen Number( - 제외 )"
                        />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        autoComplete="fname"
                        name="firstName"
                        variant="filled"
                        value={userId}
                        onChange={(e) => {setUserId(e.target.value)}}
                        required
                        fullWidth
                        id="userId"
                        label="id"
                    
                      />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="filled"
                            required
                            fullWidth
                            value={userPw}
                            onChange={(e) => {setUserPw(e.target.value)}}
                            name="userPw"
                            error={hasError('password')} // 해당 텍스트필드에 error 핸들러 추가
                            label="Password(5글자 이상 필수)"
                            type="password"
                            id="userPw"
                            autoComplete="current-password"
                        />
                        </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="filled"
                            required
                            fullWidth
                            value={userPwConfirm}
                            onChange={(e) => {setUserPwCofirm(e.target.value)}}
                            name="userPwConfirm"
                            error={hasNotSameError('userPwConfirm')} // 해당 텍스트필드에 error 핸들러 추가
                            helperText={
                                hasNotSameError('userPwConfirm') ? "입력한 비밀번호와 일치하지 않습니다." : null
                            } // 에러일 경우에만 안내 문구 표시
                            label="Confirm Password"
                            type="password"
                            id="userPwConfirm"
                            autoComplete="current-password"
                        />
                    </Grid>



                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    
                    color="primary"
                    className="submitBtn"
                  >회원가입
                  </Button>
                  <Grid>
                  <br></br>
                  </Grid>
                  <Grid container justify="flex-end">
                    <Grid item>
                      <Link href="/login" variant="body2">
                        이미 가입하셨다면, 로그인해 주세요!
                      </Link>
                    </Grid>
                  </Grid>
                </form>
              </div>
              <Box mt={5}>
                
              </Box>
            </Container>
    )
} 


