import { FormErrors, useForm } from "@mantine/form";
import { ApiResponse, DepartmentCreateUpdateDto, DepartmentGetDto } from "../../constants/types";
import { Button, Container, Flex, Space, TextInput } from "@mantine/core";
import { routes } from "../../routes";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";


export const DepartmentCreate = () => {
    const navigate = useNavigate();
    const mantineForm = useForm<DepartmentCreateUpdateDto>({
        initialValues: {
            name: "",
        },
    });


    const submitDepartment = async (values: DepartmentCreateUpdateDto) => {
        const response = await api.post<ApiResponse<DepartmentGetDto>>("/api/departments", values);


            if(response.data.hasErrors) {
                const formErrors: FormErrors = response.data.errors.reduce (
                    (prev, curr) => {
                        Object.assign(prev, {[curr.property]: curr.message});
                        return prev;
                    },
                    {} as FormErrors
                );
                mantineForm.setErrors(formErrors);
            }


            if(response.data.data) {
                showNotification({message: "Department created.", color: "green"});
                navigate(routes.departmentListing);
            }
        }


        return (
            <Container>
                <form onSubmit={mantineForm.onSubmit(submitDepartment)}>
                <TextInput
                    {...mantineForm.getInputProps("Name")}
                    label="Name"
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
            </Container>
        )
    };
