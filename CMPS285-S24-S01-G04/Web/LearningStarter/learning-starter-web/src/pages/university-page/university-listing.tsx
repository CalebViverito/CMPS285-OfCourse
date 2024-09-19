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
import { ApiResponse, UniversityGetDto } from "../../constants/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPencil,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../routes";
import { DeleteModal } from "../../components/delete-modal";

export const UniversitiesListing = () => {
  const [universities, setUniversity] = useState<UniversityGetDto[]>();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const { id } = useParams();
  const [opened, setOpened] = useState(false);

  const deleteUniversity = useCallback(async (id: number) => {
    const response = await api.delete<ApiResponse<UniversityGetDto>>(
      `/api/universities/${id}`
    );

    if (response.data.hasErrors) {
      showNotification({ message: "Error deleting university.", color: "red" });
    }

    await fetchUniversity();
  }, []);

  const fetchUniversity = useCallback(async () => {
    const response =
      await api.get<ApiResponse<UniversityGetDto[]>>("/api/universities");

    if (response.data.hasErrors) {
      showNotification({ message: "Error fecthing universities" });
    }

    if (response.data.data) {
      setUniversity(response.data.data);
    }
  }, []);

  useEffect(() => {
    fetchUniversity();
  }, []);

  return (
    <Container>
      <Flex direction="row" justify={"space-between"}>
        <Title order={2}>Universities</Title>
        <Button
          onClick={() => {
            navigate(routes.universityCreate);
          }}
        >
          <FontAwesomeIcon icon={faPlus} /> <Space w={8} />
          Add University
        </Button>
      </Flex>
      <Space h={7} />
      {universities && (
        <Table withBorder striped>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {universities.map((university) => {
              return (
                <tr key={university.id}>
                  <td>
                    <Flex direction={"row"}>
                      <FontAwesomeIcon
                        className={classes.iconbutton}
                        icon={faPenToSquare}
                        onClick={() => {
                          navigate(
                            routes.universityUpdate.replace(
                              ":id",
                              `${university.id}`
                            )
                          );
                        }}
                      />

                      <Space w={7} />

                      <DeleteModal
                        text={`Delete ${university.name}`}
                        onDelete={() => deleteUniversity(university.id)}
                      />
                    </Flex>
                  </td>
                  <td
                    onClick={() => {
                      navigate(
                        routes.universityDetails.replace(
                          ":id",
                          `${university.id}`
                        )
                      );
                    }}
                  >
                    <text className={classes.iconbutton}>
                      {university.name}
                    </text>
                  </td>
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
