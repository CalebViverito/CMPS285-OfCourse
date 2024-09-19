import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Container,
  Flex,
  Space,
  Table,
  Title,
  createStyles,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteModal } from "../../components/delete-modal";
import api from "../../config/axios";
import { ApiResponse, ProfessorGetDto } from "../../constants/types";
import { routes } from "../../routes";

export const ProfessorListing = () => {
  const [professors, setProfessors] = useState<ProfessorGetDto[]>();
  const navigate = useNavigate();
  const { classes } = useStyles();

  const deleteProfessor = useCallback(async (id: number) => {
    const response = await api.delete<ApiResponse<ProfessorGetDto>>(
      `/api/professors/${id}`
    );

    if (response.data.hasErrors) {
      showNotification({ message: "Error deleting professor.", color: "red" });
    }

    await fetchProfessors();
  }, []);

  const fetchProfessors = useCallback(async () => {
    const response =
      await api.get<ApiResponse<ProfessorGetDto[]>>("/api/professors");

    if (response.data.hasErrors) {
      showNotification({ message: "Error fetching professors." });
    }

    if (response.data.data) {
      setProfessors(response.data.data);
    }
  }, []);

  useEffect(() => {
    fetchProfessors();
  }, []);

  return (
    <Container>
      <Flex direction="row" justify="space-between">
        <Title order={2}>Professors</Title>

        <Button
          onClick={() => {
            navigate(routes.professorCreate);
          }}
          leftIcon={<FontAwesomeIcon icon={faPlus} />}
        >
          Add Professor
        </Button>
      </Flex>

      <Space h={7} />

      {professors && (
        <Table withBorder striped>
          <thead>
            <tr>
              <th></th>
              <th>FirstName</th>
              <th>LastName</th>
            </tr>
          </thead>

          <tbody>
            {professors.map((professor) => {
              return (
                <tr key={professor.id}>
                  <td>
                    <Flex direction={"row"}>
                      <FontAwesomeIcon
                        className={classes.iconButton}
                        icon={faPenToSquare}
                        onClick={() => {
                          navigate(
                            routes.professorUpdate.replace(
                              ":id",
                              `${professor.id}`
                            )
                          );
                        }}
                      />

                      <Space w={7} />

                      <DeleteModal
                        text={`Delete ${professor.firstName}, ${professor.lastName}?`}
                        onDelete={() => deleteProfessor(professor.id)}
                      />
                    </Flex>
                  </td>

                  <td
                    onClick={() => {
                      navigate(
                        routes.professorDetails.replace(
                          ":id",
                          `${professor.id}`
                        )
                      );
                    }}
                  >
                    <text className={classes.iconButton}>
                      {professor.firstName}
                    </text>
                  </td>
                  <td>{professor.lastName}</td>
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
    iconButton: {
      cursor: "pointer",
    },
    centerContainer: {
      display: "flex",
      justifyContent: "center",
    },
  };
});
