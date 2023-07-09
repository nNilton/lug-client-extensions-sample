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

        console.log(schedule.email)
        console.log(schedule.email.value)

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
                .catch(({data}) => toast.error(data));
        } else{
            await axios
                .post("http://localhost:8080/o/c/schedules/", {
                    name: schedule.name.value,
                    email: schedule.email.value    
                },
                {headers: { Authorization: 'Basic ' + btoa("test@liferay.com:test") }}
                )
                .catch(({data}) => console.log(data));
        }

        schedule.name.value = "";
        schedule.email.value = "";

        setOnEdit(null);
        getSchedules();
    };

    return(
        <FormContainer ref={ref} onSubmit={handleSubmit}>
            <InputArea>
                <Label>name</Label>
                <Input name = "name"/>
            </InputArea>

            <InputArea>
                <Label>email</Label>
                <Input name = "email"/>
            </InputArea>

            <InputArea>
                <Label>phone number</Label>
                <Input name = "phone"/>
            </InputArea>

            <InputArea>
                <Label>birth date</Label>
                <Input name = "date" type="date"/>
            </InputArea>
            
            <Button type="submit">Save</Button>
        </FormContainer>
    );
}

export default Form;