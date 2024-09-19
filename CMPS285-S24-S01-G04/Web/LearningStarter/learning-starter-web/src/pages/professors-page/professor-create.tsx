import { FormErrors, useForm } from "@mantine/form";
import {
  ApiResponse,
  ProfessorCreateUpdateDto,
  ProfessorGetDto,
} from "../../constants/types";
import { Button, Container, Flex, Space, TextInput } from "@mantine/core";
import { routes } from "../../routes";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";

export const ProfessorCreate = () => {
  const navigate = useNavigate();
  const mantineForm = useForm<ProfessorCreateUpdateDto>({
    initialValues: {
      firstName: "",
      lastName: "",
    },
  });

  const submitProfessor = async (values: ProfessorCreateUpdateDto) => {
    const response = await api.post<ApiResponse<ProfessorGetDto>>(
      "/api/professors",
      values
    );

    if (response.data.hasErrors) {
      const formErrors: FormErrors = response.data.errors.reduce(
        (prev, curr) => {
          Object.assign(prev, { [curr.property]: curr.message });
          return prev;
        },
        {} as FormErrors
      );
      mantineForm.setErrors(formErrors);
    }

    if (response.data.data) {
      showNotification({ message: "Professor created.", color: "green" });
      navigate(
        routes.professorDetails.replace(":id", `${response.data.data.id}`)
      );
    }
  };

  return (
    <Container>
      <form onSubmit={mantineForm.onSubmit(submitProfessor)}>
        <TextInput
          {...mantineForm.getInputProps("firstName")}
          label="First Name"
          withAsterisk
        />

        <TextInput
          {...mantineForm.getInputProps("lastName")}
          label="Last Name"
          withAsterisk
        />

        <Space h={18} />

        <Flex direction={"row"}>
          <Button type="submit">Submit</Button>
          <Space w={7} />
          <Button
            type="button"
            onClick={() => {
              navigate(routes.professorListing);
            }}
            variant="outline"
            color="red"
          >
            Cancel
          </Button>
        </Flex>
      </form>
    </Container>
  );
};
