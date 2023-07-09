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

const Title = styled.h2``;


function Start() {
const [schedules, setSchedules] = useState([]);
const [onEdit, setOnEdit] = useState(null);

const getSchedules = async () => {
  try{
    const res = await axios.get("http://localhost:8080/o/c/schedules/", { 'headers': { 'Authorization': 'Basic ' + btoa("test@liferay.com:test") } });
    console.log(res);
    setSchedules(res.data.items)
  }catch(error){
    toast.error(error);
  }
}

useEffect(() => {
  getSchedules();
}, [setSchedules])

  return (
    <div className="App">
      <Container>
        <Title>
          Usuários
        </Title>
        <Form onEdit={onEdit} setOnEdit={setOnEdit} getSchedules={getSchedules}/>
        <Grid setOnEdit={setOnEdit} schedules={schedules} setSchedules={setSchedules}/>
      </Container>
      <ToastContainer autoClose={3000} position={toast.POSITION.TOP_CENTER} />
      {/* <GlobalStyle /> */}
    </div>
  );
}

export default Start;
