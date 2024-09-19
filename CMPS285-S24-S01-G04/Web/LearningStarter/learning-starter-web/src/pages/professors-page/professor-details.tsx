import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Container,
  Divider,
  Flex,
  Space,
  Table,
  Title,
  createStyles,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteModal } from "../../components/delete-modal";
import api from "../../config/axios";
import {
  ApiResponse,
  ProfessorCourseGetDto,
  ProfessorDepartmentGetDto,
  ProfessorGetDto,
} from "../../constants/types";
import { routes } from "../../routes";

export const ProfessorDetails = () => {
  const [professor, setProfessor] = useState<ProfessorGetDto>();
  const navigate = useNavigate();
  const { id } = useParams();
  const { classes } = useStyles();

  const deleteProfessorCourse = async (
    professorId: number,
    courseId: number
  ) => {
    const response = await api.delete<ApiResponse<ProfessorCourseGetDto>>(
      `/api/professors/${professorId}/course/${courseId}`
    );

    if (response.data.hasErrors) {
      showNotification({
        message: "Error removing course from professor.",
        color: "red",
      });
    }

    await fetchProfessor();
  };

  const deleteProfessorDepartment = async (
    professorId: number,
    departmentId: number
  ) => {
    const response = await api.delete<ApiResponse<ProfessorDepartmentGetDto>>(
      `/api/professors/${professorId}/department/${departmentId}`
    );

    if (response.data.hasErrors) {
      showNotification({
        message: "Error removing department from professor.",
        color: "red",
      });
    }

    await fetchProfessor();
  };

  const fetchProfessor = async () => {
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
    }
  };

  useEffect(() => {
    fetchProfessor();
  }, [id]);

  return (
    <Container>
      <Title order={2}>
        {professor?.firstName} {professor?.lastName}
      </Title>

      <Divider my="md" />

      <Flex direction="row" justify="space-between">
        <Title order={3}>Courses</Title>
        <Button
          onClick={() => {
            navigate(
              routes.professorCourseCreate.replace(":id", `${professor?.id}`)
            );
          }}
          leftIcon={<FontAwesomeIcon icon={faPlus} />}
        >
          Add Course
        </Button>
      </Flex>

      <Space h={7} />

      <Table withBorder striped>
        <thead>
          <tr></tr>
        </thead>
        <tbody>
          {professor?.courses.map((course) => {
            return (
              <tr key={course.id}>
                <td>
                  <text
                    className={classes.iconButton}
                    onClick={() =>
                      navigate(routes.course.replace(":id", `${course.id}`))
                    }
                  >
                    {course.name}
                  </text>
                  <text>
                    <br />
                    {course.description}
                  </text>
                </td>
                <td>
                  <DeleteModal
                    text={`Remove ${course.name} from ${professor.firstName}, ${professor.lastName}?`}
                    onDelete={() =>
                      deleteProfessorCourse(Number(id), course.id)
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Space h={14} />

      <Flex direction="row" justify="space-between">
        <Title order={3}>Departments</Title>
        <Button
          onClick={() => {
            navigate(
              routes.professorDepartmentCreate.replace(
                ":id",
                `${professor?.id}`
              )
            );
          }}
          leftIcon={<FontAwesomeIcon icon={faPlus} />}
        >
          Add Department
        </Button>
      </Flex>

      <Space h={7} />

      <Table withBorder striped>
        <thead>
          <tr></tr>
        </thead>
        <tbody>
          {professor?.departments.map((department) => {
            return (
              <tr>
                <Flex justify={"space-between"}>
                  <td>
                    <text
                      onClick={() => {
                        navigate(routes.departmentListing);
                      }}
                      className={classes.iconButton}
                    >
                      {department.name}
                    </text>
                  </td>
                  <td>
                    <DeleteModal
                      text={`Remove the ${department.name} department from ${professor.firstName}, ${professor.lastName}?`}
                      onDelete={() =>
                        deleteProfessorDepartment(Number(id), department.id)
                      }
                    />
                    <Space w={20} />
                  </td>
                </Flex>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <text></text>
    </Container>
  );
};

const useStyles = createStyles(() => {
  return {
    iconButton: {
      cursor: "pointer",
    },
  };
});
