import {
  Container,
  TextInput,
  Space,
  Flex,
  Button,
  Table,
  Title,
  Checkbox,
  NativeSelect,
  Select,
  SelectItem,
} from "@mantine/core";
import { useForm, FormErrors } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/axios";
import {
  ProfessorCourseCreateUpdateDto,
  ProfessorCreateUpdateDto,
  ApiResponse,
  ProfessorGetDto,
  ProfessorCourseGetDto,
  CourseGetDto,
} from "../../constants/types";
import { routes } from "../../routes";
import { useCallback, useEffect, useState } from "react";

export const ProfessorCourseCreate = () => {
  const [professor, setProfessor] = useState<ProfessorGetDto>();
  const [courses, setCourses] = useState<CourseGetDto[]>();
  const { id } = useParams();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  const mantineForm = useForm<ProfessorCourseCreateUpdateDto>({
    initialValues: {
      professorId: Number(id),
      courseId: 0,
    },
  });

  const fetchCourses = useCallback(async () => {
    const response = await api.get<ApiResponse<CourseGetDto[]>>("/api/courses");
    if (response.data.hasErrors) {
      showNotification({ message: "Error fetching courses." });
    }

    if (response.data.data) {
      setCourses(response.data.data);
    }
  }, []);

  const fetchProfessor = useCallback(async () => {
    const response = await api.get<ApiResponse<ProfessorGetDto>>(
      `/api/professors/${id}`
    );

    if (response.data.hasErrors) {
      showNotification({ message: "Error fetching professor." });
    }

    if (response.data.data) {
      setProfessor(response.data.data);
    }
  }, [id]);

  useEffect(() => {
    fetchCourses();
    fetchProfessor();
  }, []);

  const submitProfessorCourse = async (
    values: ProfessorCourseCreateUpdateDto
  ) => {
    const response = await api.post<ApiResponse<ProfessorCourseGetDto>>(
      `/api/professors/${id}/course/${mantineForm.values.courseId}`,
      values
    );

    if (response.data.hasErrors) {
      showNotification({
        message: `${professor?.firstName} ${professor?.lastName} already has that course.`,
        color: "red",
      });
    }

    if (response.data.data) {
      showNotification({ message: "Professor course added", color: "green" });
      navigate(
        routes.professorDetails.replace(":id", `${response.data.data.id}`)
      );
    }
  };

  return (
    <Container>
      <Title order={3}>
        Select a course for {professor?.firstName}, {professor?.lastName}
      </Title>

      <Space h={7} />

      <form onSubmit={mantineForm.onSubmit(submitProfessorCourse)}>
        {courses && (
          <Select
            {...mantineForm.getInputProps("courseId")}
            data={courses.map((course) => {
              return {
                label: course.name,
                value: String(course.id),
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
