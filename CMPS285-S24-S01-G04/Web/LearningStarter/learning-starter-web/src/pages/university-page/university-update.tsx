import { Button, Container, Flex, Space, TextInput } from "@mantine/core"
import { useEffect, useState } from "react"
import { ApiResponse, UniversityCreateUpdateDto, UniversityGetDto } from "../../constants/types"
import api from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { FormErrors, useForm } from "@mantine/form";
import { routes } from "../../routes";

export const UniversityUpdate = () => {
    const [university, setUniversity] = useState<UniversityGetDto>();
    const navigate = useNavigate ();
    const {id} = useParams ();
    
    const mantineForm = useForm<UniversityCreateUpdateDto>({
        initialValues: university
    })

    useEffect(() => {
        fecthUniversity();


        async function fecthUniversity () {
            const response = await api.get<ApiResponse<UniversityGetDto>>(`/api/universities/${id}`);

            if(response.data.hasErrors){
                showNotification({ message: "Error updating University", color: "red"});
            }

            if(response.data.data){
                setUniversity(response.data.data);
                mantineForm.setValues(response.data.data)
                mantineForm.resetDirty();
            }
        } 
    }, [id]);

    const sumbitUniversity = async (values: UniversityCreateUpdateDto) => {
        const response = await api.put<ApiResponse<UniversityGetDto>>(`/api/universities/${id}`, values);

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
                message: "University successfully updated",
                color:"green",
            });
            navigate(routes.universityListing)
        }
    }

    return (
        <Container>
            {university && (
                <form onSubmit={mantineForm.onSubmit(sumbitUniversity)}>
                    <TextInput
                        {...mantineForm.getInputProps("name")}
                        label="Name"
                        withAsterisk
                    />
                    <Space h={18}/>
                    <Flex direction = "row">
                        <Button type="submit">Sumbit</Button>
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
            )}
        </Container>
    );
};