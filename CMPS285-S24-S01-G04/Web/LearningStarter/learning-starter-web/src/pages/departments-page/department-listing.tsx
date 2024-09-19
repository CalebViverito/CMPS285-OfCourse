import {
  Button,
  Container,
  Flex,
  Group,
  Modal,
  Space,
  Table,
  Title,
  createStyles,
} from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { showNotification } from "@mantine/notifications";
import api from "../../config/axios";
import { ApiResponse, DepartmentGetDto } from "../../constants/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPencil,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../routes";
import { DeleteModal } from "../../components/delete-modal";

export const DepartmentListing = () => {
  const [departments, setDepartment] = useState<DepartmentGetDto[]>();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const { id } = useParams();
  const [opened, setOpened] = useState(false);

  const deleteDepartment = useCallback(async (id: number) => {
    const response = await api.delete<ApiResponse<DepartmentGetDto>>(
      `/api/departments/${id}`
    );

    if (response.data.hasErrors) {
      showNotification({ message: "Error deleting department.", color: "red" });
    }

    await fetchDepartment();
  }, []);

  const fetchDepartment = useCallback(async () => {
    const response =
      await api.get<ApiResponse<DepartmentGetDto[]>>("/api/departments");

    if (response.data.hasErrors) {
      showNotification({ message: "Error fecthing departments" });
    }

    if (response.data.data) {
      setDepartment(response.data.data);
    }
  }, []);

  useEffect(() => {
    fetchDepartment();
  }, []);

  return (
    <Container>
      <Flex direction="row" justify={"space-between"}>
        <Title order={2}>Departments</Title>

        <Button
          onClick={() => {
            navigate(routes.departmentCreate);
          }}
        >
          <FontAwesomeIcon icon={faPlus} /> <Space w={8} />
          Add Department
        </Button>
      </Flex>

      <Space h={7} />

      {departments && (
        <Table withBorder striped>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => {
              return (
                <tr key={department.id}>
                  <td>
                    <Flex direction={"row"}>
                      <FontAwesomeIcon
                        className={classes.iconbutton}
                        icon={faPenToSquare}
                        onClick={() => {
                          navigate(
                            routes.departmentUpdate.replace(
                              ":id",
                              `${department.id}`
                            )
                          );
                        }}
                      />

                      <Space w={7} />

                      <DeleteModal
                        text={`Delete ${department.name}`}
                        onDelete={() => deleteDepartment(department.id)}
                      />
                    </Flex>
                  </td>
                  <td>{department.name}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

const useStyles = createStyles(() => {
  return {
    iconbutton: {
      cursor: "pointer",
    },
  };
});
