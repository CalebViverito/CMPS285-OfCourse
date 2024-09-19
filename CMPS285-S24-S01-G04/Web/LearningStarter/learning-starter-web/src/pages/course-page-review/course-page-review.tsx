import {
    Grid,
    Container,
    createStyles,
    Text,
    Stack,
    Title,
    Loader,
    Flex,
    Card,
    Button,
    Progress,
    Divider,
    Group,
    Rating,
    Select,
    TextInput,
    Overlay,
    Space,
  } from "@mantine/core";
  import { useNavigate, useParams } from "react-router-dom";
  import {
    CourseGetDto,
    ApiResponse,
    ReviewGetDto,
    ProfessorCourseGetDto,
    ProfessorGetDto,
    UserDto,
  } from "../../constants/types";
  import { useEffect, useState } from "react";
  import api from "../../config/axios";
  import { showNotification } from "@mantine/notifications";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
  import { routes } from "../../routes";
  import { useForm } from "@mantine/form";
  
  //This is a basic Component, and since it is used inside of
  //'../../routes/config.tsx' line 31, that also makes it a page
  export const CoursePageReview = () => {
    const { classes } = useStyles();
    const navigate = useNavigate();
  
    const [course, setCourse] = useState<CourseGetDto>();
    const [professors, setProfessors] = useState<ProfessorGetDto[]>([]);
    const [currentUser, setCurrentUser] = useState<UserDto>();
    const [formProfessor, setFormProfessor] = useState<string | null>(null);
    const [formComment, setFormComment] = useState<string | "">("");
    const [formRating, setFormRating] = useState<number | 0>(0);
    const { id } = useParams();
  
    async function submitReview(event) {
      event.preventDefault();
      try {
        const professorCourseId = await getProfessorCourse(formProfessor, id);
        const response = await api.post<ApiResponse<ReviewGetDto>>(
          "/api/reviews",
          {
            userId: currentUser?.id,
            professorCourseId: professorCourseId,
            dateCreated: new Date(),
            rating: formRating * 10,
            comment: formComment,
          }
        );
        console.log(response);
        if (response.data.hasErrors) {
          showNotification({ message: "Error creating review", color: "red" });
        }
        if (response.data.data) {
          navigate(routes.course.replace(":id", `${id}`));
          showNotification({
            message: "Successfully added review",
            color: "green",
          });
        }
      } catch (error) {
        console.error("Failed to submit review:", error);
        showNotification({ message: "Failed to submit review", color: "red" });
      }
    }

    async function getProfessorCourse(professorId, courseId) {
      const response = await api.get<ApiResponse<ProfessorCourseGetDto>>(
        `/api/professors/${professorId}/course/${courseId}`
      );
      if (response.data.hasErrors) {
        showNotification({
          message: "Error finding professor course",
          color: "red",
        });
      }
      if (response.data.data) {
        const professorCourseId = response.data.data;
        return professorCourseId.id;
      }
    }
  
    useEffect(() => {
      fetchCourse();
      fetchCourseProfessors();
      fetchCurrentUser();
  
      async function fetchCourse() {
        const response = await api.get<ApiResponse<CourseGetDto>>(
          `/api/courses/${id}`
        );
  
        if (response.data.hasErrors) {
          showNotification({ message: "Error finding course", color: "red" });
        }
        if (response.data.data) {
          setCourse(response.data.data);
          console.log(response.data.data);
        }
      }
  
      async function fetchCourseProfessors() {
        const response = await api.get<ApiResponse<ProfessorGetDto[]>>(
          `/api/professors/course/id?courseId=${id}`
        );
  
        if (response.data.hasErrors) {
          showNotification({ message: "Error finding course", color: "red" });
        }
        if (response.data.data) {
          setProfessors(response.data.data);
          console.log(response.data.data);
        }
      }
      
      async function fetchCurrentUser() {
        const response = await api.get<ApiResponse<UserDto>>(
          `/api/get-current-user`
        );
  
        if (response.data.hasErrors) {
          showNotification({ message: "Error finding course", color: "red" });
        }
        if (response.data.data) {
          setCurrentUser(response.data.data);
          console.log(response.data.data);
        }
      }
    }, [id]);
  
    const professorOptions = professors.map((professor) => ({
      value: professor.id.toString(),
      label: `${professor.firstName} ${professor.lastName}`,
    }));
  
    return (
      <Container>
        {course && professors ? (
          <>
            <form onSubmit={submitReview}>
              <Stack spacing="xl">
                <Title order={1}>{course.name}</Title>
                <Card p="lg" shadow="sm" style={{overflow:"visible"}} >
                  <Text weight="bold">Select Professor</Text>
                  <Select
                    placeholder="Select Professor"
                    value={formProfessor}
                    onChange={setFormProfessor}
                    data={professorOptions}
                  />
                </Card>
                <Card shadow="sm" p="lg">
                  <Text weight="bold">Rate this course</Text>
                  <Rating
                    fractions={2}
                    size="xl"
                    value={formRating}
                    onChange={setFormRating}
                  />
                </Card>
                <Card shadow="sm" p="lg">
                  <Text weight="bold">Comment</Text>
                  <TextInput
                    value={formComment}
                    onChange={(event) =>
                      setFormComment(event.currentTarget.value)
                    }
                  />
                </Card>
                <Flex direction={"row"} justify={"space-between"}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      navigate(routes.course.replace(":id", `${course.id}`));
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Submit</Button>
                </Flex>
              </Stack>
            </form>
          </>
        ) : (
          <Loader />
        )}
      </Container>
    );
  };
  
  const useStyles = createStyles(() => {
    return {
      homePageContainer: {
        display: "flex",
        justifyContent: "center",
      },
      ratingText: {
        fontSize: 52,
        fontWeight: "bold",
      },
      mediumText: {
        fontSize: 18,
      },
    };
  });