import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/axios";
import {
  ApiResponse,
  CourseGetDto,
  ProfessorCourseGetDto,
  ProfessorGetDto,
} from "../../constants/types";
import { Container, Title } from "@mantine/core";

export const ProfessorCourse = () => {
  const [professor, setProfessor] = useState<ProfessorGetDto>();
  const navigate = useNavigate();
  const { id } = useParams();
  const { courseId } = useParams();

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
      }
    }
  }, [id]);

  return (
    <Container>
      <Title order={3}>course name</Title>
    </Container>
  );
};
