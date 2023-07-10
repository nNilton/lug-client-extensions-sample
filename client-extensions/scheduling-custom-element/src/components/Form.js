import axios from "axios";
import React , {useEffect, useRef} from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { baseURL } from "../Start";

const FormContainer = styled.form`
    display: flex;
    align-items: flex-end;
    gap: 10px;
    flex-wrap: wrap;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0px 0px 5px #ccc;
    border-radius: 5px
`;

const InputArea = styled.div`
    display: flex;
    flex-direction: column;
`;

const Input = styled.input`
    width:120px;
    padding: 0 10px;
    border: 1px solid #bbb;
    border-radius: 5px;
    height: 40px;
`;

const Label = styled.label``;

const Button = styled.button`
    padding: 10px;
    cursor: pointer;
    border-radius: 5px;
    border: none;
    background-color: #2c73d2;
    color: white;
    height: 42px;
`;

const Form = ({getExams, onEdit, setOnEdit}) => {
    const ref = useRef();

    useEffect( () => {
        if(onEdit){
            const exam = ref.current;

            exam.exame.value = onEdit.exame;
            exam.numeroDaCarteirinha.value = onEdit.numeroDaCarteirinha;
        }
    }, [onEdit])

    const handleSubmit = async (item) => {
        item.preventDefault();

        const exam = ref.current;

        if( 
            !exam.exame.value
        ){
            return toast.warn("Fill up all fields")
        }

        if(onEdit){
            await axios
                .put("localhost:8080", {
                    name: exam.exame.value
                })
                .then(({data}) => toast.success(data))
                .catch(({data}) => toast.error(data));
        } else{
            await axios
                .post(baseURL, {
                    exame: {
                        key: exam.exame.value
                    } 
                },
                {headers: { Authorization: 'Basic ' + btoa("test@liferay.com:test") }}
                )
                .catch(({data}) => console.log(data));
        }

        exam.exame.value = "";
        exam.numeroDaCarteirinha.value = "";

        setOnEdit(null);
        getExams();
    };

    return(
        <FormContainer ref={ref} onSubmit={handleSubmit}>
            <InputArea>
                <Label>Exame</Label>
                <Input name = "exame"/>
            </InputArea>

            <InputArea>
                <Label>Numero da Carteirinha</Label>
                <Input name = "numeroDaCarteirinha"/>
            </InputArea>

            <InputArea>
                <Label>Data de Realização</Label>
                <Input name = "date" type="date"/>
            </InputArea>
            
            <Button type="submit">Save</Button>
        </FormContainer>
    );
}

export default Form;