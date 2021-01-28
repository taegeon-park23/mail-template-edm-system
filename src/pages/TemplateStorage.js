import React, {useEffect, useState, useContext} from 'react'
import axios from "axios";
import { globalStateStore } from "../stores/globalStateStore";
 
export default function TemplateStorage({history}) {
    const globalState = useContext(globalStateStore);
    const { state } = globalState;
    const [updateCount, setUpdateCount] = useState(0);
    const [templates, setTemplates] = useState([]);
    
    const setCheckAll = (e = null, flag = false) => {
      let checkFlag = false;
      if(flag) 
        checkFlag = flag;
      else if(e!==null)
        checkFlag = e.currentTarget.checked? true: false; 
      const inputArr = document.querySelectorAll("input[type=checkbox]");
      inputArr.forEach((input)=>{input.checked = checkFlag})
    }

    const getCheckedTplNoArr = () => {
       const inputArr = document.querySelectorAll("input[type=checkbox]");
       const checkedInputValues = [] ;
       inputArr.forEach(input=>{
         if(input.checked===true && input.value !== "on")
          checkedInputValues.push(input.value);
       });
       return checkedInputValues;  
    }

    const selectMailTemplateAll = async () => {
      const url = "/user/selectMailTemplateAll";
      try {
        const response =
        await axios.post(url, 
            {}, {headers: {
              "Content-Type": "application/json",
              "x-auth-token": localStorage.getItem('jwtToken')
            }});
  
          if(response.data.status === "OK") {
              if(response.data.data === null) {
                alert("조회되는 템플릿이 없습니다."); return;
              }
              setTemplates(response.data.data);
          } else if(response.data.status === "NOT_FOUND"){
              alert("인증되지 않은 접근입니다.");
              localStorage.removeItem('jwtToken');
          }
        } catch(err) {
          alert("서버와의 접근이 불안정합니다.");
        }
    }
    useEffect(()=>{
      selectMailTemplateAll();
    },[updateCount])

    const deleteMailTemplate = async () => {
      const url = "/user/deleteMailTemplate";
      try {
        const response =
        await axios.post(url, 
            {"tplNos":getCheckedTplNoArr()}, 
            { headers: {
              "Content-Type": "application/json",
              "x-auth-token": localStorage.getItem('jwtToken')
            }}
        );
            if(response.data.status === "OK") {
              alert(response.data.message);
              history.push("/templatestorage");
              setCheckAll(null, false);
            } else if(response.data.status === "NOT_FOUND"){
              alert("인증되지 않은 접근입니다.");
              localStorage.removeItem('jwtToken');
            }

        } catch(err) {
          alert("서버와의 접근이 불안정합니다.")
        }
    }
    return(
        <div className="container bootdey">
      <main>
        <div class="d-flex justify-content-center align-items-center ml-3 mt-3">
          <p class=" mr-auto">
            <h3>템플릿 목록</h3>
          </p>
        </div>
        <div className="container-fluid input-group shadow-sm py-10 mb-5 bg-white rounded">
          <form className="ml-5 mx-5 my-10">
            <div className="input-group w-100">
              <input
                type="text"
                class="form-control bg-light border-0 small"
                placeholder="Search for..."
                aria-label="Search"
                aria-describedby="basic-addon2"
              />
                <button className="btn btn-primary mr-3" type="button">🔍</button>
            </div>
          </form>

        </div>
        <div className="container-fluid d-flex justify-content-left">
          <button className="btn btn-primary rounded  mx-3 mb-3"
            onClick={()=>{history.push('/createtemplate:0')}}
          >생성</button>
          <button className="btn btn-primary rounded  mr-3 mb-3"
            onClick={()=>{deleteMailTemplate()}}
          >삭제</button>
        </div>
        <table
          id="example"
          className="table table-striped table-hover table-sm"
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
              <th scope="col">
                <input type="checkbox" onClick={(e)=>{setCheckAll(e)}}/>
              </th>
              <th scope="col">index</th>
              <th scope="col">템플릿 제목</th>
              <th scope="col">템플릿 설명</th>
              <th scope="col">저장 일시</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((tpl, i) => (
              <tr key={i}>
                <td scope="row">
                  <input type="checkbox" value={tpl.tplNo}/>
                </td>
                <td onClick={(e)=>{history.push(`/createTemplate:${tpl.tplNo}`)}} >{i}</td>
                <td onClick={(e)=>{history.push(`/createTemplate:${tpl.tplNo}`)}} >{tpl.tplSub}</td>
                <td onClick={(e)=>{history.push(`/createTemplate:${tpl.tplNo}`)}} >{tpl.tplDesc}</td>
                <td onClick={(e)=>{history.push(`/createTemplate:${tpl.tplNo}`)}} >{tpl.editDate ? tpl.editDate : tpl.regDate}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
            <th>
                <input type="checkbox"  onClick={(e)=>{setCheckAll(e)}}/>
              </th>
              <th>index</th>
              <th>템플릿 제목</th>
              <th>템플릿 설명</th>
              <th>저장 일시</th>
            </tr>
          </tfoot>
        </table>
        <div className="w-100 d-flex flex-row-reverse shadow-sm px-0 mb-5 bg-white rounded">
           <p className="p-2 bd-highlight">페이지 이동 <input type="number"></input> 1-5 of 6 &lt; &gt;</p>
        </div>
      </main>
    </div>
    )
}