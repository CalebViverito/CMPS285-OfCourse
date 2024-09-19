import { useCallback, useEffect, useState } from "react";
import {
  ApiResponse,
  DepartmentGetDto,
  ProfessorDepartmentCreateUpdateDto,
  ProfessorDepartmentGetDto,
  ProfessorGetDto,
} from "../../constants/types";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { routes } from "../../routes";
import { Container, Title, Select, Space, Flex, Button } from "@mantine/core";

export const ProfessorDepartmentCreate = () => {
  const [professor, setProfessor] = useState<ProfessorGetDto>();
  const [departments, setDepartments] = useState<DepartmentGetDto[]>();
  const { id } = useParams();
  const navigate = useNavigate();

  const mantineForm = useForm<ProfessorDepartmentCreateUpdateDto>({
    initialValues: {
      professorId: Number(id),
      departmentId: 0,
    },
  });

  const fetchProfessor = useCallback(async () => {
    const response = await api.get<ApiResponse<ProfessorGetDto>>(
      `/api/professors/${id}`
    );
    if (response.data.hasErrors) {
      showNotification({ message: "Error fetching courses." });
    }

    if (response.data.data) {
      setProfessor(response.data.data);
    }
  }, [id]);

  const fetchDepartments = useCallback(async () => {
    const response = await api.get<ApiResponse<DepartmentGetDto[]>>(
      "/api/departments"
    );
    if (response.data.hasErrors) {
      showNotification({ message: "Error fetching courses." });
    }

    if (response.data.data) {
      setDepartments(response.data.data);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
    fetchProfessor();
  }, []);

  const submitProfessorDepartment = async (
    values: ProfessorDepartmentCreateUpdateDto
  ) => {
    const response = await api.post<ApiResponse<ProfessorDepartmentGetDto>>(
      `/api/professors/${id}/department/${mantineForm.values.departmentId}`,
      values
    );

    if (response.data.hasErrors) {
      showNotification({
        message: `${professor?.firstName} ${professor?.lastName} already has that department.`,
        color: "red",
      });
    }

    if (response.data.data) {
      showNotification({
        message: "Professor department added",
        color: "green",
      });
      navigate(routes.professorDetails.replace(":id", `${id}`));
    }
  };

  return (
    <Container>
      <Title order={3}>
        Select a department for {professor?.firstName}, {professor?.lastName}
      </Title>

      <Space h={7} />

      <form onSubmit={mantineForm.onSubmit(submitProfessorDepartment)}>
        {departments && (
          <Select
            {...mantineForm.getInputProps("departmentId")}
            data={departments.map((department) => {
              return {
                label: department.name,
                value: String(department.id),
              };
            })}
          />
        )}

        <Space h={18} />

        <Flex direction={"row"}>
          <Button type="submit">Submit</Button>
          <Space w={7} />
          <Button
            type="button"
            onClick={() => {
              navigate(
                routes.professorDetails.replace(":id", `${professor?.id}`)
              );
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
