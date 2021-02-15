import axios from 'axios';
import React, {useEffect, useState, useContext, useCallback } from 'react'
import styled from "styled-components";
import { globalStateStore } from "../../stores/globalStateStore";

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Avatar from '@material-ui/core/Avatar';
import SearchIcon from '@material-ui/icons/Search';
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

    const [userId, setUserId] = useState("");
    const [userPw, setUserPw] = useState("");
    const [userPwConfirm, setUserPwCofirm] = useState("");
    const [userDpt, setUserDpt] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userNm, setUserNm] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [searchResult, setSearchResult] = useState("");
    const [searchResultModalStatus, setSearchResultModalStatus] = useState(false);


    const onClickSearchResultCallBack = useCallback((no)=>{
        setSearchResultModalStatus(true);
  
      })



  
    




    useEffect(()=>{

    }, [updateCount])


    

    
    const searchAPI = async (e) => {
        e.preventDefault();

        const url = "http://localhost:8080/searchId";

        try {
            const response = await axios.post(url, {
                "userEmail" : userEmail,
                "userNm" : userNm,
                
            }, {headers : {
                "Content-Type" : "application/json",
                "x-auth-token" : localStorage.getItem('jwtToken')
            }});

            if (response.data.status === "OK") {
                if(response.data.data === null) {
                    alert("아이디가 존재하지 않습니다."); 
                    return;
                  }
                alert("아이디는 " + response.data.data.userId + " 입니다.");
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
                  <SearchIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  아이디 찾기
                </Typography>
                <form className="jonForm" onSubmit={searchAPI} >
                    
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
                    



                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    
                    color="primary"
                    className="submitBtn"
                  >아이디 찾기
                  </Button>
                  <Grid>
                  <br></br>
                  </Grid>
                  
                </form>
              </div>
              <Box mt={5}>
                
              </Box>
            </Container>
    )
} 


