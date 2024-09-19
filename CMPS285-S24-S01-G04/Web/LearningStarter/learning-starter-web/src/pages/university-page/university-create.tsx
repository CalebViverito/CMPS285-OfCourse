import { Button, Container, Flex, Space, TextInput } from "@mantine/core"
import { FormErrors, useForm } from "@mantine/form"
import { useNavigate } from "react-router-dom"
import { routes } from "../../routes";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { ApiResponse, UniversityCreateUpdateDto, UniversityGetDto } from "../../constants/types";

export const UniversityCreate = () => {
    const navigate = useNavigate();
    const mantineForm = useForm<UniversityCreateUpdateDto>({
        initialValues:  {
            name: ""
        }
    });

    const sumbitUniversity = async (values: UniversityCreateUpdateDto) => {
        const response = await api.post<ApiResponse<UniversityGetDto>>("/api/universities", values);

        if (response.data.hasErrors){
            const formErrors: FormErrors = response.data.errors.reduce(
                (prev, curr) => {
                    Object.assign(prev, { [curr.property]: curr.message});
                    return prev;
                },
                {} as FormErrors
            );
            mantineForm.setErrors(formErrors);
        }

        if (response.data.data){
            showNotification({
                message: "University successfully created",
                color:"green",
            });
            navigate(routes.universityListing)
        }

    }

    return <Container>
        <form onSubmit={mantineForm.onSubmit(sumbitUniversity)}>
            <TextInput
                {...mantineForm.getInputProps("name")}
                label="Name"
                withAsterisk
            />
            <Space h={18}/>
            <Flex direction = "row">
            <Button type="submit">Submit</Button>
            <Space w={8}/>
            <Button 
                type="button"
                onClick={() => {
                    navigate(routes.universityListing);
                }}
                variant="outline"
            >
                Cancel
            </Button>
            </Flex> 
        </form>
    </Container>
}