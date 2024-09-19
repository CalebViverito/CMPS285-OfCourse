import {
  Button,
  Container,
  Flex,
  MultiSelect,
  Space,
  TextInput,
} from "@mantine/core";
import { FormErrors, useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/axios";
import {
  ApiResponse,
  CourseGetDto,
  ProfessorCreateUpdateDto,
  ProfessorGetDto,
} from "../../constants/types";
import { routes } from "../../routes";

export const ProfessorUpdate = () => {
  const [courses, setCourses] = useState<CourseGetDto[]>();
  const [professor, setProfessor] = useState<ProfessorGetDto>();
  const navigate = useNavigate();
  const { id } = useParams();

  const mantineForm = useForm<ProfessorCreateUpdateDto>({
    initialValues: professor,
  });

  useEffect(() => {
    fetchProfessor();

    async function fetchProfessor() {
      const response = await api.get<ApiResponse<ProfessorGetDto>>(
        `/api/professors/${id}`
      );

      if (response.data.hasErrors) {
        showNotification({
          message: "Error fetching professor.",
          color: "red",
        });
      }

      if (response.data.data) {
        setProfessor(response.data.data);
        mantineForm.setValues(response.data.data);
        mantineForm.resetDirty();
      }
    }
  }, [id]);

  const submitProfessor = async (values: ProfessorCreateUpdateDto) => {
    const response = await api.put<ApiResponse<ProfessorGetDto>>(
      `/api/professors/${id}`,
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
      showNotification({ message: "Professor updated.", color: "green" });
      navigate(routes.professorListing);
    }
  };

  return (
    <Container>
      {professor && (
        <>
          <form onSubmit={mantineForm.onSubmit(submitProfessor)}>
            <TextInput
              {...mantineForm.getInputProps("firstName")}
              label="First Name"
              withAsterisk
            />

            <Space h={7} />

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
        </>
      )}
    </Container>
  );
};
