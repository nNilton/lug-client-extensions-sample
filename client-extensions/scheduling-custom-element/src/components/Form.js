import axios from "axios";
import React , {useEffect, useRef} from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

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

const Form = ({getSchedules, onEdit, setOnEdit}) => {
    const ref = useRef();

    useEffect( () => {
        if(onEdit){
            const schedule = ref.current;

            schedule.name.value = onEdit.name;
            schedule.email.value = onEdit.email;
        }
    }, [onEdit])

    const handleSubmit = async (item) => {
        item.preventDefault();

        const schedule = ref.current;

        if(
            !schedule.name.value
        ){
            return toast.warn("Fill up all fields")
        }

        if(onEdit){
            await axios
                .put("localhost:8080", {
                    name: schedule.name.value
                })
                .then(({data}) => toast.success(data))
                .catch(({data}) => toast.error(data))
        } else{
            await axios
                .post("localhost:8080", {
                    name: schedule.name.value
                })
                .then(({data}) => toast.success(data))
                .catch(({data}) => toast.error(data))
        }

        schedule.name.value = "";
        schedule.email.value = "";

        setOnEdit(null);
        getSchedules();
    };

    return(
        <FormContainer ref={ref} onSubmit={handleSubmit}>
            <InputArea>
                <Label>Nome</Label>
                <Input name = "nome"/>
            </InputArea>

            <InputArea>
                <Label>email</Label>
                <Input email = "nome"/>
            </InputArea>

            <InputArea>
                <Label>phone number</Label>
                <Input phone = "nome"/>
            </InputArea>

            <InputArea>
                <Label>birth date</Label>
                <Input date = "nome" type="date"/>
            </InputArea>
            
            <Button type="submit">Save</Button>
        </FormContainer>
    );
}

export default Form;