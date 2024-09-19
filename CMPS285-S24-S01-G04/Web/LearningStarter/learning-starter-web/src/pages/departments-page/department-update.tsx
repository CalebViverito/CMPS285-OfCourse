import { useEffect, useState } from "react";
import api from "../../config/axios";
import { ApiResponse, DepartmentCreateUpdateDto, DepartmentGetDto } from "../../constants/types";
import { showNotification } from "@mantine/notifications";
import { Button, Container, Flex,  Space,  TextInput, createStyles } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../routes";
import { FormErrors, useForm } from "@mantine/form";


export const DepartmentUpdate = () => {
    const [department, setDepartment] = useState<DepartmentGetDto>();
    const navigate = useNavigate();
    const {id} = useParams();


    const mantineForm = useForm<DepartmentCreateUpdateDto>({
        initialValues: department,
    });


    useEffect(() => {
        fetchDepartment();


        async function fetchDepartment() {
            const response = await api.get<ApiResponse<DepartmentGetDto>>(`/api/departments/${id}`);
           
            if(response.data.hasErrors) {
                showNotification({message: "Error fetching department.", color: "red"});
            }


            if(response.data.data) {
                setDepartment(response.data.data);
                mantineForm.setValues(response.data.data);
                mantineForm.resetDirty();
            }
        }
    }, [id]);


    const submitDepartment = async (values: DepartmentCreateUpdateDto) => {
        const response = await api.put<ApiResponse<DepartmentGetDto>>(`/api/departments/${id}`, values);
       
        if(response.data.hasErrors) {
            const formErrors: FormErrors = response.data.errors.reduce (
                (prev, curr) => {
                    Object.assign(prev, {[curr.property]: curr.message});
                    return prev;
                },
                {} as FormErrors
            );
            mantineForm.setErrors(formErrors);
           
            showNotification({message: "Error updating Department.", color: "red"});
        }


        if(response.data.data) {
            showNotification({message: "Department updated.", color: "green"});
            navigate(routes.departmentListing);
        }
    };


    return (
        <Container>
            {department && (
            <form onSubmit={mantineForm.onSubmit(submitDepartment)}>
                <TextInput
                    {...mantineForm.getInputProps("name")}
                    label = "Name"
                    withAsterisk
                />


                <Space h = {18}/>


                <Flex direction={"row"}>
                    <Button type ="submit">Submit</Button>
                    <Space w = {7}/>
                    <Button
                        type ="button"
                        onClick={() => {navigate(routes.departmentListing);}}
                        variant = "outline"
                        color = "red">
                            Cancel
                    </Button>
                </Flex>
            </form>
            )}
        </Container>
    )
};
