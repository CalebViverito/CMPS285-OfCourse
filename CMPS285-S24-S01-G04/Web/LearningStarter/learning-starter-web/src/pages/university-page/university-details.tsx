import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ApiResponse,
  ProfessorDepartmentGetDto,
  ProfessorGetDto,
  UniversityDepartmentGetDto,
  UniversityGetDto,
} from "../../constants/types";
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
import api from "../../config/axios";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { routes } from "../../routes";
import { DeleteModal } from "../../components/delete-modal";

export const UniversityDetails = () => {
  const [university, setUniversity] = useState<UniversityGetDto>();
  const navigate = useNavigate();
  const { id } = useParams();
  const { classes } = useStyles();

  const deleteUniversityDepartment = async (
    universityId: number,
    departmentId: number
  ) => {
    const response = await api.delete<ApiResponse<UniversityDepartmentGetDto>>(
      `/api/universities/${universityId}/department/${departmentId}`
    );

    if (response.data.hasErrors) {
      showNotification({
        message: "Error removing course from professor.",
        color: "red",
      });
    }

    await fetchUniversity();
  };

  const fetchUniversity = async () => {
    const response = await api.get<ApiResponse<UniversityGetDto>>(
      `/api/universities/${id}`
    );

    if (response.data.hasErrors) {
      showNotification({
        message: "Error fetching university.",
        color: "red",
      });
    }

    if (response.data.data) {
      setUniversity(response.data.data);
    }
  };

  useEffect(() => {
    fetchUniversity();
  }, [id]);

  return (
    <Container>
      <Title order={2}>{university?.name}</Title>

      <Divider my="md" />

      <Flex direction="row" justify="space-between">
        <Title order={3}>Departments</Title>
        <Button
          onClick={() => {
            navigate(
              routes.universityDepartmentCreate.replace(
                ":id",
                `${university?.id}`
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
          {university?.departments.map((department) => {
            return (
              <tr key={department.id}>
                <td>
                  <text
                    className={classes.iconButton}
                    onClick={() => navigate(routes.departmentListing)}
                  >
                    {department.name}
                  </text>
                </td>
                <td>
                  <Flex justify={"right"}>
                    <DeleteModal
                      text={`Remove ${department.name} from ${university.name}?`}
                      onDelete={() =>
                        deleteUniversityDepartment(Number(id), department.id)
                      }
                    />

                    <Space w={20} />
                  </Flex>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
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
