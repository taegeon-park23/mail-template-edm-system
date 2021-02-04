import React, {useState} from "react";

import "./Login.css";
import axios from "axios";

const MailResponse = ({match}) => {
    const {number} = match.params;
    const [receiverEmail, setReceiverEmail] = useState("");
    const [receiverName, setReceiverName] = useState("");
    const [receiverPhone, setReceiverPhone] = useState("");

    return (
      <div className="sign-in">
        <div className="text-center shadow p-3 mb-5 bg-white rounded">
          <form className="form-signin">
            {/* <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1> */}
            <label htmlFor="inputId" className="sr-only">
                email
            </label>
            <input
              type="email"
              id="inputId"
              className="form-control"
              placeholder="👥email"
              required
              value={receiverEmail}
              onChange={(e)=>{setReceiverEmail(e.target.value)}}
              autoFocus
            />
            <label htmlFor="inputPassword" className="sr-only">
               name
            </label>
            <input
              type="text"
              id="inputPassword"
              className="form-control"
              placeholder="👥 name"
              value={receiverName}
              onChange={(e)=>{setReceiverName(e.target.value)}}
              required
            />
            <label htmlFor="inputId" className="sr-only">
                phone
            </label>
            <input
              type="tel"
              id="inputId"
              className="form-control"
              placeholder="📞 phone"
              value={receiverPhone}
              onChange={(e)=>{setReceiverPhone(e.target.value)}}
              autoFocus
            />
            <div className="checkbox mb-3">
              <label>
                <input type="checkbox" value="remember-me" /> Remember me
              </label>
            </div>
            <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={async (e)=> {
              e.preventDefault();
              try {
                const response = await axios.post(`http://localhost:8080/all/insertMailResponse/${number}`, 
                {"receiverEmail":receiverEmail, 
                "receiverPhone": receiverPhone,
                "receiverName": receiverName
                }
                  ,{headers:{ "Content-Type":'application/json'}}
                );
                alert(response.data.message);
              } catch(err) {
                alert("서버와 연결이 불안정합니다.");
              }
            }}>
              등록
            </button>
            <p className="mt-5 mb-3 text-muted">&copy; 2020</p>
          </form>
        </div>
      </div>
    );
}

export default MailResponse;
