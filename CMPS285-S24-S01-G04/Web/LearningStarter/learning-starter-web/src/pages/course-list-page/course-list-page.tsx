import {
  Grid,
  Card,
  Container,
  createStyles,
  Text,
  Loader,
  Group,
  Stack,
  Title,
  Flex,
  Button,
  Space,
} from "@mantine/core";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import { CourseGetDto, ApiResponse } from "../../constants/types";
import { useCallback, useEffect, useState } from "react";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { routes } from "../../routes";
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DeleteModal } from "../../components/delete-modal";

//This is a basic Component, and since it is used inside of
//'../../routes/config.tsx' line 31, that also makes it a page
export const CourseListPage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseGetDto[]>();

  const deleteCourse = useCallback(async (id: number) => {
    const response = await api.delete<ApiResponse<CourseGetDto>>(
      `/api/courses/${id}`
    );

    if (response.data.hasErrors) {
      showNotification({ message: "Error deleting professor.", color: "red" });
    }

    await fetchCourses();
  }, []);

  const fetchCourses = useCallback(async () => {
    const response = await api.get<ApiResponse<CourseGetDto[]>>(`/api/courses`);

    if (response.data.hasErrors) {
      showNotification({ message: "Error finding course", color: "red" });
    }
    if (response.data.data) {
      setCourses(response.data.data);
      console.log(response.data.data);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <Container>
      <Stack>
        <Flex direction="row" justify={"space-between"}>
          <Title order={2}>All Courses</Title>

          <Button
            onClick={() => {
              navigate(routes.courseCreate);
            }}
            leftIcon={<FontAwesomeIcon icon={faPlus} />}
          >
            Add Course
          </Button>
        </Flex>
        {courses ? (
          <Stack>
            {courses?.map((course) => {
              return (
                <Card withBorder radius="md">
                  <Flex justify={"space-between"}>
                    <Text
                      className={classes.courseCard}
                      onClick={() => {
                        navigate(routes.course.replace(":id", `${course.id}`));
                      }}
                      size="lg"
                      style={{ fontWeight: "bold" }}
                    >
                      {course.name}
                    </Text>

                    <Space w={20} />
                    <Flex justify={"right"}>
                      <FontAwesomeIcon
                        className={classes.courseCard}
                        icon={faPenToSquare}
                        onClick={() => {
                          navigate(
                            routes.courseUpdate.replace(":id", `${course.id}`)
                          );
                        }}
                      />

                      <Space w={7} />
                      <DeleteModal
                        text={`Delete ${course.name}`}
                        onDelete={() => deleteCourse(course.id)}
                      />
                    </Flex>
                  </Flex>

                  <Flex direction="row">
                    <Text>{course.description}</Text>
                  </Flex>

                  <Flex direction="row" gap="md">
                    <Text>
                      <span style={{ fontWeight: "bold" }}>Department:</span>{" "}
                      {course.department}
                    </Text>
                  </Flex>
                </Card>
              );
            })}
          </Stack>
        ) : (
          <>
            <Loader />
          </>
        )}
      </Stack>
    </Container>
  );
};

const useStyles = createStyles(() => {
  return {
    homePageContainer: {
      display: "flex",
      justifyContent: "center",
    },
    courseCard: {
      cursor: "pointer",
    },
  };
});
