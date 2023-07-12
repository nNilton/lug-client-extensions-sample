import GlobalStyle from "./styles/global";
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import styled from "styled-components";
import Form from "./components/Form";
import Grid from "./components/Grid";
import { useEffect, useState } from "react";
import axios from "axios";

const Container = styled.div`
  width:100%;
  max-width:800px;
  margin-top: 20px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

`;

export const baseURL = "http://localhost:8080/o/c/rayhealths/";

const Title = styled.h2``;


function Start() {
const [exams, setExams] = useState([]);
const [onEdit, setOnEdit] = useState(null);

const getExams = async () => {
  try{
    const res = await axios.get(baseURL, { 'headers': { 'Authorization': 'Basic ' + btoa("test@liferay.com:test") } });
    console.log(res);
    setExams(res.data.items)
  }catch(error){
    toast.error(error);
  }
}

useEffect(() => {
  getExams();
}, [setExams])

  return (
    <div className="App">
      <Container>
        <Title>
          RayHealth
        </Title>
        <Form onEdit={onEdit} setOnEdit={setOnEdit} getExams={getExams}/>
        <Grid setOnEdit={setOnEdit} exams={exams} setExams={setExams}/>
      </Container>
      <ToastContainer autoClose={3000} position={toast.POSITION.TOP_CENTER} />
    </div>
  );
}

export default Start;
